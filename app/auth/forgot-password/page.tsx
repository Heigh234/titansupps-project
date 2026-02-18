'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dumbbell, Loader2, Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import { getEmailDomainError } from '@/lib/email-validation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const domainErr = getEmailDomainError(email)
    if (domainErr) {
      setEmailError(domainErr)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-neon/20 animate-ping opacity-40" />
            <div className="w-20 h-20 rounded-full bg-neon/15 border-2 border-neon flex items-center justify-center relative">
              <Mail className="w-10 h-10 text-neon" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Email sent!</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              If an account exists with <span className="text-white font-semibold">{email}</span>,
              you'll receive a code to reset your password in the next few minutes.
            </p>
          </div>
          <Button
            onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)}
            className="w-full btn-primary py-5 gap-2"
          >
            Enter the code <ArrowRight className="w-4 h-4" />
          </Button>
          <Link href="/auth/login" className="block text-sm text-gray-400 hover:text-neon transition-colors">
            ← Back to login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-neon rounded-xl flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-background" />
            </div>
            <span className="text-3xl font-black">
              TITAN<span className="text-neon">SUPPS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Forgot your password?</h1>
          <p className="text-gray-400 text-sm">
            Enter your email and we'll send you a code to reset it
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Email address</label>
              <input
                type="email"
                required
                className={`input ${emailError ? 'border-red-500' : ''}`}
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                onBlur={(e) => {
                  const err = getEmailDomainError(e.target.value)
                  if (err) setEmailError(err)
                }}
              />
              {emailError && <p className="text-red-400 text-xs mt-2">{emailError}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full btn-primary py-6 text-lg">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" />Sending code...</>
              ) : (
                'Send recovery code'
              )}
            </Button>
          </form>

          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </main>
  )
}
