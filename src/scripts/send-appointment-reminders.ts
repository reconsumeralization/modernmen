#!/usr/bin/env ts-node

/**
 * Automated Appointment Reminder Script
 *
 * This script runs periodically (e.g., every hour) to send reminders for upcoming appointments.
 * It checks for appointments that need reminders and sends them via email, SMS, or both.
 *
 * Usage:
 * - Run manually: npm run send-reminders
 * - Cron job: Add to crontab for hourly execution
 * - Environment: Set REMINDER_HOURS_BEFORE for hours before appointment to send reminder
 */

import { getPayloadClient } from '../payload'
import { sendAppointmentReminder } from '../lib/smsService'
import { sendAppointmentNotification } from '../lib/emailService'
import { notificationService } from '../lib/notificationService'

interface ReminderConfig {
  hoursBefore: number
  reminderType: 'email' | 'sms' | 'both'
  maxRemindersPerRun: number
  dryRun: boolean
}

class AppointmentReminderService {
  private config: ReminderConfig

  constructor(config: Partial<ReminderConfig> = {}) {
    this.config = {
      hoursBefore: parseInt(process.env.REMINDER_HOURS_BEFORE || '24'),
      reminderType: (process.env.REMINDER_TYPE as 'email' | 'sms' | 'both') || 'email',
      maxRemindersPerRun: parseInt(process.env.MAX_REMINDERS_PER_RUN || '50'),
      dryRun: process.env.DRY_RUN === 'true',
      ...config
    }
  }

