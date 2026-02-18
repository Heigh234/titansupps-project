import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json()

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    if (!user.resetCode || !user.resetCodeExpiry) {
      return NextResponse.json(
        { error: 'No active request found. Please request the code again.' },
        { status: 400 }
      )
    }

    if (new Date() > user.resetCodeExpiry) {
      return NextResponse.json(
        { error: 'The code has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    if (user.resetCode !== code) {
      return NextResponse.json({ error: 'Incorrect code' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpiry: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Error resetting password' }, { status: 500 })
  }
}
