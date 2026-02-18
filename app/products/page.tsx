import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { Suspense } from 'react'

export const revalidate = 60

interface ProductsPageProps {
  searchParams: {
    category?: string
    search?: string
  }
}

async function getProducts(category?: string, search?: string) {
  const where: any = {
    isActive: true, // Only show active products to public
  }

  if (category) {
    where.category = category
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return products
}

async function getCategories() {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  })
  return products.map((p) => p.category)
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts(searchParams.category, searchParams.search)
  const categories = await getCategories()

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4">
            ALL <span className="text-neon">PRODUCTS</span>
          </h1>
          <p className="text-xl text-gray-400">
            Browse our complete collection of premium supplements
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-20 loading-skeleton rounded-xl" />}>
          <ProductFilters categories={categories} />
        </Suspense>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </main>
  )
}
