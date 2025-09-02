"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps {
  searchKey?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  children?: React.ReactNode
}

export function DataTableToolbar({
  searchKey,
  searchPlaceholder = "Search...",
  onSearch,
  children
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}