import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface OrderReceiptEmailProps {
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

export const OrderReceiptEmail = ({
  orderId = 'ABC12345',
  customerName = 'John Doe',
  customerEmail = 'john@example.com',
  items = [
    { name: 'Titan Whey Protein', quantity: 2, price: 49.99 },
    { name: 'Pre-Workout Blast', quantity: 1, price: 39.99 },
  ],
  totalAmount = 139.97,
  orderDate = new Date().toLocaleDateString(),
}: OrderReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Your TitanSupps order confirmation #{orderId.slice(0, 8).toUpperCase()}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={logo}>TITAN<span style={logoAccent}>SUPPS</span></Heading>
          <Text style={tagline}>FUEL YOUR GAINS</Text>
        </Section>

        {/* Order Confirmation */}
        <Section style={content}>
          <Heading style={h1}>Order Confirmed!</Heading>
          <Text style={text}>
            Hey {customerName}, thanks for your order! Your supplements are being prepared.
          </Text>

          {/* Order Details */}
          <Section style={orderBox}>
            <Row>
              <Column>
                <Text style={label}>Order Number</Text>
                <Text style={value}>#{orderId.slice(0, 8).toUpperCase()}</Text>
              </Column>
              <Column align="right">
                <Text style={label}>Order Date</Text>
                <Text style={value}>{orderDate}</Text>
              </Column>
            </Row>
          </Section>

          {/* Items */}
          <Section style={itemsSection}>
            <Heading style={h2}>Order Summary</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemName}>
                  <Text style={itemText}>{item.name}</Text>
                  <Text style={itemQty}>Qty: {item.quantity}</Text>
                </Column>
                <Column align="right" style={itemPrice}>
                  <Text style={itemText}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={divider} />

            {/* Total */}
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalAmountStyle}>${totalAmount.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Footer Message */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or contact us at support@titansupps.com
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} TitanSupps. All rights reserved.
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default OrderReceiptEmail

// Styles
const main = {
  backgroundColor: '#080808',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  padding: '40px 20px',
  backgroundColor: '#121212',
  borderRadius: '8px 8px 0 0',
}

const logo = {
  fontSize: '32px',
  fontWeight: '900',
  color: '#ffffff',
  margin: '0',
  letterSpacing: '2px',
}

const logoAccent = {
  color: '#CCFF00',
}

const tagline = {
  fontSize: '12px',
  color: '#CCFF00',
  letterSpacing: '3px',
  margin: '8px 0 0',
}

const content = {
  backgroundColor: '#121212',
  padding: '40px 30px',
  borderRadius: '0 0 8px 8px',
}

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 20px',
}

const h2 = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '30px 0 20px',
}

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#a0a0a0',
  margin: '0 0 20px',
}

const orderBox = {
  backgroundColor: '#1a1a1a',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #2a2a2a',
  marginBottom: '30px',
}

const label = {
  fontSize: '12px',
  color: '#666666',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}

const value = {
  fontSize: '16px',
  color: '#ffffff',
  fontWeight: '600',
  margin: '0',
}

const itemsSection = {
  marginTop: '30px',
}

const itemRow = {
  marginBottom: '16px',
}

const itemName = {
  width: '70%',
}

const itemPrice = {
  width: '30%',
}

const itemText = {
  fontSize: '15px',
  color: '#ffffff',
  margin: '0 0 4px',
}

const itemQty = {
  fontSize: '13px',
  color: '#666666',
  margin: '0',
}

const divider = {
  borderColor: '#2a2a2a',
  margin: '20px 0',
}

const totalRow = {
  marginTop: '20px',
}

const totalLabel = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
}

const totalAmountStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#CCFF00',
  margin: '0',
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '40px',
}

const footerText = {
  fontSize: '12px',
  color: '#666666',
  margin: '8px 0',
}
