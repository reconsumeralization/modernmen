import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    icon: BusinessIcons.Users,
  },
  auth: {
    useAPIKey: true,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
    verify: {
      generateEmailHTML: ({ token }) => {
        return `
          <div>
            <h1>Verify your email</h1>
            <p>Click the link below to verify your email:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">Verify Email</a>
          </div>
        `
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ token }) => {
        return `
          <div>
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">Reset Password</a>
          </div>
        `
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
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
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        // Administrative Roles
        {
          label: '👑 Owner/CEO',
          value: 'owner',
        },
        {
          label: '🏢 Manager',
          value: 'manager',
        },
        {
          label: '⚙️ System Admin',
          value: 'admin',
        },

        // Service Provider Roles
        {
          label: '✂️ Senior Barber/Stylist',
          value: 'senior_barber',
        },
        {
          label: '💇‍♂️ Barber/Stylist',
          value: 'barber',
        },
        {
          label: '🎓 Apprentice/Intern',
          value: 'apprentice',
        },
        {
          label: '💅 Nail Technician',
          value: 'nail_technician',
        },
        {
          label: '🧴 Esthetician',
          value: 'esthetician',
        },
        {
          label: '💆‍♀️ Massage Therapist',
          value: 'massage_therapist',
        },

        // Support Staff Roles
        {
          label: '👋 Receptionist',
          value: 'receptionist',
        },
        {
          label: '🧹 Cleaner/Maintenance',
          value: 'cleaner',
        },
        {
          label: '📦 Inventory Manager',
          value: 'inventory_manager',
        },

        // Customer Roles
        {
          label: '⭐ VIP Customer',
          value: 'vip_customer',
        },
        {
          label: '👤 Regular Customer',
          value: 'customer',
        },
        {
          label: '🏢 Corporate Account',
          value: 'corporate',
        },

        // Business Roles
        {
          label: '🚚 Supplier/Vendor',
          value: 'supplier',
        },
        {
          label: '📊 Marketing Partner',
          value: 'marketing_partner',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Select the primary role for this user',
      },
      access: {
        update: ({ req: { user } }) => {
          return ['admin', 'owner', 'manager'].includes(user?.role || '')
        },
      },
    },
    {
      name: 'userType',
      type: 'select',
      required: true,
      defaultValue: 'individual',
      options: [
        {
          label: '👤 Individual',
          value: 'individual',
        },
        {
          label: '🏢 Business/Corporate',
          value: 'business',
        },
        {
          label: '🏪 Salon Franchise',
          value: 'franchise',
        },
        {
          label: '📦 Supplier/Vendor',
          value: 'supplier',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Type of user account',
        condition: (data) => ['customer', 'vip_customer', 'corporate', 'supplier', 'marketing_partner'].includes(data.role),
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        {
          label: '✅ Active',
          value: 'active',
        },
        {
          label: '⏸️ Inactive',
          value: 'inactive',
        },
        {
          label: '🚫 Suspended',
          value: 'suspended',
        },
        {
          label: '🔒 Banned',
          value: 'banned',
        },
        {
          label: '⏳ Pending Approval',
          value: 'pending',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      access: {
        update: ({ req: { user } }) => {
          return ['admin', 'owner', 'manager'].includes(user?.role || '')
        },
      },
    },
    {
      name: 'permissions',
      type: 'group',
      admin: {
        position: 'sidebar',
        condition: (data) => ['admin', 'owner', 'manager', 'senior_barber', 'receptionist', 'inventory_manager'].includes(data.role),
      },
      fields: [
        {
          name: 'canBookAppointments',
          type: 'checkbox',
          defaultValue: true,
          label: 'Can book appointments',
        },
        {
          name: 'canManageCustomers',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can manage customers',
        },
        {
          name: 'canManageStaff',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can manage staff',
        },
        {
          name: 'canViewReports',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can view reports',
        },
        {
          name: 'canManageInventory',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can manage inventory',
        },
        {
          name: 'canManageServices',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can manage services',
        },
        {
          name: 'canManageSettings',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can manage settings',
        },
        {
          name: 'canViewFinancials',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can view financial data',
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        condition: (data) => ['customer', 'vip_customer'].includes(data.role),
        position: 'sidebar',
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'prefer_not_to_say' },
      ],
      admin: {
        condition: (data) => ['customer', 'vip_customer'].includes(data.role),
        position: 'sidebar',
      },
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
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this user',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for categorizing users',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    // Customer-specific fields
    {
      name: 'loyaltyPoints',
      type: 'number',
      defaultValue: 0,
      admin: {
        condition: (data) => ['customer', 'vip_customer'].includes(data.role),
      },
    },
    {
      name: 'membershipTier',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
        { label: 'VIP', value: 'vip' },
      ],
      admin: {
        condition: (data) => ['customer', 'vip_customer'].includes(data.role),
        position: 'sidebar',
      },
    },
    {
      name: 'preferredStylist',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          in: ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist'],
        },
      },
      admin: {
        condition: (data) => ['customer', 'vip_customer'].includes(data.role),
      },
    },

    // Business/Corporate fields
    {
      name: 'companyName',
      type: 'text',
      admin: {
        condition: (data) => ['corporate', 'supplier', 'marketing_partner'].includes(data.role),
      },
    },
    {
      name: 'companySize',
      type: 'select',
      options: [
        { label: '1-10 employees', value: 'small' },
        { label: '11-50 employees', value: 'medium' },
        { label: '51-200 employees', value: 'large' },
        { label: '201+ employees', value: 'enterprise' },
      ],
      admin: {
        condition: (data) => ['corporate', 'supplier', 'marketing_partner'].includes(data.role),
      },
    },
    {
      name: 'industry',
      type: 'text',
      admin: {
        condition: (data) => ['corporate', 'supplier', 'marketing_partner'].includes(data.role),
      },
    },

    // Service Provider fields (Barbers, Stylists, Technicians)
    {
      name: 'specialties',
      type: 'array',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist'].includes(data.role),
      },
      fields: [
        {
          name: 'specialty',
          type: 'text',
          required: true,
        },
        {
          name: 'certification',
          type: 'text',
        },
        {
          name: 'experience',
          type: 'number',
          admin: {
            description: 'Years of experience with this specialty',
          },
        },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist'].includes(data.role),
      },
    },
    {
      name: 'certifications',
      type: 'array',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist', 'apprentice'].includes(data.role),
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'issuingAuthority',
          type: 'text',
        },
        {
          name: 'issueDate',
          type: 'date',
        },
        {
          name: 'expiryDate',
          type: 'date',
        },
      ],
    },
    {
      name: 'availability',
      type: 'array',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist', 'receptionist'].includes(data.role),
      },
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
          name: 'startTime',
          type: 'text',
          required: true,
          label: 'Start Time (HH:MM)',
        },
        {
          name: 'endTime',
          type: 'text',
          required: true,
          label: 'End Time (HH:MM)',
        },
        {
          name: 'isAvailable',
          type: 'checkbox',
          defaultValue: true,
          label: 'Available',
        },
      ],
    },

    // Employment/Staff fields
    {
      name: 'employeeId',
      type: 'text',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist', 'receptionist', 'cleaner', 'inventory_manager', 'apprentice'].includes(data.role),
        position: 'sidebar',
      },
    },
    {
      name: 'hireDate',
      type: 'date',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist', 'receptionist', 'cleaner', 'inventory_manager', 'apprentice'].includes(data.role),
        position: 'sidebar',
      },
    },
    {
      name: 'hourlyRate',
      type: 'number',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist', 'receptionist', 'cleaner', 'inventory_manager', 'apprentice'].includes(data.role),
        position: 'sidebar',
        description: 'Hourly rate in cents',
      },
    },
    {
      name: 'commissionRate',
      type: 'number',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist'].includes(data.role),
        position: 'sidebar',
        description: 'Commission rate as percentage (e.g., 30 for 30%)',
      },
    },
    {
      name: 'emergencyContact',
      type: 'group',
      admin: {
        condition: (data) => ['barber', 'senior_barber', 'nail_technician', 'esthetician', 'massage_therapist', 'receptionist', 'cleaner', 'inventory_manager', 'apprentice'].includes(data.role),
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'relationship',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },

    // Supplier/Vendor fields
    {
      name: 'supplierType',
      type: 'select',
      options: [
        { label: 'Hair Products', value: 'hair_products' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Consumables', value: 'consumables' },
        { label: 'Services', value: 'services' },
        { label: 'Marketing', value: 'marketing' },
      ],
      admin: {
        condition: (data) => data.role === 'supplier',
      },
    },
    {
      name: 'taxId',
      type: 'text',
      admin: {
        condition: (data) => ['corporate', 'supplier', 'marketing_partner'].includes(data.role),
        position: 'sidebar',
      },
    },
    {
      name: 'paymentTerms',
      type: 'select',
      options: [
        { label: 'Net 15', value: 'net_15' },
        { label: 'Net 30', value: 'net_30' },
        { label: 'Net 60', value: 'net_60' },
        { label: 'Due on Receipt', value: 'due_on_receipt' },
      ],
      admin: {
        condition: (data) => ['corporate', 'supplier', 'marketing_partner'].includes(data.role),
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ],
        },
        {
          name: 'notifications',
          type: 'checkbox',
          defaultValue: true,
          label: 'Email Notifications',
        },
        {
          name: 'language',
          type: 'select',
          defaultValue: 'en',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
          ],
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set default permissions based on role
        if (operation === 'create' || (operation === 'update' && data.role)) {
          const defaultPermissions = getDefaultPermissions(data.role);

          if (defaultPermissions && !data.permissions) {
            data.permissions = defaultPermissions;
          }
        }

        return data;
      },
    ],
  },
};

