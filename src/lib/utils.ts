import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function formatDateFull(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'negative':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'urgent':
      return 'bg-purple-100 text-purple-800 border-purple-300'
    case 'neutral':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    work: 'bg-blue-100 text-blue-800 border-blue-300',
    personal: 'bg-purple-100 text-purple-800 border-purple-300',
    sales: 'bg-green-100 text-green-800 border-green-300',
    support: 'bg-orange-100 text-orange-800 border-orange-300',
    inbox: 'bg-gray-100 text-gray-800 border-gray-300',
  }
  return colors[category] || colors.inbox
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function extractDomain(email: string): string {
  const match = email.match(/@([^@]+)/)
  return match ? match[1] : ''
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function htmlToText(html: string): string {
  const temp = new DOMParser().parseFromString(html, 'text/html')
  return temp.body.textContent || ''
}

export function getEmailPreview(body: string, length: number = 100): string {
  return truncate(body.replace(/\n/g, ' ').replace(/\s+/g, ' '), length)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
