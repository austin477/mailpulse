'use client'

import { useState } from 'react'
import { Email } from '@/types/email'
import { formatDateFull, getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  AlertCircle,
} from 'lucide-react'
import { AIAnalysisPanel } from '@/components/ai/ai-analysis-panel'

interface EmailDetailProps {
  email: Email
  onReply?: () => void
  onArchive?: () => void
  onDelete?: () => void
}

export function EmailDetail({
  email,
  onReply,
  onArchive,
  onDelete,
}: EmailDetailProps) {
  const [showReplyCompose, setShowReplyCompose] = useState(false)

  const extractName = (emailStr: string) => {
    const match = emailStr.match(/^(.+?)(?:\+|@|<)/)
    return match ? match[1] : emailStr.split('@')[0]
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
              {getInitials(extractName(email.from))}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{extractName(email.from)}</h3>
              <p className="text-sm text-gray-600">{email.from}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDateFull(email.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {}}
              className="text-gray-600"
            >
              <Star className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onArchive}
              className="text-gray-600"
            >
              <Archive className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">{email.subject}</h2>

        <div className="flex flex-wrap gap-2">
          <Badge variant={email.priority as any}>
            {email.priority}
          </Badge>
          <Badge variant={email.category as any}>
            {email.category}
          </Badge>
          {email.hasAttachments && (
            <Badge variant="secondary">
              📎 {email.attachments.length} attachment
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 overflow-auto">
        <div className="col-span-2 border-r border-gray-200 p-6">
          <div className="prose prose-sm max-w-none">
            <div
              className="text-gray-900 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: email.htmlBody || email.body,
              }}
            />
          </div>

          {email.attachments.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Attachments
              </h4>
              <div className="space-y-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {attachment.size} bytes
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-2">
            <Button
              onClick={() => setShowReplyCompose(!showReplyCompose)}
              className="gap-2"
            >
              <Reply className="w-4 h-4" />
              Reply
            </Button>
            <Button variant="outline" className="gap-2">
              <ReplyAll className="w-4 h-4" />
              Reply All
            </Button>
            <Button variant="outline" className="gap-2">
              <Forward className="w-4 h-4" />
              Forward
            </Button>
          </div>

          {showReplyCompose && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <textarea
                placeholder="Write your reply..."
                className="w-full h-32 p-3 border border-gray-200 rounded text-sm resize-none"
              />
              <div className="flex gap-2 mt-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Send
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReplyCompose(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto">
          <AIAnalysisPanel email={email} />
        </div>
      </div>
    </div>
  )
}
