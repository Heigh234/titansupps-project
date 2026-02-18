import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { VerificationEmail } from '@/emails/verification'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })
    }

    // Generate 6-digit code with 15min expiry
    const code = generateCode()
    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: code,
        verificationExpiry: expiry,
      },
    })

    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify`

    const html = render(VerificationEmail({
      name: user.name || 'Athlete',
      code,
      verifyUrl,
    }))

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'TitanSupps <onboarding@resend.dev>',
      to: user.email,
      subject: `Your verification code: ${code}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json({ error: 'Error sending the email' }, { status: 500 })
  }
}
