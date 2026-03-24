import { create } from 'zustand'

interface FilterStore {
  searchQuery: string
  categoryFilter: string | null
  priorityFilter: string | null
  sentimentFilter: string | null
  statusFilter: 'all' | 'read' | 'unread' | 'starred'
  dateRangeFilter: 'all' | 'today' | 'week' | 'month' | 'custom'
  customDateFrom?: Date
  customDateTo?: Date
  sortBy: 'date' | 'sender' | 'subject'
  sortOrder: 'asc' | 'desc'

  setSearchQuery: (query: string) => void
  setCategoryFilter: (category: string | null) => void
  setPriorityFilter: (priority: string | null) => void
  setSentimentFilter: (sentiment: string | null) => void
  setStatusFilter: (status: 'all' | 'read' | 'unread' | 'starred') => void
  setDateRangeFilter: (range: 'all' | 'today' | 'week' | 'month' | 'custom') => void
  setCustomDateRange: (from: Date, to: Date) => void
  setSortBy: (field: 'date' | 'sender' | 'subject') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  clearAllFilters: () => void
  hasActiveFilters: () => boolean
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  searchQuery: '',
  categoryFilter: null,
  priorityFilter: null,
  sentimentFilter: null,
  statusFilter: 'all',
  dateRangeFilter: 'all',
  sortBy: 'date',
  sortOrder: 'desc',

  setSearchQuery: (query) => set({ searchQuery: query }),

  setCategoryFilter: (category) => set({ categoryFilter: category }),

  setPriorityFilter: (priority) => set({ priorityFilter: priority }),

  setSentimentFilter: (sentiment) => set({ sentimentFilter: sentiment }),

  setStatusFilter: (status) => set({ statusFilter: status }),

  setDateRangeFilter: (range) => set({ dateRangeFilter: range }),

  setCustomDateRange: (from, to) =>
    set({
      dateRangeFilter: 'custom',
      customDateFrom: from,
      customDateTo: to,
    }),

  setSortBy: (field) => set({ sortBy: field }),

  setSortOrder: (order) => set({ sortOrder: order }),

  clearAllFilters: () =>
    set({
      searchQuery: '',
      categoryFilter: null,
      priorityFilter: null,
      sentimentFilter: null,
      statusFilter: 'all',
      dateRangeFilter: 'all',
      customDateFrom: undefined,
      customDateTo: undefined,
      sortBy: 'date',
      sortOrder: 'desc',
    }),

  hasActiveFilters: () => {
    const state = get()
    return (
      state.searchQuery !== '' ||
      state.categoryFilter !== null ||
      state.priorityFilter !== null ||
      state.sentimentFilter !== null ||
      state.statusFilter !== 'all' ||
      state.dateRangeFilter !== 'all'
    )
  },
}))
