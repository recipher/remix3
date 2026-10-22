import { router } from '../router.ts'

const origin = 'http://localhost'

export function get(path: string, cookie?: string): Promise<Response> {
  return router.fetch(
    new Request(new URL(path, origin), { headers: cookie ? { Cookie: cookie } : {} }),
  )
}

export function post(path: string, body: Record<string, string>, cookie?: string): Promise<Response> {
  return router.fetch(
    new Request(new URL(path, origin), {
      method: 'POST',
      headers: cookie ? { Cookie: cookie } : {},
      body: new URLSearchParams(body),
    }),
  )
}

/** Returns the `name=value` part of the response's session cookie. */
export function sessionCookieFrom(response: Response): string {
  return (response.headers.get('Set-Cookie') ?? '').split(';')[0]
}

let counter = 0
export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}-${++counter}-${Date.now()}@example.com`
}

export const password = 'correct horse battery'
