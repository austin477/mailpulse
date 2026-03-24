import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  selectedTab: string
  showComposeModal: boolean
  showSettingsModal: boolean
  showAnalyticsModal: boolean
  activeTheme: 'light' | 'dark'
  notificationSound: boolean
  emailsPerPage: number

  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setSelectedTab: (tab: string) => void
  toggleComposeModal: () => void
  setComposeModalOpen: (open: boolean) => void
  toggleSettingsModal: () => void
  setSettingsModalOpen: (open: boolean) => void
  toggleAnalyticsModal: () => void
  setAnalyticsModalOpen: (open: boolean) => void
  setActiveTheme: (theme: 'light' | 'dark') => void
  setNotificationSound: (enabled: boolean) => void
  setEmailsPerPage: (count: number) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  selectedTab: 'inbox',
  showComposeModal: false,
  showSettingsModal: false,
  showAnalyticsModal: false,
  activeTheme: 'light',
  notificationSound: true,
  emailsPerPage: 50,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  setSelectedTab: (tab) => set({ selectedTab: tab }),

  toggleComposeModal: () => set((state) => ({ showComposeModal: !state.showComposeModal })),

  setComposeModalOpen: (open) => set({ showComposeModal: open }),

  toggleSettingsModal: () => set((state) => ({ showSettingsModal: !state.showSettingsModal })),

  setSettingsModalOpen: (open) => set({ showSettingsModal: open }),

  toggleAnalyticsModal: () => set((state) => ({ showAnalyticsModal: !state.showAnalyticsModal })),

  setAnalyticsModalOpen: (open) => set({ showAnalyticsModal: open }),

  setActiveTheme: (theme) => set({ activeTheme: theme }),

  setNotificationSound: (enabled) => set({ notificationSound: enabled }),

  setEmailsPerPage: (count) => set({ emailsPerPage: count }),
}))
