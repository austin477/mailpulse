'use client'

import { useState } from 'react'
import { useFilterStore } from '@/stores/filter-store'
import { Button } from '@/components/ui/button'
import { X, Filter, Search, ChevronDown } from 'lucide-react'

export function EmailFilters() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useFilterStore()

  const [showFilters, setShowFilters] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'starred', label: 'Starred' },
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Search bar */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-300 focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Status filter pills */}
      <div className="px-3 pb-2 flex items-center gap-1.5 overflow-x-auto">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value as any)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              statusFilter === opt.value || (opt.value === 'all' && !statusFilter)
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}

        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="ml-auto px-2 py-1 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-1 whitespace-nowrap transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
