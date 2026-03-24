'use client'

import { StatsCards } from '@/components/dashboard/stats-cards'
import { VolumeChart } from '@/components/analytics/volume-chart'
import { CategoryBreakdown } from '@/components/analytics/category-breakdown'
import { SentimentChart } from '@/components/analytics/sentiment-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getPriorityColor } from '@/lib/utils'
import { Mail, AlertCircle, MessageSquare } from 'lucide-react'

export default function DashboardPage() {
  const mockEmails = [
    {
      id: '1',
      from: 'john@acme.com',
      subject: 'Important: Q3 Budget Review',
      priority: 'critical',
      timestamp: new Date(),
      isRead: false,
    },
    {
      id: '2',
      from: 'sarah@company.com',
      subject: 'Team Meeting Notes',
      priority: 'high',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
    },
    {
      id: '3',
      from: 'support@service.com',
      subject: 'Your Support Ticket Update',
      priority: 'medium',
      timestamp: new Date(Date.now() - 7200000),
      isRead: true,
    },
    {
      id: '4',
      from: 'marketing@brand.com',
      subject: 'Campaign Performance Report',
      priority: 'low',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true,
    },
    {
      id: '5',
      from: 'cto@startup.io',
      subject: 'Architecture Discussion',
      priority: 'high',
      timestamp: new Date(Date.now() - 172800000),
      isRead: true,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your email summary.</p>
      </div>

      {/* Stats */}
      <StatsCards
        totalEmails={658}
        unreadEmails={23}
        avgResponseTime={4}
        slaCompliance={94}
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
            Priority Inbox
          </CardTitle>
          <CardDescription>Top 5 emails requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockEmails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 truncate">
                      {email.from.split('@')[0]}
                    </p>
                    <Badge variant={email.priority as any} className="text-xs">
                      {email.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{email.subject}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <p className="text-xs text-gray-500">{formatDate(email.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Emails
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>12 new emails received</span>
              <span className="text-xs">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>AI categorized 8 emails</span>
              <span className="text-xs">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>4 urgent items flagged</span>
              <span className="text-xs">45 mins ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg. Response Time</span>
              <span className="font-semibold">4h 23m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Read Rate</span>
              <span className="font-semibold">96%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">SLA Compliance</span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
