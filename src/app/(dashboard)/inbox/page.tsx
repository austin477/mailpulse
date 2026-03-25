'use client'

import { useState, useEffect, useCallback } from 'react'
import { EmailList } from '@/components/email/email-list'
import { EmailDetail } from '@/components/email/email-detail'
import { Email } from '@/types/email'
import { useEmailStore } from '@/stores/email-store'
import { useAutoRefresh } from '@/hooks/use-auto-refresh'
import { Loader2, RefreshCw, Inbox, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InboxPage() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const setEmails = useEmailStore((state) => state.setEmails)
  const emails = useEmailStore((state) => state.emails)
  const filteredEmails = useEmailStore((state) => state.filteredEmails)
  const removeEmail = useEmailStore((state) => state.deleteEmail)

  const fetchEmails = useCallback(async () => {
    try {
      const res = await fetch('/api/gmail/messages?max=50')

      if (res.status === 401) {
        window.location.href = '/login'
        return
      }

      if (!res.ok) throw new Error('Failed to fetch emails')

      const data = await res.json()
      const fetched = (data.emails || []).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }))
      setEmails(fetched)
      return fetched
    } catch (err: any) {
      console.error('Inbox fetch error:', err)
      throw err
    }
  }, [setEmails])

  // Initial load
  useEffect(() => {
    async function initialFetch() {
      try {
        setIsLoading(true)
        const fetched = await fetchEmails()
        if (fetched && fetched.length > 0) {
          setSelectedEmail(fetched[0])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    initialFetch()
  }, [fetchEmails])

  // Auto-refresh every 30 seconds
  const { lastRefresh, isRefreshing, refresh } = useAutoRefresh({
    interval: 30000,
    enabled: !isLoading && !error,
    onRefresh: async () => {
      await fetchEmails()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Syncing your inbox...</p>
          <p className="text-gray-400 text-sm mt-1">Loading messages from Gmail</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load inbox</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const displayEmails = filteredEmails.length > 0 ? filteredEmails : emails

  const handleArchive = () => {
    if (selectedEmail) {
      removeEmail(selectedEmail.id)
      const remaining = displayEmails.filter(e => e.id !== selectedEmail.id)
      setSelectedEmail(remaining.length > 0 ? remaining[0] : null)
    }
  }

  const handleDelete = () => {
    if (selectedEmail) {
      removeEmail(selectedEmail.id)
      const remaining = displayEmails.filter(e => e.id !== selectedEmail.id)
      setSelectedEmail(remaining.length > 0 ? remaining[0] : null)
    }
  }

  const formatLastRefresh = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 10) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    return `${Math.floor(seconds / 60)}m ago`
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Refresh status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-white border-b border-gray-200 text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-700">{displayEmails.length} emails</span>
          <span className="text-gray-300">|</span>
          <span>{emails.filter(e => !e.isRead).length} unread</span>
        </div>
        <div className="flex items-center gap-2">
          {isRefreshing && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
          <Clock className="w-3 h-3" />
          <span>Updated {formatLastRefresh(lastRefresh)}</span>
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="ml-1 p-1 hover:bg-gray-100 rounded transition-colors"
            title="Refresh now"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-blue-500' : 'text-gray-400 hover:text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Email List */}
        <div className="w-[380px] min-w-[320px] border-r border-gray-200 overflow-hidden flex flex-col bg-white">
          <EmailList
            emails={displayEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={setSelectedEmail}
          />
        </div>

        {/* Email Detail */}
        <div className="flex-1 overflow-hidden">
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-700 text-lg">Select an email</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">Choose a message from the list to view its contents and AI insights</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