// Helper function to get default permissions for each role
function getDefaultPermissions(role: string) {
  const basePermissions = {
    canBookAppointments: true,
    canManageCustomers: false,
    canManageStaff: false,
    canViewReports: false,
    canManageInventory: false,
    canManageServices: false,
    canManageSettings: false,
    canViewFinancials: false,
  };

  switch (role) {
    case 'owner':
      return {
        ...basePermissions,
        canManageCustomers: true,
        canManageStaff: true,
        canViewReports: true,
        canManageInventory: true,
        canManageServices: true,
        canManageSettings: true,
        canViewFinancials: true,
      };

    case 'manager':
      return {
        ...basePermissions,
        canManageCustomers: true,
        canManageStaff: true,
        canViewReports: true,
        canManageInventory: true,
        canManageServices: true,
        canViewFinancials: true,
      };

    case 'admin':
      return {
        ...basePermissions,
        canManageCustomers: true,
        canManageStaff: true,
        canViewReports: true,
        canManageInventory: true,
        canManageServices: true,
        canManageSettings: true,
        canViewFinancials: true,
      };

    case 'senior_barber':
      return {
        ...basePermissions,
        canManageCustomers: true,
        canViewReports: true,
      };

    case 'receptionist':
      return {
        ...basePermissions,
        canManageCustomers: true,
        canManageInventory: true,
      };

    case 'inventory_manager':
      return {
        ...basePermissions,
        canManageInventory: true,
        canViewReports: true,
      };

    case 'supplier':
    case 'marketing_partner':
      return {
        ...basePermissions,
        canBookAppointments: false,
      };

    default:
      return basePermissions;
  }
}
