import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'loyaltyTier', 'totalSpent', 'lastVisit'],
    group: 'Customers',
    icon: BusinessIcons.Customers,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'prefer-not-to-say' },
      ],
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'USA',
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'preferredStaff',
          type: 'relationship',
          relationTo: 'staff',
          admin: {
            description: 'Preferred staff member',
          },
        },
        {
          name: 'preferredServices',
          type: 'relationship',
          relationTo: 'services',
          hasMany: true,
          admin: {
            description: 'Most requested services',
          },
        },
        {
          name: 'preferredTimes',
          type: 'array',
          fields: [
            {
              name: 'dayOfWeek',
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
              name: 'timePreference',
              type: 'select',
              required: true,
              options: [
                { label: 'Morning', value: 'morning' },
                { label: 'Afternoon', value: 'afternoon' },
                { label: 'Evening', value: 'evening' },
              ],
            },
          ],
        },
        {
          name: 'allergies',
          type: 'textarea',
          admin: {
            description: 'Known allergies or sensitivities',
          },
        },
        {
          name: 'specialRequests',
          type: 'textarea',
          admin: {
            description: 'Special requests or preferences',
          },
        },
      ],
    },
    {
      name: 'loyalty',
      type: 'group',
      fields: [
        {
          name: 'tier',
          type: 'select',
          defaultValue: 'bronze',
          options: [
            { label: 'Bronze', value: 'bronze' },
            { label: 'Silver', value: 'silver' },
            { label: 'Gold', value: 'gold' },
            { label: 'Platinum', value: 'platinum' },
          ],
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'points',
          type: 'number',
          defaultValue: 0,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'totalSpent',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            position: 'sidebar',
          },
        },
        {
          name: 'visitCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            position: 'sidebar',
          },
        },
        {
          name: 'lastVisit',
          type: 'date',
          admin: {
            readOnly: true,
            position: 'sidebar',
          },
        },
        {
          name: 'memberSince',
          type: 'date',
          admin: {
            readOnly: true,
            position: 'sidebar',
          },
        },
      ],
    },
    {
      name: 'communication',
      type: 'group',
      fields: [
        {
          name: 'emailMarketing',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Subscribe to promotional emails',
          },
        },
        {
          name: 'smsMarketing',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Subscribe to promotional SMS',
          },
        },
        {
          name: 'appointmentReminders',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send appointment reminders',
          },
        },
        {
          name: 'birthdayMessages',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send birthday messages',
          },
        },
      ],
    },
    {
      name: 'referrals',
      type: 'group',
      fields: [
        {
          name: 'referredBy',
          type: 'relationship',
          relationTo: 'customers',
          admin: {
            description: 'Customer who referred this person',
          },
        },
        {
          name: 'referralCode',
          type: 'text',
          unique: true,
          admin: {
            description: 'Unique referral code',
          },
        },
        {
          name: 'referralsMade',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of successful referrals',
          },
        },
        {
          name: 'referralBonusEarned',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Total referral bonus earned',
          },
        },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      fields: [
        {
          name: 'appointment',
          type: 'relationship',
          relationTo: 'appointments',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
        },
        {
          name: 'comment',
          type: 'textarea',
        },
        {
          name: 'reviewDate',
          type: 'date',
          defaultValue: () => new Date(),
        },
        {
          name: 'isPublic',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      admin: {
        description: 'Customer reviews and ratings',
      },
    },
    {
      name: 'socialMedia',
      type: 'group',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram handle',
          },
        },
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook profile',
          },
        },
        {
          name: 'tiktok',
          type: 'text',
          admin: {
            description: 'TikTok handle',
          },
        },
        {
          name: 'allowSocialSharing',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow sharing their photos on social media',
          },
        },
      ],
    },
    {
      name: 'hairProfile',
      type: 'group',
      fields: [
        {
          name: 'hairType',
          type: 'select',
          options: [
            { label: 'Straight', value: 'straight' },
            { label: 'Wavy', value: 'wavy' },
            { label: 'Curly', value: 'curly' },
            { label: 'Coily', value: 'coily' },
          ],
        },
        {
          name: 'hairTexture',
          type: 'select',
          options: [
            { label: 'Fine', value: 'fine' },
            { label: 'Medium', value: 'medium' },
            { label: 'Thick', value: 'thick' },
          ],
        },
        {
          name: 'hairLength',
          type: 'select',
          options: [
            { label: 'Short', value: 'short' },
            { label: 'Medium', value: 'medium' },
            { label: 'Long', value: 'long' },
          ],
        },
        {
          name: 'scalpSensitivity',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Mild', value: 'mild' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Severe', value: 'severe' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'currentHairColor',
          type: 'text',
          admin: {
            description: 'Current hair color',
          },
        },
        {
          name: 'colorHistory',
          type: 'array',
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
            },
            {
              name: 'date',
              type: 'date',
              required: true,
            },
            {
              name: 'colorist',
              type: 'relationship',
              relationTo: 'staff',
            },
            {
              name: 'products',
              type: 'array',
              fields: [
                {
                  name: 'product',
                  type: 'relationship',
                  relationTo: 'products',
                  required: true,
                },
                {
                  name: 'quantity',
                  type: 'number',
                  required: true,
                },
              ],
            },
          ],
          admin: {
            description: 'Complete color treatment history',
          },
        },
        {
          name: 'favoriteStyles',
          type: 'array',
          fields: [
            {
              name: 'styleName',
              type: 'text',
              required: true,
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'notes',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      name: 'portfolio',
      type: 'group',
      fields: [
        {
          name: 'beforeAfterPhotos',
          type: 'array',
          fields: [
            {
              name: 'appointment',
              type: 'relationship',
              relationTo: 'appointments',
              required: true,
            },
            {
              name: 'beforePhoto',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'afterPhoto',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'isPublic',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Allow in public portfolio',
              },
            },
            {
              name: 'socialMediaApproved',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Approved for social media sharing',
              },
            },
          ],
          admin: {
            description: 'Before/After photo gallery',
          },
        },
        {
          name: 'stylePhotos',
          type: 'array',
          fields: [
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'tags',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'isPublic',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
          admin: {
            description: 'Style photo gallery',
          },
        },
      ],
    },
    {
      name: 'financials',
      type: 'group',
      fields: [
        {
          name: 'averageSpendPerVisit',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calculated automatically',
          },
        },
        {
          name: 'lifetimeValue',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Predicted lifetime value',
          },
        },
        {
          name: 'outstandingBalance',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Any outstanding payments',
          },
        },
        {
          name: 'creditLimit',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Account credit limit',
          },
        },
        {
          name: 'paymentMethod',
          type: 'select',
          options: [
            { label: 'Cash', value: 'cash' },
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'Debit Card', value: 'debit_card' },
            { label: 'Mobile Payment', value: 'mobile' },
            { label: 'Account Credit', value: 'credit' },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about the customer',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
};
