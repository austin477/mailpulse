import { create } from 'zustand'
import { Email, EmailFilter } from '@/types/email'

interface EmailStore {
  emails: Email[]
  selectedEmail: Email | null
  filteredEmails: Email[]
  isLoading: boolean
  error: string | null
  filters: EmailFilter
  unreadCount: number

  setEmails: (emails: Email[]) => void
  setSelectedEmail: (email: Email | null) => void
  updateEmail: (id: string, updates: Partial<Email>) => void
  deleteEmail: (id: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setFilters: (filters: Partial<EmailFilter>) => void
  clearFilters: () => void
  applyFilters: () => void
  addEmail: (email: Email) => void
  bulkUpdateEmails: (ids: string[], updates: Partial<Email>) => void
}

const initialFilters: EmailFilter = {
  category: undefined,
  priority: undefined,
  sentiment: undefined,
  status: undefined,
  dateRange: undefined,
  searchQuery: undefined,
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: [],
  selectedEmail: null,
  filteredEmails: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  unreadCount: 0,

  setEmails: (emails) =>
    set((state) => ({
      emails,
      unreadCount: emails.filter((e) => !e.isRead).length,
      filteredEmails: applyFiltersToEmails(emails, state.filters),
    })),

  setSelectedEmail: (email) => set({ selectedEmail: email }),

  updateEmail: (id, updates) =>
    set((state) => {
      const updated = state.emails.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      )
      return {
        emails: updated,
        selectedEmail: state.selectedEmail?.id === id ? { ...state.selectedEmail, ...updates } : state.selectedEmail,
        filteredEmails: applyFiltersToEmails(updated, state.filters),
        unreadCount: updated.filter((e) => !e.isRead).length,
      }
    }),

  deleteEmail: (id) =>
    set((state) => {
      const updated = state.emails.filter((e) => e.id !== id)
      return {
        emails: updated,
        selectedEmail: state.selectedEmail?.id === id ? null : state.selectedEmail,
        filteredEmails: applyFiltersToEmails(updated, state.filters),
        unreadCount: updated.filter((e) => !e.isRead).length,
      }
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setFilters: (filters) =>
    set((state) => {
      const newFilters = { ...state.filters, ...filters }
      return {
        filters: newFilters,
        filteredEmails: applyFiltersToEmails(state.emails, newFilters),
      }
    }),

  clearFilters: () =>
    set((state) => ({
      filters: initialFilters,
      filteredEmails: state.emails,
    })),

  applyFilters: () =>
    set((state) => ({
      filteredEmails: applyFiltersToEmails(state.emails, state.filters),
    })),

  addEmail: (email) =>
    set((state) => {
      const updated = [email, ...state.emails]
      return {
        emails: updated,
        filteredEmails: applyFiltersToEmails(updated, state.filters),
        unreadCount: updated.filter((e) => !e.isRead).length,
      }
    }),

  bulkUpdateEmails: (ids, updates) =>
    set((state) => {
      const updated = state.emails.map((e) =>
        ids.includes(e.id) ? { ...e, ...updates } : e
      )
      return {
        emails: updated,
        filteredEmails: applyFiltersToEmails(updated, state.filters),
        unreadCount: updated.filter((e) => !e.isRead).length,
      }
    }),
}))

function applyFiltersToEmails(emails: Email[], filters: EmailFilter): Email[] {
  return emails.filter((email) => {
    if (filters.category && email.category !== filters.category) return false
    if (filters.priority && email.priority !== filters.priority) return false
    if (filters.sentiment && email.sentiment !== filters.sentiment) return false
    if (filters.status === 'read' && email.isRead === false) return false
    if (filters.status === 'unread' && email.isRead === true) return false
    if (filters.status === 'starred' && email.isStarred === false) return false

    if (filters.dateRange) {
      const emailDate = new Date(email.timestamp)
      if (emailDate < filters.dateRange.from || emailDate > filters.dateRange.to) {
        return false
      }
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const matches =
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query)
      if (!matches) return false
    }

    return true
  })
}
