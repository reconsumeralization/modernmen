import sgMail from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required')
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text?: string
}

export interface AppointmentData {
  id: string
  customerName: string
  customerEmail: string
  serviceName: string
  barberName: string
  date: string
  time: string
  duration: number
  price: number
  salonName: string
  salonAddress: string
  salonPhone: string
}

class EmailService {
  private fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@modernmen.com'
  private fromName = process.env.SENDGRID_FROM_NAME || 'Modern Men Hair Salon'

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmation(appointment: AppointmentData): Promise<void> {
    const subject = `Appointment Confirmed - ${appointment.serviceName}`
    const html = this.generateAppointmentConfirmationHTML(appointment)

    await this.sendEmail({
      to: { email: appointment.customerEmail, name: appointment.customerName },
      subject,
      html,
    })
  }

  /**
   * Send appointment reminder email
   */
  async sendAppointmentReminder(appointment: AppointmentData, hoursBefore: number): Promise<void> {
    const subject = `Appointment Reminder - ${hoursBefore} hours away`
    const html = this.generateAppointmentReminderHTML(appointment, hoursBefore)

    await this.sendEmail({
      to: { email: appointment.customerEmail, name: appointment.customerName },
      subject,
      html,
    })
  }

  /**
   * Send appointment cancellation email
   */
  async sendAppointmentCancellation(appointment: AppointmentData): Promise<void> {
    const subject = 'Appointment Cancelled'
    const html = this.generateAppointmentCancellationHTML(appointment)

    await this.sendEmail({
      to: { email: appointment.customerEmail, name: appointment.customerName },
      subject,
      html,
    })
  }

  /**
   * Send payment receipt email
   */
  async sendPaymentReceipt(
    customerEmail: string,
    customerName: string,
    appointment: AppointmentData,
    paymentAmount: number,
    paymentId: string
  ): Promise<void> {
    const subject = 'Payment Receipt'
    const html = this.generatePaymentReceiptHTML(appointment, paymentAmount, paymentId)

    await this.sendEmail({
      to: { email: customerEmail, name: customerName },
      subject,
      html,
    })
  }

  /**
   * Send welcome email to new customers
   */
  async sendWelcomeEmail(customerEmail: string, customerName: string): Promise<void> {
    const subject = 'Welcome to Modern Men Hair Salon!'
    const html = this.generateWelcomeEmailHTML(customerName)

    await this.sendEmail({
      to: { email: customerEmail, name: customerName },
      subject,
      html,
    })
  }

  /**
   * Send promotional email
   */
  async sendPromotionalEmail(
    recipient: EmailRecipient,
    campaignName: string,
    content: string
  ): Promise<void> {
    const subject = campaignName
    const html = this.generatePromotionalEmailHTML(content)

    await this.sendEmail({
      to: recipient,
      subject,
      html,
    })
  }

  /**
   * Send newsletter
   */
  async sendNewsletter(
    recipients: EmailRecipient[],
    subject: string,
    content: string
  ): Promise<void> {
    const html = this.generateNewsletterHTML(content)

    const messages = recipients.map(recipient => ({
      to: recipient,
      from: { email: this.fromEmail, name: this.fromName },
      subject,
      html,
    }))

    await sgMail.send(messages)
  }

  /**
   * Core email sending function
   */
  private async sendEmail({
    to,
    subject,
    html,
    text,
  }: {
    to: EmailRecipient | EmailRecipient[]
    subject: string
    html: string
    text?: string
  }): Promise<void> {
    try {
      const msg = {
        to,
        from: { email: this.fromEmail, name: this.fromName },
        subject,
        html,
        text,
      }

      await sgMail.send(msg)
      console.log(`Email sent successfully to ${Array.isArray(to) ? to.length : 1} recipient(s)`)
    } catch (error) {
      console.error('Failed to send email:', error)
      throw new Error('Email sending failed')
    }
  }

