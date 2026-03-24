'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Zap, BarChart3, Shield, Users, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600">
            MP
          </div>
          <span className="text-xl font-bold">MailPulse</span>
        </div>
        <Link href="/login">
          <Button variant="secondary" className="text-blue-600 hover:bg-white/90">
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Email Intelligence<br />Powered by AI
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
          MailPulse transforms your inbox with intelligent categorization, sentiment analysis, and AI-powered insights. Work smarter, respond faster.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Link href="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
            Learn More
          </Button>
        </div>

        {/* Demo Screenshot */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-8 border border-white/20 shadow-2xl">
          <div className="bg-gray-900 rounded-lg p-8 text-gray-400 text-sm">
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/5 backdrop-blur py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: 'Smart Inbox',
                description: 'Automatically categorize and prioritize emails with AI-powered classification',
              },
              {
                icon: Zap,
                title: 'AI Automation',
                description: 'Create intelligent rules that learn from your behavior patterns',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Track email metrics, response times, and team performance',
              },
              {
                icon: Shield,
                title: 'Sentiment Analysis',
                description: 'Understand email tone and detect urgent messages automatically',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Share insights, delegate emails, and manage team workload',
              },
              {
                icon: Zap,
                title: 'Smart Suggestions',
                description: 'Get AI-powered reply suggestions tailored to each email',
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to transform your inbox?</h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of professionals using MailPulse to manage their email smarter.
        </p>
        <Link href="/login">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Start Free Trial
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-blue-100 text-sm">
          <p>&copy; 2024 MailPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
