'use client'

import { useState, useEffect } from 'react'
import { Email } from '@/types/email'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Loader2,
  Copy,
  Check,
  FileText,
  Clock,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  Send,
} from 'lucide-react'

interface AIAnalysisPanelProps {
  email: Email
  onUseReply?: (content: string) => void
}

interface EmailSummary {
  tldr: string
  keyPoints: string[]
  deadlines: string[]
  questions: string[]
}

type ToneType = 'professional' | 'friendly' | 'concise' | 'detailed'

export function AIAnalysisPanel({ email, onUseReply }: AIAnalysisPanelProps) {
  const [summary, setSummary] = useState<EmailSummary | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [suggestedReply, setSuggestedReply] = useState<string | null>(null)
  const [activeTone, setActiveTone] = useState<ToneType | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showFullReply, setShowFullReply] = useState(false)

  // Auto-summarize when email changes
  useEffect(() => {
    setSummary(null)
    setSuggestedReply(null)
    setActiveTone(null)
    setCopied(false)
    setShowFullReply(false)

    if (email.body && email.body.length > 50) {
      handleSummarize()
    }
  }, [email.id])

  const handleSummarize = async () => {
    setIsSummarizing(true)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: email.subject,
          body: email.body,
          from: email.from,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSummary({
          tldr: data.tldr || '',
          keyPoints: data.keyPoints || [],
          deadlines: data.deadlines || [],
          questions: data.questions || [],
        })
      }
    } catch (err) {
      console.error('Summary error:', err)
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleGenerateReply = async (tone: ToneType) => {
    setActiveTone(tone)
    setIsGenerating(true)
    setCopied(false)
    setShowFullReply(false)

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: email.subject,
          body: email.body,
          from: email.from,
          tone,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSuggestedReply(data.suggestion)
        setShowFullReply(true)
      }
    } catch (err) {
      console.error('Reply generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (suggestedReply) {
      await navigator.clipboard.writeText(suggestedReply)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* TLDR Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-900">AI Summary</h3>
        </div>

        {isSummarizing ? (
          <div className="flex items-center gap-2 py-3">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-sm text-blue-700">Analyzing email...</span>
          </div>
        ) : summary ? (
          <div className="space-y-3">
            {/* TLDR */}
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              {summary.tldr}
            </p>

            {/* Key Points */}
            {summary.keyPoints.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Key Points</p>
                <ul className="space-y-1">
                  {summary.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-400 mt-0.5">&#8226;</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deadlines */}
            {summary.deadlines.length > 0 && (
              <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800">Deadlines</span>
                </div>
                {summary.deadlines.map((d, i) => (
                  <p key={i} className="text-xs text-amber-700 ml-5">{d}</p>
                ))}
              </div>
            )}

            {/* Questions to Answer */}
            {summary.questions.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-800">Questions to Answer</span>
                </div>
                {summary.questions.map((q, i) => (
                  <p key={i} className="text-xs text-purple-700 ml-5">&#8226; {q}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSummarize}
              className="text-blue-600 hover:text-blue-700"
            >
              <FileText className="w-4 h-4 mr-1" />
              Summarize this email
            </Button>
          </div>
        )}
      </div>

      {/* Smart Reply */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-900">Smart Reply</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {([
              { tone: 'professional' as ToneType, label: 'Professional', emoji: '💼' },
              { tone: 'friendly' as ToneType, label: 'Friendly', emoji: '😊' },
              { tone: 'concise' as ToneType, label: 'Concise', emoji: '⚡' },
              { tone: 'detailed' as ToneType, label: 'Detailed', emoji: '📝' },
            ]).map(({ tone, label, emoji }) => (
              <button
                key={tone}
                onClick={() => handleGenerateReply(tone)}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTone === tone
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Reply */}
        {isGenerating && (
          <div className="p-4 bg-gray-50 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span className="text-sm text-gray-600">Drafting reply...</span>
          </div>
        )}

        {!isGenerating && suggestedReply && showFullReply && (
          <div className="p-4 space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {suggestedReply}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5 text-green-600" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </Button>
              <Button
                onClick={() => onUseReply?.(suggestedReply)}
                size="sm"
                className="flex-1 gap-1.5 bg-indigo-600 hover:bg-indigo-700"
              >
                <Send className="w-3.5 h-3.5" />
                Use Reply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="flex flex-wrap gap-2">
        {email.priority && email.priority !== 'medium' && (
          <Badge className={`text-xs ${
            email.priority === 'critical' ? 'bg-red-100 text-red-700' :
            email.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {email.priority === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {email.priority}
          </Badge>
        )}
        {email.labels?.filter(l =>
          !['INBOX', 'UNREAD', 'IMPORTANT', 'SENT', 'STARRED', 'DRAFT',
            'CATEGORY_PERSONAL', 'CATEGORY_UPDATES', 'CATEGORY_SOCIAL',
            'CATEGORY_PROMOTIONS', 'CATEGORY_FORUMS'].includes(l)
        ).map(label => (
          <Badge key={label} variant="outline" className="text-xs">
            {label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
