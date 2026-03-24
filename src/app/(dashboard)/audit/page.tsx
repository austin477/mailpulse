'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { Search, Download, Settings } from 'lucide-react'

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState('all')

  const auditLogs = [
    {
      id: '1',
      user: 'You',
      email: 'you@company.com',
      action: 'email_archived',
      resource: 'Email',
      details: 'Archived 5 emails from Inbox',
      timestamp: new Date(),
    },
    {
      id: '2',
      user: 'Sarah Johnson',
      email: 'sarah@company.com',
      action: 'rule_created',
      resource: 'Automation',
      details: 'Created automation rule: Auto-categorize Work Emails',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      user: 'You',
      email: 'you@company.com',
      action: 'member_invited',
      resource: 'Team',
      details: 'Invited mike@company.com as Member',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '4',
      user: 'Mike Chen',
      email: 'mike@company.com',
      action: 'email_forwarded',
      resource: 'Email',
      details: 'Forwarded email to external address',
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '5',
      user: 'You',
      email: 'you@company.com',
      action: 'settings_updated',
      resource: 'Settings',
      details: 'Changed notification preferences',
      timestamp: new Date(Date.now() - 172800000),
    },
  ]

  const actionColors: Record<string, string> = {
    email_archived: 'bg-blue-100 text-blue-800',
    rule_created: 'bg-purple-100 text-purple-800',
    member_invited: 'bg-green-100 text-green-800',
    email_forwarded: 'bg-orange-100 text-orange-800',
    settings_updated: 'bg-gray-100 text-gray-800',
  }

  const filteredLogs = auditLogs.filter(
    (log) =>
      (selectedAction === 'all' || log.action === selectedAction) &&
      (searchQuery === '' ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600 mt-2">Track all team activities and changes</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by user, email, or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
              </label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="email_archived">Email Archived</SelectItem>
                  <SelectItem value="rule_created">Rule Created</SelectItem>
                  <SelectItem value="member_invited">Member Invited</SelectItem>
                  <SelectItem value="email_forwarded">Email Forwarded</SelectItem>
                  <SelectItem value="settings_updated">Settings Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            {filteredLogs.length} entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No activities found</p>
              <p className="text-sm">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {log.user.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{log.user}</p>
                      <span className="text-xs text-gray-500">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{log.email}</p>
                    <p className="text-sm text-gray-700 mb-2">{log.details}</p>

                    <div className="flex items-center gap-2">
                      <Badge className={`${actionColors[log.action]} text-xs`}>
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {log.resource}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredLogs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retention Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-gray-900 mb-2">Retention Period</p>
            <p className="text-sm text-gray-600 mb-3">
              Audit logs are kept for 90 days and automatically purged after this period
            </p>
            <Button variant="outline" size="sm">
              Change Retention
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
