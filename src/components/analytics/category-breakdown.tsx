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

interface Email {
  labels?: string[]
}

interface CategoryBreakdownProps {
  emails?: Email[]
  data?: Array<{
    name: string
    value: number
  }>
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ec4899']

// Gmail label to friendly name mapping
const LABEL_MAP: Record<string, string> = {
  'INBOX': 'Inbox',
  'SENT': 'Sent',
  'DRAFT': 'Draft',
  'SPAM': 'Spam',
  'TRASH': 'Trash',
  'CATEGORY_PROMOTIONS': 'Promotions',
  'CATEGORY_SOCIAL': 'Social',
  'CATEGORY_UPDATES': 'Updates',
  'CATEGORY_FORUMS': 'Forums',
  'CATEGORY_PERSONAL': 'Personal',
}

export function CategoryBreakdown({ emails, data }: CategoryBreakdownProps) {
  const defaultData = [
    { name: 'Work', value: 245 },
    { name: 'Personal', value: 123 },
    { name: 'Sales', value: 89 },
    { name: 'Support', value: 156 },
    { name: 'Other', value: 45 },
  ]

  // Compute category data from emails if provided
  let chartData = data || defaultData

  if (emails && emails.length > 0) {
    // Count emails by their Gmail labels
    const categoryCount: Record<string, number> = {}

    emails.forEach(email => {
      const labels = email.labels || []

      // Find the first label that matches our mapping
      let found = false
      for (const label of labels) {
        if (LABEL_MAP[label]) {
          categoryCount[LABEL_MAP[label]] = (categoryCount[LABEL_MAP[label]] || 0) + 1
          found = true
          break
        }
      }

      // If no label matched, add to "Other"
      if (!found) {
        categoryCount['Other'] = (categoryCount['Other'] || 0) + 1
      }
    })

    chartData = Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Show top 5
  }

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
