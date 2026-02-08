import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import { ToastProvider } from '@/components/ToastProvider'
import EasterEggs from '@/components/EasterEggs'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const siteUrl = 'https://devgathering.in'
const siteName = 'DevGathering'
const siteDescription = 'India\'s premier in-person developer community. Join exclusive meetups, hackathons, and networking events designed for software engineers, indie hackers, and tech enthusiasts. Connect with top developers in Bangalore, Mumbai, Delhi, and cities across India.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DevGathering — Where Developers Connect | India\'s Developer Community',
    template: '%s | DevGathering'
  },
  description: siteDescription,
  keywords: [
    'developer community India', 'tech meetups India', 'developer events Bangalore',
    'software engineer networking', 'hackathons India', 'indie hackers India',
    'programming meetups', 'tech community', 'developer conferences',
    'coding events', 'tech networking', 'software developers India',
    'startup community', 'web developers meetup', 'full stack developers',
    'DevGathering', 'developer gathering', 'tech talks India'
  ],
  authors: [{ name: 'DevGathering Team', url: siteUrl }],
  creator: 'DevGathering',
  publisher: 'DevGathering',
  formatDetection: { email: false, telephone: false, address: false },

  // OpenGraph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName,
    title: 'DevGathering — Where Developers Connect',
    description: siteDescription,
    images: [{ url: '/icon.png', width: 512, height: 512, alt: 'DevGathering Logo' }],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'DevGathering — Where Developers Connect',
    description: siteDescription,
    images: ['/icon.png'],
    creator: '@devgathering',
  },

  // Favicon & Icons
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icon.png', sizes: '180x180', type: 'image/png' }],
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add actual codes when available)
  // verification: { google: 'xxx', yandex: 'xxx' },

  // Canonical
  alternates: { canonical: siteUrl },

  // Category
  category: 'technology',
}

// JSON-LD Structured Data for rich search results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DevGathering',
  description: siteDescription,
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@devgathering.in',
    contactType: 'customer service',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  knowsAbout: ['Software Development', 'Programming', 'Web Development', 'Developer Communities', 'Tech Meetups'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* 
        Nice! You're inspecting the source 👀
        You're definitely one of us.
        
        Looking to get involved? → hello@devgathering.in
        
        P.S. Try pressing ↑↓↑↓←→←→ on the site...
      */}
      <SmoothScroll />
      <body>
        <ToastProvider>
          {children}
          <EasterEggs />
        </ToastProvider>
      </body>
    </html>
  )
}
