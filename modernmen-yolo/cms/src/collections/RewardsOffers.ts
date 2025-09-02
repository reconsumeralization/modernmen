import { CollectionConfig } from '../payload-types';
import BusinessIcons from '../admin/customIcons';

export const RewardsOffers: CollectionConfig = {
  slug: 'rewards-offers',
  admin: {
    useAsTitle: 'name',
    icon: BusinessIcons.Reviews,
    group: 'Loyalty & Rewards',
    description: 'Special offers, rewards, and promotions for loyalty program members',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'staff')),
    update: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'staff')),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Offer Name',
      admin: {
        description: 'Name of the reward or special offer',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Offer Description',
      admin: {
        description: 'Detailed description of the offer and its benefits',
      },
    },
    {
      name: 'shortDescription',
      type: 'text',
      required: true,
      label: 'Short Description',
      admin: {
        description: 'Brief description for display in lists and cards',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Offer Type',
      options: [
        { label: 'Service Discount', value: 'service_discount' },
        { label: 'Free Service', value: 'free_service' },
        { label: 'Product Discount', value: 'product_discount' },
        { label: 'Bonus Points', value: 'bonus_points' },
        { label: 'Free Upgrade', value: 'free_upgrade' },
        { label: 'Complimentary Add-on', value: 'complimentary_addon' },
        { label: 'Priority Booking', value: 'priority_booking' },
        { label: 'Exclusive Access', value: 'exclusive_access' },
        { label: 'Birthday Special', value: 'birthday_special' },
        { label: 'Anniversary Special', value: 'anniversary_special' },
        { label: 'Referral Bonus', value: 'referral_bonus' },
        { label: 'Seasonal Promotion', value: 'seasonal_promotion' },
        { label: 'Flash Sale', value: 'flash_sale' },
        { label: 'Bundle Deal', value: 'bundle_deal' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Category of the reward or offer',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Haircuts', value: 'haircuts' },
        { label: 'Styling', value: 'styling' },
        { label: 'Color & Highlights', value: 'color_highlights' },
        { label: 'Beard Grooming', value: 'beard_grooming' },
        { label: 'Facial Treatments', value: 'facial_treatments' },
        { label: 'Products', value: 'products' },
        { label: 'Membership', value: 'membership' },
        { label: 'Events', value: 'events' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active Offer',
      defaultValue: true,
      admin: {
        description: 'Whether this offer is currently active',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      label: 'Public Offer',
      defaultValue: true,
      admin: {
        description: 'Whether this offer is visible to all customers',
      },
    },
    {
      name: 'targetAudience',
      type: 'select',
      label: 'Target Audience',
      options: [
        { label: 'All Customers', value: 'all' },
        { label: 'New Customers Only', value: 'new_customers' },
        { label: 'Returning Customers Only', value: 'returning_customers' },
        { label: 'Loyalty Members Only', value: 'loyalty_members' },
        { label: 'Specific Tiers Only', value: 'specific_tiers' },
        { label: 'VIP Customers Only', value: 'vip_customers' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'eligibleTiers',
      type: 'array',
      label: 'Eligible Loyalty Tiers',
      admin: {
        condition: (data, siblingData) => siblingData.targetAudience === 'specific_tiers',
        description: 'Which loyalty tiers can use this offer',
      },
      fields: [
        {
          name: 'tier',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'validFrom',
      type: 'date',
      required: true,
      label: 'Valid From',
      admin: {
        description: 'When this offer becomes available',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      required: true,
      label: 'Valid Until',
      admin: {
        description: 'When this offer expires',
      },
    },
    {
      name: 'redemptionLimit',
      type: 'group',
      label: 'Redemption Limits',
      fields: [
        {
          name: 'maxRedemptions',
          type: 'number',
          label: 'Maximum Total Redemptions',
          admin: {
            description: 'Maximum number of times this offer can be redeemed (leave empty for unlimited)',
          },
        },
        {
          name: 'maxPerCustomer',
          type: 'number',
          label: 'Maximum Per Customer',
          defaultValue: 1,
          admin: {
            description: 'Maximum number of times a single customer can redeem this offer',
          },
        },
        {
          name: 'currentRedemptions',
          type: 'number',
          label: 'Current Redemptions',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of times this offer has been redeemed',
          },
        },
      ],
    },
    {
      name: 'requirements',
      type: 'group',
      label: 'Offer Requirements',
      fields: [
        {
          name: 'minimumSpend',
          type: 'number',
          label: 'Minimum Spend ($)',
          admin: {
            description: 'Minimum amount customer must spend to qualify',
          },
        },
        {
          name: 'minimumPoints',
          type: 'number',
          label: 'Minimum Points Required',
          admin: {
            description: 'Minimum loyalty points required to redeem',
          },
        },
        {
          name: 'requiredServices',
          type: 'array',
          label: 'Required Services',
          admin: {
            description: 'Services that must be purchased to qualify',
          },
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              label: 'Service',
              required: true,
            },
            {
              name: 'quantity',
              type: 'number',
              label: 'Quantity',
              defaultValue: 1,
            },
          ],
        },
        {
          name: 'requiredProducts',
          type: 'array',
          label: 'Required Products',
          admin: {
            description: 'Products that must be purchased to qualify',
          },
          fields: [
            {
              name: 'product',
              type: 'text',
              label: 'Product Name',
              required: true,
            },
            {
              name: 'quantity',
              type: 'number',
              label: 'Quantity',
              defaultValue: 1,
            },
          ],
        },
        {
          name: 'appointmentRequired',
          type: 'checkbox',
          label: 'Appointment Required',
          defaultValue: false,
          admin: {
            description: 'Whether customer must have an appointment to redeem',
          },
        },
        {
          name: 'referralRequired',
          type: 'checkbox',
          label: 'Referral Required',
          defaultValue: false,
          admin: {
            description: 'Whether customer must refer someone to qualify',
          },
        },
      ],
    },
    {
      name: 'discountDetails',
      type: 'group',
      label: 'Discount Details',
      admin: {
        condition: (data, siblingData) => 
          siblingData.type === 'service_discount' || 
          siblingData.type === 'product_discount',
      },
      fields: [
        {
          name: 'discountType',
          type: 'select',
          required: true,
          options: [
            { label: 'Percentage Off', value: 'percentage' },
            { label: 'Fixed Amount Off', value: 'fixed_amount' },
            { label: 'Buy One Get One', value: 'bogo' },
            { label: 'Buy X Get Y', value: 'buy_x_get_y' },
          ],
          label: 'Discount Type',
        },
        {
          name: 'discountValue',
          type: 'number',
          required: true,
          label: 'Discount Value',
          admin: {
            description: 'Percentage or fixed amount (e.g., 20 for 20% off, 10 for $10 off)',
          },
        },
        {
          name: 'maximumDiscount',
          type: 'number',
          label: 'Maximum Discount ($)',
          admin: {
            description: 'Maximum amount customer can save (for percentage discounts)',
          },
        },
        {
          name: 'applicableServices',
          type: 'array',
          label: 'Applicable Services',
          admin: {
            description: 'Services this discount applies to (leave empty for all)',
          },
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              label: 'Service',
            },
          ],
        },
      ],
    },
    {
      name: 'bonusPoints',
      type: 'group',
      label: 'Bonus Points Details',
      admin: {
        condition: (data, siblingData) => siblingData.type === 'bonus_points',
      },
      fields: [
        {
          name: 'pointsToAward',
          type: 'number',
          required: true,
          label: 'Points to Award',
        },
        {
          name: 'multiplier',
          type: 'number',
          label: 'Points Multiplier',
          admin: {
            description: 'Multiply base points by this factor (e.g., 2 for double points)',
          },
        },
        {
          name: 'minimumSpendForBonus',
          type: 'number',
          label: 'Minimum Spend for Bonus',
          admin: {
            description: 'Minimum amount to spend to earn bonus points',
          },
        },
      ],
    },
    {
      name: 'freeService',
      type: 'group',
      label: 'Free Service Details',
      admin: {
        condition: (data, siblingData) => siblingData.type === 'free_service',
      },
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          label: 'Free Service',
          required: true,
        },
        {
          name: 'upgradeOptions',
          type: 'array',
          label: 'Upgrade Options',
          admin: {
            description: 'Additional services that can be added for a fee',
          },
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              label: 'Upgrade Service',
            },
            {
              name: 'upgradePrice',
              type: 'number',
              label: 'Upgrade Price ($)',
            },
          ],
        },
      ],
    },
    {
      name: 'priorityFeatures',
      type: 'group',
      label: 'Priority Features',
      admin: {
        condition: (data, siblingData) => 
          siblingData.type === 'priority_booking' || 
          siblingData.type === 'exclusive_access',
      },
      fields: [
        {
          name: 'priorityLevel',
          type: 'select',
          options: [
            { label: 'Standard Priority', value: 'standard' },
            { label: 'High Priority', value: 'high' },
            { label: 'VIP Priority', value: 'vip' },
            { label: 'Exclusive Access', value: 'exclusive' },
          ],
          label: 'Priority Level',
        },
        {
          name: 'earlyAccessHours',
          type: 'number',
          label: 'Early Access Hours',
          admin: {
            description: 'Hours before general public that this offer becomes available',
          },
        },
        {
          name: 'exclusiveTimeSlots',
          type: 'array',
          label: 'Exclusive Time Slots',
          admin: {
            description: 'Specific time slots reserved for this offer',
          },
          fields: [
            {
              name: 'dayOfWeek',
              type: 'select',
              options: [
                { label: 'Monday', value: 'monday' },
                { label: 'Tuesday', value: 'tuesday' },
                { label: 'Wednesday', value: 'wednesday' },
                { label: 'Thursday', value: 'thursday' },
                { label: 'Friday', value: 'friday' },
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
              ],
              label: 'Day of Week',
            },
            {
              name: 'startTime',
              type: 'text',
              label: 'Start Time',
              admin: {
                description: 'Time in HH:MM format (e.g., 09:00)',
              },
            },
            {
              name: 'endTime',
              type: 'text',
              label: 'End Time',
              admin: {
                description: 'Time in HH:MM format (e.g., 17:00)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'promotionalContent',
      type: 'group',
      label: 'Promotional Content',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Featured Image',
          admin: {
            description: 'Main image for promoting this offer',
          },
        },
        {
          name: 'bannerText',
          type: 'text',
          label: 'Banner Text',
          admin: {
            description: 'Short text to display on banners and promotional materials',
          },
        },
        {
          name: 'promotionalCode',
          type: 'text',
          label: 'Promotional Code',
          admin: {
            description: 'Code customers can use to redeem this offer',
          },
        },
        {
          name: 'termsAndConditions',
          type: 'richText',
          label: 'Terms & Conditions',
          admin: {
            description: 'Legal terms and conditions for this offer',
          },
        },
        {
          name: 'howToRedeem',
          type: 'richText',
          label: 'How to Redeem',
          admin: {
            description: 'Step-by-step instructions for customers',
          },
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics & Tracking',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'views',
          type: 'number',
          label: 'Total Views',
          defaultValue: 0,
        },
        {
          name: 'clicks',
          type: 'number',
          label: 'Total Clicks',
          defaultValue: 0,
        },
        {
          name: 'redemptions',
          type: 'number',
          label: 'Total Redemptions',
          defaultValue: 0,
        },
        {
          name: 'conversionRate',
          type: 'number',
          label: 'Conversion Rate (%)',
          defaultValue: 0,
          admin: {
            description: 'Percentage of views that resulted in redemptions',
          },
        },
        {
          name: 'totalValue',
          type: 'number',
          label: 'Total Value Redeemed ($)',
          defaultValue: 0,
        },
        {
          name: 'averageOrderValue',
          type: 'number',
          label: 'Average Order Value ($)',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Keywords to help customers find this offer',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
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
      ({ data, req, operation }) => {
        // Auto-calculate conversion rate
        if (data.analytics && data.analytics.views > 0) {
          data.analytics.conversionRate = Math.round((data.analytics.redemptions / data.analytics.views) * 100);
        }

        // Auto-calculate average order value
        if (data.analytics && data.analytics.redemptions > 0) {
          data.analytics.averageOrderValue = Math.round((data.analytics.totalValue / data.analytics.redemptions) * 100) / 100;
        }

        // Track user changes
        if (operation === 'create') {
          data.createdBy = req.user?.id;
        }
        if (operation === 'update') {
          data.updatedBy = req.user?.id;
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
          const now = new Date();
          
          const offers = await payload.find({
            collection: 'rewards-offers',
            where: {
              and: [
                { isActive: { equals: true } },
                { validFrom: { less_than_equal: now } },
                { validUntil: { greater_than: now } },
              ],
            },
            sort: '-createdAt',
            limit: 50,
          });
          
          res.json(offers);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/category/:category',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { category } = req.params;
          const now = new Date();
          
          const offers = await payload.find({
            collection: 'rewards-offers',
            where: {
              and: [
                { category: { equals: category } },
                { isActive: { equals: true } },
                { validFrom: { less_than_equal: now } },
                { validUntil: { greater_than: now } },
              ],
            },
            sort: '-createdAt',
            limit: 20,
          });
          
          res.json(offers);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/redeem/:offerId',
      method: 'post',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { offerId } = req.params;
          const { customerId, appointmentId } = req.body;

          if (!customerId) {
            return res.status(400).json({ error: 'Customer ID required' });
          }

          // Get the offer
          const offer = await payload.findByID({
            collection: 'rewards-offers',
            id: offerId,
          });

          if (!offer || !offer.isActive) {
            return res.status(400).json({ error: 'Offer not available' });
          }

          // Check if offer is still valid
          const now = new Date();
          if (now < new Date(offer.validFrom) || now > new Date(offer.validUntil)) {
            return res.status(400).json({ error: 'Offer has expired or not yet available' });
          }

          // Check redemption limits
          if (offer.redemptionLimit?.maxRedemptions && 
              offer.redemptionLimit.currentRedemptions >= offer.redemptionLimit.maxRedemptions) {
            return res.status(400).json({ error: 'Offer redemption limit reached' });
          }

          // Update analytics
          await payload.update({
            collection: 'rewards-offers',
            id: offerId,
            data: {
              analytics: {
                ...offer.analytics,
                redemptions: (offer.analytics?.redemptions || 0) + 1,
                clicks: (offer.analytics?.clicks || 0) + 1,
              },
            },
          });

          res.json({ success: true, message: 'Offer redeemed successfully' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
  ],
};
