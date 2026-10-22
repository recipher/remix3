import { router } from '../router.ts'

const origin = 'http://localhost'

export function get(path: string, cookie?: string): Promise<Response> {
  return router.fetch(
    new Request(new URL(path, origin), { headers: cookie ? { Cookie: cookie } : {} }),
  )
}

export interface PostOptions {
  /** Fetch a CSRF token first and send it with the request. Defaults to true. */
  csrf?: boolean
  headers?: Record<string, string>
}

/** Loads a page to start a session and read the CSRF token rendered into its forms. */
export async function getCsrf(cookie?: string): Promise<{ token: string; cookie: string }> {
  let response = await get('/login', cookie)
  let html = await response.text()
  let token = html.match(/name="_csrf"[^>]*value="([^"]+)"/)?.[1]
  if (!token) throw new Error(`No CSRF token found on /login (status ${response.status})`)
  return { token, cookie: sessionCookieFrom(response) || cookie || '' }
}

/** POSTs a form. By default it first fetches a valid CSRF token, like a browser would. */
export async function post(
  path: string,
  body: Record<string, string>,
  cookie?: string,
  { csrf = true, headers = {} }: PostOptions = {},
): Promise<Response> {
  let fields = { ...body }

  if (csrf) {
    let session = await getCsrf(cookie)
    fields = { _csrf: session.token, ...body }
    cookie = session.cookie
  }

  return router.fetch(
    new Request(new URL(path, origin), {
      method: 'POST',
      headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}) },
      body: new URLSearchParams(fields),
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
