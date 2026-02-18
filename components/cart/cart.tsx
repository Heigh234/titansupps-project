'use client'

import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Minus, Plus, ShoppingBag, Mail, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { CheckoutDialog } from './checkout-dialog'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'

export function Cart() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [verifyPromptOpen, setVerifyPromptOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const totalPrice = getTotalPrice()

  const handleFinishPurchase = () => {
    if (!session?.user?.emailVerified) {
      setVerifyPromptOpen(true)
      return
    }
    setCheckoutOpen(true)
    toggleCart()
  }

  const handleGoVerify = () => {
    setVerifyPromptOpen(false)
    toggleCart()
    router.push('/auth/verify')
  }

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in" onClick={toggleCart} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col animate-slide-in-right shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-neon" />
                <h2 className="text-2xl font-bold">Your Cart</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleCart} aria-label="Cerrar carrito">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-500 mb-4" />
                  <p className="text-xl font-semibold text-gray-300">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-2">Add supplements to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-background/50 rounded-lg p-4 border border-border/50">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-card flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{item.name}</h3>
                        <p className="text-neon font-bold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Reducir cantidad"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Aumentar cantidad"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}>
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="ml-auto text-red-400 hover:text-red-300"
                            onClick={() => removeItem(item.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-neon">{formatPrice(totalPrice)}</span>
                </div>
                <Button className="w-full btn-primary text-lg py-6" onClick={handleFinishPurchase}>
                  Checkout {formatPrice(totalPrice)}
                </Button>
                <Button variant="outline" className="w-full py-5" onClick={toggleCart}>
                  Continue shopping
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Dialogo Verificación (Mantenido igual) */}
      <Dialog.Root open={verifyPromptOpen} onOpenChange={setVerifyPromptOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-2xl p-10 z-50 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-yellow-500/15 border-2 border-yellow-500 flex items-center justify-center">
                  <Mail className="w-9 h-9 text-yellow-400" />
                </div>
              </div>
              <div>
                <Dialog.Title className="text-2xl font-bold mb-3">Verify your email</Dialog.Title>
                <p className="text-gray-300 text-sm leading-relaxed">
                  To make a purchase you need to verify your email first.
                  It's a quick process that only takes a minute.
                </p>
              </div>
              <div className="bg-background/60 rounded-xl p-4 border border-border">
                <p className="text-xs text-gray-400 mb-1">Your email</p>
                <p className="font-semibold text-white truncate">{session?.user?.email}</p>
              </div>
              <div className="space-y-3">
                <Button onClick={handleGoVerify} className="w-full btn-primary py-5 gap-2">
                  Verify my email <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => setVerifyPromptOpen(false)} className="w-full py-5">
                  Not now
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  )
}
