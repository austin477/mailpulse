'use client'

import { useState } from 'react'
import { Email, SuggestedReply } from '@/types/email'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChevronDown,
  Sparkles,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react'

interface AIAnalysisPanelProps {
  email: Email
}

export function AIAnalysisPanel({ email }: AIAnalysisPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['actionItems'])
  )
  const [suggestedReplyTone, setSuggestedReplyTone] = useState<'professional' | 'friendly' | 'concise' | 'detailed'>('professional')

  const toggleSection = (section: string) => {
    const next = new Set(expandedSections)
    if (next.has(section)) {
      next.delete(section)
    } else {
      next.add(section)
    }
    setExpandedSections(next)
  }

  const mockSuggestedReplies: Record<string, SuggestedReply> = {
    professional: {
      tone: 'professional',
      content: 'Thank you for your email. I appreciate the information and will review it shortly. I will follow up with you within 24 hours.',
    },
    friendly: {
      tone: 'friendly',
      content: 'Hey! Thanks so much for reaching out. I really appreciate this. Let me look into it and I\'ll get back to you soon!',
    },
    concise: {
      tone: 'concise',
      content: 'Thanks for the email. Will respond shortly.',
    },
    detailed: {
      tone: 'detailed',
      content: 'Thank you for taking the time to send this message. I have carefully reviewed your email and understand the key points you\'ve raised. I would like to provide a comprehensive response, so I will conduct a thorough analysis and follow up with you within 24 hours with detailed insights.',
    },
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">CATEGORY</p>
            <Badge variant={email.category as any} className="capitalize">
              {email.category}
            </Badge>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">PRIORITY</p>
            <Badge variant={email.priority as any} className="capitalize">
              {email.priority}
            </Badge>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">SENTIMENT</p>
            <Badge variant={email.sentiment as any} className="capitalize">
              {email.sentiment}
            </Badge>
          </div>

          {email.aiAnalysis?.summary && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">SUMMARY</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {email.aiAnalysis.summary}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('actionItems')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Action Items
            </CardTitle>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.has('actionItems') ? 'rotate-180' : ''
              }`}
            />
          </div>
        </CardHeader>
        {expandedSections.has('actionItems') && (
          <CardContent>
            {email.aiAnalysis?.actionItems && email.aiAnalysis.actionItems.length > 0 ? (
              <ul className="space-y-2">
                {email.aiAnalysis.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No action items identified</p>
            )}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('suggestedReply')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Suggested Reply
            </CardTitle>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.has('suggestedReply') ? 'rotate-180' : ''
              }`}
            />
          </div>
        </CardHeader>
        {expandedSections.has('suggestedReply') && (
          <CardContent className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {(['professional', 'friendly', 'concise', 'detailed'] as const).map((tone) => (
                <Button
                  key={tone}
                  variant={suggestedReplyTone === tone ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSuggestedReplyTone(tone)}
                  className="capitalize"
                >
                  {tone}
                </Button>
              ))}
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-sm text-gray-700">
                {mockSuggestedReplies[suggestedReplyTone]?.content}
              </p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Use This Reply
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
