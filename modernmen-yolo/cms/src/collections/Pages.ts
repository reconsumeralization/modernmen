import { CollectionConfig } from 'payload/types';
import BusinessIcons from '../admin/customIcons';
import { PageBuilderField } from '../fields/PageBuilderField';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'publishedAt'],
    group: 'Content',
    icon: BusinessIcons.Media,
    preview: (doc) => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/${doc.slug}`
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'staff') return true;
      return {
        status: { equals: 'published' }
      };
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'staff',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'staff',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    // Basic Page Information
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'This will be the page title and H1',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path for this page (e.g., "about-us")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // SEO Settings
    {
      type: 'tabs',
      tabs: [
        {
          label: '🎨 Page Builder',
          fields: [
            {
              name: 'pageBlocks',
              type: 'blocks',
              minRows: 0,
              maxRows: 50,
              admin: {
                initCollapsed: false,
                description: 'Build your page by dragging and dropping blocks',
              },
              blocks: [
                // Hero Section Block
                {
                  slug: 'hero',
                  labels: {
                    singular: '🚀 Hero Section',
                    plural: '🚀 Hero Sections',
                  },
                  imageURL: '/admin-assets/block-hero.svg',
                  fields: [
                    {
                      name: 'style',
                      type: 'select',
                      defaultValue: 'gradient',
                      options: [
                        { label: '🌈 Gradient Background', value: 'gradient' },
                        { label: '🖼️ Image Background', value: 'image' },
                        { label: '🎥 Video Background', value: 'video' },
                        { label: '🎨 Solid Color', value: 'solid' },
                        { label: '✨ Animated Particles', value: 'particles' },
                      ],
                    },
                    {
                      name: 'backgroundImage',
                      type: 'upload',
                      relationTo: 'gallery',
                      admin: {
                        condition: (data) => data.style === 'image',
                      },
                    },
                    {
                      name: 'backgroundVideo',
                      type: 'text',
                      admin: {
                        condition: (data) => data.style === 'video',
                        description: 'YouTube or Vimeo URL',
                      },
                    },
                    {
                      name: 'backgroundColor',
                      type: 'text',
                      admin: {
                        condition: (data) => data.style === 'solid',
                        description: 'Hex color (e.g., #ff6b35)',
                      },
                    },
                    {
                      name: 'height',
                      type: 'select',
                      defaultValue: 'large',
                      options: [
                        { label: '📱 Small (400px)', value: 'small' },
                        { label: '💻 Medium (600px)', value: 'medium' },
                        { label: '🖥️ Large (800px)', value: 'large' },
                        { label: '📺 Extra Large (100vh)', value: 'fullscreen' },
                      ],
                    },
                    {
                      name: 'headline',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Main headline - make it compelling!',
                      },
                    },
                    {
                      name: 'subheadline',
                      type: 'textarea',
                      admin: {
                        description: 'Supporting text under the headline',
                      },
                    },
                    {
                      name: 'ctaButtons',
                      type: 'array',
                      maxRows: 3,
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'link',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'style',
                          type: 'select',
                          defaultValue: 'primary',
                          options: [
                            { label: '🎯 Primary Button', value: 'primary' },
                            { label: '⚪ Secondary Button', value: 'secondary' },
                            { label: '👻 Ghost Button', value: 'ghost' },
                            { label: '🔗 Link Style', value: 'link' },
                          ],
                        },
                        {
                          name: 'icon',
                          type: 'select',
                          options: [
                            { label: 'None', value: '' },
                            { label: '📅 Calendar', value: 'calendar' },
                            { label: '📞 Phone', value: 'phone' },
                            { label: '✂️ Scissors', value: 'scissors' },
                            { label: '⭐ Star', value: 'star' },
                            { label: '🚀 Rocket', value: 'rocket' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'textAlign',
                      type: 'select',
                      defaultValue: 'center',
                      options: [
                        { label: '👈 Left', value: 'left' },
                        { label: '🎯 Center', value: 'center' },
                        { label: '👉 Right', value: 'right' },
                      ],
                    },
                    {
                      name: 'overlay',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description: 'Add dark overlay for better text readability',
                      },
                    },
                  ],
                },

                // Text Content Block
                {
                  slug: 'text',
                  labels: {
                    singular: '📝 Text Block',
                    plural: '📝 Text Blocks',
                  },
                  imageURL: '/admin-assets/block-text.svg',
                  fields: [
                    {
                      name: 'content',
                      type: 'richText',
                      required: true,
                      admin: {
                        description: 'Rich text content with formatting options',
                      },
                    },
                    {
                      name: 'width',
                      type: 'select',
                      defaultValue: 'normal',
                      options: [
                        { label: '📱 Narrow (600px)', value: 'narrow' },
                        { label: '📄 Normal (800px)', value: 'normal' },
                        { label: '📰 Wide (1200px)', value: 'wide' },
                        { label: '🖥️ Full Width', value: 'full' },
                      ],
                    },
                    {
                      name: 'textAlign',
                      type: 'select',
                      defaultValue: 'left',
                      options: [
                        { label: '👈 Left', value: 'left' },
                        { label: '🎯 Center', value: 'center' },
                        { label: '👉 Right', value: 'right' },
                        { label: '📏 Justify', value: 'justify' },
                      ],
                    },
                    {
                      name: 'backgroundColor',
                      type: 'text',
                      admin: {
                        description: 'Background color (optional)',
                      },
                    },
                  ],
                },

                // Image Gallery Block
                {
                  slug: 'gallery',
                  labels: {
                    singular: '🖼️ Image Gallery',
                    plural: '🖼️ Image Galleries',
                  },
                  imageURL: '/admin-assets/block-gallery.svg',
                  fields: [
                    {
                      name: 'images',
                      type: 'array',
                      required: true,
                      minRows: 1,
                      maxRows: 24,
                      fields: [
                        {
                          name: 'image',
                          type: 'upload',
                          relationTo: 'gallery',
                          required: true,
                        },
                        {
                          name: 'caption',
                          type: 'text',
                        },
                        {
                          name: 'alt',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'grid',
                      options: [
                        { label: '🔲 Grid Layout', value: 'grid' },
                        { label: '📱 Masonry', value: 'masonry' },
                        { label: '📜 Carousel', value: 'carousel' },
                        { label: '⚡ Lightbox Grid', value: 'lightbox' },
                      ],
                    },
                    {
                      name: 'columns',
                      type: 'select',
                      defaultValue: '3',
                      options: [
                        { label: '1️⃣ One Column', value: '1' },
                        { label: '2️⃣ Two Columns', value: '2' },
                        { label: '3️⃣ Three Columns', value: '3' },
                        { label: '4️⃣ Four Columns', value: '4' },
                        { label: '6️⃣ Six Columns', value: '6' },
                      ],
                      admin: {
                        condition: (data) => data.layout === 'grid' || data.layout === 'lightbox',
                      },
                    },
                    {
                      name: 'spacing',
                      type: 'select',
                      defaultValue: 'normal',
                      options: [
                        { label: '🤏 Tight', value: 'tight' },
                        { label: '📏 Normal', value: 'normal' },
                        { label: '🌬️ Loose', value: 'loose' },
                      ],
                    },
                  ],
                },

                // Services/Features Block
                {
                  slug: 'services',
                  labels: {
                    singular: '⚡ Services Block',
                    plural: '⚡ Services Blocks',
                  },
                  imageURL: '/admin-assets/block-services.svg',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      admin: {
                        description: 'Section title (optional)',
                      },
                    },
                    {
                      name: 'subtitle',
                      type: 'textarea',
                      admin: {
                        description: 'Section description (optional)',
                      },
                    },
                    {
                      name: 'services',
                      type: 'array',
                      required: true,
                      minRows: 1,
                      maxRows: 12,
                      fields: [
                        {
                          name: 'icon',
                          type: 'select',
                          required: true,
                          options: [
                            { label: '✂️ Scissors', value: 'scissors' },
                            { label: '🧔 Beard', value: 'beard' },
                            { label: '💇 Haircut', value: 'haircut' },
                            { label: '🎨 Color', value: 'color' },
                            { label: '💆 Massage', value: 'massage' },
                            { label: '🕴️ Style', value: 'style' },
                            { label: '⚡ Flash', value: 'flash' },
                            { label: '🎯 Target', value: 'target' },
                            { label: '💎 Diamond', value: 'diamond' },
                            { label: '🚀 Rocket', value: 'rocket' },
                          ],
                        },
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'description',
                          type: 'textarea',
                          required: true,
                        },
                        {
                          name: 'price',
                          type: 'text',
                          admin: {
                            description: 'Price (optional, e.g., "From $25")',
                          },
                        },
                        {
                          name: 'image',
                          type: 'upload',
                          relationTo: 'gallery',
                        },
                        {
                          name: 'link',
                          type: 'text',
                          admin: {
                            description: 'Link URL (optional)',
                          },
                        },
                      ],
                    },
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'cards',
                      options: [
                        { label: '🃏 Cards', value: 'cards' },
                        { label: '📋 List', value: 'list' },
                        { label: '🔲 Grid', value: 'grid' },
                        { label: '📱 Carousel', value: 'carousel' },
                      ],
                    },
                    {
                      name: 'columns',
                      type: 'select',
                      defaultValue: '3',
                      options: [
                        { label: '1️⃣ One Column', value: '1' },
                        { label: '2️⃣ Two Columns', value: '2' },
                        { label: '3️⃣ Three Columns', value: '3' },
                        { label: '4️⃣ Four Columns', value: '4' },
                      ],
                      admin: {
                        condition: (data) => data.layout === 'cards' || data.layout === 'grid',
                      },
                    },
                  ],
                },

                // Team/Staff Block
                {
                  slug: 'team',
                  labels: {
                    singular: '👥 Team Block',
                    plural: '👥 Team Blocks',
                  },
                  imageURL: '/admin-assets/block-team.svg',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      admin: {
                        description: 'Section title (optional)',
                      },
                    },
                    {
                      name: 'subtitle',
                      type: 'textarea',
                      admin: {
                        description: 'Section description (optional)',
                      },
                    },
                    {
                      name: 'teamMembers',
                      type: 'relationship',
                      relationTo: 'staff',
                      hasMany: true,
                      admin: {
                        description: 'Select team members to display',
                      },
                    },
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'cards',
                      options: [
                        { label: '🃏 Cards', value: 'cards' },
                        { label: '⭕ Circles', value: 'circles' },
                        { label: '🔲 Grid', value: 'grid' },
                        { label: '📱 Carousel', value: 'carousel' },
                      ],
                    },
                    {
                      name: 'showBio',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description: 'Show team member bio/description',
                      },
                    },
                    {
                      name: 'showSocials',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Show social media links',
                      },
                    },
                  ],
                },

                // Contact Form Block
                {
                  slug: 'contact',
                  labels: {
                    singular: '📞 Contact Form',
                    plural: '📞 Contact Forms',
                  },
                  imageURL: '/admin-assets/block-contact.svg',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'Get In Touch',
                    },
                    {
                      name: 'subtitle',
                      type: 'textarea',
                      defaultValue: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
                    },
                    {
                      name: 'fields',
                      type: 'array',
                      defaultValue: [
                        { type: 'text', label: 'Name', required: true },
                        { type: 'email', label: 'Email', required: true },
                        { type: 'textarea', label: 'Message', required: true },
                      ],
                      fields: [
                        {
                          name: 'type',
                          type: 'select',
                          required: true,
                          options: [
                            { label: '📝 Text Input', value: 'text' },
                            { label: '📧 Email Input', value: 'email' },
                            { label: '📞 Phone Input', value: 'phone' },
                            { label: '📄 Textarea', value: 'textarea' },
                            { label: '📋 Select Dropdown', value: 'select' },
                            { label: '☑️ Checkbox', value: 'checkbox' },
                          ],
                        },
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'placeholder',
                          type: 'text',
                        },
                        {
                          name: 'required',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'options',
                          type: 'array',
                          fields: [
                            {
                              name: 'label',
                              type: 'text',
                              required: true,
                            },
                            {
                              name: 'value',
                              type: 'text',
                              required: true,
                            },
                          ],
                          admin: {
                            condition: (data) => data.type === 'select',
                          },
                        },
                      ],
                    },
                    {
                      name: 'submitButtonText',
                      type: 'text',
                      defaultValue: 'Send Message',
                    },
                    {
                      name: 'successMessage',
                      type: 'text',
                      defaultValue: 'Thank you! Your message has been sent.',
                    },
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'single',
                      options: [
                        { label: '📄 Single Column', value: 'single' },
                        { label: '📰 Two Columns', value: 'two-column' },
                        { label: '🎨 Inline Form', value: 'inline' },
                      ],
                    },
                  ],
                },

                // Testimonials Block
                {
                  slug: 'testimonials',
                  labels: {
                    singular: '⭐ Testimonials',
                    plural: '⭐ Testimonials',
                  },
                  imageURL: '/admin-assets/block-testimonials.svg',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'What Our Clients Say',
                    },
                    {
                      name: 'testimonials',
                      type: 'relationship',
                      relationTo: 'reviews',
                      hasMany: true,
                      filterOptions: {
                        published: { equals: true },
                        rating: { greater_than: 3 },
                      },
                    },
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'carousel',
                      options: [
                        { label: '📱 Carousel', value: 'carousel' },
                        { label: '🔲 Grid', value: 'grid' },
                        { label: '📋 List', value: 'list' },
                        { label: '🃏 Cards', value: 'cards' },
                      ],
                    },
                    {
                      name: 'showRating',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'showPhoto',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                  ],
                },

                // Call to Action Block
                {
                  slug: 'cta',
                  labels: {
                    singular: '🎯 Call to Action',
                    plural: '🎯 Call to Actions',
                  },
                  imageURL: '/admin-assets/block-cta.svg',
                  fields: [
                    {
                      name: 'style',
                      type: 'select',
                      defaultValue: 'banner',
                      options: [
                        { label: '📢 Banner Style', value: 'banner' },
                        { label: '🃏 Card Style', value: 'card' },
                        { label: '👻 Minimal', value: 'minimal' },
                        { label: '🌈 Gradient', value: 'gradient' },
                      ],
                    },
                    {
                      name: 'backgroundColor',
                      type: 'text',
                      admin: {
                        description: 'Background color (hex, e.g., #ff6b35)',
                      },
                    },
                    {
                      name: 'headline',
                      type: 'text',
                      required: true,
                      defaultValue: 'Ready to Get Started?',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      defaultValue: 'Join thousands of satisfied customers who trust us with their style.',
                    },
                    {
                      name: 'button',
                      type: 'group',
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                          defaultValue: 'Book Now',
                        },
                        {
                          name: 'link',
                          type: 'text',
                          required: true,
                          defaultValue: '/book',
                        },
                        {
                          name: 'style',
                          type: 'select',
                          defaultValue: 'primary',
                          options: [
                            { label: '🎯 Primary', value: 'primary' },
                            { label: '⚪ Secondary', value: 'secondary' },
                            { label: '👻 Ghost', value: 'ghost' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'size',
                      type: 'select',
                      defaultValue: 'normal',
                      options: [
                        { label: '🤏 Small', value: 'small' },
                        { label: '📏 Normal', value: 'normal' },
                        { label: '🔥 Large', value: 'large' },
                        { label: '💥 Extra Large', value: 'xl' },
                      ],
                    },
                  ],
                },

                // Custom HTML Block
                {
                  slug: 'html',
                  labels: {
                    singular: '⚡ Custom HTML',
                    plural: '⚡ Custom HTML',
                  },
                  imageURL: '/admin-assets/block-html.svg',
                  fields: [
                    {
                      name: 'html',
                      type: 'code',
                      required: true,
                      admin: {
                        language: 'html',
                        description: 'Custom HTML code - be careful!',
                      },
                    },
                    {
                      name: 'css',
                      type: 'code',
                      admin: {
                        language: 'css',
                        description: 'Custom CSS styles (optional)',
                      },
                    },
                    {
                      name: 'js',
                      type: 'code',
                      admin: {
                        language: 'javascript',
                        description: 'Custom JavaScript (optional)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '🎨 Design Settings',
          fields: [
            {
              name: 'pageStyle',
              type: 'group',
              fields: [
                {
                  name: 'backgroundColor',
                  type: 'text',
                  admin: {
                    description: 'Page background color (hex)',
                  },
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'gallery',
                  admin: {
                    description: 'Page background image (optional)',
                  },
                },
                {
                  name: 'maxWidth',
                  type: 'select',
                  defaultValue: 'normal',
                  options: [
                    { label: '📱 Narrow (800px)', value: 'narrow' },
                    { label: '📄 Normal (1200px)', value: 'normal' },
                    { label: '📰 Wide (1600px)', value: 'wide' },
                    { label: '🖥️ Full Width', value: 'full' },
                  ],
                },
                {
                  name: 'customCSS',
                  type: 'code',
                  admin: {
                    language: 'css',
                    description: 'Custom CSS for this page',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '🔍 SEO & Meta',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'SEO page title (defaults to page title)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'SEO meta description (160 characters max)',
                  },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: {
                    description: 'SEO keywords (comma-separated)',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'gallery',
                  admin: {
                    description: 'Social media share image',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Prevent search engines from indexing this page',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // Sidebar Fields
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'lastModified',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          data.author = req.user?.id;
        }
        data.lastModified = new Date();
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Here you could trigger page regeneration, cache clearing, etc.
        console.log(`Page ${doc.title} was ${operation}d`);
      },
    ],
  },

  timestamps: true,
};