  /**
   * Generate appointment confirmation HTML
   */
  private generateAppointmentConfirmationHTML(appointment: AppointmentData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Appointment Confirmed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .appointment-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #000; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Confirmed</h1>
            </div>
            <div class="content">
              <p>Dear ${appointment.customerName},</p>
              <p>Your appointment has been confirmed! We're excited to serve you.</p>

              <div class="appointment-details">
                <h3>Appointment Details</h3>
                <p><strong>Service:</strong> ${appointment.serviceName}</p>
                <p><strong>Barber:</strong> ${appointment.barberName}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Duration:</strong> ${appointment.duration} minutes</p>
                <p><strong>Price:</strong> $${appointment.price}</p>
              </div>

              <div class="appointment-details">
                <h3>Salon Information</h3>
                <p><strong>${appointment.salonName}</strong></p>
                <p>${appointment.salonAddress}</p>
                <p>Phone: ${appointment.salonPhone}</p>
              </div>

              <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>

              <p>We look forward to seeing you!</p>
              <p>The Modern Men Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>For questions, contact us at ${appointment.salonPhone}</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Generate appointment reminder HTML
   */
  private generateAppointmentReminderHTML(appointment: AppointmentData, hoursBefore: number): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Appointment Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .reminder-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .appointment-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #000; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Reminder</h1>
            </div>
            <div class="content">
              <p>Dear ${appointment.customerName},</p>

              <div class="reminder-box">
                <p><strong>⏰ Your appointment is in ${hoursBefore} hours!</strong></p>
              </div>

              <div class="appointment-details">
                <h3>Your Upcoming Appointment</h3>
                <p><strong>Service:</strong> ${appointment.serviceName}</p>
                <p><strong>Barber:</strong> ${appointment.barberName}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Duration:</strong> ${appointment.duration} minutes</p>
              </div>

              <p>We recommend arriving 10-15 minutes early for your appointment.</p>
              <p>If you need to reschedule, please contact us as soon as possible.</p>

              <p>See you soon!</p>
              <p>The Modern Men Team</p>
            </div>
            <div class="footer">
              <p>This is an automated reminder. For questions, contact us at ${appointment.salonPhone}</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Generate appointment cancellation HTML
   */
  private generateAppointmentCancellationHTML(appointment: AppointmentData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Appointment Cancelled</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #666; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .appointment-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #666; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Cancelled</h1>
            </div>
            <div class="content">
              <p>Dear ${appointment.customerName},</p>
              <p>Your appointment has been cancelled as requested.</p>

              <div class="appointment-details">
                <h3>Cancelled Appointment Details</h3>
                <p><strong>Service:</strong> ${appointment.serviceName}</p>
                <p><strong>Barber:</strong> ${appointment.barberName}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
              </div>

              <p>If you'd like to reschedule, you can book a new appointment through our website or by calling us.</p>

              <p>We hope to serve you again soon!</p>
              <p>The Modern Men Team</p>
            </div>
            <div class="footer">
              <p>For questions, contact us at ${appointment.salonPhone}</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Generate payment receipt HTML
   */
  private generatePaymentReceiptHTML(
    appointment: AppointmentData,
    paymentAmount: number,
    paymentId: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .receipt-box { background: white; padding: 20px; margin: 20px 0; border: 1px solid #ddd; }
            .total { background: #f0f0f0; padding: 10px; margin: 10px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Receipt</h1>
            </div>
            <div class="content">
              <p>Dear ${appointment.customerName},</p>
              <p>Thank you for your payment! Your transaction has been processed successfully.</p>

              <div class="receipt-box">
                <h3>Receipt Details</h3>
                <p><strong>Service:</strong> ${appointment.serviceName}</p>
                <p><strong>Barber:</strong> ${appointment.barberName}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <div class="total">
                  <p><strong>Total Paid: $${paymentAmount}</strong></p>
                </div>
                <p><strong>Payment ID:</strong> ${paymentId}</p>
                <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>

              <p>A confirmation of your appointment details has been sent separately.</p>
              <p>If you have any questions about this transaction, please contact us.</p>

              <p>Thank you for choosing Modern Men Hair Salon!</p>
              <p>The Modern Men Team</p>
            </div>
            <div class="footer">
              <p>This receipt was generated automatically. Keep this email for your records.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Generate welcome email HTML
   */
  private generateWelcomeEmailHTML(customerName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Modern Men</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .welcome-box { background: white; padding: 20px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Modern Men!</h1>
            </div>
            <div class="content">
              <p>Dear ${customerName},</p>
              <p>Welcome to Modern Men Hair Salon! We're thrilled to have you as part of our community.</p>

              <div class="welcome-box">
                <h3>Your Benefits as a Member</h3>
                <ul style="text-align: left; display: inline-block;">
                  <li>✨ Priority booking for appointments</li>
                  <li>🎁 Loyalty points on every service</li>
                  <li>📱 Easy online booking and management</li>
                  <li>💳 Exclusive member discounts</li>
                  <li>📧 Appointment reminders and updates</li>
                </ul>
              </div>

              <p>Ready to book your first appointment? Visit our website or give us a call.</p>

              <p>We can't wait to provide you with an exceptional grooming experience!</p>
              <p>The Modern Men Team</p>
            </div>
            <div class="footer">
              <p>Modern Men Hair Salon - Professional grooming for the modern gentleman</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Generate promotional email HTML
   */
  private generatePromotionalEmailHTML(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Special Offer</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .promo-box { background: white; padding: 20px; margin: 20px 0; border: 2px solid #000; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Special Offer</h1>
            </div>
            <div class="content">
              <div class="promo-box">
                ${content}
              </div>
              <p>The Modern Men Team</p>
            </div>
            <div class="footer">
              <p>You received this email because you're a valued member of our community.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Generate newsletter HTML
   */
  private generateNewsletterHTML(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Modern Men Newsletter</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .newsletter-content { background: white; padding: 20px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Modern Men Newsletter</h1>
            </div>
            <div class="content">
              <div class="newsletter-content">
                ${content}
              </div>
              <p>Best regards,<br>The Modern Men Team</p>
            </div>
            <div class="footer">
              <p>Modern Men Hair Salon - Professional grooming for the modern gentleman</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export const emailService = new EmailService()
export default emailService
