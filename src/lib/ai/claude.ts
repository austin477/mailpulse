import { ClaudeAnalysis } from '@/types/ai'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

export async function analyzeEmail(subject: string, body: string, from: string): Promise<ClaudeAnalysis> {
  if (!ANTHROPIC_API_KEY) {
    return getMockAnalysis(subject, body, from)
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Analyze this email and provide JSON response with these fields:
- category: 'inbox'|'work'|'personal'|'sales'|'support'
- priority: 'critical'|'high'|'medium'|'low'
- sentiment: 'positive'|'neutral'|'negative'|'urgent'
- summary: brief 1-2 sentence summary
- actionItems: array of 2-3 action items if any
- topics: array of 2-3 main topics

Email:
From: ${from}
Subject: ${subject}
Body: ${body}

Respond ONLY with valid JSON, no markdown or explanation.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      return getMockAnalysis(subject, body, from)
    }

    const data = await response.json()
    const content = data.content[0].text

    try {
      const parsed = JSON.parse(content)
      return {
        category: parsed.category || 'inbox',
        priority: parsed.priority || 'medium',
        sentiment: parsed.sentiment || 'neutral',
        summary: parsed.summary || 'Email received',
        actionItems: parsed.actionItems || [],
        topics: parsed.topics || [],
      }
    } catch {
      return getMockAnalysis(subject, body, from)
    }
  } catch (error) {
    console.error('Error analyzing email with Claude:', error)
    return getMockAnalysis(subject, body, from)
  }
}

export async function generateReplySuggestions(
  emailSubject: string,
  emailBody: string,
  senderEmail: string,
  tone: 'professional' | 'friendly' | 'concise' | 'detailed'
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    return getMockReply(tone)
  }

  try {
    const toneDescriptions = {
      professional: 'formal business tone, professional language',
      friendly: 'warm and personable tone, conversational style',
      concise: 'brief and to-the-point, minimal words',
      detailed: 'comprehensive, thorough explanation with context',
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Generate an email reply with a ${toneDescriptions[tone]}.

Original email from ${senderEmail}:
Subject: ${emailSubject}
Body: ${emailBody}

Write only the reply body text, no greeting or signature. Make it appropriate for replying to this email.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      return getMockReply(tone)
    }

    const data = await response.json()
    return data.content[0].text.trim()
  } catch (error) {
    console.error('Error generating reply suggestion:', error)
    return getMockReply(tone)
  }
}

function getMockAnalysis(subject: string, body: string, from: string): ClaudeAnalysis {
  const isUrgent = subject.toLowerCase().includes('urgent') || body.toLowerCase().includes('asap')
  const isSales = from.includes('sales') || subject.toLowerCase().includes('offer')
  const isSupport = subject.toLowerCase().includes('support') || subject.toLowerCase().includes('help')

  return {
    category: isUrgent ? 'work' : isSales ? 'sales' : isSupport ? 'support' : 'inbox',
    priority: isUrgent ? 'high' : 'medium',
    sentiment: body.includes('!') ? 'positive' : 'neutral',
    summary: body.slice(0, 150).replace(/\n/g, ' ') + '...',
    actionItems: ['Review and respond', 'Add to calendar if needed'],
    topics: ['General', 'Follow-up'],
  }
}

function getMockReply(tone: string): string {
  const replies = {
    professional:
      'Thank you for your email. I appreciate you reaching out. I will review this matter and get back to you with a response shortly.',
    friendly:
      'Hey! Thanks so much for getting in touch. I appreciate the message and will definitely look into this. Talk soon!',
    concise: 'Thanks for the email. Will follow up shortly.',
    detailed:
      'Thank you for reaching out with this inquiry. I have carefully reviewed your message and will provide a comprehensive response after conducting the necessary research and analysis. I will follow up within 24 hours with additional details.',
  }
  return replies[tone as keyof typeof replies] || replies.professional
}
