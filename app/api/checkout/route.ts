import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderReceipt } from '@/lib/email'

interface CheckoutItem {
  productId: string
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'You must be signed in to make a purchase' },
        { status: 401 }
      )
    }

    // Block checkout if email not verified
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user?.emailVerified && !user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You must verify your email before making a purchase' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { items, customerName, customerEmail } = body as {
      items: CheckoutItem[]
      customerName: string
      customerEmail: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No products in the cart' }, { status: 400 })
    }

    if (!customerName || !customerEmail) {
      return NextResponse.json({ success: false, error: 'Name and email required' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch products and validate stock
      const products = await tx.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
      })

      const productMap = new Map(products.map((p) => [p.id, p]))

      for (const item of items) {
        const product = productMap.get(item.productId)
        if (!product) throw new Error(`Product not found`)
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`)
        }
      }

      // 2. Calculate total
      const totalAmount = items.reduce((sum, item) => {
        return sum + productMap.get(item.productId)!.price * item.quantity
      }, 0)

      // 3. Create order - userId stored as plain string (no FK relation)
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          customerName,
          customerEmail,
          totalAmount,
          status: 'completed',
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      })

      // 4. Atomically decrement stock
      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      )

      return order
    })

    // 5. Send receipt email (non-blocking)
    sendOrderReceipt({
      orderId: result.id,
      customerName: result.customerName,
      customerEmail: result.customerEmail,
      items: result.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: result.totalAmount,
      orderDate: result.createdAt.toLocaleDateString('en-US'),
    }).catch(console.error)

    return NextResponse.json({ success: true, orderId: result.id })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing the order' },
      { status: 500 }
    )
  }
}
