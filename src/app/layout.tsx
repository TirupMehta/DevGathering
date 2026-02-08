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

export const metadata: Metadata = {
  title: 'DevGathering',
  description: 'In-person developer events.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
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
