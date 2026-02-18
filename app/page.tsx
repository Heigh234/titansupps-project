import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Zap, Shield, TrendingUp } from 'lucide-react'

export const revalidate = 60

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true, isActive: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })
  return products
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              FUEL YOUR
              <br />
              <span className="text-gradient">GAINS</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Premium supplements engineered for champions. Maximum performance, zero compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="btn-primary text-lg px-8 py-6">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Dumbbell, label: '50K+', sublabel: 'Athletes' },
              { icon: Zap, label: '100%', sublabel: 'Natural' },
              { icon: Shield, label: 'Lab', sublabel: 'Tested' },
              { icon: TrendingUp, label: '#1', sublabel: 'Rated' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl p-6 hover:border-neon/50 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-neon mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black mb-4">
              FEATURED <span className="text-neon">PRODUCTS</span>
            </h2>
            <p className="text-xl text-gray-300">
              Our most popular supplements trusted by champions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="btn-primary">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why TitanSupps Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              WHY <span className="text-neon">TITANSUPPS</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Quality',
                description: 'Every product is third-party tested and certified for purity and potency.',
                icon: Shield,
              },
              {
                title: 'Science-Backed',
                description: 'Formulations based on the latest sports nutrition research and studies.',
                icon: TrendingUp,
              },
              {
                title: 'Fast Results',
                description: 'Engineered for maximum absorption and rapid performance enhancement.',
                icon: Zap,
              },
            ].map((feature, i) => (
              <div key={i} className="card text-center group hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon/10 mb-6 group-hover:bg-neon/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-neon" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
