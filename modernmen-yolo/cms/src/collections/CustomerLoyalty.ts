import { CollectionConfig } from 'payload/types';
import { BusinessIcons } from '../admin';

export const CustomerLoyalty: CollectionConfig = {
  slug: 'customer-loyalty',
  admin: {
    useAsTitle: 'customerName',
    icon: BusinessIcons.Customers,
    group: 'Loyalty & Rewards',
    description: 'Individual customer loyalty accounts and point balances',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      // Users can read their own loyalty account, admins can read all
      return user.role === 'admin' || user.role === 'staff';
    },
    create: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'staff')),
    update: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'staff')),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      hasMany: false,
      label: 'Customer',
      admin: {
        description: 'Customer this loyalty account belongs to',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer Name',
      admin: {
        description: 'Customer name for display purposes',
      },
    },
    {
      name: 'loyaltyProgram',
      type: 'relationship',
      relationTo: 'loyalty-program',
      required: true,
      hasMany: false,
      label: 'Loyalty Program',
      admin: {
        description: 'Loyalty program this customer is enrolled in',
      },
    },
    {
      name: 'currentTier',
      type: 'relationship',
      relationTo: 'loyalty-program',
      label: 'Current Tier',
      admin: {
        description: 'Current loyalty tier (auto-calculated)',
        readOnly: true,
      },
    },
    {
      name: 'tierName',
      type: 'text',
      label: 'Tier Name',
      admin: {
        readOnly: true,
        description: 'Current tier name for display',
      },
    },
    {
      name: 'totalPointsEarned',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Points Earned',
      admin: {
        description: 'Lifetime points earned',
        readOnly: true,
      },
    },
    {
      name: 'totalPointsRedeemed',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Points Redeemed',
      admin: {
        description: 'Lifetime points redeemed',
        readOnly: true,
      },
    },
    {
      name: 'currentPoints',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Current Points Balance',
      admin: {
        description: 'Available points for redemption',
        readOnly: true,
      },
    },
    {
      name: 'pendingPoints',
      type: 'number',
      defaultValue: 0,
      label: 'Pending Points',
      admin: {
        description: 'Points earned but not yet available (e.g., from recent appointments)',
        readOnly: true,
      },
    },
    {
      name: 'expiringPoints',
      type: 'number',
      defaultValue: 0,
      label: 'Expiring Points',
      admin: {
        description: 'Points that will expire soon',
        readOnly: true,
      },
    },
    {
      name: 'enrollmentDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      label: 'Enrollment Date',
      admin: {
        description: 'When customer joined the loyalty program',
        readOnly: true,
      },
    },
    {
      name: 'lastActivityDate',
      type: 'date',
      label: 'Last Activity Date',
      admin: {
        description: 'Last time customer earned or redeemed points',
        readOnly: true,
      },
    },
    {
      name: 'nextTierProgress',
      type: 'group',
      label: 'Next Tier Progress',
      admin: {
        description: 'Progress toward next loyalty tier',
        readOnly: true,
      },
      fields: [
        {
          name: 'nextTier',
          type: 'text',
          label: 'Next Tier Name',
        },
        {
          name: 'pointsNeeded',
          type: 'number',
          label: 'Points Needed',
        },
        {
          name: 'progressPercentage',
          type: 'number',
          label: 'Progress Percentage',
          min: 0,
          max: 100,
        },
      ],
    },
    {
      name: 'referralCode',
      type: 'text',
      label: 'Referral Code',
      admin: {
        description: 'Unique referral code for this customer',
        readOnly: true,
      },
    },
    {
      name: 'referrals',
      type: 'array',
      label: 'Referrals',
      admin: {
        description: 'Customers referred by this customer',
        readOnly: true,
      },
      fields: [
        {
          name: 'referredCustomer',
          type: 'relationship',
          relationTo: 'customers',
          label: 'Referred Customer',
        },
        {
          name: 'referralDate',
          type: 'date',
          label: 'Referral Date',
        },
        {
          name: 'bonusPointsAwarded',
          type: 'number',
          label: 'Bonus Points Awarded',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Completed', value: 'completed' },
            { label: 'Expired', value: 'expired' },
          ],
          label: 'Status',
        },
      ],
    },
    {
      name: 'recentTransactions',
      type: 'array',
      label: 'Recent Transactions',
      admin: {
        description: 'Recent point transactions (last 50)',
        readOnly: true,
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Earned', value: 'earned' },
            { label: 'Redeemed', value: 'redeemed' },
            { label: 'Expired', value: 'expired' },
            { label: 'Bonus', value: 'bonus' },
            { label: 'Referral', value: 'referral' },
            { label: 'Birthday', value: 'birthday' },
            { label: 'Anniversary', value: 'anniversary' },
            { label: 'Adjustment', value: 'adjustment' },
          ],
          required: true,
          label: 'Transaction Type',
        },
        {
          name: 'points',
          type: 'number',
          required: true,
          label: 'Points',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
        {
          name: 'appointment',
          type: 'relationship',
          relationTo: 'appointments',
          label: 'Related Appointment',
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Transaction Date',
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Expiration Date',
          admin: {
            description: 'When these points expire (if applicable)',
          },
        },
      ],
    },
    {
      name: 'redemptionHistory',
      type: 'array',
      label: 'Redemption History',
      admin: {
        description: 'History of point redemptions',
        readOnly: true,
      },
      fields: [
        {
          name: 'redemptionDate',
          type: 'date',
          required: true,
          label: 'Redemption Date',
        },
        {
          name: 'pointsRedeemed',
          type: 'number',
          required: true,
          label: 'Points Redeemed',
        },
        {
          name: 'value',
          type: 'number',
          required: true,
          label: 'Value in Dollars',
        },
        {
          name: 'redemptionType',
          type: 'select',
          options: [
            { label: 'Service Discount', value: 'service_discount' },
            { label: 'Free Service', value: 'free_service' },
            { label: 'Product Discount', value: 'product_discount' },
            { label: 'Cash Value', value: 'cash_value' },
            { label: 'Special Offer', value: 'special_offer' },
          ],
          required: true,
          label: 'Redemption Type',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
        {
          name: 'appointment',
          type: 'relationship',
          relationTo: 'appointments',
          label: 'Related Appointment',
        },
      ],
    },
    {
      name: 'specialOffers',
      type: 'array',
      label: 'Special Offers',
      admin: {
        description: 'Special offers available to this customer',
        readOnly: true,
      },
      fields: [
        {
          name: 'offer',
          type: 'text',
          required: true,
          label: 'Offer Name',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Offer Description',
        },
        {
          name: 'validFrom',
          type: 'date',
          required: true,
          label: 'Valid From',
        },
        {
          name: 'validUntil',
          type: 'date',
          required: true,
          label: 'Valid Until',
        },
        {
          name: 'isRedeemed',
          type: 'checkbox',
          label: 'Redeemed',
          defaultValue: false,
        },
        {
          name: 'redemptionDate',
          type: 'date',
          label: 'Redemption Date',
          admin: {
            condition: (data, siblingData) => siblingData.isRedeemed,
          },
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      label: 'Customer Preferences',
      fields: [
        {
          name: 'emailNotifications',
          type: 'checkbox',
          label: 'Email Notifications',
          defaultValue: true,
        },
        {
          name: 'smsNotifications',
          type: 'checkbox',
          label: 'SMS Notifications',
          defaultValue: false,
        },
        {
          name: 'pushNotifications',
          type: 'checkbox',
          label: 'Push Notifications',
          defaultValue: true,
        },
        {
          name: 'marketingEmails',
          type: 'checkbox',
          label: 'Marketing Emails',
          defaultValue: true,
        },
        {
          name: 'birthdayReminders',
          type: 'checkbox',
          label: 'Birthday Reminders',
          defaultValue: true,
        },
        {
          name: 'anniversaryReminders',
          type: 'checkbox',
          label: 'Anniversary Reminders',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Staff Notes',
      admin: {
        description: 'Internal notes about this customer\'s loyalty account',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Account Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' },
      ],
      admin: {
        description: 'Current status of the loyalty account',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Auto-calculate current points
        if (data.recentTransactions) {
          data.currentPoints = data.totalPointsEarned - data.totalPointsRedeemed;
        }

        // Auto-update last activity date
        if (operation === 'update' && data.recentTransactions && data.recentTransactions.length > 0) {
          const latestTransaction = data.recentTransactions[data.recentTransactions.length - 1];
          if (latestTransaction && latestTransaction.date) {
            data.lastActivityDate = latestTransaction.date;
          }
        }

        // Auto-generate referral code if not provided
        if (!data.referralCode && data.customer) {
          data.referralCode = `REF${data.customer.toString().slice(-6).toUpperCase()}`;
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
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update customer record with loyalty info
        if (doc.customer) {
          try {
            const { payload } = req;
            await payload.update({
              collection: 'customers',
              id: doc.customer,
              data: {
                loyaltyStatus: doc.status,
                currentTier: doc.tierName,
                loyaltyPoints: doc.currentPoints,
              },
            });
          } catch (error) {
            console.error('Error updating customer loyalty status:', error);
          }
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/customer/:customerId',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { customerId } = req.params;

          const loyaltyAccount = await payload.find({
            collection: 'customer-loyalty',
            where: {
              customer: { equals: customerId },
            },
            limit: 1,
          });

          if (loyaltyAccount.docs.length > 0) {
            res.json(loyaltyAccount.docs[0]);
          } else {
            res.status(404).json({ error: 'Loyalty account not found' });
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/earn-points',
      method: 'post',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { customerId, points, description, appointmentId, type = 'earned' } = req.body;

          if (!customerId || !points || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
          }

          // Find or create loyalty account
          let loyaltyAccount = await payload.find({
            collection: 'customer-loyalty',
            where: {
              customer: { equals: customerId },
            },
            limit: 1,
          });

          if (loyaltyAccount.docs.length === 0) {
            // Create new loyalty account
            const customer = await payload.findByID({
              collection: 'customers',
              id: customerId,
            });

            loyaltyAccount = await payload.create({
              collection: 'customer-loyalty',
              data: {
                customer: customerId,
                customerName: customer.name || 'Unknown Customer',
                loyaltyProgram: 'default', // You'll need to set this
                totalPointsEarned: points,
                currentPoints: points,
                enrollmentDate: new Date(),
                lastActivityDate: new Date(),
                recentTransactions: [{
                  type,
                  points,
                  description,
                  appointment: appointmentId,
                  date: new Date(),
                }],
              },
            });
          } else {
            // Update existing account
            const account = loyaltyAccount.docs[0];
            const newTransaction = {
              type,
              points,
              description,
              appointment: appointmentId,
              date: new Date(),
            };

            await payload.update({
              collection: 'customer-loyalty',
              id: account.id,
              data: {
                totalPointsEarned: account.totalPointsEarned + points,
                currentPoints: account.currentPoints + points,
                lastActivityDate: new Date(),
                recentTransactions: [...(account.recentTransactions || []), newTransaction].slice(-50), // Keep last 50
              },
            });
          }

          res.json({ success: true, message: 'Points earned successfully' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/redeem-points',
      method: 'post',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { customerId, points, description, redemptionType, appointmentId } = req.body;

          if (!customerId || !points || !description || !redemptionType) {
            return res.status(400).json({ error: 'Missing required fields' });
          }

          // Find loyalty account
          const loyaltyAccount = await payload.find({
            collection: 'customer-loyalty',
            where: {
              customer: { equals: customerId },
            },
            limit: 1,
          });

          if (loyaltyAccount.docs.length === 0) {
            return res.status(404).json({ error: 'Loyalty account not found' });
          }

          const account = loyaltyAccount.docs[0];

          if (account.currentPoints < points) {
            return res.status(400).json({ error: 'Insufficient points' });
          }

          // Calculate value (you'll need to get this from loyalty program settings)
          const pointValue = 0.01; // Default value
          const value = points * pointValue;

          const redemption = {
            redemptionDate: new Date(),
            pointsRedeemed: points,
            value,
            redemptionType,
            description,
            appointment: appointmentId,
          };

          await payload.update({
            collection: 'customer-loyalty',
            id: account.id,
            data: {
              totalPointsRedeemed: account.totalPointsRedeemed + points,
              currentPoints: account.currentPoints - points,
              lastActivityDate: new Date(),
              redemptionHistory: [...(account.redemptionHistory || []), redemption],
              recentTransactions: [...(account.recentTransactions || []), {
                type: 'redeemed',
                points: -points,
                description: `Redeemed: ${description}`,
                appointment: appointmentId,
                date: new Date(),
              }].slice(-50),
            },
          });

          res.json({ success: true, message: 'Points redeemed successfully', value });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
  ],
};
