import { NextRequest, NextResponse } from 'next/server'
import { summarizeEmail } from '@/lib/ai/claude'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { allowed, resetIn } = rateLimit(`summarize:${accessToken.slice(-10)}`, 20, 60000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) } }
    )
  }

  try {
    const { subject, body, from } = await request.json()

    if (!body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const summary = await summarizeEmail(
      (subject || '').slice(0, 500),
      (body || '').slice(0, 10000),
      from || 'unknown'
    )

    return NextResponse.json({ success: true, ...summary })
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 })
  }
}
