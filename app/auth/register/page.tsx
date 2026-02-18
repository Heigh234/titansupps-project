'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Dumbbell, Loader2, Eye, EyeOff } from 'lucide-react'
import { getEmailDomainError } from '@/lib/email-validation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Validate email domain
    const emailErr = getEmailDomainError(formData.email)
    if (emailErr) {
      setEmailError(emailErr)
      return
    }

    // Only letters and spaces allowed in name
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
    if (!nameRegex.test(formData.name.trim())) {
      setError('Name can only contain letters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error creating account')
        setLoading(false)
        return
      }

      // Auto login after register
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      router.push('/')
      router.refresh()
    } catch {
      setError('Error creating account')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
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
          <h1 className="text-2xl font-bold mt-6 mb-2">Create account</h1>
          <p className="text-gray-300">Join the TitanSupps community</p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              {/* Vinculado label con input id="name" */}
              <label htmlFor="name" className="block text-sm font-semibold mb-2">Full name</label>
              <input
                id="name"
                type="text"
                required
                className="input"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value
                  // Only allow letters, spaces and accented characters
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(val)) {
                    setFormData({ ...formData, name: val })
                  }
                }}
              />
            </div>

            <div>
              {/* Vinculado label con input id="email" */}
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
              <input
                id="email"
                type="email"
                required
                className={`input ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setEmailError('')
                }}
                onBlur={(e) => {
                  const err = getEmailDomainError(e.target.value)
                  if (err) setEmailError(err)
                }}
              />
              {emailError && (
                <p className="text-red-400 text-xs mt-2">{emailError}</p>
              )}
            </div>

            <div>
              {/* Vinculado label con input id="password" */}
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pr-12"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {/* Ojo mejorado con aria-label y área táctil grande (p-2) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              {/* Vinculado label con input id="confirmPassword" */}
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirm password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pr-12"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {/* Ojo extra para el confirm password (opcional, pero buena UX), con accesibilidad */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña de confirmación" : "Mostrar contraseña de confirmación"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-6 text-lg mt-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" />Creating account...</>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-gray-300 mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-neon font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
