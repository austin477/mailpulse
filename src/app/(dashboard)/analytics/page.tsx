'use client'

import { useState, useEffect, useMemo } from 'react'
import { VolumeChart } from '@/components/analytics/volume-chart'
import { CategoryBreakdown } from '@/components/analytics/category-breakdown'
import { SentimentChart } from '@/components/analytics/sentiment-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Download, TrendingUp, Loader2 } from 'lucide-react'

interface EmailSummary {
  id: string
  from: string
  subject: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  labels?: string[]
}

export default function AnalyticsPage() {
  const [emails, setEmails] = useState<EmailSummary[]>([])
  const [totalEmails, setTotalEmails] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEmails() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/gmail/messages?max=100')
        if (res.status === 401) {
          window.location.href = '/login'
          return
        }
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setEmails(data.emails || [])
        setTotalEmails(data.total || 0)
      } catch (err) {
        console.error('Analytics fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEmails()
  }, [])

  // Compute real analytics from email data
  const analytics = useMemo(() => {
    if (emails.length === 0) return null

    const unreadCount = emails.filter(e => !e.isRead).length
    const readRate = emails.length > 0 ? Math.round(((emails.length - unreadCount) / emails.length) * 100) : 0

    // Average time between emails
    let avgTimeBetween = 0
    if (emails.length > 1) {
      const times = emails.map(e => new Date(e.timestamp).getTime()).sort((a, b) => b - a)
      const diffs = times.slice(0, -1).map((t, i) => Math.abs(t - times[i + 1]))
      avgTimeBetween = diffs.reduce((s, d) => s + d, 0) / diffs.length / (1000 * 60 * 60)
    }

    // Response time by hour of day
    const hourCounts: Record<number, number[]> = {}
    emails.forEach(e => {
      const hour = new Date(e.timestamp).getHours()
      if (!hourCounts[hour]) hourCounts[hour] = []
      hourCounts[hour].push(1)
    })

    const responseTimeData = Array.from({ length: 12 }, (_, i) => {
      const hour = i + 7 // 7am to 6pm
      const count = hourCounts[hour]?.length || 0
      const label = hour <= 12 ? `${hour}${hour === 12 ? 'pm' : 'am'}` : `${hour - 12}pm`
      return { hour: label, count, target: Math.round(emails.length / 12) }
    })

    // Top senders
    const senderCounts: Record<string, number> = {}
    emails.forEach(e => {
      const sender = e.from.replace(/<.*>/, '').trim() || e.from
      senderCounts[sender] = (senderCounts[sender] || 0) + 1
    })
    const topSenders = Object.entries(senderCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([sender, count]) => ({
        sender,
        count,
        percentage: Math.round((count / emails.length) * 100),
      }))

    // Heatmap: actual email counts by day of week and hour
    const heatmap: Record<string, Record<number, number>> = {}
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    emails.forEach(e => {
      const d = new Date(e.timestamp)
      const day = days[d.getDay()]
      const hour = d.getHours()
      if (!heatmap[day]) heatmap[day] = {}
      heatmap[day][hour] = (heatmap[day][hour] || 0) + 1
    })

    return {
      totalLoaded: emails.length,
      totalEstimate: totalEmails,
      unreadCount,
      readRate,
      avgTimeBetween,
      responseTimeData,
      topSenders,
      heatmap,
    }
  }, [emails, totalEmails])

  const formatTime = (hours: number) => {
    if (hours === 0) return 'N/A'
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours.toFixed(1)}h`
    return `${(hours / 24).toFixed(1)}d`
  }

  const handleExport = () => {
    const csv = [
      ['From', 'Subject', 'Date', 'Read', 'Starred', 'Labels'].join(','),
      ...emails.map(e => [
        `"${e.from.replace(/"/g, '""')}"`,
        `"${e.subject.replace(/"/g, '""')}"`,
        new Date(e.timestamp).toISOString(),
        e.isRead ? 'Yes' : 'No',
        e.isStarred ? 'Yes' : 'No',
        `"${(e.labels || []).join('; ')}"`,
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mailpulse-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your emails...</p>
        </div>
      </div>
    )
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm']
  const hourValues = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed email metrics and insights</p>
        </div>
        <Button onClick={handleExport} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Emails', value: analytics ? analytics.totalEstimate.toLocaleString() : '0' },
          { label: 'Avg Email Gap', value: analytics ? formatTime(analytics.avgTimeBetween) : 'N/A' },
          { label: 'Unread Count', value: analytics ? analytics.unreadCount.toString() : '0' },
          { label: 'Read Rate', value: analytics ? `${analytics.readRate}%` : '0%' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <VolumeChart emails={emails} />
        <CategoryBreakdown emails={emails} />
      </div>

      <SentimentChart emails={emails} />

      {/* Email Activity by Hour */}
      {analytics && analytics.responseTimeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Email Activity by Hour
            </CardTitle>
            <CardDescription>Number of emails received by time of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" label={{ value: 'Emails', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="count" name="Emails" fill="#3b82f6" />
                <Bar dataKey="target" name="Average" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Senders */}
      {analytics && analytics.topSenders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Senders</CardTitle>
            <CardDescription>Most frequent email senders (from {analytics.totalLoaded} loaded emails)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topSenders.map((sender, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{sender.sender}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(sender.percentage * 3, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{sender.percentage}%</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold text-gray-900">{sender.count}</p>
                    <p className="text-xs text-gray-500">emails</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distribution Heatmap */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Distribution Heatmap</CardTitle>
            <CardDescription>Email activity by day and hour (based on {analytics.totalLoaded} emails)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 font-semibold">Hour</th>
                    {days.map((day) => (
                      <th key={day} className="text-center p-2 font-semibold">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.map((hourLabel, idx) => (
                    <tr key={hourLabel} className="border-b border-gray-200">
                      <td className="p-2 font-medium text-gray-600">{hourLabel}</td>
                      {days.map((day) => {
                        const count = analytics.heatmap[day]?.[hourValues[idx]] || 0
                        const maxCount = Math.max(
                          ...Object.values(analytics.heatmap).flatMap(h =>
                            Object.values(h)
                          ),
                          1
                        )
                        const intensity = count / maxCount
                        const bgColor =
                          intensity > 0.7 ? 'bg-blue-600 text-white' :
                          intensity > 0.4 ? 'bg-blue-400 text-white' :
                          intensity > 0.1 ? 'bg-blue-200 text-blue-800' :
                          count > 0 ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        return (
                          <td key={day} className="text-center p-2">
                            <div className={`h-8 w-8 mx-auto ${bgColor} rounded flex items-center justify-center text-xs font-semibold`}>
                              {count > 0 ? count : ''}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
