'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'
import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ShoppingCart, Check, LogIn } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [added, setAdded] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleAddToCart = () => {
    // Redirect to login if not authenticated
    if (!session) {
      router.push(`/auth/login?callbackUrl=/products/${product.id}`)
      return
    }

    if (product.stock === 0) {
      toast({
        variant: 'destructive',
        title: 'Out of stock',
        description: 'This product is currently unavailable',
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    })

    setAdded(true)
    toast({
      variant: 'success',
      title: 'Added to cart!',
      description: `${product.name} was added`,
    })

    setTimeout(() => setAdded(false), 2000)
  }

  if (!session) {
    return (
      <Button
        onClick={handleAddToCart}
        className="w-full btn-primary text-lg py-6"
        size="lg"
      >
        <LogIn className="w-5 h-5 mr-2" />
        Sign in to purchase
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock === 0 || added}
      className="w-full btn-primary text-lg py-6"
      size="lg"
    >
      {added ? (
        <><Check className="w-5 h-5 mr-2" />Added to cart</>
      ) : (
        <><ShoppingCart className="w-5 h-5 mr-2" />Add to cart</>
      )}
    </Button>
  )
}
