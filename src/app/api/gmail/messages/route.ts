import { NextRequest, NextResponse } from 'next/server'
import { GmailClient } from '@/lib/gmail/client'
import { parseMessage, extractAttachments, stripHtmlTags } from '@/lib/gmail/parser'

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const maxResults = parseInt(searchParams.get('max') || '20')

  try {
    const gmail = new GmailClient({
      accessToken,
      refreshToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

    const listResponse = await gmail.listMessages(query)
    const messageIds = (listResponse.messages || []).slice(0, maxResults)

    if (messageIds.length === 0) {
      return NextResponse.json({ emails: [], total: 0 })
    }

    // Fetch full message details in parallel
    const messages = await Promise.all(
      messageIds.map((m) => gmail.getMessage(m.id!))
    )

    const emails = messages.map((msg) => {
      const parsed = parseMessage(msg)
      const attachments = extractAttachments(msg.payload)
      const plainBody = parsed.htmlBody ? stripHtmlTags(parsed.htmlBody) : parsed.body

      return {
        id: msg.id,
        messageId: msg.id,
        threadId: msg.threadId,
        from: parsed.from,
        to: parsed.to,
        cc: parsed.headers.cc ? parsed.headers.cc.split(',').map((s: string) => s.trim()) : [],
        bcc: parsed.headers.bcc ? parsed.headers.bcc.split(',').map((s: string) => s.trim()) : [],
        subject: parsed.subject,
        body: plainBody,
        htmlBody: parsed.htmlBody,
        timestamp: parsed.timestamp.toISOString(),
        isRead: !parsed.labels.includes('UNREAD'),
        isStarred: parsed.labels.includes('STARRED'),
        isDraft: parsed.labels.includes('DRAFT'),
        hasAttachments: attachments.length > 0,
        labels: parsed.labels,
        category: 'inbox' as const,
        priority: 'medium' as const,
        sentiment: 'neutral' as const,
        attachments: attachments.map((a) => ({
          id: a.id || '',
          filename: a.filename,
          mimeType: a.mimeType,
          size: a.size,
        })),
        userEmail: parsed.to[0] || '',
      }
    })

    return NextResponse.json({
      emails,
      total: listResponse.resultSizeEstimate || emails.length,
      nextPageToken: listResponse.nextPageToken,
    })
  } catch (error: any) {
    console.error('Gmail messages error:', error)
    if (error?.code === 401 || error?.response?.status === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
