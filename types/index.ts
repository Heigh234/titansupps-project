import { Product, Order, OrderItem, User } from '@prisma/client'

export type ProductWithDetails = Product

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
  })[]
  user: User
}

export interface CheckoutItem {
  productId: string
  quantity: number
}

export interface CheckoutResult {
  success: boolean
  orderId?: string
  error?: string
}
