import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Create a 1x1 transparent GIF pixel
    const gif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )

    // In a real application, you would:
    // 1. Log this pixel view to a database
    // 2. Track the recipient and timestamp
    // 3. Correlate with email metadata

    const response = new NextResponse(gif, {
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': gif.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

    return response
  } catch (error) {
    console.error('Tracking pixel error:', error)
    return new NextResponse('', { status: 400 })
  }
}
