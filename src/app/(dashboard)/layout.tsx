'use client'

import React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useUIStore } from '@/stores/ui-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
