import React from "react"
import Link from "next/link"
import { Database, Search, Book, ArrowLeft } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { documentationCategories } from "@/lib/documentation-data"

export default function DocumentationLayout({ children }: { children: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      <header className="border-b border-slate-700/50 sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-cyan-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                EDB POSTGRES AI
              </span>
            </div>
            <Link href="/" className="flex items-center text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-20">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-10 py-2 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-400"
                />
              </div>
              
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="pr-4 pb-8">
                  <h3 className="font-medium text-slate-300 mb-3">Documentation</h3>
                  <div className="space-y-6">
                    {documentationCategories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <Link 
                          href={`/documentation/${category.slug}`}
                          className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors"
                        >
                          {category.title}
                        </Link>
                        <ul className="space-y-1 border-l border-slate-700 pl-3 ml-1">
                          {category.articles.map((article) => (
                            <li key={article.id}>
                              <Link 
                                href={`/documentation/${category.slug}/${article.slug}`}
                                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors block py-1"
                              >
                                {article.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 