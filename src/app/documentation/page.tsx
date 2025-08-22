import Link from "next/link"
import { documentationCategories } from "@/lib/documentation-data"

export default function DocumentationPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Documentation</h1>
        <p className="text-slate-300">
          Welcome to the EDB Postgres AI documentation. Here you'll find comprehensive guides and documentation to help you start working with EDB Postgres AI as quickly as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentationCategories.map((category) => (
          <div key={category.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
            <h2 className="text-xl font-semibold mb-2 text-slate-100">
              <Link href={`/documentation/${category.slug}`}>
                {category.title}
              </Link>
            </h2>
            <p className="text-slate-400 text-sm mb-4">{category.description}</p>
            <ul className="space-y-1">
              {category.articles.slice(0, 3).map((article) => (
                <li key={article.id}>
                  <Link 
                    href={`/documentation/${category.slug}/${article.slug}`}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
                  >
                    <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 mr-2"></span>
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
            {category.articles.length > 3 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <Link 
                  href={`/documentation/${category.slug}`}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  View all {category.articles.length} articles →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 