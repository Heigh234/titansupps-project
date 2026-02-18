import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-black text-neon mb-4 animate-pulse-glow">
            404
          </h1>
          <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-400">
            Looks like this page took a rest day. Let's get you back to lifting!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="btn-primary">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="btn-secondary">
              <Search className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="mt-16 flex justify-center gap-4">
          <div className="w-16 h-1 bg-neon rounded-full animate-pulse" />
          <div className="w-16 h-1 bg-neon/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-16 h-1 bg-neon/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </main>
  )
}
