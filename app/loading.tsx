import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-neon animate-spin mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
