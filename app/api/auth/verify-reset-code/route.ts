import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Incomplete data' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.resetCode || !user.resetCodeExpiry) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
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

    // Code is valid — don't change password yet, just confirm
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify reset code error:', error)
    return NextResponse.json({ error: 'Error verifying the code' }, { status: 500 })
  }
}
