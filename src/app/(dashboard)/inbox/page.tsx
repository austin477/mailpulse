'use client'

import { useState, useEffect } from 'react'
import { EmailList } from '@/components/email/email-list'
import { EmailDetail } from '@/components/email/email-detail'
import { Email } from '@/types/email'
import { useEmailStore } from '@/stores/email-store'
import { Loader2 } from 'lucide-react'

export default function InboxPage() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const setEmails = useEmailStore((state) => state.setEmails)
  const emails = useEmailStore((state) => state.emails)
  const filteredEmails = useEmailStore((state) => state.filteredEmails)
  const removeEmail = useEmailStore((state) => state.deleteEmail)

  useEffect(() => {
    async function fetchEmails() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/gmail/messages?max=30')

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
        if (fetched.length > 0) {
          setSelectedEmail(fetched[0])
        }
      } catch (err: any) {
        console.error('Inbox fetch error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmails()
  }, [setEmails])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Syncing your inbox...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading inbox: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Retry
          </button>
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

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-0 bg-white">
      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
        <EmailList
          emails={displayEmails}
          selectedEmail={selectedEmail}
          onSelectEmail={setSelectedEmail}
        />
      </div>

      {/* Email Detail */}
      <div className="w-2/3 overflow-hidden">
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <p className="font-medium">Select an email to read</p>
              <p className="text-sm mt-2">Choose an email from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
