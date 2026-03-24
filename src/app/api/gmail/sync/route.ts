import { NextRequest, NextResponse } from 'next/server'
import { GmailClient } from '@/lib/gmail/client'

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken, userId } = await request.json()

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const gmail = new GmailClient({
      accessToken,
      refreshToken,
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

    const messages = await gmail.listMessages('', undefined)

    return NextResponse.json({
      success: true,
      messageIds: messages.messages?.map((m) => m.id) || [],
      nextPageToken: messages.nextPageToken,
    })
  } catch (error) {
    console.error('Gmail sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync emails' },
      { status: 500 }
    )
  }
}
