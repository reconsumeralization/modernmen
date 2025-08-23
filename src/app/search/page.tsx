import { Metadata } from 'next'
import { SearchPage } from '@/components/search/search-page'

export const metadata: Metadata = {
  title: 'Search Documentation - Modern Men Salon',
  description: 'Search through our comprehensive documentation for components, guides, APIs, and references.',
  keywords: ['search', 'documentation', 'components', 'guides', 'api', 'reference']
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPageRoute({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const initialQuery = params.q || ''

  return (
    <SearchPage
      initialQuery={initialQuery}
      showStats={true}
    />
  )
}
