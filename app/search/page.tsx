'use client'

export const dynamic = 'force-dynamic'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  // Mock search results for demonstration — replace with your real search logic or API
  const allItems = [
    { id: 1, name: 'Product A', href: '/products/a' },
    { id: 2, name: 'Bundle B', href: '/bundles/b' },
    { id: 3, name: 'Category C', href: '/categories/c' },
    { id: 4, name: 'About Us', href: '/about' },
    { id: 5, name: 'Support Help Center', href: '/help' },
  ]

  // Simple filtering by name matching query (case-insensitive)
  const results = allItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h1>

      {results.length > 0 ? (
        <ul className="space-y-3">
          {results.map(({ id, name, href }) => (
            <li key={id}>
              <Link href={href} className="text-blue-600 hover:underline">
                {name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  )
}
