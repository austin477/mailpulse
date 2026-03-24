'use client'

import { useState, useEffect } from 'react'
import { EmailList } from '@/components/email/email-list'
import { EmailDetail } from '@/components/email/email-detail'
import { Email } from '@/types/email'
import { useEmailStore } from '@/stores/email-store'

// Mock email data
const mockEmails: Email[] = [
  {
    id: '1',
    messageId: 'msg1',
    threadId: 'thread1',
    from: 'john.doe@acme.com',
    to: ['user@company.com'],
    cc: [],
    bcc: [],
    subject: 'Urgent: Project Timeline Changes',
    body: 'Hi,\n\nWe need to discuss the project timeline changes. The deadline has been moved up by two weeks. Please review the attached document and let me know your thoughts.\n\nBest regards,\nJohn',
    timestamp: new Date(),
    isRead: false,
    isStarred: false,
    isDraft: false,
    hasAttachments: true,
    labels: ['important'],
    category: 'work',
    priority: 'critical',
    sentiment: 'urgent',
    attachments: [
      { id: 'att1', filename: 'timeline.pdf', mimeType: 'application/pdf', size: 245678 },
    ],
    userEmail: 'user@company.com',
    aiAnalysis: {
      summary: 'Project deadline moved up by 2 weeks, requires immediate review',
      actionItems: ['Review timeline document', 'Coordinate with team', 'Confirm feasibility'],
      suggestedReplies: [],
      sentiment: 'urgent',
      priority: 'critical',
      category: 'work',
      extractedEntities: {
        names: ['John'],
        dates: ['2 weeks'],
        companies: ['ACME'],
        topics: ['Project Timeline', 'Deadline'],
      },
    },
  },
  {
    id: '2',
    messageId: 'msg2',
    threadId: 'thread2',
    from: 'sarah.smith@company.com',
    to: ['user@company.com'],
    cc: [],
    bcc: [],
    subject: 'Team Meeting - Weekly Sync',
    body: 'Hi,\n\nReminder about our weekly sync meeting today at 3 PM. We\'ll cover:\n1. Q3 Performance Review\n2. Upcoming Projects\n3. Team Updates\n\nLooking forward to seeing everyone there!\n\nSarah',
    timestamp: new Date(Date.now() - 3600000),
    isRead: false,
    isStarred: false,
    isDraft: false,
    hasAttachments: false,
    labels: ['meeting'],
    category: 'work',
    priority: 'high',
    sentiment: 'neutral',
    attachments: [],
    userEmail: 'user@company.com',
  },
  {
    id: '3',
    messageId: 'msg3',
    threadId: 'thread3',
    from: 'support@service.io',
    to: ['user@company.com'],
    cc: [],
    bcc: [],
    subject: 'Your Support Ticket #12345 has been updated',
    body: 'Thank you for reporting this issue. Our technical team has reviewed your ticket and found a solution. Please check your account settings to implement the fix.\n\nBest regards,\nSupport Team',
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
    isStarred: false,
    isDraft: false,
    hasAttachments: false,
    labels: ['support'],
    category: 'support',
    priority: 'medium',
    sentiment: 'positive',
    attachments: [],
    userEmail: 'user@company.com',
  },
  {
    id: '4',
    messageId: 'msg4',
    threadId: 'thread4',
    from: 'marketing@brand.com',
    to: ['user@company.com'],
    cc: [],
    bcc: [],
    subject: 'New Campaign Results - February Report',
    body: 'Hi,\n\nAttached is the performance report for our February marketing campaign. Key highlights:\n\n- 15% increase in engagement\n- 23% higher click-through rate\n- 89% conversion rate improvement\n\nGreat work from the team!\n\nMarketing Team',
    timestamp: new Date(Date.now() - 86400000),
    isRead: true,
    isStarred: false,
    isDraft: false,
    hasAttachments: true,
    labels: [],
    category: 'work',
    priority: 'low',
    sentiment: 'positive',
    attachments: [
      { id: 'att2', filename: 'campaign_report.xlsx', mimeType: 'application/vnd.ms-excel', size: 523456 },
    ],
    userEmail: 'user@company.com',
  },
  {
    id: '5',
    messageId: 'msg5',
    threadId: 'thread5',
    from: 'cto@startup.io',
    to: ['user@company.com'],
    cc: ['dev@startup.io'],
    bcc: [],
    subject: 'Architecture Discussion - Microservices Approach',
    body: 'Team,\n\nI want to propose a shift to a microservices architecture for our next release. This would allow for better scalability and faster deployment cycles. Let\'s discuss the pros and cons in our meeting.\n\nThanks,\nCTO',
    timestamp: new Date(Date.now() - 172800000),
    isRead: true,
    isStarred: true,
    isDraft: false,
    hasAttachments: false,
    labels: ['technical'],
    category: 'work',
    priority: 'high',
    sentiment: 'neutral',
    attachments: [],
    userEmail: 'user@company.com',
  },
]

export default function InboxPage() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(mockEmails[0])

  const setEmails = useEmailStore((state) => state.setEmails)
  const filteredEmails = useEmailStore((state) => state.filteredEmails)

  // Initialize store with mock emails
  useEffect(() => {
    setEmails(mockEmails)
  }, [setEmails])

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-0 bg-white">
      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
        <EmailList
          emails={filteredEmails.length > 0 ? filteredEmails : mockEmails}
          selectedEmail={selectedEmail}
          onSelectEmail={setSelectedEmail}
        />
      </div>

      {/* Email Detail */}
      <div className="w-2/3 overflow-hidden">
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onArchive={() => {
              setSelectedEmail(null)
            }}
            onDelete={() => {
              setSelectedEmail(null)
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <p className="font-medium">Select an email to read</p>
              <p className="text-sm mt-2">Choose an email from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
