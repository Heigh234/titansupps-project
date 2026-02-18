import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { code } = await request.json()

    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // Check code exists
    if (!user.verificationCode || !user.verificationExpiry) {
      return NextResponse.json(
        { error: 'No active code. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check expiry
    if (new Date() > user.verificationExpiry) {
      return NextResponse.json(
        { error: 'The code has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check code matches
    if (user.verificationCode !== code) {
      return NextResponse.json({ error: 'Incorrect code' }, { status: 400 })
    }

    // Mark as verified and clear code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpiry: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Error verifying email' }, { status: 500 })
  }
}
