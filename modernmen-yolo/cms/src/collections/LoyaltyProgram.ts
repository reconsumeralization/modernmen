import { CollectionConfig } from 'payload/types';
import { BusinessIcons } from '../admin';

export const LoyaltyProgram: CollectionConfig = {
  slug: 'loyalty-program',
  admin: {
    useAsTitle: 'name',
    icon: BusinessIcons.Reviews,
    group: 'Loyalty & Rewards',
    description: 'Loyalty program configuration and settings',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Program Name',
      admin: {
        description: 'Name of the loyalty program (e.g., "ModernMen Rewards")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Program Description',
      admin: {
        description: 'Description of the loyalty program benefits',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active Program',
      defaultValue: true,
      admin: {
        description: 'Whether this loyalty program is currently active',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        description: 'When the loyalty program begins',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
      admin: {
        description: 'When the loyalty program ends (leave empty for ongoing)',
      },
    },
    {
      name: 'pointsPerDollar',
      type: 'number',
      required: true,
      defaultValue: 1,
      label: 'Points per Dollar Spent',
      admin: {
        description: 'How many loyalty points customers earn per dollar spent',
      },
    },
    {
      name: 'bonusPoints',
      type: 'array',
      label: 'Bonus Point Opportunities',
      admin: {
        description: 'Special ways customers can earn bonus points',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Bonus Name',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'points',
          type: 'number',
          required: true,
          label: 'Bonus Points',
        },
        {
          name: 'conditions',
          type: 'array',
          label: 'Conditions',
          fields: [
            {
              name: 'condition',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Active',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      required: true,
      label: 'Loyalty Tiers',
      admin: {
        description: 'Different loyalty levels with increasing benefits',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Tier Name',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Tier Description',
        },
        {
          name: 'minPoints',
          type: 'number',
          required: true,
          label: 'Minimum Points Required',
        },
        {
          name: 'maxPoints',
          type: 'number',
          label: 'Maximum Points for This Tier',
        },
        {
          name: 'benefits',
          type: 'array',
          label: 'Tier Benefits',
          fields: [
            {
              name: 'benefit',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'discountPercentage',
          type: 'number',
          label: 'Discount Percentage',
          min: 0,
          max: 100,
          admin: {
            description: 'Percentage discount on services for this tier',
          },
        },
        {
          name: 'freeServices',
          type: 'array',
          label: 'Free Services',
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              label: 'Service',
            },
            {
              name: 'frequency',
              type: 'select',
              options: [
                { label: 'Once per month', value: 'monthly' },
                { label: 'Once per quarter', value: 'quarterly' },
                { label: 'Once per year', value: 'yearly' },
                { label: 'One time only', value: 'once' },
              ],
              label: 'Frequency',
            },
          ],
        },
        {
          name: 'priorityBooking',
          type: 'checkbox',
          label: 'Priority Booking',
          admin: {
            description: 'Priority access to appointment booking',
          },
        },
        {
          name: 'exclusiveOffers',
          type: 'checkbox',
          label: 'Exclusive Offers',
          admin: {
            description: 'Access to exclusive promotions and offers',
          },
        },
        {
          name: 'birthdayBonus',
          type: 'number',
          label: 'Birthday Bonus Points',
          admin: {
            description: 'Extra points given on customer birthday',
          },
        },
        {
          name: 'anniversaryBonus',
          type: 'number',
          label: 'Anniversary Bonus Points',
          admin: {
            description: 'Extra points given on customer anniversary',
          },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Tier Color',
          admin: {
            description: 'Color code for tier display (e.g., #FFD700 for gold)',
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Tier Icon',
          admin: {
            description: 'Emoji or icon for tier display (e.g., 🥉, 🥈, 🥇, 👑)',
          },
        },
      ],
    },
    {
      name: 'redemptionRules',
      type: 'group',
      label: 'Point Redemption Rules',
      admin: {
        description: 'Rules for how customers can redeem their points',
      },
      fields: [
        {
          name: 'minPointsToRedeem',
          type: 'number',
          required: true,
          defaultValue: 100,
          label: 'Minimum Points to Redeem',
        },
        {
          name: 'pointValue',
          type: 'number',
          required: true,
          defaultValue: 0.01,
          label: 'Point Value in Dollars',
          admin: {
            description: 'How much each point is worth when redeemed',
          },
        },
        {
          name: 'redemptionOptions',
          type: 'array',
          label: 'Redemption Options',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Option Name',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'pointsRequired',
              type: 'number',
              required: true,
              label: 'Points Required',
            },
            {
              name: 'value',
              type: 'number',
              required: true,
              label: 'Value in Dollars',
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Active',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'expirationPolicy',
          type: 'group',
          label: 'Point Expiration Policy',
          fields: [
            {
              name: 'pointsExpire',
              type: 'checkbox',
              label: 'Points Expire',
              defaultValue: false,
            },
            {
              name: 'expirationPeriod',
              type: 'number',
              label: 'Expiration Period (months)',
              admin: {
                condition: (data, siblingData) => siblingData.pointsExpire,
              },
            },
            {
              name: 'expirationWarning',
              type: 'number',
              label: 'Expiration Warning (days)',
              admin: {
                condition: (data, siblingData) => siblingData.pointsExpire,
                description: 'How many days before expiration to warn customers',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'referralProgram',
      type: 'group',
      label: 'Referral Program',
      admin: {
        description: 'Referral bonus system',
      },
      fields: [
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Active Referral Program',
          defaultValue: false,
        },
        {
          name: 'referrerBonus',
          type: 'number',
          label: 'Referrer Bonus Points',
          admin: {
            condition: (data, siblingData) => siblingData.isActive,
          },
        },
        {
          name: 'refereeBonus',
          type: 'number',
          label: 'Referee Bonus Points',
          admin: {
            condition: (data, siblingData) => siblingData.isActive,
          },
        },
        {
          name: 'referralCode',
          type: 'text',
          label: 'Referral Code Format',
          admin: {
            condition: (data, siblingData) => siblingData.isActive,
            description: 'Format for referral codes (e.g., "REF{ID}")',
          },
        },
      ],
    },
    {
      name: 'notifications',
      type: 'group',
      label: 'Notification Settings',
      fields: [
        {
          name: 'pointEarned',
          type: 'checkbox',
          label: 'Point Earned Notifications',
          defaultValue: true,
        },
        {
          name: 'tierUpgrade',
          type: 'checkbox',
          label: 'Tier Upgrade Notifications',
          defaultValue: true,
        },
        {
          name: 'pointExpiration',
          type: 'checkbox',
          label: 'Point Expiration Warnings',
          defaultValue: true,
        },
        {
          name: 'specialOffers',
          type: 'checkbox',
          label: 'Special Offers Notifications',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO & Meta',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Meta Keywords',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate tier max points if not provided
        if (data.tiers && data.tiers.length > 0) {
          data.tiers.forEach((tier, index) => {
            if (index < data.tiers.length - 1) {
              tier.maxPoints = data.tiers[index + 1].minPoints - 1;
            }
          });
        }

        return data;
      },
    ],
  },
  endpoints: [
    {
      path: '/active',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const program = await payload.find({
            collection: 'loyalty-program',
            where: {
              isActive: { equals: true },
            },
            limit: 1,
          });
          res.json(program);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/tiers',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const program = await payload.find({
            collection: 'loyalty-program',
            where: {
              isActive: { equals: true },
            },
            limit: 1,
          });

          if (program.docs.length > 0) {
            res.json(program.docs[0].tiers || []);
          } else {
            res.json([]);
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
  ],
};
