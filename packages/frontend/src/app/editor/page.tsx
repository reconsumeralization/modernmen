import { Metadata } from 'next'
import ModernMenImageEditor from '@/components/image-editor/ModernMenImageEditor'

export const metadata: Metadata = {
  title: 'Image Editor - Modern Men Salon',
  description: 'Professional image editing tools for creating stunning content with Modern Men branding and templates.',
  keywords: ['image editor', 'photo editing', 'content creation', 'social media', 'design tools', 'Modern Men']
}

export default function ImageEditorPage() {
  return <ModernMenImageEditor />
}
