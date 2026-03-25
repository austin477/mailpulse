'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Mail,
  AlertCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'

interface StatsCardsProps {
  totalEmails: number
  unreadEmails: number
  avgResponseTime: number
  readRate: number
}

export function StatsCards({
  totalEmails,
  unreadEmails,
  avgResponseTime,
  readRate,
}: StatsCardsProps) {
  const formatResponseTime = (hours: number) => {
    if (hours === 0) return 'N/A'
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours.toFixed(1)}h`
    return `${(hours / 24).toFixed(1)}d`
  }

  const stats = [
    {
      title: 'Total Emails',
      value: totalEmails.toLocaleString(),
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Unread',
      value: unreadEmails,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Avg Response Time',
      value: formatResponseTime(avgResponseTime),
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Read Rate',
      value: `${readRate}%`,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
