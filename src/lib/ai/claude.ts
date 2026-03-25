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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are an AI email analyst for a business professional. Analyze this email thoroughly and provide a JSON response.

Email:
From: ${from}
Subject: ${subject}
Body: ${body}

Provide a JSON response with these exact fields:
{
  "category": one of "inbox"|"work"|"personal"|"sales"|"support",
  "priority": one of "critical"|"high"|"medium"|"low",
  "sentiment": one of "positive"|"neutral"|"negative"|"urgent",
  "summary": "A clear 2-3 sentence summary capturing the key message and any requests made",
  "actionItems": ["Specific, actionable next steps extracted from the email — be concrete, not generic"],
  "topics": ["2-4 specific topics discussed in this email"]
}

Rules:
- summary should capture WHAT the sender wants/needs, not just describe the email
- actionItems should be specific actions (e.g., "Reply confirming Tuesday 2pm meeting" not "Respond to email")
- If the email asks questions, list each question as a separate action item
- If there are deadlines mentioned, include them in action items
- topics should be specific (e.g., "Q3 budget review" not "Business")

Respond ONLY with valid JSON.`,
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
      // Handle case where response might have markdown code blocks
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(jsonStr)
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
    return getMockReply(tone, emailSubject, emailBody)
  }

  try {
    const toneInstructions = {
      professional: 'Write in a polished, professional business tone. Be clear and structured.',
      friendly: 'Write in a warm, personable tone while staying professional. Be approachable.',
      concise: 'Be brief and direct. Get to the point in 2-3 sentences max.',
      detailed: 'Be thorough and comprehensive. Address all points raised and provide context.',
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [
          {
            role: 'user',
            content: `You are drafting an email reply for a business professional. Read the original email carefully and write a reply that DIRECTLY ADDRESSES the content.

Original email from ${senderEmail}:
Subject: ${emailSubject}
Body: ${emailBody}

Instructions:
- ${toneInstructions[tone]}
- DIRECTLY answer any questions asked in the email
- ACKNOWLEDGE specific points, names, dates, or numbers mentioned
- If the email requests a meeting, suggest availability
- If the email shares information, reference specific details in your response
- If the email asks for a decision, provide a thoughtful response
- Include a greeting (e.g., "Hi [name],") and sign-off (e.g., "Best regards,")
- Do NOT be generic. Your reply should only make sense as a response to THIS specific email.
- Do NOT include placeholder brackets like [your name] — leave the sign-off name blank

Write the complete reply:`,
          },
        ],
      }),
    })

    if (!response.ok) {
      return getMockReply(tone, emailSubject, emailBody)
    }

    const data = await response.json()
    return data.content[0].text.trim()
  } catch (error) {
    console.error('Error generating reply suggestion:', error)
    return getMockReply(tone, emailSubject, emailBody)
  }
}

export async function summarizeEmail(
  subject: string,
  body: string,
  from: string
): Promise<{ tldr: string; keyPoints: string[]; deadlines: string[]; questions: string[] }> {
  if (!ANTHROPIC_API_KEY) {
    return {
      tldr: body.slice(0, 120).replace(/\n/g, ' ').trim() + '...',
      keyPoints: ['Review the email content'],
      deadlines: [],
      questions: [],
    }
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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Summarize this email. Extract the most important information.

From: ${from}
Subject: ${subject}
Body: ${body}

Respond with JSON:
{
  "tldr": "One sentence capturing the core message and what action is needed (max 120 chars)",
  "keyPoints": ["2-4 bullet points of the most important information"],
  "deadlines": ["Any dates, deadlines, or time-sensitive items mentioned (empty array if none)"],
  "questions": ["Any questions the sender is asking that need answers (empty array if none)"]
}

Respond ONLY with valid JSON.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      return {
        tldr: body.slice(0, 120).replace(/\n/g, ' ').trim() + '...',
        keyPoints: ['Review the email content'],
        deadlines: [],
        questions: [],
      }
    }

    const data = await response.json()
    const content = data.content[0].text
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(jsonStr)

    return {
      tldr: parsed.tldr || '',
      keyPoints: parsed.keyPoints || [],
      deadlines: parsed.deadlines || [],
      questions: parsed.questions || [],
    }
  } catch (error) {
    console.error('Error summarizing email:', error)
    return {
      tldr: body.slice(0, 120).replace(/\n/g, ' ').trim() + '...',
      keyPoints: ['Review the email content'],
      deadlines: [],
      questions: [],
    }
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
    summary: body.slice(0, 200).replace(/\n/g, ' ').trim(),
    actionItems: ['Review and respond to this email', 'Follow up if needed'],
    topics: [subject.split(' ').slice(0, 3).join(' ') || 'General'],
  }
}

function getMockReply(tone: string, subject: string, body: string): string {
  // Extract sender name from body or subject for personalization
  const greeting = 'Hi,'

  const bodyPreview = body.slice(0, 100).replace(/\n/g, ' ')

  const replies: Record<string, string> = {
    professional: `${greeting}\n\nThank you for your email regarding "${subject}". I've reviewed the details you shared and appreciate you bringing this to my attention.\n\nI'll look into this and get back to you with a comprehensive response by end of day.\n\nBest regards,`,
    friendly: `${greeting}\n\nThanks for reaching out about "${subject}"! I appreciate you sharing this.\n\nLet me take a closer look and I'll circle back to you soon. Feel free to ping me if anything else comes up in the meantime.\n\nCheers,`,
    concise: `${greeting}\n\nNoted on "${subject}". Will review and follow up shortly.\n\nThanks,`,
    detailed: `${greeting}\n\nThank you for your detailed email regarding "${subject}". I've carefully reviewed the information you provided.\n\nHere are my initial thoughts:\n- I understand the core issue and will prioritize this accordingly\n- I'll coordinate with the relevant team members to ensure we address all the points raised\n- I expect to have a full response ready within 24-48 hours\n\nPlease don't hesitate to reach out if you have any additional information to share in the meantime.\n\nBest regards,`,
  }
  return replies[tone] || replies.professional
}
