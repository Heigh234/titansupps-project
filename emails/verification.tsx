import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface VerificationEmailProps {
  name: string
  code: string
  verifyUrl: string
}

export const VerificationEmail = ({
  name = 'Athlete',
  code = '482916',
  verifyUrl = 'http://localhost:3000/auth/verify',
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your TitanSupps verification code: {code}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={logo}>TITAN<span style={logoAccent}>SUPPS</span></Heading>
          <Text style={tagline}>FUEL YOUR GAINS</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Heading style={h1}>Verify your email</Heading>
          <Text style={text}>
            Hi <strong style={{ color: '#ffffff' }}>{name}</strong>, thanks for joining TitanSupps.
            To activate your account, enter the following code:
          </Text>

          {/* Code Box */}
          <Section style={codeContainer}>
            <Text style={codeText}>{code}</Text>
            <Text style={codeExpiry}>This code expires in 15 minutes</Text>
          </Section>

          {/* Divider */}
          <Text style={orText}>— or click the button —</Text>

          {/* CTA Button */}
          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button href={verifyUrl} style={button}>
              Verify my account
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={footerText}>
            If you didn't create this account, please ignore this email.
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} TitanSupps. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

const main = {
  backgroundColor: '#080808',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '520px',
}

const header = {
  textAlign: 'center' as const,
  padding: '40px 20px 30px',
  backgroundColor: '#121212',
  borderRadius: '12px 12px 0 0',
}

const logo = {
  fontSize: '30px',
  fontWeight: '900',
  color: '#ffffff',
  margin: '0',
  letterSpacing: '2px',
}

const logoAccent = { color: '#CCFF00' }

const tagline = {
  fontSize: '11px',
  color: '#CCFF00',
  letterSpacing: '3px',
  margin: '6px 0 0',
}

const content = {
  backgroundColor: '#121212',
  padding: '40px 36px',
  borderRadius: '0 0 12px 12px',
}

const h1 = {
  fontSize: '26px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 16px',
}

const text = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#a0a0a0',
  margin: '0 0 28px',
}

const codeContainer = {
  backgroundColor: '#0d0d0d',
  border: '2px solid #CCFF00',
  borderRadius: '12px',
  padding: '28px 20px 16px',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

const codeText = {
  fontSize: '52px',
  fontWeight: '900',
  color: '#CCFF00',
  letterSpacing: '14px',
  margin: '0 0 8px',
  fontFamily: 'monospace',
}

const codeExpiry = {
  fontSize: '12px',
  color: '#666666',
  margin: '0',
}

const orText = {
  fontSize: '12px',
  color: '#444444',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const button = {
  backgroundColor: '#CCFF00',
  color: '#080808',
  fontWeight: '700',
  fontSize: '15px',
  padding: '14px 36px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
}

const divider = {
  borderColor: '#2a2a2a',
  margin: '32px 0 20px',
}

const footerText = {
  fontSize: '12px',
  color: '#555555',
  margin: '6px 0',
  textAlign: 'center' as const,
}
