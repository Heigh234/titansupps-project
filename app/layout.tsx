import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Navigation } from '@/components/navigation'
import { Cart } from '@/components/cart/cart'
import { SessionProvider } from '@/components/auth/session-provider'

export const metadata: Metadata = {
  title: 'TitanSupps - Premium Gym Supplements',
  description: 'Fuel your gains with premium supplements designed for champions.',
  keywords: ['supplements', 'protein', 'pre-workout', 'gym', 'fitness'],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'TitanSupps - Premium Gym Supplements',
    description: 'Fuel your gains with premium supplements',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="noise-bg">
        <SessionProvider>
          <Navigation />
          {children}
          <Cart />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
