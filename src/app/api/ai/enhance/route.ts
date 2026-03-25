import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Rate limit: 10 enhancements per minute per user
  const { allowed, resetIn } = rateLimit(`enhance:${accessToken.slice(-10)}`, 10, 60000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) } }
    )
  }

  try {
    const { body, tone } = await request.json()

    if (!body) {
      return NextResponse.json({ error: 'Missing body text' }, { status: 400 })
    }

    // Limit input size
    const truncatedBody = body.slice(0, 10000)

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Fallback: basic enhancement without AI
      return NextResponse.json({
        enhanced: truncatedBody.charAt(0).toUpperCase() + truncatedBody.slice(1) +
          (truncatedBody.endsWith('.') ? '' : '.') +
          '\n\nBest regards',
        tone: tone || 'professional',
      })
    }

    const toneInstructions: Record<string, string> = {
      professional: 'Rewrite this email in a polished, professional tone suitable for business communication. Keep it clear and concise.',
      friendly: 'Rewrite this email in a warm, friendly tone while maintaining professionalism. Make it personable.',
      concise: 'Rewrite this email to be as concise as possible. Remove unnecessary words while keeping the core message intact.',
      formal: 'Rewrite this email in a very formal tone suitable for executives or official correspondence.',
    }

    const instruction = toneInstructions[tone || 'professional'] || toneInstructions.professional

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${instruction}\n\nOriginal email:\n${truncatedBody}\n\nProvide ONLY the rewritten email text, no explanations or commentary.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const enhanced = data.content?.[0]?.text || body

    return NextResponse.json({ enhanced, tone: tone || 'professional' })
  } catch (error: any) {
    console.error('AI enhance error:', error)
    return NextResponse.json(
      { error: 'Failed to enhance email' },
      { status: 500 }
    )
  }
}
