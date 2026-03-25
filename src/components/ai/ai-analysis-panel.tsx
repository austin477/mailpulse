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
  Loader2,
} from 'lucide-react'

interface AIAnalysisPanelProps {
  email: Email
}

export function AIAnalysisPanel({ email }: AIAnalysisPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['actionItems'])
  )
  const [suggestedReplyTone, setSuggestedReplyTone] = useState<'professional' | 'friendly' | 'concise' | 'detailed'>('professional')
  const [suggestedReplyContent, setSuggestedReplyContent] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const toggleSection = (section: string) => {
    const next = new Set(expandedSections)
    if (next.has(section)) {
      next.delete(section)
    } else {
      next.add(section)
    }
    setExpandedSections(next)
  }

  const generateSuggestedReply = async (tone: 'professional' | 'friendly' | 'concise' | 'detailed') => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: email.subject,
          body: email.body,
          from: email.from,
          tone: tone,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSuggestedReplyContent(result.suggestion)
      } else {
        console.error('Failed to generate reply suggestion')
      }
    } catch (error) {
      console.error('Error generating reply:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleToneChange = async (tone: 'professional' | 'friendly' | 'concise' | 'detailed') => {
    setSuggestedReplyTone(tone)
    await generateSuggestedReply(tone)
  }

  const handleUseSuggestedReply = () => {
    if (suggestedReplyContent) {
      // This could trigger a compose modal or redirect to compose page with pre-filled content
      // For now, we'll just copy to clipboard
      navigator.clipboard.writeText(suggestedReplyContent).then(() => {
        alert('Suggested reply copied to clipboard!')
      })
    }
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
                  onClick={() => handleToneChange(tone)}
                  disabled={isGenerating}
                  className="capitalize"
                >
                  {tone}
                </Button>
              ))}
            </div>

            {isGenerating && (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded border border-gray-200">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                <p className="text-sm text-gray-600">Generating suggestion...</p>
              </div>
            )}

            {!isGenerating && suggestedReplyContent && (
              <>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-700">
                    {suggestedReplyContent}
                  </p>
                </div>

                <Button
                  onClick={handleUseSuggestedReply}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Copy Reply
                </Button>
              </>
            )}

            {!isGenerating && !suggestedReplyContent && (
              <p className="text-sm text-gray-600 text-center p-4">
                Click a tone button to generate a suggested reply
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
