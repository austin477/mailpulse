'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Chrome } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              MP
            </div>
            <span className="text-2xl font-bold text-gray-900">MailPulse</span>
          </div>
          <p className="text-gray-600">AI-Powered Email Intelligence</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your MailPulse account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google OAuth */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-11 border-2"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/" className="text-blue-600 hover:underline font-medium">
                Start free trial
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Demo Account</p>
              <p className="text-xs text-gray-600 mt-1">
                Use any email to sign in. Gmail access will be required for full functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
