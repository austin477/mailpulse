import { NextRequest, NextResponse } from 'next/server'
import { analyzeEmail } from '@/lib/ai/claude'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Rate limit: 20 analyses per minute per user
  const { allowed, remaining, resetIn } = rateLimit(`analyze:${accessToken.slice(-10)}`, 20, 60000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) } }
    )
  }

  try {
    const { subject, body, from } = await request.json()

    if (!subject || !body || !from) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Limit input sizes to prevent abuse
    const truncatedBody = body.slice(0, 10000)
    const truncatedSubject = subject.slice(0, 500)

    const analysis = await analyzeEmail(truncatedSubject, truncatedBody, from)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error('Email analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze email' },
      { status: 500 }
    )
  }
}
