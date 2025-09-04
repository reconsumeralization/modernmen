import type { CollectionConfig } from 'payload'

/**
 * Default hooks for Payload collections
 */
export function withDefaultHooks(config: CollectionConfig): CollectionConfig {
  return {
    ...config,
    hooks: {
      ...config.hooks,
      // Add default hooks here if needed
      beforeChange: [
        ...(config.hooks?.beforeChange || []),
      ],
      afterChange: [
        ...(config.hooks?.afterChange || []),
      ],
      beforeDelete: [
        ...(config.hooks?.beforeDelete || []),
      ],
      afterDelete: [
        ...(config.hooks?.afterDelete || []),
      ],
    },
  }
}

