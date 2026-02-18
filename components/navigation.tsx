'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, Dumbbell, User, LogOut, LogIn, Shield } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSession, signOut } from 'next-auth/react'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { getTotalItems, toggleCart } = useCartStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  const totalItems = getTotalItems()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    ...(session?.user?.isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ]

  const handleCartClick = () => {
    if (!session) {
      router.push('/auth/login?callbackUrl=/')
      return
    }
    toggleCart()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Ir al inicio">
            <div className="w-10 h-10 bg-neon rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6 text-background" />
            </div>
            <span className="text-2xl font-black">TITAN<span className="text-neon">SUPPS</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={cn('text-sm font-semibold uppercase tracking-wider transition-colors hover:text-neon',
                  pathname === link.href ? 'text-neon' : 'text-gray-300')}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Botón de carrito con aria-label */}
            <Button variant="ghost" size="icon" onClick={handleCartClick} className="relative" aria-label="Abrir carrito de compras">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && session && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon text-background text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            <div className="hidden md:block relative">
              {session ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="Abrir menú de usuario"
                    className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 hover:border-neon/50 transition-all">
                    <div className="w-7 h-7 bg-neon rounded-full flex items-center justify-center">
                      {session.user.isAdmin
                        ? <Shield className="w-4 h-4 text-background" />
                        : <User className="w-4 h-4 text-background" />}
                    </div>
                    <span className="text-sm font-semibold max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm font-semibold truncate">{session.user.email}</p>
                          
                          {/* Lógica de administrador y verificación actualizada */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {session.user.isAdmin ? (
                              <span className="inline-block px-2 py-0.5 bg-neon/20 border border-neon/40 rounded text-neon text-xs font-bold">
                                ADMIN
                              </span>
                            ) : (
                              <>
                                {session.user.emailVerified ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded text-green-400 text-xs font-semibold">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Email verified
                                  </span>
                                ) : (
                                  <a href="/auth/verify" className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded text-yellow-400 text-xs font-semibold hover:bg-yellow-500/30 transition-colors">
                                    ⚠ Verify email
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                          
                        </div>
                        <button onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" />Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Botón de menú móvil con aria-label */}
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className={cn('block text-lg font-semibold uppercase tracking-wider transition-colors hover:text-neon',
                  pathname === link.href ? 'text-neon' : 'text-gray-300')}>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              {session ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Signed in: <span className="text-white">{session.user.email}</span></p>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-red-400 font-semibold">
                    <LogOut className="w-5 h-5" />Sign out
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-neon font-semibold">
                  <LogIn className="w-5 h-5" />Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
