import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="product-card block group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-neon text-background px-3 py-1 rounded-full text-xs font-bold">
            Only {product.stock} left!
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-lg font-bold text-white">OUT OF STOCK</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <div className="flex items-center gap-2 text-neon font-semibold">
            <ShoppingCart className="w-5 h-5" />
            <span>View Details</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="inline-block px-3 py-1 bg-neon/10 border border-neon/30 rounded-full text-neon text-xs font-semibold uppercase tracking-wider mb-3">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-neon transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-neon">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock} in stock
          </span>
        </div>
      </div>
    </Link>
  )
}
