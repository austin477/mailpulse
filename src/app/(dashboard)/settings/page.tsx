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
import { Bell, Lock, Zap, Sliders, LogOut, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [notificationSettings, setNotificationSettings] = useState({
    newEmails: true,
    urgentOnly: false,
    weeklyDigest: true,
    soundEnabled: true,
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Settings', icon: Zap },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input defaultValue="John Doe" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input defaultValue="john.doe@company.com" disabled />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Timezone
                </label>
                <Select defaultValue="pst">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="cst">Central Time (CST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Accounts</CardTitle>
              <CardDescription>Manage connected email accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">john.doe@company.com</p>
                  <p className="text-sm text-gray-600">Primary Account</p>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>

              <Button variant="outline" className="w-full">
                + Add Another Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Control when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: 'newEmails',
                  label: 'New Email Notifications',
                  description: 'Get notified when new emails arrive',
                },
                {
                  id: 'urgentOnly',
                  label: 'Urgent Only',
                  description: 'Only notify for critical and high priority emails',
                },
                {
                  id: 'weeklyDigest',
                  label: 'Weekly Digest',
                  description: 'Receive a summary email every Sunday',
                },
                {
                  id: 'soundEnabled',
                  label: 'Sound Notifications',
                  description: 'Play sound when new email arrives',
                },
              ].map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{setting.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={
                      notificationSettings[setting.id as keyof typeof notificationSettings]
                    }
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [setting.id]: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </div>
              ))}

              <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>Disable notifications during specific times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-5 h-5 rounded text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Enable Quiet Hours</p>
                  <p className="text-sm text-gray-600">No notifications from 6 PM to 9 AM</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 ml-9">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <Input type="time" defaultValue="18:00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <Input type="time" defaultValue="09:00" />
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 ml-9">Save</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Settings */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Customize AI analysis and suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Confidence Threshold
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12">75%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Only show AI suggestions with confidence above this threshold
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-categorization
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Automatically categorize incoming emails
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Detection
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Automatically detect and flag urgent emails
                  </span>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">Save AI Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Model</CardTitle>
              <CardDescription>Your AI learns from your actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-blue-900">Model Status</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Your personal AI model is being trained (45% complete)
                  </p>
                </div>
                <div className="w-32 bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <Input type="password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <Input type="password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Input type="password" />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Status</p>
                  <p className="text-sm text-gray-600 mt-1">Two-factor authentication is disabled</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium text-red-900 mb-2">Delete Account</p>
                <p className="text-sm text-red-800 mb-3">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
