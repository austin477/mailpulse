import { NextRequest, NextResponse } from 'next/server'
import { generateReplySuggestions } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const { subject, body, from, tone } = await request.json()

    if (!subject || !body || !from || !tone) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const suggestion = await generateReplySuggestions(subject, body, from, tone)

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
