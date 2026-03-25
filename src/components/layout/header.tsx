'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useEmailStore } from '@/stores/email-store'
import { Menu, X, Search, Bell, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UserInfo {
  name: string
  email: string
  picture?: string
}

export function Header() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const unreadCount = useEmailStore((state) => state.unreadCount)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUserInfo(data)
        } else if (response.status === 401) {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserInfo()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white h-14 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-gray-500 hover:text-gray-700"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>

        <div className={cn(
          'flex-1 max-w-md transition-all duration-200',
          searchFocused && 'max-w-lg'
        )}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border rounded-lg outline-none transition-all duration-200',
                searchFocused
                  ? 'border-blue-300 bg-white ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1.5" />

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {isLoading ? '...' : getInitials(userInfo?.name)}
            </div>
            {userInfo && (
              <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                {userInfo.name?.split(' ')[0] || 'User'}
              </span>
            )}
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-100">
                <p className="font-medium text-gray-900 text-sm">{userInfo?.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{userInfo?.email || ''}</p>
              </div>
              <div className="py-1">
                <Link href="/settings">
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false)
                    handleSignOut()
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
