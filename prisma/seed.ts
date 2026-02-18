import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting seed...')

  // CHANGE THESE TO YOUR REAL CREDENTIALS
// Leer credenciales del archivo .env
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME || 'Admin' // Nombre por defecto si no lo pones

  // Validar que las variables existan para evitar errores
  if (!adminEmail || !adminPassword) {
    throw new Error('❌ Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el archivo .env')
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  // ... el resto del código sigue exactamente igual ...

const hashedPassword = await bcrypt.hash(adminPassword, 12)
await prisma.user.upsert({
  where: { email: adminEmail },
  update: {
    password: hashedPassword,
    name: adminName,
    isAdmin: true,
    emailVerified: true,
  },
  create: {
    email: adminEmail,
    password: hashedPassword,
    name: adminName,
    isAdmin: true,
    emailVerified: true,
  },
})

  // Create products
  await prisma.product.deleteMany()
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Titan Whey Protein Isolate',
        description: 'Ultra-pure whey protein isolate with 25g of protein per serving. Fast-absorption formula for maximum muscle recovery and growth.',
        price: 49.99, stock: 150, category: 'Protein',
        imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
        featured: true,
      },
      {
        name: 'Titan Pre-Workout Blast',
        description: 'Explosive pre-workout formula with 300mg caffeine, beta-alanine, and citrulline malate. Extreme energy and total focus.',
        price: 39.99, stock: 120, category: 'Pre-Workout',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        featured: true,
      },
      {
        name: 'Titan Creatine Monohydrate',
        description: 'Pure micronized creatine monohydrate. 5g per serving with no additives for maximum strength and power.',
        price: 29.99, stock: 200, category: 'Creatine',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        featured: true,
      },
      {
        name: 'Titan BCAA Recovery',
        description: 'Advanced 2:1:1 BCAA formula with 7g per serving. Accelerates recovery and reduces post-workout muscle soreness.',
        price: 34.99, stock: 100, category: 'BCAA',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        featured: true,
      },
      {
        name: 'Titan Mass Gainer',
        description: 'Mass gainer with 50g protein and 250g carbs per serving. Ideal for hardgainers looking to build size.',
        price: 59.99, stock: 80, category: 'Gainers',
        imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
        featured: false,
      },
      {
        name: 'Titan L-Glutamine',
        description: 'Pure L-glutamine powder. 5g per serving to support recovery, immune system, and gut health.',
        price: 27.99, stock: 150, category: 'Amino Acids',
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
        featured: false,
      },
      {
        name: 'Titan Fat Burner',
        description: 'Advanced thermogenic formula with green tea extract, caffeine, and L-carnitine. Boost metabolism and energy.',
        price: 44.99, stock: 90, category: 'Fat Burners',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        featured: false,
      },
      {
        name: 'Titan Multivitamin',
        description: 'Complete daily multivitamin with essential vitamins, minerals, and antioxidants. Support overall health and performance.',
        price: 24.99, stock: 200, category: 'Vitamins',
        imageUrl: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=800&q=80',
        featured: false,
      },
      {
        name: 'Titan Casein Protein',
        description: 'Slow-digesting casein protein. 24g protein per serving, perfect for overnight muscle recovery.',
        price: 47.99, stock: 100, category: 'Protein',
        imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
        featured: false,
      },
      {
        name: 'Titan Beta-Alanine',
        description: 'Pure beta-alanine powder. 3g per serving to increase muscular endurance and delay fatigue during high-intensity training.',
        price: 22.99, stock: 180, category: 'Amino Acids',
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
        featured: false,
      },
    ],
  })
  console.log(`✅ Created ${products.count} products`)
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error in seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
