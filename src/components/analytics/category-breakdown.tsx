'use client'

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CategoryBreakdownProps {
  data?: Array<{
    name: string
    value: number
  }>
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ec4899']

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const defaultData = [
    { name: 'Work', value: 245 },
    { name: 'Personal', value: 123 },
    { name: 'Sales', value: 89 },
    { name: 'Support', value: 156 },
    { name: 'Other', value: 45 },
  ]

  const chartData = data || defaultData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Distribution of emails by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} (${value})`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
