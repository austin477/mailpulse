'use client'

import { useState, useMemo } from 'react'
import DOMPurify from 'dompurify'
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
  Loader2,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react'
import { AIAnalysisPanel } from '@/components/ai/ai-analysis-panel'

interface EmailDetailProps {
  email: Email
  onReply?: () => void
  onArchive?: () => void
  onDelete?: () => void
  onEmailUpdated?: (email: Email) => void
}

async function performAction(action: string, messageIds: string[]) {
  const res = await fetch('/api/gmail/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, messageIds }),
  })
  if (!res.ok) throw new Error(`Action failed: ${action}`)
  return res.json()
}

export function EmailDetail({
  email,
  onReply,
  onArchive,
  onDelete,
  onEmailUpdated,
}: EmailDetailProps) {
  const [showReplyCompose, setShowReplyCompose] = useState(false)
  const [replyMode, setReplyMode] = useState<'reply' | 'replyAll' | 'forward'>('reply')
  const [replyBody, setReplyBody] = useState('')
  const [forwardTo, setForwardTo] = useState('')
  const [isStarred, setIsStarred] = useState(email.isStarred)
  const [isSending, setIsSending] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const sanitizedHtml = useMemo(() => {
    const raw = email.htmlBody || email.body
    if (!raw) return ''
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'img', 'hr'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'style', 'class', 'target', 'width', 'height'],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
      FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
    })
  }, [email.htmlBody, email.body])

  const extractName = (emailStr: string) => {
    const match = emailStr.match(/^(.+?)(?:\+|@|<)/)
    return match ? match[1].trim() : emailStr.split('@')[0]
  }

  const extractEmail = (emailStr: string) => {
    const match = emailStr.match(/<(.+?)>/)
    return match ? match[1] : emailStr
  }

  const handleStar = async () => {
    const action = isStarred ? 'unstar' : 'star'
    setActionLoading('star')
    try {
      await performAction(action, [email.id])
      setIsStarred(!isStarred)
    } catch (err) {
      console.error('Star error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleArchive = async () => {
    setActionLoading('archive')
    try {
      await performAction('archive', [email.id])
      setMessage({ type: 'success', text: 'Email archived' })
      setTimeout(() => onArchive?.(), 500)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to archive' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    setActionLoading('delete')
    try {
      await performAction('trash', [email.id])
      setMessage({ type: 'success', text: 'Email moved to trash' })
      setTimeout(() => onDelete?.(), 500)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    } finally {
      setActionLoading(null)
    }
  }

  const openReply = (mode: 'reply' | 'replyAll' | 'forward') => {
    setReplyMode(mode)
    setReplyBody('')
    setForwardTo('')
    setShowReplyCompose(true)
    setMessage(null)
  }

  const handleSendReply = async () => {
    if (!replyBody.trim()) return
    if (replyMode === 'forward' && !forwardTo.trim()) return

    setIsSending(true)
    setMessage(null)

    try {
      let to: string
      let cc = ''
      const replySubject = email.subject.startsWith('Re:') || email.subject.startsWith('Fwd:')
        ? email.subject
        : replyMode === 'forward'
          ? `Fwd: ${email.subject}`
          : `Re: ${email.subject}`

      if (replyMode === 'forward') {
        to = forwardTo.trim()
      } else if (replyMode === 'replyAll') {
        to = extractEmail(email.from)
        // Add CC recipients excluding sender and current user
        const allRecipients = [...email.to, ...email.cc]
          .map(r => typeof r === 'string' ? r : '')
          .filter(r => r && r !== email.userEmail && r !== extractEmail(email.from))
        cc = allRecipients.join(', ')
      } else {
        to = extractEmail(email.from)
      }

      const fullBody = replyMode === 'forward'
        ? `${replyBody}\n\n---------- Forwarded message ----------\nFrom: ${email.from}\nDate: ${formatDateFull(email.timestamp)}\nSubject: ${email.subject}\n\n${email.body}`
        : replyBody

      const res = await fetch('/api/gmail/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          cc: cc || undefined,
          subject: replySubject,
          body: fullBody,
          threadId: email.threadId,
        }),
      })

      if (!res.ok) throw new Error('Failed to send')

      setMessage({ type: 'success', text: replyMode === 'forward' ? 'Email forwarded!' : 'Reply sent!' })
      setShowReplyCompose(false)
      setReplyBody('')
      setForwardTo('')
    } catch (err) {
      console.error('Reply error:', err)
      setMessage({ type: 'error', text: 'Failed to send. Please try again.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Status message */}
      {message && (
        <div
          className={`px-6 py-3 flex items-center gap-2 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-b border-green-200'
              : 'bg-red-50 text-red-800 border-b border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}

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
              onClick={handleStar}
              disabled={actionLoading === 'star'}
              className={isStarred ? 'text-yellow-500' : 'text-gray-600'}
            >
              {actionLoading === 'star' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleArchive}
              disabled={actionLoading === 'archive'}
              className="text-gray-600"
            >
              {actionLoading === 'archive' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Archive className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={actionLoading === 'delete'}
              className="text-red-600"
            >
              {actionLoading === 'delete' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">{email.subject}</h2>

        <div className="flex flex-wrap gap-2">
          {email.priority && email.priority !== 'medium' && (
            <Badge variant={email.priority as any}>
              {email.priority}
            </Badge>
          )}
          {!email.isRead && (
            <Badge className="bg-blue-100 text-blue-700">Unread</Badge>
          )}
          {email.hasAttachments && (
            <Badge variant="secondary">
              📎 {email.attachments.length} attachment{email.attachments.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {email.labels?.filter(l => !['INBOX', 'UNREAD', 'CATEGORY_PERSONAL', 'CATEGORY_UPDATES', 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS', 'CATEGORY_FORUMS', 'IMPORTANT', 'SENT', 'STARRED', 'DRAFT'].includes(l)).map(label => (
            <Badge key={label} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 overflow-auto">
        <div className="col-span-2 border-r border-gray-200 p-6">
          <div className="prose prose-sm max-w-none">
            <div
              className="text-gray-900 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: sanitizedHtml,
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
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {attachment.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-2">
            <Button
              onClick={() => openReply('reply')}
              className="gap-2"
            >
              <Reply className="w-4 h-4" />
              Reply
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => openReply('replyAll')}
            >
              <ReplyAll className="w-4 h-4" />
              Reply All
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => openReply('forward')}
            >
              <Forward className="w-4 h-4" />
              Forward
            </Button>
          </div>

          {showReplyCompose && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {replyMode === 'reply' && `Reply to ${extractName(email.from)}`}
                {replyMode === 'replyAll' && 'Reply to all'}
                {replyMode === 'forward' && 'Forward this email'}
              </p>

              {replyMode === 'forward' && (
                <input
                  type="email"
                  placeholder="Forward to email address..."
                  value={forwardTo}
                  onChange={(e) => setForwardTo(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded text-sm mb-3"
                />
              )}

              <textarea
                placeholder={
                  replyMode === 'forward'
                    ? 'Add a message (optional)...'
                    : 'Write your reply...'
                }
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className="w-full h-32 p-3 border border-gray-200 rounded text-sm resize-none"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleSendReply}
                  disabled={isSending || !replyBody.trim() || (replyMode === 'forward' && !forwardTo.trim())}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isSending ? 'Sending...' : 'Send'}
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
