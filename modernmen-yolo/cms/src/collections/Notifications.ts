import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'recipient', 'status', 'sentAt'],
    group: 'Communications',
    icon: BusinessIcons.Notifications,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Appointment Reminder', value: 'appointment-reminder' },
        { label: 'Appointment Confirmation', value: 'appointment-confirmation' },
        { label: 'Appointment Cancellation', value: 'appointment-cancellation' },
        { label: 'Payment Receipt', value: 'payment-receipt' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'System Alert', value: 'system-alert' },
        { label: 'Staff Notification', value: 'staff-notification' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Recipient of the notification',
      },
    },
    {
      name: 'recipientEmail',
      type: 'email',
      admin: {
        description: 'Email address for external recipients',
        condition: (data) => !data.recipient,
      },
    },
    {
      name: 'recipientPhone',
      type: 'text',
      admin: {
        description: 'Phone number for SMS notifications',
        condition: (data) => !data.recipient,
      },
    },
    {
      name: 'channels',
      type: 'array',
      fields: [
        {
          name: 'channel',
          type: 'select',
          required: true,
          options: [
            { label: 'Email', value: 'email' },
            { label: 'SMS', value: 'sms' },
            { label: 'Push Notification', value: 'push' },
            { label: 'In-App', value: 'in-app' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Failed', value: 'failed' },
            { label: 'Read', value: 'read' },
          ],
        },
        {
          name: 'sentAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'deliveredAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'readAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'errorMessage',
          type: 'text',
          admin: {
            readOnly: true,
            condition: (data) => data.status === 'failed',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'scheduledFor',
      type: 'date',
      admin: {
        description: 'When to send the notification',
        condition: (data) => data.status === 'scheduled',
      },
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'notification-templates',
      admin: {
        description: 'Use a predefined template',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data for personalization',
      },
    },
    {
      name: 'relatedAppointment',
      type: 'relationship',
      relationTo: 'appointments',
      admin: {
        description: 'Related appointment (if applicable)',
      },
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'services',
      admin: {
        description: 'Related service (if applicable)',
      },
    },
    {
      name: 'sentBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          data.sentBy = req.user?.id;
        }
        if (data.status === 'sent' && !data.sentAt) {
          data.sentAt = new Date();
        }
        return data;
      },
    ],
  },
};
