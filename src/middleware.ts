import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedPaths = ['/dashboard', '/inbox', '/compose', '/analytics', '/settings']
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected) {
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === '/login') {
    const accessToken = request.cookies.get('access_token')?.value
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/inbox/:path*', '/compose/:path*', '/analytics/:path*', '/settings/:path*', '/login'],
}
