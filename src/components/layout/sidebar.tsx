'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useEmailStore } from '@/stores/email-store'
import {
  Mail,
  Home,
  Send,
  BarChart3,
  Zap,
  Users,
  ClipboardList,
  Settings,
  Plus,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const mainNavItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Mail, label: 'Inbox', href: '/inbox' },
  { icon: Send, label: 'Compose', href: '/compose' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
]

const secondaryNavItems = [
  { icon: Zap, label: 'Automation', href: '/automation' },
  { icon: Users, label: 'Team', href: '/team' },
  { icon: ClipboardList, label: 'Audit', href: '/audit' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const setComposeModalOpen = useUIStore((state) => state.setComposeModalOpen)
  const unreadCount = useEmailStore((state) => state.unreadCount)

  if (!sidebarOpen) return null

  return (
    <aside className="w-64 border-r border-gray-200 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            MP
          </div>
          <h1 className="text-xl font-bold">MailPulse</h1>
        </div>
        <Button
          onClick={() => setComposeModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Compose
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Main
          </h3>
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.label === 'Inbox' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Tools
          </h3>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <p className="text-xs text-slate-400 mb-2">MailPulse Pro</p>
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-slate-900"
          >
            Upgrade Plan
          </Button>
        </div>
      </div>
    </aside>
  )
}
