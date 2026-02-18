'use client'

import { useEffect, useState, useRef } from 'react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Status = 'processing' | 'success' | 'error'

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { data: session } = useSession()
  const [status, setStatus] = useState<Status>('processing')
  const [orderId, setOrderId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Ref guard prevents double execution in React StrictMode
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (!open) {
      // Reset for next time
      hasProcessed.current = false
      return
    }

    // Prevent double execution
    if (hasProcessed.current) return
    hasProcessed.current = true

    setStatus('processing')
    setOrderId('')
    setErrorMsg('')

    const process = async () => {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
            customerName: session?.user?.name || session?.user?.email || 'Customer',
            customerEmail: session?.user?.email,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setOrderId(data.orderId)
          setStatus('success')
          clearCart()
        } else {
          throw new Error(data.error || 'Error processing order')
        }
      } catch (error: any) {
        setErrorMsg(error.message || 'An unexpected error occurred')
        setStatus('error')
      }
    }

    process()
  }, [open])

  const handleClose = () => {
    // Only allow closing on error, never during processing or success
    // Success must be dismissed via the "Continue shopping" button
    if (status === 'processing' || status === 'success') return
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in ${status === 'processing' ? 'pointer-events-none' : ''}`} />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-2xl p-10 z-50 shadow-2xl">

          {/* PROCESSING */}
          {status === 'processing' && (
            <div className="text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-neon/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-neon animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-neon animate-spin" />
                </div>
              </div>
              <div>
                <Dialog.Title className="text-2xl font-bold mb-2">
                  Processing your order
                </Dialog.Title>
                <p className="text-gray-400 text-sm">
                  We're confirming your purchase, just a moment...
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-neon animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {status === 'success' && (
            <div className="text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-neon/20 animate-ping opacity-40" />
                <div className="relative w-20 h-20 rounded-full bg-neon/15 border-2 border-neon flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-neon" strokeWidth={2} />
                </div>
              </div>
              <div>
                <Dialog.Title className="text-2xl font-bold mb-2">
                  Purchase successful!
                </Dialog.Title>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your order was processed successfully.<br />
                  We've sent the receipt to your email.
                </p>
              </div>
              <div className="bg-background/60 rounded-xl p-4 border border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order number</span>
                  <span className="font-bold text-neon tracking-wider">
                    #{orderId.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Receipt sent to</span>
                  <span className="font-semibold truncate ml-4 max-w-[160px]">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
              <Button onClick={() => onOpenChange(false)} className="w-full btn-primary py-5">
                Continue shopping
              </Button>
            </div>
          )}

          {/* ERROR */}
          {status === 'error' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-500/15 border-2 border-red-500 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <Dialog.Title className="text-2xl font-bold mb-2">
                  Could not complete
                </Dialog.Title>
                <p className="text-gray-400 text-sm">{errorMsg}</p>
              </div>
              <Button onClick={handleClose} variant="outline" className="w-full py-5">
                Try again
              </Button>
            </div>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
