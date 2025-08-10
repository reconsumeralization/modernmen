import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://modernmen.ca'
  const staticPaths = [
    '',
    '/about',
    '/services',
    '/products',
    '/team',
    '/gallery',
    '/hours-contact',
    '/privacy-policy',
    '/terms-of-service',
    '/book',
    '/book-enhanced',
    '/portal/login',
    '/portal/register'
  ]

  const now = new Date()
  return staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }))
}


