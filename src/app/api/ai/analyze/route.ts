import { NextRequest, NextResponse } from 'next/server'
import { analyzeEmail } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const { subject, body, from } = await request.json()

    if (!subject || !body || !from) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const analysis = await analyzeEmail(subject, body, from)

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
