import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';

export const TimeTracking: CollectionConfig = {
  slug: 'time-tracking',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'staff', 'date', 'clockIn', 'clockOut', 'totalHours', 'status'],
    group: 'Staff Management',
    icon: BusinessIcons.TimeTracking,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated display name',
      },
    },
    {
      name: 'staff',
      type: 'relationship',
      relationTo: 'staff',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'clockIn',
      type: 'text',
      required: true,
      admin: {
        description: 'Format: HH:MM (24-hour)',
      },
    },
    {
      name: 'clockOut',
      type: 'text',
      admin: {
        description: 'Format: HH:MM (24-hour)',
      },
    },
    {
      name: 'breakTime',
      type: 'group',
      fields: [
        {
          name: 'breaks',
          type: 'array',
          fields: [
            {
              name: 'startTime',
              type: 'text',
              required: true,
              admin: {
                description: 'Break start time (HH:MM)',
              },
            },
            {
              name: 'endTime',
              type: 'text',
              required: true,
              admin: {
                description: 'Break end time (HH:MM)',
              },
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Lunch Break', value: 'lunch' },
                { label: 'Rest Break', value: 'rest' },
                { label: 'Personal Break', value: 'personal' },
                { label: 'Smoke Break', value: 'smoke' },
              ],
            },
            {
              name: 'paid',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'totalBreakMinutes',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Total break time in minutes (calculated)',
          },
        },
      ],
    },
    {
      name: 'workDetails',
      type: 'group',
      fields: [
        {
          name: 'appointments',
          type: 'relationship',
          relationTo: 'appointments',
          hasMany: true,
          admin: {
            description: 'Appointments handled during this shift',
          },
        },
        {
          name: 'servicesPerformed',
          type: 'array',
          fields: [
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              required: true,
            },
            {
              name: 'client',
              type: 'relationship',
              relationTo: 'customers',
              required: true,
            },
            {
              name: 'startTime',
              type: 'text',
              required: true,
            },
            {
              name: 'endTime',
              type: 'text',
              required: true,
            },
            {
              name: 'revenue',
              type: 'number',
              admin: {
                description: 'Revenue generated from this service',
              },
            },
          ],
          admin: {
            description: 'Individual services performed during shift',
          },
        },
        {
          name: 'location',
          type: 'relationship',
          relationTo: 'locations',
          admin: {
            description: 'Work location for this shift',
          },
        },
      ],
    },
    {
      name: 'calculations',
      type: 'group',
      fields: [
        {
          name: 'totalHours',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Total hours worked (calculated)',
          },
        },
        {
          name: 'regularHours',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Regular hours (up to 8 per day)',
          },
        },
        {
          name: 'overtimeHours',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Overtime hours (over 8 per day or 40 per week)',
          },
        },
        {
          name: 'grossPay',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Gross pay for this shift',
          },
        },
        {
          name: 'commissionEarned',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Commission earned from services',
          },
        },
        {
          name: 'totalEarnings',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Total earnings (hourly + commission)',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'in_progress',
      options: [
        { label: 'Clocked In', value: 'in_progress' },
        { label: 'On Break', value: 'on_break' },
        { label: 'Clocked Out', value: 'completed' },
        { label: 'No Show', value: 'no_show' },
        { label: 'Sick Day', value: 'sick' },
        { label: 'Holiday', value: 'holiday' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Notes about this shift',
        position: 'sidebar',
      },
    },
    {
      name: 'managerApproval',
      type: 'group',
      fields: [
        {
          name: 'approved',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'approvedBy',
          type: 'relationship',
          relationTo: 'staff',
        },
        {
          name: 'approvedAt',
          type: 'date',
        },
        {
          name: 'adjustments',
          type: 'textarea',
          admin: {
            description: 'Any time adjustments made by manager',
          },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate display name
        if (data.staff && data.date) {
          data.displayName = `${data.staff.personalInfo?.fullName || 'Staff Member'} - ${new Date(data.date).toLocaleDateString()}`;
        }
        
        // Calculate total hours if clockIn and clockOut are present
        if (data.clockIn && data.clockOut) {
          const [inHour, inMin] = data.clockIn.split(':').map(Number);
          const [outHour, outMin] = data.clockOut.split(':').map(Number);
          
          const clockInMinutes = inHour * 60 + inMin;
          const clockOutMinutes = outHour * 60 + outMin;
          
          let totalMinutes = clockOutMinutes - clockInMinutes;
          if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts
          
          // Subtract break time
          const breakMinutes = data.breakTime?.totalBreakMinutes || 0;
          totalMinutes -= breakMinutes;
          
          data.calculations = data.calculations || {};
          data.calculations.totalHours = Number((totalMinutes / 60).toFixed(2));
          
          // Calculate regular vs overtime hours
          if (data.calculations.totalHours <= 8) {
            data.calculations.regularHours = data.calculations.totalHours;
            data.calculations.overtimeHours = 0;
          } else {
            data.calculations.regularHours = 8;
            data.calculations.overtimeHours = data.calculations.totalHours - 8;
          }
        }
        
        return data;
      },
    ],
  },
};