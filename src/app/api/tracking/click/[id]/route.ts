import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const url = request.nextUrl.searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Log this click to a database
    // 2. Record timestamp, user agent, IP
    // 3. Associate with email and recipient

    // Redirect to the original URL
    return NextResponse.redirect(url, { status: 302 })
  } catch (error) {
    console.error('Link tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to process click' },
      { status: 500 }
    )
  }
}
