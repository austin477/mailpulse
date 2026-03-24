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
  slaCompliance: number
}

export function StatsCards({
  totalEmails,
  unreadEmails,
  avgResponseTime,
  slaCompliance,
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Emails',
      value: totalEmails.toLocaleString(),
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
      trend: '+12%',
      trendPositive: true,
    },
    {
      title: 'Unread',
      value: unreadEmails,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
      trend: '-5%',
      trendPositive: false,
    },
    {
      title: 'Avg Response Time',
      value: `${avgResponseTime}h`,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
      trend: '-2h',
      trendPositive: true,
    },
    {
      title: 'SLA Compliance',
      value: `${slaCompliance}%`,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      trend: '+3%',
      trendPositive: true,
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
                <span className={`text-xs font-semibold ${
                  stat.trendPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
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
