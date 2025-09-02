import { GlobalConfig } from 'payload/types';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Configuration',
  },
  fields: [
    {
      name: 'businessInfo',
      type: 'group',
      fields: [
        {
          name: 'businessName',
          type: 'text',
          required: true,
          defaultValue: process.env.DEFAULT_BUSINESS_NAME || 'Your Business Name',
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: process.env.DEFAULT_BUSINESS_TAGLINE || 'Professional services for discerning clients',
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Business description for SEO and marketing',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'address',
          type: 'group',
          fields: [
            {
              name: 'street',
              type: 'text',
              required: true,
            },
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'state',
              type: 'text',
              required: true,
            },
            {
              name: 'zipCode',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'businessHours',
          type: 'array',
          fields: [
            {
              name: 'day',
              type: 'select',
              required: true,
              options: [
                { label: 'Monday', value: 'monday' },
                { label: 'Tuesday', value: 'tuesday' },
                { label: 'Wednesday', value: 'wednesday' },
                { label: 'Thursday', value: 'thursday' },
                { label: 'Friday', value: 'friday' },
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
              ],
            },
            {
              name: 'openTime',
              type: 'text',
              defaultValue: process.env.DEFAULT_OPEN_TIME || '09:00',
            },
            {
              name: 'closeTime',
              type: 'text',
              defaultValue: process.env.DEFAULT_CLOSE_TIME || '17:00',
            },
            {
              name: 'isClosed',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'bookingSettings',
      type: 'group',
      fields: [
        {
          name: 'maxAdvanceBookingDays',
          type: 'number',
          defaultValue: 30,
          admin: {
            description: 'Maximum days in advance customers can book',
          },
        },
        {
          name: 'minAdvanceBookingHours',
          type: 'number',
          defaultValue: 2,
          admin: {
            description: 'Minimum hours in advance required for booking',
          },
        },
        {
          name: 'slotDuration',
          type: 'number',
          defaultValue: 30,
          admin: {
            description: 'Duration of each booking slot in minutes',
          },
        },
        {
          name: 'cancellationHours',
          type: 'number',
          defaultValue: 24,
          admin: {
            description: 'Hours before appointment when cancellation is free',
          },
        },
        {
          name: 'allowSameDayBooking',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'requirePhoneVerification',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'loyaltyProgram',
      type: 'group',
      fields: [
        {
          name: 'isEnabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'pointsPerDollar',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Points earned per dollar spent',
          },
        },
        {
          name: 'pointsPerVisit',
          type: 'number',
          defaultValue: 10,
          admin: {
            description: 'Bonus points per visit',
          },
        },
        {
          name: 'referralPoints',
          type: 'number',
          defaultValue: 50,
          admin: {
            description: 'Points earned for successful referrals',
          },
        },
        {
          name: 'tiers',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'minPoints',
              type: 'number',
              required: true,
            },
            {
              name: 'benefits',
              type: 'array',
              fields: [
                {
                  name: 'benefit',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Discount Percentage', value: 'discount-percent' },
                    { label: 'Discount Amount', value: 'discount-amount' },
                    { label: 'Free Service', value: 'free-service' },
                    { label: 'Priority Booking', value: 'priority-booking' },
                  ],
                },
                {
                  name: 'value',
                  type: 'number',
                  admin: {
                    condition: (data) => ['discount-percent', 'discount-amount'].includes(data.type),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'paymentSettings',
      type: 'group',
      fields: [
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'USD',
        },
        {
          name: 'requireDeposit',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'depositPercentage',
          type: 'number',
          defaultValue: 25,
          admin: {
            condition: (data) => data.requireDeposit,
            description: 'Percentage of service cost required as deposit',
          },
        },
        {
          name: 'acceptedPaymentMethods',
          type: 'array',
          fields: [
            {
              name: 'method',
              type: 'select',
              required: true,
              options: [
                { label: 'Credit Card', value: 'credit-card' },
                { label: 'Debit Card', value: 'debit-card' },
                { label: 'Cash', value: 'cash' },
                { label: 'Check', value: 'check' },
                { label: 'Gift Card', value: 'gift-card' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'communicationSettings',
      type: 'group',
      fields: [
        {
          name: 'reminderTiming',
          type: 'group',
          fields: [
            {
              name: 'emailReminderHours',
              type: 'number',
              defaultValue: 24,
            },
            {
              name: 'smsReminderHours',
              type: 'number',
              defaultValue: 2,
            },
          ],
        },
        {
          name: 'notificationTemplates',
          type: 'group',
          fields: [
            {
              name: 'bookingConfirmation',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'appointmentReminder',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'cancellationNotice',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'paymentReceipt',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: 'seoSettings',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          defaultValue: `${process.env.DEFAULT_BUSINESS_NAME || 'Your Business'} - ${process.env.DEFAULT_BUSINESS_TAGLINE || 'Professional Services'}`,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          defaultValue: process.env.DEFAULT_META_DESCRIPTION || 'Experience professional services at our business location. Quality service and customer satisfaction guaranteed.',
        },
        {
          name: 'keywords',
          type: 'text',
          defaultValue: process.env.DEFAULT_KEYWORDS || 'professional services, quality, business, local',
        },
        {
          name: 'socialMedia',
          type: 'group',
          fields: [
            {
              name: 'facebook',
              type: 'text',
            },
            {
              name: 'instagram',
              type: 'text',
            },
            {
              name: 'twitter',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};
