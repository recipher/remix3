import { createCookie } from 'remix/cookie'
import { createCookieSessionStorage } from 'remix/session-storage/cookie'

/** Session key under which the signed-in user's record is stored. */
export const AUTH_SESSION_KEY = 'auth'

const secret = process.env.SESSION_SECRET ?? 'dev-only-insecure-secret'

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production')
}

export const sessionCookie = createCookie('__session', {
  secrets: [secret],
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
})

export const sessionStorage = createCookieSessionStorage()
