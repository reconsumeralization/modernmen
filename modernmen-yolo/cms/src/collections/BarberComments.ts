import { CollectionConfig } from 'payload/types';
import { BusinessIcons } from '../admin';

export const BarberComments: CollectionConfig = {
  slug: 'barber-comments',
  admin: {
    useAsTitle: 'content',
    icon: BusinessIcons.Notifications,
    group: 'Social Media',
    description: 'Comments on barber social media posts',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user }, doc }) => {
      if (!user) return false;
      return user.role === 'admin' || doc.author === user.id;
    },
    delete: ({ req: { user }, doc }) => {
      if (!user) return false;
      return user.role === 'admin' || doc.author === user.id;
    },
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment',
      admin: {
        description: 'Your comment on this post',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        description: 'Who wrote this comment',
        readOnly: true,
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'barber-social',
      required: true,
      hasMany: false,
      admin: {
        description: 'The post this comment is on',
      },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'barber-comments',
      hasMany: false,
      admin: {
        description: 'If this is a reply to another comment',
      },
    },
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Likes',
      admin: {
        readOnly: true,
        description: 'Users who liked this comment',
      },
    },
    {
      name: 'isEdited',
      type: 'checkbox',
      label: 'Edited',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Has this comment been edited?',
      },
    },
    {
      name: 'editHistory',
      type: 'array',
      label: 'Edit History',
      admin: {
        readOnly: true,
        description: 'Previous versions of this comment',
      },
      fields: [
        {
          name: 'content',
          type: 'textarea',
          label: 'Previous Content',
        },
        {
          name: 'editedAt',
          type: 'date',
          label: 'Edited At',
        },
        {
          name: 'editedBy',
          type: 'relationship',
          relationTo: 'users',
          label: 'Edited By',
        },
      ],
    },
    {
      name: 'isFlagged',
      type: 'checkbox',
      label: 'Flagged',
      defaultValue: false,
      admin: {
        description: 'Has this comment been flagged as inappropriate?',
      },
    },
    {
      name: 'flags',
      type: 'array',
      label: 'Flags',
      admin: {
        readOnly: true,
        description: 'Reports of inappropriate content',
      },
      fields: [
        {
          name: 'reason',
          type: 'select',
          options: [
            { label: 'Spam', value: 'spam' },
            { label: 'Inappropriate', value: 'inappropriate' },
            { label: 'Harassment', value: 'harassment' },
            { label: 'False Information', value: 'false-info' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Additional Details',
        },
        {
          name: 'reportedBy',
          type: 'relationship',
          relationTo: 'users',
          label: 'Reported By',
        },
        {
          name: 'reportedAt',
          type: 'date',
          label: 'Reported At',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, originalDoc }) => {
        // Auto-set author if not provided
        if (!data.author && req.user) {
          data.author = req.user.id;
        }

        // Track edits
        if (originalDoc && originalDoc.content !== data.content) {
          data.isEdited = true;
          
          // Add to edit history
          if (!data.editHistory) data.editHistory = [];
          data.editHistory.push({
            content: originalDoc.content,
            editedAt: new Date().toISOString(),
            editedBy: req.user.id,
          });
        }

        return data;
      },
    ],
  },
};
