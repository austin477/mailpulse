'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Copy } from 'lucide-react'

export default function AutomationPage() {
  const [showNewRule, setShowNewRule] = useState(false)
  const [rules, setRules] = useState([
    {
      id: '1',
      name: 'Auto-categorize Work Emails',
      description: 'Labels emails from work domain as Work category',
      enabled: true,
      trigger: { type: 'sender', value: '@company.com' },
      action: { type: 'category', value: 'work' },
    },
    {
      id: '2',
      name: 'Flag Urgent Messages',
      description: 'Mark emails containing "URGENT" as high priority',
      enabled: true,
      trigger: { type: 'keyword', value: 'URGENT' },
      action: { type: 'priority', value: 'high' },
    },
    {
      id: '3',
      name: 'Auto-archive Newsletters',
      description: 'Automatically archive emails from marketing lists',
      enabled: false,
      trigger: { type: 'sender', value: 'newsletter' },
      action: { type: 'archive', value: 'true' },
    },
  ])

  const toggleRule = (id: string) => {
    setRules(rules.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation Rules</h1>
          <p className="text-gray-600 mt-2">Create automated workflows for your emails</p>
        </div>
        <Button
          onClick={() => setShowNewRule(!showNewRule)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </Button>
      </div>

      {showNewRule && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Automation Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name
              </label>
              <Input placeholder="e.g., Auto-archive newsletters" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email_received">Email Received</SelectItem>
                    <SelectItem value="keyword">Contains Keyword</SelectItem>
                    <SelectItem value="sender">From Sender</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Value
                </label>
                <Input placeholder="e.g., newsletter@ or URGENT" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="label">Apply Label</SelectItem>
                    <SelectItem value="category">Set Category</SelectItem>
                    <SelectItem value="priority">Set Priority</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Value
                </label>
                <Input placeholder="e.g., Important, Work, etc" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">Create Rule</Button>
              <Button variant="outline" onClick={() => setShowNewRule(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Rules */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className={rule.enabled ? '' : 'opacity-60'}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rule.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Trigger</p>
                      <p className="text-sm text-gray-900">
                        {rule.trigger.type === 'sender' && `From: ${rule.trigger.value}`}
                        {rule.trigger.type === 'keyword' && `Contains: ${rule.trigger.value}`}
                        {rule.trigger.type === 'email_received' && 'Any email received'}
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-semibold text-blue-600 mb-1">Action</p>
                      <p className="text-sm text-blue-900 font-medium">
                        {rule.action.type === 'category' && `Set category: ${rule.action.value}`}
                        {rule.action.type === 'priority' && `Set priority: ${rule.action.value}`}
                        {rule.action.type === 'archive' && 'Archive email'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRule(rule.id)}
                  >
                    {rule.enabled ? (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <p className="font-semibold text-gray-900 mb-2">No automation rules yet</p>
              <p className="text-gray-600 text-sm mb-4">
                Create your first rule to automate your email management
              </p>
              <Button onClick={() => setShowNewRule(true)}>Create First Rule</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Rule Templates</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Newsletter Auto-archive',
              description: 'Automatically archive newsletter emails',
            },
            {
              title: 'VIP Fast-track',
              description: 'Mark VIP sender emails as high priority',
            },
            {
              title: 'Spam Filter',
              description: 'Move suspicious emails to spam',
            },
            {
              title: 'Backup Archiver',
              description: 'Archive emails after 30 days automatically',
            },
          ].map((template, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
