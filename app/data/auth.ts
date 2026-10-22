import { createCredentialsAuthProvider } from 'remix/auth'
import { createSessionAuthScheme } from 'remix/middleware/auth'

import { db } from '../db.ts'
import { hashPassword, verifyPassword } from './password.ts'
import { users } from './tables.ts'
import type { User } from './tables.ts'

export type Identity = Pick<User, 'id' | 'email'>

// Verified against when the email is unknown, so timing doesn't reveal which emails exist.
const dummyHash = await hashPassword('dummy-password')

export const passwordProvider = createCredentialsAuthProvider({
  parse(context) {
    let formData = context.get(FormData)
    if (formData == null) {
      throw new Error('Expected formData() middleware before verifyCredentials()')
    }
    return {
      email: String(formData.get('email') ?? '').trim().toLowerCase(),
      password: String(formData.get('password') ?? ''),
    }
  },
  async verify({ email, password }): Promise<Identity | null> {
    let user = await db.findOne(users, { where: { email } })
    let ok = await verifyPassword(password, user?.password_hash ?? dummyHash)
    return user && ok ? { id: user.id, email: user.email } : null
  },
})

export const sessionAuthScheme = createSessionAuthScheme<Identity, { userId: string }>({
  read(session) {
    return (session.get('auth') as { userId: string } | null) ?? null
  },
  async verify(value) {
    let user = await db.find(users, value.userId)
    return user ? { id: user.id, email: user.email } : null
  },
  invalidate(session) {
    session.unset('auth')
  },
})
