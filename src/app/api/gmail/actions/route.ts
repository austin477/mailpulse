import { NextRequest, NextResponse } from 'next/server'
import { GmailClient } from '@/lib/gmail/client'

function getGmailClient(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!accessToken) {
    return null
  }

  return new GmailClient({
    accessToken,
    refreshToken,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
}

export async function POST(request: NextRequest) {
  const gmail = getGmailClient(request)
  if (!gmail) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { action, messageIds } = await request.json()

    if (!action || !messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing action or messageIds' },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      messageIds.map(async (id: string) => {
        switch (action) {
          case 'archive':
            return gmail.modifyMessage(id, [], ['INBOX'])

          case 'unarchive':
            return gmail.modifyMessage(id, ['INBOX'], [])

          case 'trash':
            return gmail.trashMessage(id)

          case 'star':
            return gmail.modifyMessage(id, ['STARRED'], [])

          case 'unstar':
            return gmail.modifyMessage(id, [], ['STARRED'])

          case 'read':
            return gmail.modifyMessage(id, [], ['UNREAD'])

          case 'unread':
            return gmail.modifyMessage(id, ['UNREAD'], [])

          case 'spam':
            return gmail.modifyMessage(id, ['SPAM'], ['INBOX'])

          default:
            throw new Error(`Unknown action: ${action}`)
        }
      })
    )

    return NextResponse.json({
      success: true,
      action,
      count: results.length,
    })
  } catch (error: any) {
    console.error('Gmail action error:', error)
    if (error?.code === 401 || error?.response?.status === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to perform action' },
      { status: 500 }
    )
  }
}
