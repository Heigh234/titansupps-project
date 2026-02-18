import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Restore: set isActive back to true
    await prisma.product.update({
      where: { id },
      data: { isActive: true },
    })

    return NextResponse.json({ message: 'Product restored successfully' })
  } catch (error) {
    console.error('Error restoring product:', error)
    return NextResponse.json({ error: 'Failed to restore product' }, { status: 500 })
  }
}
