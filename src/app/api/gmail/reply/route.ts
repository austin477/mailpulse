import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { to, cc, subject, body, threadId, messageId, inReplyTo, references } = await request.json()

    if (!to || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, body' },
        { status: 400 }
      )
    }

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    auth.setCredentials({ access_token: accessToken, refresh_token: refreshToken })

    const gmail = google.gmail({ version: 'v1', auth })

    // Build RFC 2822 formatted email
    const headers = [
      `To: ${to}`,
      ...(cc ? [`Cc: ${cc}`] : []),
      `Subject: ${subject || 'Re:'}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      ...(inReplyTo ? [`In-Reply-To: ${inReplyTo}`] : []),
      ...(references ? [`References: ${references}`] : []),
    ]

    const email = [...headers, '', body].join('\n')
    const base64Email = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64Email,
        threadId: threadId || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      messageId: result.data.id,
      threadId: result.data.threadId,
    })
  } catch (error: any) {
    console.error('Reply error:', error)
    if (error?.code === 401 || error?.response?.status === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}
