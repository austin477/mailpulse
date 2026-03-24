'use client'

import { useState } from 'react'
import { Email } from '@/types/email'
import { EmailListItem, EmailListSkeleton } from './email-list-item'
import { EmailFilters } from './email-filters'
import { useEmailStore } from '@/stores/email-store'
import { Button } from '@/components/ui/button'
import { Archive, Trash2, Tag } from 'lucide-react'

interface EmailListProps {
  emails: Email[]
  selectedEmail?: Email | null
  onSelectEmail: (email: Email) => void
  isLoading?: boolean
}

export function EmailList({
  emails,
  selectedEmail,
  onSelectEmail,
  isLoading = false,
}: EmailListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const bulkUpdateEmails = useEmailStore((state) => state.bulkUpdateEmails)

  const handleSelectEmail = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === emails.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(emails.map((e) => e.id)))
    }
  }

  const handleBulkArchive = () => {
    bulkUpdateEmails(Array.from(selectedIds), { isDraft: false })
    setSelectedIds(new Set())
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <EmailFilters />

      {selectedIds.size > 0 && (
        <div className="border-b border-gray-200 bg-blue-50 p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulkArchive}
              className="text-gray-700 hover:bg-blue-100"
            >
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-blue-100"
            >
              <Tag className="w-4 h-4 mr-1" />
              Tag
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <EmailListSkeleton key={i} />
            ))}
          </>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">📬</div>
            <p className="font-medium">No emails found</p>
            <p className="text-sm">Try adjusting your filters or search</p>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center gap-3 bg-gray-50">
              <input
                type="checkbox"
                checked={selectedIds.size === emails.length && emails.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-gray-600">
                {emails.length} emails
              </span>
            </div>
            {emails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedIds.has(email.id)}
                onSelect={handleSelectEmail}
                onClick={() => onSelectEmail(email)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
