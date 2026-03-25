'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  badge?: string
  badgeColor?: string
}

export function StatCard({ title, value, icon: Icon, iconBg, iconColor, badge, badgeColor }: StatCardProps) {
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {badge && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor || 'bg-gray-100 text-gray-600'}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  totalEmails: number
  unreadEmails: number
  avgResponseTime: number
  readRate: number
}

export function StatsCards({ totalEmails, unreadEmails, avgResponseTime, readRate }: StatsCardsProps) {
  const formatResponseTime = (hours: number) => {
    if (hours === 0) return 'N/A'
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours.toFixed(1)}h`
    return `${(hours / 24).toFixed(1)}d`
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Emails" value={totalEmails.toLocaleString()} icon={require('lucide-react').Inbox} iconBg="bg-blue-50" iconColor="text-blue-600" />
      <StatCard title="Unread" value={unreadEmails} icon={require('lucide-react').Mail} iconBg="bg-red-50" iconColor="text-red-500" />
      <StatCard title="Avg Response" value={formatResponseTime(avgResponseTime)} icon={require('lucide-react').Clock} iconBg="bg-amber-50" iconColor="text-amber-500" />
      <StatCard title="Read Rate" value={`${readRate}%`} icon={require('lucide-react').TrendingUp} iconBg="bg-green-50" iconColor="text-green-500" />
    </div>
  )
}
