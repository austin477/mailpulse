import { NextRequest, NextResponse } from 'next/server'

// Allowlist of domains we permit redirects to
const ALLOWED_DOMAINS = [
  'mailpulse-iota.vercel.app',
  'usawholesalesupplies.com',
  'stablestorefronts.com',
  'google.com',
  'gmail.com',
]

function isAllowedUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr)
    // Only allow https
    if (parsed.protocol !== 'https:') return false
    // Check if domain or a subdomain of an allowed domain
    return ALLOWED_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const url = request.nextUrl.searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400 }
      )
    }

    if (!isAllowedUrl(url)) {
      return NextResponse.json(
        { error: 'URL not allowed' },
        { status: 403 }
      )
    }

    // TODO: Log click to database for tracking analytics
    // Record: tracking ID, timestamp, user agent, associated email

    return NextResponse.redirect(url, { status: 302 })
  } catch (error) {
    console.error('Link tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to process click' },
      { status: 500 }
    )
  }
}
