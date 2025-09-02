import { CollectionConfig } from 'payload/types';
import { BusinessIcons } from '../admin';

export const BarberSocial: CollectionConfig = {
  slug: 'barber-social',
  admin: {
    useAsTitle: 'title',
    icon: BusinessIcons.Barbers,
    group: 'Social Media',
    description: 'Social media posts for barbers and barberettes to showcase their work',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user }, doc }) => {
      if (!user) return false;
      // Users can edit their own posts, admins can edit all
      return user.role === 'admin' || doc.author === user.id;
    },
    delete: ({ req: { user }, doc }) => {
      if (!user) return false;
      return user.role === 'admin' || doc.author === user.id;
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
      admin: {
        description: 'A catchy title for your hair transformation post',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        description: 'The barber/barberette who created this post',
        readOnly: true,
      },
    },
    {
      name: 'clientName',
      type: 'text',
      label: 'Client Name (Optional)',
      admin: {
        description: 'Client name if they gave permission to share',
      },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Before Photo',
      admin: {
        description: 'Client hair before the transformation',
      },
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'After Photo',
      admin: {
        description: 'Client hair after the transformation',
      },
    },
    {
      name: 'additionalImages',
      type: 'array',
      label: 'Additional Photos',
      admin: {
        description: 'More angles or process photos',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Photo Caption',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Post Description',
      admin: {
        description: 'Tell the story of this transformation',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Services Used',
      admin: {
        description: 'What services were performed',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      label: 'Difficulty Level',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
      admin: {
        description: 'How challenging was this transformation?',
      },
    },
    {
      name: 'timeSpent',
      type: 'number',
      label: 'Time Spent (minutes)',
      admin: {
        description: 'How long did this transformation take?',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Add relevant tags for discoverability',
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
      name: 'category',
      type: 'select',
      label: 'Hair Category',
      options: [
        { label: 'Fade', value: 'fade' },
        { label: 'Pompadour', value: 'pompadour' },
        { label: 'Undercut', value: 'undercut' },
        { label: 'Textured Crop', value: 'textured-crop' },
        { label: 'Slick Back', value: 'slick-back' },
        { label: 'Quiff', value: 'quiff' },
        { label: 'Side Part', value: 'side-part' },
        { label: 'Buzz Cut', value: 'buzz-cut' },
        { label: 'Long Hair', value: 'long-hair' },
        { label: 'Braids', value: 'braids' },
        { label: 'Dreadlocks', value: 'dreadlocks' },
        { label: 'Color', value: 'color' },
        { label: 'Highlights', value: 'highlights' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'clientConsent',
      type: 'checkbox',
      label: 'Client Consent',
      required: true,
      admin: {
        description: 'I have permission to share these photos',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      label: 'Public Post',
      defaultValue: true,
      admin: {
        description: 'Make this post visible to everyone',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Post',
      admin: {
        description: 'Mark as featured (admin only)',
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
        description: 'Users who liked this post',
      },
    },
    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'barber-comments',
      hasMany: true,
      label: 'Comments',
      admin: {
        readOnly: true,
        description: 'Comments on this post',
      },
    },
    {
      name: 'shares',
      type: 'number',
      label: 'Share Count',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this post was shared',
      },
    },
    {
      name: 'views',
      type: 'number',
      label: 'View Count',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this post was viewed',
      },
    },
    {
      name: 'rating',
      type: 'group',
      label: 'Post Rating',
      admin: {
        description: 'Community rating system',
      },
      fields: [
        {
          name: 'averageRating',
          type: 'number',
          label: 'Average Rating',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalRatings',
          type: 'number',
          label: 'Total Ratings',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'ratings',
          type: 'relationship',
          relationTo: 'barber-ratings',
          hasMany: true,
          label: 'Individual Ratings',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'challenge',
      type: 'relationship',
      relationTo: 'barber-challenges',
      hasMany: false,
      label: 'Challenge Entry',
      admin: {
        description: 'If this post is part of a challenge',
      },
    },
    {
      name: 'location',
      type: 'group',
      label: 'Location',
      admin: {
        description: 'Where this transformation was done',
      },
      fields: [
        {
          name: 'city',
          type: 'text',
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          label: 'State/Province',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Country',
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO & Meta',
      admin: {
        description: 'Search engine optimization',
      },
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
      ({ data, req }) => {
        // Auto-set author if not provided
        if (!data.author && req.user) {
          data.author = req.user.id;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        // Update user's post count
        if (operation === 'create' || operation === 'delete') {
          // This would update the user's post count
          // Implementation depends on your user collection structure
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/trending',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const posts = await payload.find({
            collection: 'barber-social',
            where: {
              isPublic: { equals: true },
            },
            sort: '-rating.averageRating',
            limit: 20,
          });
          res.json(posts);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/by-category/:category',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { category } = req.params;
          const posts = await payload.find({
            collection: 'barber-social',
            where: {
              and: [
                { isPublic: { equals: true } },
                { category: { equals: category } },
              ],
            },
            sort: '-createdAt',
            limit: 50,
          });
          res.json(posts);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/by-barber/:barberId',
      method: 'get',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { barberId } = req.params;
          const posts = await payload.find({
            collection: 'barber-social',
            where: {
              and: [
                { isPublic: { equals: true } },
                { author: { equals: barberId } },
              ],
            },
            sort: '-createdAt',
            limit: 50,
          });
          res.json(posts);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
  ],
};
