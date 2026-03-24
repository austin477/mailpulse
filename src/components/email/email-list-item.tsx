'use client'

import { Email } from '@/types/email'
import { formatDate, getEmailPreview, getInitials, getPriorityColor, getCategoryColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailListItemProps {
  email: Email
  isSelected?: boolean
  onSelect?: (id: string) => void
  onClick?: () => void
}

export function EmailListItem({
  email,
  isSelected = false,
  onSelect,
  onClick,
}: EmailListItemProps) {
  const extractName = (email: string) => {
    const match = email.match(/^(.+?)(?:\+|@|<)/)
    return match ? match[1] : email.split('@')[0]
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors',
        !email.isRead && 'bg-blue-50',
        isSelected && 'bg-blue-100'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect?.(email.id)}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
          {getInitials(extractName(email.from))}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className={cn(
              'text-sm truncate',
              !email.isRead ? 'font-semibold' : 'font-medium'
            )}>
              {extractName(email.from)}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-xs text-gray-500">{formatDate(email.timestamp)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="text-gray-400 hover:text-yellow-500"
              >
                <Star className={cn(
                  'w-4 h-4',
                  email.isStarred && 'fill-yellow-500 text-yellow-500'
                )} />
              </button>
            </div>
          </div>

          <p className={cn(
            'text-sm truncate',
            !email.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'
          )}>
            {email.subject || '(no subject)'}
          </p>

          <p className="text-xs text-gray-500 truncate mb-2">
            {getEmailPreview(email.body, 60)}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={email.priority as any} className="text-xs">
              {email.priority}
            </Badge>
            <Badge variant={email.category as any} className="text-xs">
              {email.category}
            </Badge>
            {email.hasAttachments && (
              <span className="text-xs text-gray-500">📎 Attachment</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EmailListSkeleton() {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="w-4 h-4 bg-gray-200 rounded" />
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}
