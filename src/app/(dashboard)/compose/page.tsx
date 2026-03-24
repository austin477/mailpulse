'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Send, Paperclip, Type, Smile } from 'lucide-react'

export default function ComposePage() {
  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setTo('')
      setCc('')
      setSubject('')
      setBody('')
      setIsExpanded(false)
    }, 1000)
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
          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <Input
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {isExpanded && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cc
                </label>
                <Input
                  placeholder="cc@example.com"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bcc
                </label>
                <Input placeholder="bcc@example.com" />
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
              Subject
            </label>
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <Textarea
              placeholder="Write your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-96 resize-none"
            />
          </div>

          {/* AI Suggestion */}
          {body.length > 50 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">
                ✨ AI Suggestion: Tone Enhancement
              </p>
              <p className="text-sm text-blue-800">
                Your message could be more professional. Would you like me to rewrite it?
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Enhance
                </Button>
                <Button size="sm" variant="ghost" className="text-xs">
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Type className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
              <Send className="w-4 h-4" />
              {isSending ? 'Sending...' : 'Send'}
            </Button>
            <Button variant="outline">
              Save Draft
            </Button>
            <Button variant="ghost">
              Cancel
            </Button>
          </div>

          {/* Quick Templates */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Templates</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Follow Up',
                'Meeting Request',
                'Thank You',
                'Out of Office',
              ].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSubject(`Re: ${template}`)}
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
