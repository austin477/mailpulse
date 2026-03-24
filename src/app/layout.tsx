import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MailPulse - AI-Powered Email Intelligence',
  description: 'Intelligent email management and analysis platform powered by AI',
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
