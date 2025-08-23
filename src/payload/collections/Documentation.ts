/* @ts-ignore: Payload types may not be resolvable in this context */
/* @ts-ignore: Payload types may not be resolvable in this context */
type CollectionConfig = any;
// Helper function to check if user can manage documentation
const isAdminOrDeveloper = (userRole?: string) => {
  return ['system_admin', 'developer'].includes(userRole || '');
};

export const Documentation: CollectionConfig = {
  slug: 'documentation',
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'type', 'role', 'updatedAt'],
  group: 'Content',
  // Only admins and developers can manage documentation in the admin UI
  hidden: ({ user }: { user?: any }) => !isAdminOrDeveloper(user?.role),
},
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Guide', value: 'guide' },
        { label: 'API Reference', value: 'api' },
        { label: 'Component', value: 'component' },
        { label: 'Page', value: 'page' },
      ],
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Guest', value: 'guest' },
        { label: 'Salon Customer', value: 'salon_customer' },
        { label: 'Salon Employee', value: 'salon_employee' },
        { label: 'Salon Owner', value: 'salon_owner' },
        { label: 'Developer', value: 'developer' },
        { label: 'System Admin', value: 'system_admin' },
      ],
      required: true,
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ type: 'text', name: 'tag' }],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending Review', value: 'pending' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: '1.0.0',
    },
    {
      name: 'lastUpdated',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'estimatedReadTime',
      type: 'number',
      admin: {
        description: 'Estimated read time in minutes',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'views',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'rating',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'completionRate',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'feedbackCount',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'isNew',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isUpdated',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isDeprecated',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
  timestamps: true,
  // Hook to index document after save
  hooks: {
afterChange: [
  async ({ doc }: { doc: any }) => {
    // Index the document for search
    const { DocumentationSearchService } = await import('@/lib/search-service');
    const searchService = new DocumentationSearchService({
      provider: 'local',
      indexName: 'documentation',
      maxResults: 50,
      enableFacets: true,
      enableSuggestions: true,
      enableAnalytics: true,
      enableHighlighting: true,
      enableTypoTolerance: true,
      enableSynonyms: true,
      rankingConfig: {
        roleBasedBoost: { guest: 1, salon_customer: 1.1, salon_employee: 1.2, salon_owner: 1.3, developer: 1.4, system_admin: 1.5 },
        recencyBoost: 0.01, popularityBoost: 0.001, accuracyBoost: 1.5, completionRateBoost: 0.5, ratingBoost: 0.3, viewsBoost: 0.0001,
        titleBoost: 3, descriptionBoost: 2, contentBoost: 1, tagsBoost: 2
      }
    });
    await searchService.indexDocument({
          id: doc.id,
          title: doc.title,
          description: doc.description || '',
          content: doc.content,
          path: `/documentation/${doc.slug}`,
          type: doc.type,
          role: doc.role,
          category: doc.category,
tags: doc.tags?.map((t: any) => t.tag) ?? [],
          author: doc.author?.id ?? '',
          lastUpdated: doc.lastUpdated,
          difficulty: doc.difficulty,
          estimatedReadTime: doc.estimatedReadTime,
          metadata: doc.metadata,
          searchableText: '',
          keywords: [],
        });
      },
    ],
  },
};
