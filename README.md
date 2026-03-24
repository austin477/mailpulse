# MailPulse - AI-Powered Email Intelligence Platform

MailPulse is a modern, full-featured email management application built with Next.js 14, TypeScript, and Tailwind CSS. It leverages AI to provide intelligent email categorization, sentiment analysis, and productivity features.

## Features

### Core Email Management
- **Smart Inbox** - Automatically categorize and prioritize emails
- **Email Filtering** - Advanced search and filter by category, priority, sentiment, and more
- **Thread View** - Read complete email conversations in context
- **Bulk Actions** - Archive, tag, and manage multiple emails at once

### AI-Powered Intelligence
- **Email Analysis** - Automatic categorization into work, personal, sales, or support
- **Priority Detection** - Identifies critical and urgent emails
- **Sentiment Analysis** - Understand email tone (positive, neutral, negative, urgent)
- **Reply Suggestions** - AI-generated reply suggestions with multiple tone options
- **Action Item Extraction** - Automatically identify and list action items

### Dashboard & Analytics
- **Real-time Dashboard** - View key metrics at a glance
- **Detailed Analytics** - Email volume trends, category breakdown, sentiment distribution
- **Response Time Tracking** - Monitor average response times and SLA compliance
- **Heatmaps** - Visualize email activity patterns by hour and day

### Team Collaboration
- **Team Management** - Invite team members and manage roles
- **Audit Logs** - Track all team activities and changes
- **Automation Rules** - Create intelligent workflows for email management
- **Shared Insights** - Share email analytics and insights with the team

### Automation & Integration
- **Custom Rules** - Build automation rules based on sender, keywords, or patterns
- **Email Integrations** - Connect Gmail and other email providers
- **Webhook Support** - Integrate with external tools and services
- **Tracking** - Email open tracking and link click tracking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 5
- **Charts**: Recharts 3.8
- **Icons**: Lucide React
- **Database**: Supabase
- **APIs**:
  - Gmail API (via googleapis)
  - Anthropic Claude API for AI analysis
  - Google OAuth 2.0

## Project Structure

```
mailpulse-app/
├── src/
│   ├── app/
│   │   ├── (auth)/login/           # Login page
│   │   ├── (dashboard)/            # Dashboard layout
│   │   │   ├── dashboard/          # Main dashboard
│   │   │   ├── inbox/              # Email inbox
│   │   │   ├── compose/            # Email composer
│   │   │   ├── analytics/          # Analytics dashboard
│   │   │   ├── automation/         # Automation rules
│   │   │   ├── team/               # Team management
│   │   │   ├── audit/              # Audit logs
│   │   │   └── settings/           # Settings
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # Authentication
│   │   │   ├── gmail/              # Gmail integration
│   │   │   ├── ai/                 # AI analysis
│   │   │   └── tracking/           # Email tracking
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── layout/                 # Layout components
│   │   ├── email/                  # Email-specific components
│   │   ├── ai/                     # AI-related components
│   │   ├── analytics/              # Analytics components
│   │   └── dashboard/              # Dashboard components
│   ├── lib/
│   │   ├── supabase/               # Supabase utilities
│   │   ├── gmail/                  # Gmail API utilities
│   │   ├── ai/                     # Claude AI utilities
│   │   └── utils.ts                # Helper functions
│   ├── stores/                     # Zustand stores
│   └── types/                      # TypeScript types
├── public/                         # Static assets
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Google Cloud Console setup with Gmail API
- Anthropic API key

### Installation

1. Clone the repository:
```bash
cd mailpulse-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in your environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

Build for production:
```bash
npm run build
npm start
```

## Key Components

### Email Store (Zustand)
Central state management for emails, including:
- Email list with filtering and search
- Selected email tracking
- Bulk operations
- Unread count management

### UI Components
- `Button` - Variants: default, destructive, outline, secondary, ghost, link
- `Input` - Text input with validation
- `Card` - Container with header, content, footer
- `Badge` - Status and category labels
- `Dialog` - Modal dialogs
- `Select` - Dropdown selection
- `Checkbox` - Checkboxes for selection
- `Textarea` - Multi-line text input
- `Skeleton` - Loading placeholders

### Layout Components
- `Sidebar` - Dark sidebar with navigation
- `Header` - Top navigation bar with search
- `MobileNav` - Mobile navigation menu

### Email Components
- `EmailList` - Scrollable email list
- `EmailListItem` - Individual email preview
- `EmailDetail` - Full email view with reply options
- `EmailFilters` - Advanced filtering controls
- `EmailCompose` - Email composer

### AI Components
- `AIAnalysisPanel` - AI insights and suggestions
- `ActionItems` - Checklist of extracted action items
- `ThreadSummary` - AI-generated email summary

### Analytics Components
- `StatsCards` - Key metrics display
- `VolumeChart` - Email volume over time
- `CategoryBreakdown` - Email distribution by category
- `SentimentChart` - Sentiment distribution
- `ResponseTimeChart` - Response time trends

## API Routes

### Authentication
- `POST /api/auth/callback` - Google OAuth callback

### Gmail Integration
- `POST /api/gmail/sync` - Sync emails from Gmail
- `POST /api/gmail/send` - Send email via Gmail
- `POST /api/gmail/webhook` - Pub/Sub webhook handler

### AI Analysis
- `POST /api/ai/analyze` - Analyze email with Claude
- `POST /api/ai/suggest` - Generate reply suggestions

### Tracking
- `GET /api/tracking/pixel/[id]` - Email open tracking pixel
- `GET /api/tracking/click/[id]` - Link click tracking

## Database Schema

### Tables
- `users` - User accounts
- `email_accounts` - Connected email accounts
- `emails` - Email messages with AI analysis
- `teams` - Team organizations
- `team_members` - Team membership
- `automations` - Automation rules
- `audit_logs` - Activity logs

## Styling

The application uses Tailwind CSS with custom color schemes:

### Priority Colors
- Critical: `#ef4444` (red)
- High: `#f97316` (orange)
- Medium: `#eab308` (yellow)
- Low: `#22c55e` (green)

### Sentiment Colors
- Positive: `#22c55e` (green)
- Neutral: `#9ca3af` (gray)
- Negative: `#ef4444` (red)
- Urgent: `#a855f7` (purple)

## Performance Optimizations

- Server-side rendering with Next.js
- Client-side state management with Zustand
- Image optimization with Next.js Image
- CSS-in-JS with Tailwind CSS
- Component code splitting
- Lazy loading for charts and heavy components

## Security Features

- OAuth 2.0 authentication with Google
- Secure token storage in HTTP-only cookies
- Row-level security in Supabase
- API route authentication
- CSRF protection
- XSS prevention with React

## Future Enhancements

- Mobile app with React Native
- Advanced email scheduling
- Smart reply with context awareness
- Email template library
- Integration with more email providers
- Advanced search with natural language
- Offline support with service workers
- Real-time collaboration features
- Advanced reporting and insights

## License

MIT License - See LICENSE file for details

## Support

For support, please visit [support.mailpulse.app](https://support.mailpulse.app)
