import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) throw new Error('Invalid credentials')

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error('Invalid credentials')

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.isAdmin = (user as any).isAdmin
        token.emailVerified = (user as any).emailVerified
      }
      // Allow session update to refresh emailVerified status
      if (trigger === 'update' && session?.emailVerified !== undefined) {
        token.emailVerified = session.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.emailVerified = token.emailVerified as boolean
      }
      return session
    },
  },
}
