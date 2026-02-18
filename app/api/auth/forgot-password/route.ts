import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ResetPasswordEmail } from '@/emails/reset-password'
import { isValidEmailDomain } from '@/lib/email-validation'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isValidEmailDomain(email)) {
      return NextResponse.json(
        { error: 'Please use a real email address (Gmail, Hotmail, Outlook, Yahoo, iCloud, etc.)' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success even if user doesn't exist (security best practice)
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({ success: true })
    }

    const code = generateCode()
    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetCode: code, resetCodeExpiry: expiry },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?email=${encodeURIComponent(email)}`

    const html = render(ResetPasswordEmail({
      name: user.name || 'Athlete',
      code,
      resetUrl,
    }))

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'TitanSupps <onboarding@resend.dev>',
      to: email,
      subject: `Code to reset your password: ${code}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Error processing the request' }, { status: 500 })
  }
}
