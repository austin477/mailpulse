'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { Menu, X, Search, Bell, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface UserInfo {
  name: string
  email: string
  picture?: string
}

export function Header() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUserInfo(data)
        } else if (response.status === 401) {
          // Not authenticated
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

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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
    <header className="border-b border-gray-200 bg-white h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        <div className={cn('flex-1 max-w-md transition-all', searchFocused && 'max-w-lg')}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              className="pl-10"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>

        {/* User Avatar with Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-400 transition-colors"
          >
            {isLoading ? 'U' : getInitials(userInfo?.name)}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <p className="font-medium text-gray-900 text-sm">
                  {userInfo?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600">
                  {userInfo?.email || 'user@example.com'}
                </p>
              </div>
              <Link href="/settings">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </Link>
              <button
                onClick={() => {
                  setShowDropdown(false)
                  handleSignOut()
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
