'use client'

import { Email } from '@/types/email'
import { formatDate, getEmailPreview, getInitials } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Star, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailListItemProps {
  email: Email
  isSelected?: boolean
  onSelect?: (id: string) => void
  onClick?: () => void
  isActive?: boolean
}

// Color palette for avatars
const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
]

function getAvatarColor(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash = hash & hash
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function extractName(email: string): string {
  const match = email.match(/^(.+?)(?:\+|@|<)/)
  return match ? match[1] : email.split('@')[0]
}

function getRelativeTime(timestamp: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(timestamp).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`

  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function EmailListItem({
  email,
  isSelected = false,
  onSelect,
  onClick,
  isActive = false,
}: EmailListItemProps) {
  const senderName = extractName(email.from)
  const avatarColor = getAvatarColor(email.from)
  const relativeTime = getRelativeTime(email.timestamp)
  const preview = getEmailPreview(email.body, 80)

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative px-4 py-3 border-b border-gray-100 cursor-pointer transition-all duration-200',
        'hover:bg-gray-50',
        isActive && 'bg-blue-50 border-l-4 border-l-blue-500 pl-3',
        !email.isRead && !isActive && 'bg-white',
        email.isRead && !isActive && 'bg-gray-50'
      )}
    >
      {/* Unread indicator dot */}
      {!email.isRead && !isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full" />
      )}

      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.(email.id)}
            onClick={(e) => e.stopPropagation()}
            className="transition-opacity opacity-0 group-hover:opacity-100"
          />
        </div>

        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white',
            avatarColor
          )}
        >
          {getInitials(senderName)}
        </div>

        {/* Email Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            {/* Sender Name and Star */}
            <div className="flex items-center gap-2 min-w-0">
              <p
                className={cn(
                  'text-sm truncate',
                  !email.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                )}
              >
                {senderName}
              </p>

              {/* Star Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className={cn(
                  'flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100',
                  email.isStarred ? 'opacity-100' : ''
                )}
              >
                <Star
                  className={cn(
                    'w-4 h-4 transition-colors',
                    email.isStarred
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400 hover:text-yellow-400'
                  )}
                />
              </button>
            </div>

            {/* Time */}
            <span className="flex-shrink-0 text-xs text-gray-500">
              {relativeTime}
            </span>
          </div>

          {/* Subject */}
          <p
            className={cn(
              'text-sm truncate leading-tight mb-1',
              !email.isRead
                ? 'font-semibold text-gray-900'
                : 'font-medium text-gray-700'
            )}
          >
            {email.subject || '(no subject)'}
          </p>

          {/* Preview and Indicators */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500 truncate flex-1 min-w-0">
              {preview}
            </p>

            {/* Right side indicators */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {email.hasAttachments && (
                <Paperclip className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EmailListSkeleton() {
  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0" />
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-2/5" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}
