'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface VolumeChartProps {
  data?: Array<{
    date: string
    sent: number
    received: number
  }>
}

export function VolumeChart({ data }: VolumeChartProps) {
  const defaultData = [
    { date: 'Mon', sent: 45, received: 89 },
    { date: 'Tue', sent: 52, received: 102 },
    { date: 'Wed', sent: 38, received: 78 },
    { date: 'Thu', sent: 61, received: 115 },
    { date: 'Fri', sent: 55, received: 98 },
    { date: 'Sat', sent: 12, received: 34 },
    { date: 'Sun', sent: 8, received: 22 },
  ]

  const chartData = data || defaultData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Volume</CardTitle>
        <CardDescription>Sent vs received emails this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sent"
              stroke="#f97316"
              dot={{ fill: '#f97316' }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="received"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6' }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
