import { Metadata } from 'next'
import { SearchPage } from '@/components/search/search-page'

export const metadata: Metadata = {
  title: 'Search - {{companyName}} Salon',
  description: 'Search through our services, stylists, and documentation.',
  keywords: ['search', 'services', 'stylists', 'documentation'],
}

/**
 * Props for the SearchPageRoute component.
 */
interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

/**
 * Server component for the search page route.
 * @param {SearchPageProps} props - The search params from the URL.
 * @returns {JSX.Element} The rendered search page.
 */
export default async function SearchPageRoute({ searchParams }: SearchPageProps) {
  // Defensive: Ensure searchParams is defined and is an object
  const params = searchParams ?? {}
  const initialQuery = typeof params.q === 'string' ? params.q : ''

  return (
    <SearchPage
      initialQuery={initialQuery}
      showStats={true}
    />
  )
}
