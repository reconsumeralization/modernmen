import { CollectionConfig } from 'payload/types';
import { BusinessIcons } from '../admin';

export const BarberRatings: CollectionConfig = {
  slug: 'barber-ratings',
  admin: {
    useAsTitle: 'rating',
    icon: BusinessIcons.Reviews,
    group: 'Social Media',
    description: 'Ratings and reviews for barber social media posts',
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
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      label: 'Rating',
      admin: {
        description: 'Rate this transformation from 1-10',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        description: 'Who gave this rating',
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
        description: 'The post being rated',
      },
    },
    {
      name: 'review',
      type: 'textarea',
      label: 'Review (Optional)',
      admin: {
        description: 'Share your thoughts on this transformation',
      },
    },
    {
      name: 'criteria',
      type: 'group',
      label: 'Rating Criteria',
      admin: {
        description: 'Break down your rating by different aspects',
      },
      fields: [
        {
          name: 'technique',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Technique',
          admin: {
            description: 'How well was the technique executed?',
          },
        },
        {
          name: 'creativity',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Creativity',
          admin: {
            description: 'How creative and unique is this style?',
          },
        },
        {
          name: 'difficulty',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Difficulty',
          admin: {
            description: 'How challenging was this transformation?',
          },
        },
        {
          name: 'execution',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Execution',
          admin: {
            description: 'How well was the final result achieved?',
          },
        },
        {
          name: 'clientSatisfaction',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Client Satisfaction',
          admin: {
            description: 'How happy would the client be with this result?',
          },
        },
      ],
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      label: 'Verified Rating',
      defaultValue: false,
      admin: {
        description: 'Is this rating from a verified barber?',
      },
    },
    {
      name: 'helpful',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Helpful Votes',
      admin: {
        readOnly: true,
        description: 'Users who found this rating helpful',
      },
    },
    {
      name: 'notHelpful',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Not Helpful Votes',
      admin: {
        readOnly: true,
        description: 'Users who found this rating not helpful',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Auto-set author if not provided
        if (!data.author && req.user) {
          data.author = req.user.id;
        }

        // Calculate overall rating from criteria if provided
        if (data.criteria) {
          const criteriaValues = Object.values(data.criteria).filter(val => typeof val === 'number');
          if (criteriaValues.length > 0) {
            const avgRating = criteriaValues.reduce((sum, val) => sum + val, 0) / criteriaValues.length;
            data.rating = Math.round(avgRating);
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update post's average rating
        if (operation === 'create' || operation === 'update' || operation === 'delete') {
          try {
            const { payload } = req;
            
            // Get all ratings for this post
            const ratings = await payload.find({
              collection: 'barber-ratings',
              where: {
                post: { equals: doc.post },
              },
            });

            if (ratings.docs.length > 0) {
              const totalRating = ratings.docs.reduce((sum, rating) => sum + rating.rating, 0);
              const averageRating = totalRating / ratings.docs.length;

              // Update the post's rating
              await payload.update({
                collection: 'barber-social',
                id: doc.post,
                data: {
                  rating: {
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalRatings: ratings.docs.length,
                  },
                },
              });
            }
          } catch (error) {
            console.error('Error updating post rating:', error);
          }
        }
      },
    ],
  },
};
