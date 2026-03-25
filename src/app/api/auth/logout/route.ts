import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')
  return response
}

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')
  return response
}
