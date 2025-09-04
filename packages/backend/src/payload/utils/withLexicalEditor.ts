// Utility to add Lexical editor to Payload collections
import lexicalEditor from '@payloadcms/richtext-lexical';
import { CollectionConfig } from 'payload';

export function withLexicalEditor(collection: CollectionConfig): CollectionConfig {
  // Find the content field and replace it with Lexical editor
  const fields = collection.fields?.map((field: any) => {
    if (field.name === 'content' && field.type === 'richText') {
      return {
        ...field,
        editor: lexicalEditor({
          features: ({ defaultFeatures }: any) => [
            ...defaultFeatures,
            // Add any custom features here if needed
          ],
        }),
      };
    }
    return field;
  }) || [];

  return {
    ...collection,
    fields,
  };
}

// Default export for compatibility
export default withLexicalEditor;
