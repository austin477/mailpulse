'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer, Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SentimentChartProps {
  data?: Array<{
    sentiment: string
    count: number
  }>
}

export function SentimentChart({ data }: SentimentChartProps) {
  const defaultData = [
    { sentiment: 'Positive', count: 234 },
    { sentiment: 'Neutral', count: 456 },
    { sentiment: 'Negative', count: 89 },
    { sentiment: 'Urgent', count: 67 },
  ]

  const chartData = data || defaultData

  const colors: Record<string, string> = {
    'Positive': '#10b981',
    'Neutral': '#9ca3af',
    'Negative': '#ef4444',
    'Urgent': '#a855f7',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Email sentiment distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="sentiment" stroke="#9ca3af" />
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
                  fill={colors[entry.sentiment] || '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
