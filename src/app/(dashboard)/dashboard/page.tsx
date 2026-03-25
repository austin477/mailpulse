'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAutoRefresh } from '@/hooks/use-auto-refresh'
import {
  Mail,
  MailOpen,
  Clock,
  TrendingUp,
  Star,
  AlertTriangle,
  ArrowRight,
  Loader2,
  RefreshCw,
  Send,
  Inbox,
  BarChart3,
  Sparkles,
  Calendar,
  Users,
} from 'lucide-react'
import Link from 'next/link'

interface EmailSummary {
  id: string
  from: string
  subject: string
  priority: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  labels?: string[]
  category?: string
  sentiment?: string
}

export default function DashboardPage() {
  const [emails, setEmails] = useState<EmailSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmails = useCallback(async () => {
    const res = await fetch('/api/gmail/messages?max=100')
    if (res.status === 401) {
      window.location.href = '/login'
      return
    }
    if (!res.ok) throw new Error('Failed to fetch emails')
    const data = await res.json()
    setEmails(data.emails || [])
  }, [])

  useEffect(() => {
    async function initialFetch() {
      try {
        setIsLoading(true)
        await fetchEmails()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    initialFetch()
  }, [fetchEmails])

  const { lastRefresh, isRefreshing, refresh } = useAutoRefresh({
    interval: 30000,
    enabled: !isLoading && !error,
    onRefresh: fetchEmails,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-700 font-medium">Unable to load dashboard</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Compute real KPIs from fetched data
  const unreadCount = emails.filter(e => !e.isRead).length
  const starredCount = emails.filter(e => e.isStarred).length
  const readRate = emails.length > 0 ? Math.round(((emails.length - unreadCount) / emails.length) * 100) : 0

  // Today's emails
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEmails = emails.filter(e => new Date(e.timestamp) >= today)

  // This week's emails
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekEmails = emails.filter(e => new Date(e.timestamp) >= weekAgo)

  // Top senders
  const senderMap: Record<string, number> = {}
  emails.forEach(e => {
    const name = e.from.replace(/<.*>/, '').trim() || e.from.split('@')[0]
    senderMap[name] = (senderMap[name] || 0) + 1
  })
  const topSenders = Object.entries(senderMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Activity by hour (last 7 days)
  const hourCounts = new Array(24).fill(0)
  weekEmails.forEach(e => {
    const hour = new Date(e.timestamp).getHours()
    hourCounts[hour]++
  })
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts))

  // Recent emails (last 8)
  const recentEmails = emails.slice(0, 8)

  const formatLastRefresh = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 10) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    return `${Math.floor(seconds / 60)}m ago`
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your email intelligence at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            {isRefreshing && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
            <Clock className="w-3 h-3" />
            <span>Updated {formatLastRefresh(lastRefresh)}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Inbox className="w-5 h-5 text-blue-600" />
              </div>
              {todayEmails.length > 0 && (
                <Badge className="bg-blue-50 text-blue-700 text-xs font-medium">
                  +{todayEmails.length} today
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-0.5">Total Loaded</p>
            <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-red-500" />
              </div>
              {unreadCount > 10 && (
                <Badge className="bg-red-50 text-red-600 text-xs font-medium">
                  Needs attention
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-0.5">Unread</p>
            <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-0.5">Starred</p>
            <p className="text-2xl font-bold text-gray-900">{starredCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-0.5">Read Rate</p>
            <p className="text-2xl font-bold text-gray-900">{readRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Emails - takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Recent Emails
                </CardTitle>
                <Link href="/inbox">
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {recentEmails.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No emails found</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentEmails.map((email) => {
                    const senderName = email.from.replace(/<.*>/, '').trim() || email.from.split('@')[0]
                    const initial = senderName.charAt(0).toUpperCase()
                    const timeDiff = Date.now() - new Date(email.timestamp).getTime()
                    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60))
                    const timeStr = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`

                    return (
                      <Link href="/inbox" key={email.id}>
                        <div className={`flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${!email.isRead ? 'bg-blue-50/50' : ''}`}>
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${!email.isRead ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                {senderName}
                              </span>
                              {!email.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{email.subject}</p>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">{timeStr}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <Link href="/inbox" className="block">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 text-sm">
                  <Inbox className="w-4 h-4 text-blue-500" />
                  Go to Inbox
                  {unreadCount > 0 && (
                    <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">{unreadCount}</Badge>
                  )}
                </Button>
              </Link>
              <Link href="/compose" className="block">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 text-sm">
                  <Send className="w-4 h-4 text-green-500" />
                  Compose Email
                </Button>
              </Link>
              <Link href="/analytics" className="block">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 text-sm">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Top Senders */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                Top Senders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {topSenders.length === 0 ? (
                <p className="text-gray-400 text-sm">No data yet</p>
              ) : (
                <div className="space-y-2.5">
                  {topSenders.map(([name, count], i) => (
                    <div key={name} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{name}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 border-0 shadow-sm text-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Insight</span>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed">
                {unreadCount > 20
                  ? `You have ${unreadCount} unread emails. Consider using bulk actions in your inbox to catch up.`
                  : todayEmails.length > 0
                    ? `You received ${todayEmails.length} email${todayEmails.length === 1 ? '' : 's'} today. ${peakHour >= 9 && peakHour <= 17 ? 'Most activity is during business hours.' : `Peak activity is around ${peakHour > 12 ? peakHour - 12 + 'PM' : peakHour + 'AM'}.`}`
                    : `Your inbox is looking good! ${readRate}% read rate across ${emails.length} emails.`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
