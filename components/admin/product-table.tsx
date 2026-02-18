'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, RotateCcw, Archive } from 'lucide-react'
import { EditProductDialog } from './edit-product-dialog'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface ProductTableProps {
  products: Product[]
}

export function ProductTable({ products }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Archive "${name}"? It won't be deleted, it will just be hidden from customers.`)) return

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          variant: 'success',
          title: 'Product archived',
          description: `${name} was archived successfully`,
        })
        router.refresh()
      } else {
        throw new Error('Failed to archive product')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not archive the product',
      })
    }
  }

  const handleRestore = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/products/restore?id=${id}`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          variant: 'success',
          title: 'Product restored',
          description: `${name} is visible again`,
        })
        router.refresh()
      } else {
        throw new Error('Failed to restore product')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not restore the product',
      })
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Product</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Category</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Price</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Stock</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-right py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className={`border-b border-border/50 hover:bg-card/50 transition-colors ${
                  !product.isActive ? 'opacity-50' : ''
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-400 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-card border border-border">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-neon">{formatPrice(product.price)}</td>
                <td className="py-4 px-4">
                  <span
                    className={`font-semibold ${
                      product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-yellow-400' : 'text-green-400'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {product.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                      <Archive className="w-3 h-3" />
                      Archived
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {product.isActive ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:border-red-400"
                          onClick={() => handleArchive(product.id, product.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-400 hover:text-green-300 hover:border-green-400 gap-1"
                        onClick={() => handleRestore(product.id, product.name)}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No products yet</p>
          </div>
        )}
      </div>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}
    </>
  )
}
