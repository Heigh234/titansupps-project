import { Resend } from 'resend'
import { render } from '@react-email/render'
import { OrderReceiptEmail } from '@/emails/receipt'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  orderDate: string
}

export async function sendOrderReceipt(data: OrderEmailData) {
  try {
    const html = render(OrderReceiptEmail(data))

    const emailResponse = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'TitanSupps <noreply@titansupps.com>',
      to: data.customerEmail,
      subject: `Order Confirmation #${data.orderId.slice(0, 8).toUpperCase()}`,
      html,
    })

    return { success: true, data: emailResponse }
  } catch (error) {
    console.error('Failed to send order receipt:', error)
    return { success: false, error }
  }
}
