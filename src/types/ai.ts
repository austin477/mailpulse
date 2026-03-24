export interface AIRequest {
  emailId: string
  emailContent: string
  emailSubject: string
  action: 'analyze' | 'summarize' | 'categorize' | 'suggest-reply'
}

export interface AIResponse {
  success: boolean
  data?: {
    summary?: string
    category?: string
    priority?: string
    sentiment?: string
    actionItems?: string[]
    suggestedReplies?: {
      tone: string
      content: string
    }[]
  }
  error?: string
}

export interface ClaudeAnalysis {
  category: 'inbox' | 'work' | 'personal' | 'sales' | 'support'
  priority: 'critical' | 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent'
  summary: string
  actionItems: string[]
  topics: string[]
}

export interface SuggestionsRequest {
  emailId: string
  subject: string
  from: string
  body: string
  tone: 'professional' | 'friendly' | 'concise' | 'detailed'
}

export interface SuggestionsResponse {
  suggestions: string[]
  context: string
}
