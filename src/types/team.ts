export interface TeamMember {
  id: string
  userId: string
  teamId: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'invited'
  avatarUrl?: string
  joinedAt: Date
}

export interface Team {
  id: string
  name: string
  slug: string
  description?: string
  members: TeamMember[]
  createdAt: Date
  updatedAt: Date
  plan: 'free' | 'pro' | 'enterprise'
}

export interface AuditLog {
  id: string
  teamId: string
  userId: string
  action: string
  resource: string
  resourceId: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export interface Automation {
  id: string
  teamId: string
  name: string
  description?: string
  trigger: {
    type: 'email_received' | 'keyword' | 'sender'
    value: string
  }
  actions: {
    type: 'label' | 'category' | 'priority' | 'archive' | 'forward' | 'webhook'
    value: string
  }[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}
