import { CollectionConfig } from 'payload/types';
import { BusinessIcons } from '../admin';

export const BarberChallenges: CollectionConfig = {
  slug: 'barber-challenges',
  admin: {
    useAsTitle: 'title',
    icon: BusinessIcons.Barbers,
    group: 'Social Media',
    description: 'Competitions and challenges for barbers and barberettes',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      // Only admins and verified barbers can create challenges
      return user && (user.role === 'admin' || user.isVerifiedBarber);
    },
    update: ({ req: { user }, doc }) => {
      if (!user) return false;
      return user.role === 'admin' || doc.creator === user.id;
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      return user.role === 'admin';
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Challenge Title',
      admin: {
        description: 'Name of the challenge or competition',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Challenge Description',
      admin: {
        description: 'Explain the challenge rules and requirements',
      },
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        description: 'Who created this challenge',
        readOnly: true,
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Challenge Category',
      options: [
        { label: 'Fade Challenge', value: 'fade' },
        { label: 'Pompadour Challenge', value: 'pompadour' },
        { label: 'Undercut Challenge', value: 'undercut' },
        { label: 'Textured Crop Challenge', value: 'textured-crop' },
        { label: 'Slick Back Challenge', value: 'slick-back' },
        { label: 'Quiff Challenge', value: 'quiff' },
        { label: 'Side Part Challenge', value: 'side-part' },
        { label: 'Buzz Cut Challenge', value: 'buzz-cut' },
        { label: 'Long Hair Challenge', value: 'long-hair' },
        { label: 'Braids Challenge', value: 'braids' },
        { label: 'Dreadlocks Challenge', value: 'dreadlocks' },
        { label: 'Color Challenge', value: 'color' },
        { label: 'Highlights Challenge', value: 'highlights' },
        { label: 'Speed Challenge', value: 'speed' },
        { label: 'Innovation Challenge', value: 'innovation' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      label: 'Challenge Difficulty',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        description: 'When the challenge begins',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      label: 'End Date',
      admin: {
        description: 'When the challenge ends',
      },
    },
    {
      name: 'votingEndDate',
      type: 'date',
      required: true,
      label: 'Voting End Date',
      admin: {
        description: 'When voting ends (can be after challenge ends)',
      },
    },
    {
      name: 'maxParticipants',
      type: 'number',
      label: 'Maximum Participants',
      admin: {
        description: 'Leave empty for unlimited participants',
      },
    },
    {
      name: 'entryFee',
      type: 'number',
      label: 'Entry Fee ($)',
      defaultValue: 0,
      admin: {
        description: 'Cost to enter the challenge (0 for free)',
      },
    },
    {
      name: 'prizes',
      type: 'array',
      label: 'Prizes',
      admin: {
        description: 'What winners will receive',
      },
      fields: [
        {
          name: 'place',
          type: 'select',
          options: [
            { label: '1st Place', value: '1st' },
            { label: '2nd Place', value: '2nd' },
            { label: '3rd Place', value: '3rd' },
            { label: 'Honorable Mention', value: 'honorable' },
            { label: 'Special Award', value: 'special' },
          ],
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Prize Description',
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          label: 'Prize Value ($)',
        },
        {
          name: 'sponsor',
          type: 'text',
          label: 'Sponsored By',
        },
      ],
    },
    {
      name: 'rules',
      type: 'array',
      label: 'Challenge Rules',
      admin: {
        description: 'Specific rules participants must follow',
      },
      fields: [
        {
          name: 'rule',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'requirements',
      type: 'array',
      label: 'Entry Requirements',
      admin: {
        description: 'What participants must provide',
      },
      fields: [
        {
          name: 'requirement',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'judgingCriteria',
      type: 'array',
      label: 'Judging Criteria',
      admin: {
        description: 'How entries will be evaluated',
      },
      fields: [
        {
          name: 'criterion',
          type: 'text',
          required: true,
        },
        {
          name: 'weight',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Weight (1-10)',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Challenge Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Open for Registration', value: 'registration' },
        { label: 'In Progress', value: 'active' },
        { label: 'Voting', value: 'voting' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Participants',
      admin: {
        readOnly: true,
        description: 'Users who have joined this challenge',
      },
    },
    {
      name: 'entries',
      type: 'relationship',
      relationTo: 'barber-social',
      hasMany: true,
      label: 'Challenge Entries',
      admin: {
        readOnly: true,
        description: 'Posts submitted for this challenge',
      },
    },
    {
      name: 'judges',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Judges',
      admin: {
        description: 'Users who will judge the challenge',
      },
    },
    {
      name: 'winners',
      type: 'array',
      label: 'Winners',
      admin: {
        readOnly: true,
        description: 'Challenge winners and their placements',
      },
      fields: [
        {
          name: 'place',
          type: 'select',
          options: [
            { label: '1st Place', value: '1st' },
            { label: '2nd Place', value: '2nd' },
            { label: '3rd Place', value: '3rd' },
            { label: 'Honorable Mention', value: 'honorable' },
            { label: 'Special Award', value: 'special' },
          ],
          required: true,
        },
        {
          name: 'winner',
          type: 'relationship',
          relationTo: 'users',
          label: 'Winner',
          required: true,
        },
        {
          name: 'entry',
          type: 'relationship',
          relationTo: 'barber-social',
          label: 'Winning Entry',
        },
        {
          name: 'score',
          type: 'number',
          label: 'Final Score',
        },
        {
          name: 'comments',
          type: 'textarea',
          label: 'Judge Comments',
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        description: 'Main image for the challenge',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Keywords to help people find this challenge',
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
        // Auto-set creator if not provided
        if (!data.creator && req.user) {
          data.creator = req.user.id;
        }

        // Auto-update status based on dates
        if (data.startDate && data.endDate) {
          const now = new Date();
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);

          if (now < startDate) {
            data.status = 'registration';
          } else if (now >= startDate && now <= endDate) {
            data.status = 'active';
          } else if (now > endDate) {
            data.status = 'voting';
          }
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
          const challenges = await payload.find({
            collection: 'barber-challenges',
            where: {
              status: { in: ['registration', 'active', 'voting'] },
            },
            sort: '-createdAt',
            limit: 20,
          });
          res.json(challenges);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
    {
      path: '/join/:challengeId',
      method: 'post',
      handler: async (req, res, next) => {
        try {
          const { payload } = req;
          const { challengeId } = req.params;
          const { userId } = req.body;

          if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
          }

          // Add user to participants
          await payload.update({
            collection: 'barber-challenges',
            id: challengeId,
            data: {
              participants: {
                relationTo: 'users',
                value: userId,
              },
            },
          });

          res.json({ success: true, message: 'Successfully joined challenge' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    },
  ],
};
