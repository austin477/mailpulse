import { NextRequest, NextResponse } from 'next/server'
import { GmailClient } from '@/lib/gmail/client'

export async function POST(request: NextRequest) {
  try {
    // Read tokens from cookies
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    const { to, cc, subject, body } = await request.json()

    if (!accessToken || !to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required parameters or authentication' },
        { status: 400 }
      )
    }

    const gmail = new GmailClient({
      accessToken,
      refreshToken,
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

    const result = await gmail.sendMessage(to, subject, body)

    return NextResponse.json({
      success: true,
      messageId: result.id,
      threadId: result.threadId,
    })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
