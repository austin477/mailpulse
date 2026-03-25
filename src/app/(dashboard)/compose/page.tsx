'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Paperclip, Smile, AlertCircle, CheckCircle, Loader2, Sparkles, Save } from 'lucide-react'

const TEMPLATES: Record<string, { subject: string; body: string }> = {
  'Follow Up': {
    subject: 'Following up',
    body: 'Hi,\n\nI wanted to follow up on our previous conversation. Please let me know if you have any updates or if there\'s anything else I can help with.\n\nBest regards',
  },
  'Meeting Request': {
    subject: 'Meeting Request',
    body: 'Hi,\n\nI\'d like to schedule a meeting to discuss the following topics:\n\n1. \n2. \n\nPlease let me know your availability this week.\n\nBest regards',
  },
  'Thank You': {
    subject: 'Thank You',
    body: 'Hi,\n\nThank you for your time and assistance. I really appreciate your help with this matter.\n\nBest regards',
  },
  'Out of Office': {
    subject: 'Out of Office',
    body: 'Hi,\n\nThank you for your email. I am currently out of the office and will return on [date]. I will have limited access to email during this time.\n\nFor urgent matters, please contact [name] at [email].\n\nBest regards',
  },
}

export default function ComposePage() {
  const router = useRouter()
  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!to.trim()) {
      newErrors.to = 'Recipient email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim())) {
      newErrors.to = 'Please enter a valid email address'
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!body.trim()) {
      newErrors.body = 'Message body is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSend = async () => {
    if (!validateForm()) return

    setIsSending(true)
    setMessage(null)

    try {
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to.trim(),
          cc: cc.trim(),
          subject: subject.trim(),
          body: body.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: result.error || 'Failed to send email' })
        return
      }

      setMessage({ type: 'success', text: 'Email sent successfully!' })
      setTimeout(() => {
        setTo('')
        setCc('')
        setBcc('')
        setSubject('')
        setBody('')
        setIsExpanded(false)
        setMessage(null)
        router.push('/inbox')
      }, 1500)
    } catch (error) {
      console.error('Send error:', error)
      setMessage({ type: 'error', text: 'An error occurred while sending the email' })
    } finally {
      setIsSending(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!subject.trim() && !body.trim()) {
      setMessage({ type: 'error', text: 'Add a subject or body to save as draft' })
      return
    }

    setIsSavingDraft(true)
    setMessage(null)

    try {
      const response = await fetch('/api/gmail/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to.trim(),
          cc: cc.trim(),
          subject: subject.trim(),
          body: body.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to save draft')

      setMessage({ type: 'success', text: 'Draft saved!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Draft error:', error)
      setMessage({ type: 'error', text: 'Failed to save draft' })
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleEnhance = async (tone: string = 'professional') => {
    if (!body.trim()) return

    setIsEnhancing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim(), tone }),
      })

      if (!response.ok) throw new Error('Enhancement failed')

      const result = await response.json()
      setBody(result.enhanced)
      setMessage({ type: 'success', text: `Email enhanced with ${tone} tone!` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Enhance error:', error)
      setMessage({ type: 'error', text: 'AI enhancement failed. Please try again.' })
    } finally {
      setIsEnhancing(false)
    }
  }

  const applyTemplate = (name: string) => {
    const template = TEMPLATES[name]
    if (template) {
      setSubject(template.subject)
      setBody(template.body)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Compose Email</h1>
        <p className="text-gray-600 mt-2">Create and send a new email message</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Message</CardTitle>
          <CardDescription>Draft a professional email with AI suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          {message && (
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message.text}
              </p>
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => {
                setTo(e.target.value)
                if (errors.to) setErrors({ ...errors, to: '' })
              }}
              className={errors.to ? 'border-red-500' : ''}
            />
            {errors.to && <p className="text-sm text-red-600 mt-1">{errors.to}</p>}
          </div>

          {isExpanded && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cc</label>
                <Input
                  placeholder="cc@example.com"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bcc</label>
                <Input
                  placeholder="bcc@example.com"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                />
              </div>
            </>
          )}

          {!isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              + Add Cc, Bcc
            </Button>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                if (errors.subject) setErrors({ ...errors, subject: '' })
              }}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject}</p>}
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Write your message here..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                if (errors.body) setErrors({ ...errors, body: '' })
              }}
              className={`min-h-96 resize-none ${errors.body ? 'border-red-500' : ''}`}
            />
            {errors.body && <p className="text-sm text-red-600 mt-1">{errors.body}</p>}
          </div>

          {/* AI Enhancement */}
          {body.length > 30 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">
                ✨ AI Tone Enhancement
              </p>
              <p className="text-sm text-blue-800 mb-3">
                Let AI refine your message tone:
              </p>
              <div className="flex flex-wrap gap-2">
                {['professional', 'friendly', 'concise', 'formal'].map((tone) => (
                  <Button
                    key={tone}
                    size="sm"
                    variant="outline"
                    className="text-xs capitalize"
                    disabled={isEnhancing}
                    onClick={() => handleEnhance(tone)}
                  >
                    {isEnhancing ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    {tone}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Attach file">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert emoji">
              <Smile className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
            <span className="text-xs text-gray-500">{body.length} characters</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSend}
              disabled={!to || !subject || isSending}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSending ? 'Sending...' : 'Send'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="gap-2"
            >
              {isSavingDraft ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          {/* Quick Templates */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Templates</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(TEMPLATES).map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => applyTemplate(template)}
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
