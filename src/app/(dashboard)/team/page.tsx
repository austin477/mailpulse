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
import { Plus, Mail, MoreVertical, Trash2, Shield } from 'lucide-react'

export default function TeamPage() {
  const [members, setMembers] = useState([
    {
      id: '1',
      name: 'You',
      email: 'you@company.com',
      role: 'owner',
      status: 'active',
      joinedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'admin',
      status: 'active',
      joinedAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'member',
      status: 'active',
      joinedAt: '2024-02-10',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@company.com',
      role: 'member',
      status: 'invited',
      joinedAt: '2024-03-01',
    },
  ])

  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const handleInvite = () => {
    if (inviteEmail) {
      setMembers([
        ...members,
        {
          id: Math.random().toString(),
          name: inviteEmail.split('@')[0],
          email: inviteEmail,
          role: inviteRole as any,
          status: 'invited',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ])
      setInviteEmail('')
      setInviteRole('member')
      setShowInviteForm(false)
    }
  }

  const roleColors: Record<string, string> = {
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    member: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage your MailPulse team members</p>
        </div>
        <Button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {showInviteForm && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Invite Team Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send Invite
              </Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Info */}
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Team Name', value: 'Your Company' },
            { label: 'Plan', value: 'Professional' },
            { label: 'Members', value: `${members.filter((m) => m.status === 'active').length} Active` },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <p className="font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>{members.length} members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600 truncate">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <Badge className={`${roleColors[member.role]} capitalize`}>
                    {member.role}
                  </Badge>
                  <Badge
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                  >
                    {member.status === 'active' ? '✓ Active' : '○ Invited'}
                  </Badge>

                  {member.role !== 'owner' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Shield className="w-4 h-4 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() =>
                          setMembers(members.filter((m) => m.id !== member.id))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Team Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-gray-900">Require two-factor auth</p>
              <p className="text-sm text-gray-600">Enforce 2FA for all team members</p>
            </div>
            <Button variant="outline" size="sm">
              Disabled
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-gray-900">Email forwarding</p>
              <p className="text-sm text-gray-600">Allow members to forward emails externally</p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
