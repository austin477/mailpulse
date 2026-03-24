'use client'


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
import { Download, TrendingUp } from 'lucide-react'

export default function AnalyticsPage() {
  const responseTimeData = [
    { hour: '9am', time: 2.3, target: 4 },
    { hour: '10am', time: 1.8, target: 4 },
    { hour: '11am', time: 3.2, target: 4 },
    { hour: '12pm', time: 4.1, target: 4 },
    { hour: '1pm', time: 3.5, target: 4 },
    { hour: '2pm', time: 2.9, target: 4 },
    { hour: '3pm', time: 2.4, target: 4 },
    { hour: '4pm', time: 1.9, target: 4 },
  ]

  const topSenders = [
    { sender: 'john@acme.com', count: 45, percentage: 18 },
    { sender: 'sarah@company.com', count: 38, percentage: 15 },
    { sender: 'support@service.io', count: 32, percentage: 13 },
    { sender: 'marketing@brand.com', count: 28, percentage: 11 },
    { sender: 'cto@startup.io', count: 25, percentage: 10 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed email metrics and insights</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Emails', value: '658', change: '+12%' },
          { label: 'Avg Response Time', value: '3.1h', change: '-15%' },
          { label: 'Unread Rate', value: '3.5%', change: '-8%' },
          { label: 'SLA Compliance', value: '94%', change: '+3%' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <span className="text-xs text-green-600 font-semibold">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <VolumeChart />
        <CategoryBreakdown />
      </div>

      <SentimentChart />

      {/* Response Time Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Response Time by Hour
          </CardTitle>
          <CardDescription>Average response time throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="time" name="Actual" fill="#3b82f6" />
              <Bar dataKey="target" name="Target (4h)" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Senders */}
      <Card>
        <CardHeader>
          <CardTitle>Top Senders</CardTitle>
          <CardDescription>Most frequent email senders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSenders.map((sender, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{sender.sender}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${sender.percentage}%` }}
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

      {/* Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution Heatmap</CardTitle>
          <CardDescription>Email activity by day and hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 font-semibold">Hour</th>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <th key={day} className="text-center p-2 font-semibold">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'].map((hour) => (
                  <tr key={hour} className="border-b border-gray-200">
                    <td className="p-2 font-medium text-gray-600">{hour}</td>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                      const intensity = Math.floor(Math.random() * 100)
                      const bgColor =
                        intensity > 70 ? 'bg-blue-600' :
                        intensity > 40 ? 'bg-blue-400' :
                        intensity > 10 ? 'bg-blue-200' :
                        'bg-gray-100'
                      return (
                        <td key={day} className="text-center p-2">
                          <div className={`h-8 w-8 ${bgColor} rounded flex items-center justify-center text-xs font-semibold text-white`}>
                            {intensity > 20 ? Math.ceil(intensity / 10) : ''}
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
    </div>
  )
}
