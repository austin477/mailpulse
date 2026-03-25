'use client'

import { useState, useEffect } from 'react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { VolumeChart } from '@/components/analytics/volume-chart'
import { CategoryBreakdown } from '@/components/analytics/category-breakdown'
import { SentimentChart } from '@/components/analytics/sentiment-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Mail, AlertCircle, MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface EmailSummary {
  id: string
  from: string
  subject: string
  priority: string
  timestamp: string
  isRead: boolean
}

export default function DashboardPage() {
  const [emails, setEmails] = useState<EmailSummary[]>([])
  const [totalEmails, setTotalEmails] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmails() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/gmail/messages?max=10')

        if (res.status === 401) {
          window.location.href = '/login'
          return
        }

        if (!res.ok) throw new Error('Failed to fetch emails')

        const data = await res.json()
        setEmails(data.emails || [])
        setTotalEmails(data.total || 0)
        setUnreadCount((data.emails || []).filter((e: any) => !e.isRead).length)
      } catch (err: any) {
        console.error('Dashboard fetch error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmails()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your emails...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading emails: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const recentEmails = emails.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your email summary.</p>
      </div>

      {/* Stats */}
      <StatsCards
        totalEmails={totalEmails}
        unreadEmails={unreadCount}
        avgResponseTime={0}
        slaCompliance={0}
      />

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <VolumeChart />
        <CategoryBreakdown />
      </div>

      <SentimentChart />

      {/* Priority Inbox */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Recent Emails
          </CardTitle>
          <CardDescription>Your latest emails from Gmail</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEmails.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No emails found</p>
          ) : (
            <div className="space-y-3">
              {recentEmails.map((email) => (
                <div
                  key={email.id}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    email.isRead ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`truncate ${email.isRead ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                        {email.from.replace(/<.*>/, '').trim() || email.from}
                      </p>
                      {!email.isRead && (
                        <Badge className="text-xs bg-blue-100 text-blue-700">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{email.subject}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <p className="text-xs text-gray-500">{formatDate(new Date(email.timestamp))}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/inbox">
            <Button variant="outline" className="w-full mt-4">
              View All Emails
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-blue-500" />
              Email Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Total emails loaded</span>
              <span className="font-semibold">{emails.length}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Estimated total</span>
              <span className="font-semibold">{totalEmails}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Unread in batch</span>
              <span className="font-semibold">{unreadCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/inbox">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" /> Go to Inbox
              </Button>
            </Link>
            <Link href="/compose">
              <Button variant="outline" className="w-full justify-start mt-2">
                <MessageSquare className="w-4 h-4 mr-2" /> Compose Email
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
