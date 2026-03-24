import { gmail_v1 } from 'googleapis'

export function parseMessage(message: gmail_v1.Schema$Message) {
  const headers = message.payload?.headers || []
  const getHeader = (name: string) =>
    headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || ''

  const from = getHeader('from')
  const to = getHeader('to')
  const subject = getHeader('subject')
  const date = getHeader('date')

  const { body, mimeType } = getMessageBody(message.payload)

  return {
    messageId: message.id,
    threadId: message.threadId,
    from,
    to: parseEmailList(to),
    subject,
    body,
    htmlBody: mimeType === 'text/html' ? body : undefined,
    timestamp: new Date(date),
    labels: message.labelIds || [],
    headers: {
      cc: getHeader('cc'),
      bcc: getHeader('bcc'),
      replyTo: getHeader('reply-to'),
    },
  }
}

export function getMessageBody(payload: gmail_v1.Schema$MessagePart | undefined): {
  body: string
  mimeType: string
} {
  if (!payload) return { body: '', mimeType: 'text/plain' }

  if (payload.mimeType === 'text/plain' || payload.mimeType === 'text/html') {
    const data = payload.body?.data
    if (data) {
      const body = Buffer.from(data, 'base64').toString('utf8')
      return {
        body,
        mimeType: payload.mimeType,
      }
    }
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' || part.mimeType === 'text/plain') {
        const data = part.body?.data
        if (data) {
          const body = Buffer.from(data, 'base64').toString('utf8')
          return {
            body,
            mimeType: part.mimeType,
          }
        }
      }
    }

    for (const part of payload.parts) {
      if (part.parts) {
        return getMessageBody(part)
      }
    }
  }

  return { body: '', mimeType: 'text/plain' }
}

export function parseEmailList(emailString: string): string[] {
  if (!emailString) return []
  return emailString
    .split(',')
    .map((email) => {
      const match = email.match(/<([^>]+)>/)
      return match ? match[1] : email.trim()
    })
    .filter((email) => email)
}

export function extractAttachments(payload: gmail_v1.Schema$MessagePart | undefined) {
  const attachments: any[] = []

  if (!payload) return attachments

  function traverse(part: gmail_v1.Schema$MessagePart | undefined) {
    if (!part) return

    if (part.parts) {
      for (const p of part.parts) {
        if (p.filename && p.filename.length > 0) {
          attachments.push({
            id: p.body?.attachmentId,
            filename: p.filename,
            mimeType: p.mimeType,
            size: Number(p?.body?.size || 0),
          })
        }
        traverse(p)
      }
    }
  }

  traverse(payload)
  return attachments
}

export function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  return [...new Set(text.match(emailRegex) || [])]
}

export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g
  return [...new Set(text.match(urlRegex) || [])]
}

export function extractPhoneNumbers(text: string): string[] {
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
  return [...new Set(text.match(phoneRegex) || [])]
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}
