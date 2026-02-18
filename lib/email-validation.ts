// List of accepted real email domains
const VALID_DOMAINS = [
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'hotmail.com', 'hotmail.es', 'hotmail.co.uk', 'hotmail.fr',
  'outlook.com', 'outlook.es', 'outlook.co.uk',
  'live.com', 'live.es', 'msn.com',
  // Yahoo
  'yahoo.com', 'yahoo.es', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.com.mx',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Privacy / secure
  'protonmail.com', 'proton.me', 'tutanota.com', 'tutanota.de',
  // Other popular
  'aol.com', 'zoho.com', 'mail.com', 'yandex.com', 'yandex.ru',
  'gmx.com', 'gmx.net', 'gmx.de',
  'igtf.com', 'fastmail.com', 'hey.com',
  // Latin America
  'bol.com.br', 'terra.com.br', 'uol.com.br',
  'telmex.net', 'une.net.co', 'claro.com.co',
]

export function isValidEmailDomain(email: string): boolean {
  if (!email || !email.includes('@')) return false

  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false

  // Allow any .edu, .gov, .org domain (institutional/corporate)
  if (
    domain.endsWith('.edu') ||
    domain.endsWith('.gov') ||
    domain.endsWith('.edu.ve') ||
    domain.endsWith('.edu.co') ||
    domain.endsWith('.edu.mx')
  ) return true

  // Check against whitelist
  return VALID_DOMAINS.includes(domain)
}

export function getEmailDomainError(email: string): string | null {
  if (!email) return null

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'The email format is not valid'
  }

  if (!isValidEmailDomain(email)) {
    return 'Please use a real email address (Gmail, Hotmail, Outlook, Yahoo, iCloud, etc.)'
  }

  return null
}
