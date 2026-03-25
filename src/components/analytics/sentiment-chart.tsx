'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Email {
  isRead?: boolean
  isStarred?: boolean
}

interface EmailStatusChartProps {
  emails?: Email[]
  data?: Array<{
    status: string
    count: number
  }>
}

export function SentimentChart({ emails, data }: EmailStatusChartProps) {
  const defaultData = [
    { status: 'Read', count: 234 },
    { status: 'Unread', count: 456 },
    { status: 'Starred', count: 89 },
  ]

  // Compute status data from emails if provided
  let chartData = data || defaultData

  if (emails && emails.length > 0) {
    const readCount = emails.filter(e => e.isRead).length
    const unreadCount = emails.filter(e => !e.isRead).length
    const starredCount = emails.filter(e => e.isStarred).length

    chartData = [
      { status: 'Read', count: readCount },
      { status: 'Unread', count: unreadCount },
      { status: 'Starred', count: starredCount },
    ]
  }

  const colors: Record<string, string> = {
    'Read': '#10b981',
    'Unread': '#3b82f6',
    'Starred': '#f59e0b',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Status</CardTitle>
        <CardDescription>Read, unread, and starred email counts</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="status" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="count" fill="#3b82f6">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[entry.status] || '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
