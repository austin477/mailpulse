import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { to, cc, subject, body } = await request.json()

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    auth.setCredentials({ access_token: accessToken, refresh_token: refreshToken })

    const gmail = google.gmail({ version: 'v1', auth })

    const headers = [
      ...(to ? [`To: ${to}`] : []),
      ...(cc ? [`Cc: ${cc}`] : []),
      `Subject: ${subject || '(no subject)'}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
    ]

    const email = [...headers, '', body || ''].join('\n')
    const base64Email = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const result = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: base64Email,
        },
      },
    })

    return NextResponse.json({
      success: true,
      draftId: result.data.id,
    })
  } catch (error: any) {
    console.error('Draft save error:', error)
    if (error?.code === 401 || error?.response?.status === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    )
  }
}