  async run(): Promise<void> {
    console.log(`🚀 Starting appointment reminder service...`)
    console.log(`📅 Hours before appointment: ${this.config.hoursBefore}`)
    console.log(`📧 Reminder type: ${this.config.reminderType}`)
    console.log(`🔢 Max reminders per run: ${this.config.maxRemindersPerRun}`)
    console.log(`🧪 Dry run: ${this.config.dryRun ? 'YES' : 'NO'}`)

    try {
      const payload = await getPayloadClient()
      const targetTime = new Date()
      targetTime.setHours(targetTime.getHours() + this.config.hoursBefore)

      // Get appointments that need reminders
      const appointments = await this.getAppointmentsNeedingReminders(payload, targetTime)

      console.log(`📋 Found ${appointments.length} appointments needing reminders`)

      if (appointments.length === 0) {
        console.log('✅ No appointments need reminders at this time')
        return
      }

      let sentCount = 0
      let failedCount = 0

      // Process each appointment
      for (const appointment of appointments.slice(0, this.config.maxRemindersPerRun)) {
        try {
          await this.sendReminder(appointment)
          sentCount++

          // Small delay to avoid overwhelming services
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`❌ Failed to send reminder for appointment ${appointment.id}:`, error)
          failedCount++
        }
      }

      console.log(`✅ Reminder run completed:`)
      console.log(`   📤 Sent: ${sentCount}`)
      console.log(`   ❌ Failed: ${failedCount}`)
      console.log(`   ⏰ Target time: ${targetTime.toISOString()}`)

    } catch (error) {
      console.error('💥 Critical error in reminder service:', error)
      process.exit(1)
    }
  }

  private async getAppointmentsNeedingReminders(payload: any, targetTime: Date) {
    // Calculate time window (allow 30 minute buffer)
    const startTime = new Date(targetTime.getTime() - 30 * 60 * 1000) // 30 minutes before
    const endTime = new Date(targetTime.getTime() + 30 * 60 * 1000) // 30 minutes after

    const appointments = await payload.find({
      collection: 'appointments',
      where: {
        and: [
          { status: { not_equals: 'cancelled' } },
          { status: { not_equals: 'completed' } },
          { date: { greater_than_equal: startTime.toISOString().split('T')[0] } },
          { date: { less_than_equal: endTime.toISOString().split('T')[0] } },
          // Only send reminders if we haven't sent one already
          {
            or: [
              { reminderSent: { exists: false } },
              { reminderSent: { equals: false } }
            ]
          }
        ]
      },
      limit: this.config.maxRemindersPerRun * 2, // Get extra to account for filtering
      sort: 'date'
    })

    // Filter by exact time match and get customer details
    const filteredAppointments = []

    for (const appointment of appointments.docs) {
      const customer = await payload.findByID({
        collection: 'customers',
        id: appointment.customer
      })

      if (!customer) continue

      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time || '00:00'}:00`)
      const timeDiff = Math.abs(appointmentDateTime.getTime() - targetTime.getTime())
      const hoursDiff = timeDiff / (1000 * 60 * 60)

      // Check if appointment is within our target window
      if (hoursDiff <= this.config.hoursBefore + 0.5) { // Within 30 minutes of target
        filteredAppointments.push({
          ...appointment,
          customer,
          hoursUntilAppointment: hoursDiff
        })
      }
    }

    return filteredAppointments
  }

  private async sendReminder(appointment: any): Promise<void> {
    const { customer } = appointment

    // Get stylist and service details
    const stylist = appointment.stylist ? await (await getPayloadClient()).findByID({
      collection: 'stylists',
      id: appointment.stylist
    }) : null

    const service = appointment.service ? await (await getPayloadClient()).findByID({
      collection: 'services',
      id: appointment.service
    }) : null

    const appointmentDetails = {
      service: service?.name || 'Service',
      date: new Date(appointment.date).toLocaleDateString(),
      time: appointment.time || 'TBD',
      duration: service?.duration || 60,
      price: appointment.price || service?.price || 0
    }

    console.log(`📤 Sending reminder to ${customer.firstName} ${customer.lastName} for ${appointmentDetails.service}`)

    if (!this.config.dryRun) {
      // Send email reminder
      if ((this.config.reminderType === 'email' || this.config.reminderType === 'both') && customer.email) {
        try {
          await sendAppointmentNotification(
            customer.email,
            `${customer.firstName} ${customer.lastName}`,
            stylist ? `${stylist.firstName} ${stylist.lastName}` : 'Our Team',
            {
              ...appointmentDetails,
              service: `${appointmentDetails.service} - Reminder: Your appointment is coming up!`
            }
          )
        } catch (emailError) {
          console.error('Email reminder failed:', emailError)
        }
      }

      // Send SMS reminder
      if ((this.config.reminderType === 'sms' || this.config.reminderType === 'both') && customer.phone) {
        try {
          await sendAppointmentReminder(
            customer.phone,
            `${customer.firstName} ${customer.lastName}`,
            stylist ? `${stylist.firstName} ${stylist.lastName}` : 'Our Team',
            appointmentDetails.date,
            appointmentDetails.time
          )
        } catch (smsError) {
          console.error('SMS reminder failed:', smsError)
        }
      }

      // Send in-app notification
      await notificationService.sendToUser({
        userId: customer.id,
        type: 'appointment_reminder',
        title: `Appointment Reminder - ${this.config.hoursBefore} hours`,
        message: `Don't forget your ${appointmentDetails.service} appointment on ${appointmentDetails.date} at ${appointmentDetails.time}.`,
        data: {
          appointmentId: appointment.id,
          service: appointmentDetails.service,
          date: appointmentDetails.date,
          time: appointmentDetails.time,
          hoursBefore: this.config.hoursBefore
        },
        priority: 'high'
      })

      // Mark reminder as sent
      const payload = await getPayloadClient()
      await payload.update({
        collection: 'appointments',
        id: appointment.id,
        data: { reminderSent: true, reminderSentAt: new Date().toISOString() }
      })
    } else {
      console.log(`   🧪 DRY RUN: Would send reminder via ${this.config.reminderType}`)
    }
  }
}

// CLI runner
if (require.main === module) {
  const reminderService = new AppointmentReminderService()

  reminderService.run()
    .then(() => {
      console.log('🎉 Reminder service completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Reminder service failed:', error)
      process.exit(1)
    })
}

export { AppointmentReminderService }
