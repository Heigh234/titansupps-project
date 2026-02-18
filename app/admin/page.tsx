import { prisma } from '@/lib/prisma'
import { ProductTable } from '@/components/admin/product-table'
import { CreateProductButton } from '@/components/admin/create-product-button'
import { Package, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react'

export const revalidate = 0 // No caching for admin

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return products
}

async function getStats() {
  const [totalProducts, totalOrders, totalRevenue, lowStockCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    prisma.product.count({
      where: { stock: { lte: 10 } },
    }),
  ])

  return {
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    lowStockCount,
  }
}

export default async function AdminPage() {
  const [products, stats] = await Promise.all([
    getProducts(),
    getStats(),
  ])

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black mb-2">
              ADMIN <span className="text-neon">PANEL</span>
            </h1>
            <p className="text-gray-400">Manage your products and inventory</p>
          </div>
          <CreateProductButton />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Package,
              label: 'Total Products',
              value: stats.totalProducts,
              color: 'text-blue-400',
            },
            {
              icon: ShoppingCart,
              label: 'Total Orders',
              value: stats.totalOrders,
              color: 'text-green-400',
            },
            {
              icon: DollarSign,
              label: 'Total Revenue',
              value: `$${stats.totalRevenue.toFixed(2)}`,
              color: 'text-neon',
            },
            {
              icon: TrendingUp,
              label: 'Low Stock Items',
              value: stats.lowStockCount,
              color: 'text-orange-400',
            },
          ].map((stat, i) => (
            <div key={i} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Product Inventory</h2>
          <ProductTable products={products} />
        </div>
      </div>
    </main>
  )
}
