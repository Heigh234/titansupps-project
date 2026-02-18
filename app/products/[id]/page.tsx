import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { formatPrice } from '@/lib/utils'
import { Package, Shield, Zap } from 'lucide-react'

export const revalidate = 60

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  })
  return product
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - TitanSupps`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute top-4 right-4 bg-neon text-background px-4 py-2 rounded-full font-bold text-sm">
                Only {product.stock} left!
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-2xl font-bold text-white">OUT OF STOCK</div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-block px-4 py-2 bg-neon/10 border border-neon/30 rounded-full text-neon text-sm font-semibold uppercase tracking-wider">
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-5xl sm:text-6xl font-black leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-4xl font-bold text-neon">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-5 h-5 text-neon" />
              <span className={product.stock > 0 ? 'text-neon' : 'text-red-500'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Features */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-xl font-bold">Why Choose This Product</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'Third-party tested for quality' },
                  { icon: Zap, text: 'Fast-acting formula' },
                  { icon: Package, text: 'Free shipping on orders over $50' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <feature.icon className="w-5 h-5 text-neon flex-shrink-0" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Sections */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              title: 'Quality Guaranteed',
              description: 'Every batch is tested for purity and potency by independent labs.',
            },
            {
              title: 'Science-Backed',
              description: 'Formulated using the latest research in sports nutrition.',
            },
            {
              title: 'Results or Refund',
              description: '60-day money-back guarantee if you\'re not satisfied.',
            },
          ].map((info, i) => (
            <div key={i} className="card text-center">
              <h3 className="text-xl font-bold mb-3">{info.title}</h3>
              <p className="text-gray-400">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
