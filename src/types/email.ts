export interface Email {
  id: string
  messageId: string
  threadId: string
  from: string
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  body: string
  htmlBody?: string
  timestamp: Date
  isRead: boolean
  isStarred: boolean
  isDraft: boolean
  hasAttachments: boolean
  labels: string[]
  category: 'inbox' | 'work' | 'personal' | 'sales' | 'support'
  priority: 'critical' | 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent'
  aiAnalysis?: AIAnalysis
  attachments: Attachment[]
  userEmail: string
}

export interface AIAnalysis {
  summary: string
  actionItems: string[]
  suggestedReplies: SuggestedReply[]
  sentiment: string
  priority: string
  category: string
  extractedEntities: {
    names: string[]
    dates: string[]
    companies: string[]
    topics: string[]
  }
}

export interface SuggestedReply {
  tone: 'professional' | 'friendly' | 'concise' | 'detailed'
  content: string
}

export interface Attachment {
  id: string
  filename: string
  mimeType: string
  size: number
  data?: Buffer
}

export interface EmailThread {
  threadId: string
  subject: string
  emails: Email[]
  lastEmail: Email
  unreadCount: number
  participantCount: number
  lastMessageTime: Date
}

export interface EmailFilter {
  category?: string
  priority?: string
  sentiment?: string
  status?: 'read' | 'unread' | 'starred'
  dateRange?: {
    from: Date
    to: Date
  }
  searchQuery?: string
}

export interface EmailAccount {
  id: string
  userId: string
  email: string
  gmailId: string
  refreshToken: string
  accessToken: string
  accessTokenExpiry: Date
  displayName?: string
  avatarUrl?: string
  connectedAt: Date
  isActive: boolean
}
