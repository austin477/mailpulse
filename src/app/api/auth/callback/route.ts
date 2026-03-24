import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    )
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: tokens.error_description || 'Token exchange failed' },
        { status: 400 }
      )
    }

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
    response.cookies.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
    })

    if (tokens.refresh_token) {
      response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      })
    }

    return response
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
