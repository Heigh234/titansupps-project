'use client'

import { useState, useEffect } from 'react'
import { Product } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { ImageUploader } from './image-uploader'

interface ProductDialogProps {
  product?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDialog({ product, open, onOpenChange }: ProductDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
    featured: false,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        imageUrl: product.imageUrl,
        featured: product.featured,
      })
    } else {
      setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '', featured: false })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imageUrl) {
      toast({ variant: 'destructive', title: 'Image required', description: 'Upload or paste an image URL' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(product && { id: product.id }), ...formData }),
      })

      if (response.ok) {
        toast({
          variant: 'success',
          title: product ? 'Product updated' : 'Product created',
          description: `"${formData.name}" was ${product ? 'updated' : 'created'} successfully`,
        })
        onOpenChange(false)
        router.refresh()
      } else {
        throw new Error('Error saving')
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the product' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl p-8 z-50 shadow-2xl">
          <Dialog.Title className="text-3xl font-bold mb-6">
            {product ? 'Edit Product' : 'Create Product'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Uploader */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Product Image
              </label>
              <ImageUploader
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Product Name</label>
                <input type="text" required className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Titan Whey Protein" />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea required rows={3} className="input resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..." />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold mb-2">Precio ($)</label>
                <input type="number" step="0.01" min="0" required className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="49.99" />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold mb-2">Stock</label>
                <input type="number" min="0" required className="input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="100" />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Category</label>
                <input type="text" required className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Protein, Pre-Workout, Creatine..." />
              </div>

              {/* Featured */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input id="featured" type="checkbox" checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-border bg-card accent-neon cursor-pointer" />
                <label htmlFor="featured" className="text-sm font-semibold cursor-pointer">
                  Show on homepage (featured)
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button type="submit" disabled={loading} className="flex-1 btn-primary">
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" />Saving...</>
                ) : product ? 'Update Product' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
