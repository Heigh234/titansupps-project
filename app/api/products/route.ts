import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all products or specific product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(product)
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, stock, category, imageUrl, featured } = body

    if (!name || !description || price == null || stock == null || !category || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        imageUrl,
        featured: featured || false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, stock, category, imageUrl, featured } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price != null && { price: parseFloat(price) }),
        ...(stock != null && { stock: parseInt(stock) }),
        ...(category && { category }),
        ...(imageUrl && { imageUrl }),
        ...(featured != null && { featured }),
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Archive product (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    // Soft delete: mark as inactive instead of deleting
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Product archived successfully' })
  } catch (error) {
    console.error('Error archiving product:', error)
    return NextResponse.json(
      { error: 'Failed to archive product' },
      { status: 500 }
    )
  }
}
