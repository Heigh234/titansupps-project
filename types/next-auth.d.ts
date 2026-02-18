import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      isAdmin: boolean
      emailVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    isAdmin: boolean
    emailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isAdmin: boolean
    emailVerified: boolean
  }
}
