'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dumbbell, CheckCircle, Loader2, RefreshCw, Mail } from 'lucide-react'

export default function VerifyPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // Redirect if already verified
  useEffect(() => {
    if (session?.user?.emailVerified) {
      router.push('/')
    }
  }, [session])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Numbers only
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError('')
    // Auto-focus next
    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    pasted.split('').forEach((char, i) => { newCode[i] = char })
    setCode(newCode)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSendCode = async () => {
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-verification', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCountdown(60) // 60s before can resend
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Enter all 6 digits of the code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Update session to reflect verified status
      await update({ emailVerified: true })
      setSuccess(true)

      setTimeout(() => router.push('/'), 2500)
    } catch (err: any) {
      setError(err.message)
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-neon/20 animate-ping opacity-50" />
            <div className="w-24 h-24 rounded-full bg-neon/15 border-2 border-neon flex items-center justify-center relative">
              <CheckCircle className="w-12 h-12 text-neon" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black mb-2">Email verified!</h1>
            <p className="text-gray-400">Your account is fully active. Redirecting...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
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
          <div className="mt-6 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-neon" />
            <h1 className="text-2xl font-bold">Verify your email</h1>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            We'll send a 6-digit code to<br />
            <span className="text-white font-semibold">{session?.user?.email}</span>
          </p>
        </div>

        <div className="card p-8 space-y-8">
          {/* Send code button */}
          <Button
            onClick={handleSendCode}
            disabled={sending || countdown > 0}
            className="w-full btn-primary py-5"
          >
            {sending ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" />Sending...</>
            ) : countdown > 0 ? (
              <><RefreshCw className="w-4 h-4 mr-2" />Resend in {countdown}s</>
            ) : (
              <><Mail className="w-5 h-5 mr-2" />Send verification code</>
            )}
          </Button>

          {/* Code input */}
          <div className="space-y-4">
            <p className="text-sm text-gray-400 text-center">
              Enter the code received in your email
            </p>
            <div className="flex gap-3 justify-center">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-2xl font-bold bg-background border-2 border-border rounded-xl
                             focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20
                             transition-all duration-200 text-white"
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {/* Verify button */}
          <Button
            onClick={handleVerify}
            disabled={loading || code.join('').length !== 6}
            className="w-full btn-primary py-5"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" />Verifying...</>
            ) : (
              'Verify account'
            )}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Already verified?{' '}
            <Link href="/" className="text-neon hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
