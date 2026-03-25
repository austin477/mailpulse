import { NextRequest, NextResponse } from 'next/server'
import { generateReplySuggestions } from '@/lib/ai/claude'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Rate limit: 15 suggestions per minute per user
  const { allowed, resetIn } = rateLimit(`suggest:${accessToken.slice(-10)}`, 15, 60000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) } }
    )
  }

  try {
    const { subject, body, from, tone } = await request.json()

    if (!subject || !body || !from || !tone) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Limit input sizes
    const truncatedBody = body.slice(0, 10000)
    const truncatedSubject = subject.slice(0, 500)

    const suggestion = await generateReplySuggestions(truncatedSubject, truncatedBody, from, tone)

    return NextResponse.json({
      success: true,
      suggestion,
    })
  } catch (error) {
    console.error('Suggestion generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    )
  }
}
