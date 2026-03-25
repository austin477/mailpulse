import { NextRequest, NextResponse } from 'next/server'
import { GmailClient } from '@/lib/gmail/client'

export async function POST(request: NextRequest) {
  // Read tokens from secure httpOnly cookies, not request body
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const gmail = new GmailClient({
      accessToken,
      refreshToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

    const messages = await gmail.listMessages('', undefined)

    return NextResponse.json({
      success: true,
      messageIds: messages.messages?.map((m) => m.id) || [],
      nextPageToken: messages.nextPageToken,
    })
  } catch (error: any) {
    console.error('Gmail sync error:', error)
    if (error?.code === 401 || error?.response?.status === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to sync emails' },
      { status: 500 }
    )
  }
}
