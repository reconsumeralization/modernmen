// Twilio import - conditionally loaded for production
let twilio: any = null
try {
  twilio = require('twilio')
} catch (error) {
  // Mock twilio for development
  twilio = function(accountSid: string, authToken: string) {
    return {
      messages: {
        create: async (options: any) => {
          console.log('Mock SMS sent:', options)
          return { sid: 'mock-sid-' + Date.now() }
        }
      }
    }
  }
}

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables are required')
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER || ''

export interface SMSRecipient {
  phoneNumber: string
  name?: string
}

export interface AppointmentData {
  id: string
  customerName: string
  serviceName: string
  barberName: string
  date: string
  time: string
  duration: number
  price: number
  salonName: string
  salonPhone: string
}

class SMSService {
  /**
   * Send appointment confirmation SMS
   */
  async sendAppointmentConfirmation(
    phoneNumber: string,
    appointment: AppointmentData
  ): Promise<void> {
    const message = this.generateAppointmentConfirmationMessage(appointment)
    await this.sendSMS(phoneNumber, message)
  }

  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminder(
    phoneNumber: string,
    appointment: AppointmentData,
    hoursBefore: number
  ): Promise<void> {
    const message = this.generateAppointmentReminderMessage(appointment, hoursBefore)
    await this.sendSMS(phoneNumber, message)
  }

  /**
   * Send last-minute reminder SMS (24 hours before)
   */
  async sendLastMinuteReminder(
    phoneNumber: string,
    appointment: AppointmentData
  ): Promise<void> {
    const message = this.generateLastMinuteReminderMessage(appointment)
    await this.sendSMS(phoneNumber, message)
  }

  /**
   * Send appointment cancellation SMS
   */
  async sendAppointmentCancellation(
    phoneNumber: string,
    appointment: AppointmentData
  ): Promise<void> {
    const message = this.generateAppointmentCancellationMessage(appointment)
    await this.sendSMS(phoneNumber, message)
  }

  /**
   * Send promotional SMS
   */
  async sendPromotionalSMS(
    phoneNumber: string,
    message: string
  ): Promise<void> {
    await this.sendSMS(phoneNumber, message)
  }

  /**
   * Send bulk SMS to multiple recipients
   */
  async sendBulkSMS(
    recipients: string[],
    message: string
  ): Promise<void> {
    const promises = recipients.map(phoneNumber =>
      this.sendSMS(phoneNumber, message).catch(error => {
        console.error(`Failed to send SMS to ${phoneNumber}:`, error)
        return null // Continue with other messages even if one fails
      })
    )

    await Promise.all(promises)
  }

  /**
   * Send promotional campaign SMS
   */
  async sendPromotionalCampaign(
    recipients: SMSRecipient[],
    campaignMessage: string
  ): Promise<void> {
    const promises = recipients.map(recipient =>
      this.sendSMS(recipient.phoneNumber, campaignMessage).catch(error => {
        console.error(`Failed to send campaign SMS to ${recipient.phoneNumber}:`, error)
        return null
      })
    )

    await Promise.all(promises)
  }

  /**
   * Core SMS sending function
   */
  private async sendSMS(to: string, body: string): Promise<void> {
    try {
      // Ensure phone number is in E.164 format
      const formattedNumber = this.formatPhoneNumber(to)

      await client.messages.create({
        body,
        from: fromPhoneNumber,
        to: formattedNumber,
      })

      console.log(`SMS sent successfully to ${formattedNumber}`)
    } catch (error) {
      console.error('Failed to send SMS:', error)
      throw new Error('SMS sending failed')
    }
  }

  /**
   * Format phone number to E.164 format
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '')

    // If it starts with country code, assume it's already formatted
    if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      return `+${digitsOnly}`
    }

    // If it's a 10-digit US number, add +1
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`
    }

    // If it already has a +, assume it's formatted
    if (phoneNumber.startsWith('+')) {
      return phoneNumber
    }

    // Default to adding +1 for US numbers
    return `+1${digitsOnly}`
  }

  /**
   * Generate appointment confirmation message
   */
  private generateAppointmentConfirmationMessage(appointment: AppointmentData): string {
    return `Hi ${appointment.customerName}! Your appointment is confirmed:

📅 ${appointment.date} at ${appointment.time}
💇 ${appointment.serviceName}
👨 ${appointment.barberName}
⏱️ ${appointment.duration} minutes
💰 $${appointment.price}

${appointment.salonName}
${appointment.salonPhone}

See you soon! Reply STOP to opt out.`
  }

  /**
   * Generate appointment reminder message
   */
  private generateAppointmentReminderMessage(
    appointment: AppointmentData,
    hoursBefore: number
  ): string {
    return `Hi ${appointment.customerName}! Reminder: Your appointment is in ${hoursBefore} hours.

📅 ${appointment.date} at ${appointment.time}
💇 ${appointment.serviceName}
👨 ${appointment.barberName}

${appointment.salonName}
${appointment.salonPhone}

See you soon! Reply STOP to opt out.`
  }

  /**
   * Generate last-minute reminder message
   */
  private generateLastMinuteReminderMessage(appointment: AppointmentData): string {
    return `Hi ${appointment.customerName}! Your appointment is tomorrow!

📅 ${appointment.date} at ${appointment.time}
💇 ${appointment.serviceName}
👨 ${appointment.barberName}

Arrive 10-15 mins early. Call ${appointment.salonPhone} if you need to reschedule.

See you tomorrow! Reply STOP to opt out.`
  }

  /**
   * Generate appointment cancellation message
   */
  private generateAppointmentCancellationMessage(appointment: AppointmentData): string {
    return `Hi ${appointment.customerName}, your appointment has been cancelled:

📅 ${appointment.date} at ${appointment.time}
💇 ${appointment.serviceName}
👨 ${appointment.barberName}

You can reschedule anytime. Call ${appointment.salonPhone} or visit our website.

Reply STOP to opt out.`
  }

  /**
   * Check if SMS service is properly configured
   */
  isConfigured(): boolean {
    return !!(process.env.TWILIO_ACCOUNT_SID &&
              process.env.TWILIO_AUTH_TOKEN &&
              process.env.TWILIO_PHONE_NUMBER)
  }

  /**
   * Get SMS sending limits (Twilio free tier)
   */
  getLimits(): {
    maxRecipients: number
    maxMessageLength: number
    rateLimit: number
  } {
    return {
      maxRecipients: 100, // Per bulk send
      maxMessageLength: 1600, // Characters
      rateLimit: 100, // Messages per second (paid tier)
    }
  }
}

export const smsService = new SMSService()
export default smsService
