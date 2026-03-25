'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useEmailStore } from '@/stores/email-store'
import {
  Mail,
  LayoutDashboard,
  Send,
  BarChart3,
  Zap,
  Users,
  ClipboardList,
  Settings,
  PenSquare,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Mail, label: 'Inbox', href: '/inbox', showBadge: true },
  { icon: Send, label: 'Compose', href: '/compose' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
]

const toolNavItems = [
  { icon: Zap, label: 'Automation', href: '/automation' },
  { icon: Users, label: 'Team', href: '/team' },
  { icon: ClipboardList, label: 'Audit', href: '/audit' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const unreadCount = useEmailStore((state) => state.unreadCount)

  if (!sidebarOpen) return null

  return (
    <aside className="w-[260px] bg-slate-950 text-white h-screen flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">MailPulse</h1>
            <p className="text-[10px] text-slate-500 -mt-0.5 font-medium tracking-wide uppercase">AI Email Intelligence</p>
          </div>
        </div>
      </div>

      {/* Compose Button */}
      <div className="px-4 pb-4">
        <Link href="/compose">
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white gap-2 h-9 text-sm font-medium shadow-lg shadow-blue-600/20">
            <PenSquare className="w-4 h-4" />
            Compose
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Menu
          </p>
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                    isActive
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  )}
                >
                  <Icon className={cn('w-[18px] h-[18px]', isActive && 'text-blue-400')} />
                  <span>{item.label}</span>
                  {item.showBadge && unreadCount > 0 && (
                    <span className="ml-auto bg-blue-600 text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Tools
          </p>
          <div className="space-y-0.5">
            {toolNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                    isActive
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  )}
                >
                  <Icon className={cn('w-[18px] h-[18px]', isActive && 'text-blue-400')} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-lg px-4 py-3 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">AI-Powered</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Smart replies, summaries & insights powered by Claude AI
          </p>
        </div>
      </div>
    </aside>
  )
}
