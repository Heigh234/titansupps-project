'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dumbbell, Loader2, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError('')
    if (value && index < 5) inputs.current[index + 1]?.focus()
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

  const handleResend = async () => {
    setResending(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromUrl }),
      })
      setCountdown(60)
    } finally {
      setResending(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Enter all 6 digits of the code')
      return
    }

    setLoading(true)

    try {
      // Verify the code without changing password yet
      const res = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromUrl, code: fullCode }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Code valid — go to new password page
      router.push(`/auth/new-password?email=${encodeURIComponent(emailFromUrl)}&code=${fullCode}`)
    } catch (err: any) {
      setError(err.message)
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
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
          <div className="mt-6 flex items-center justify-center gap-2">
            <KeyRound className="w-5 h-5 text-neon" />
            <h1 className="text-2xl font-bold">Enter the code</h1>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            We sent a 6-digit code to<br />
            <span className="text-white font-semibold">{emailFromUrl}</span>
          </p>
        </div>

        <div className="card p-8 space-y-7">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-7">
            {/* Code boxes */}
            <div className="space-y-4">
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
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || countdown > 0}
                  className="text-xs text-gray-400 hover:text-neon transition-colors disabled:opacity-50 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full btn-primary py-6 text-lg"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" />Verifying...</>
              ) : (
                'Verify code'
              )}
            </Button>
          </form>

          <Link
            href="/auth/forgot-password"
            className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>
    </main>
  )
}
