import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { routes } from '../../routes.ts'
import { get, password, post, sessionCookieFrom, uniqueEmail } from '../test-utils.ts'

async function signUp(email = uniqueEmail('login')) {
  await post(routes.signup.action.href(), { email, password })
  return email
}

async function logIn(email: string, pw = password) {
  return post(routes.login.action.href(), { email, password: pw })
}

describe('login', () => {
  it('GET /login renders the form', async () => {
    let response = await get(routes.login.index.href())
    assert.equal(response.status, 200)
    let html = await response.text()
    assert.match(html, /name="email"/)
    assert.match(html, /name="password"/)
  })

  it('logs in with valid credentials and sets a session cookie', async () => {
    let email = await signUp()
    let response = await logIn(email)

    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.account.href())
    assert.match(response.headers.get('Set-Cookie') ?? '', /__session=/)
    assert.match(response.headers.get('Set-Cookie') ?? '', /HttpOnly/i)
  })

  it('treats the email case-insensitively', async () => {
    let email = await signUp()
    let response = await logIn(email.toUpperCase())
    assert.equal(response.status, 303)
  })

  it('rejects a wrong password with 401 and no session', async () => {
    let email = await signUp()
    let response = await logIn(email, 'wrong password')

    assert.equal(response.status, 401)
    assert.match(await response.text(), /Invalid email or password/)

    let account = await get(routes.account.href(), sessionCookieFrom(response))
    assert.equal(account.status, 303)
  })

  it('rejects an unknown email with the same error as a wrong password', async () => {
    let email = await signUp()
    let wrong = await logIn(email, 'wrong password')
    let unknown = await logIn(uniqueEmail('ghost'))

    assert.equal(unknown.status, 401)
    assert.match(await unknown.text(), /Invalid email or password/)
    assert.equal(wrong.status, unknown.status)
  })

  it('rejects empty credentials with 401', async () => {
    let response = await post(routes.login.action.href(), {})
    assert.equal(response.status, 401)
  })

  it('does not echo the password on failure', async () => {
    let email = await signUp()
    let html = await (await logIn(email, 'secret-attempt')).text()
    assert.ok(!html.includes('secret-attempt'))
  })
})

describe('account (protected route)', () => {
  it('redirects anonymous visitors to /login', async () => {
    let response = await get(routes.account.href())
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.login.index.href())
  })

  it('shows the signed-in user', async () => {
    let email = await signUp()
    let cookie = sessionCookieFrom(await logIn(email))

    let response = await get(routes.account.href(), cookie)
    assert.equal(response.status, 200)
    let html = await response.text()
    assert.ok(html.includes(email))
    assert.match(html, /action="\/logout"/)
  })

  it('rejects a tampered session cookie', async () => {
    let email = await signUp()
    let cookie = sessionCookieFrom(await logIn(email))
    let tampered = cookie.slice(0, -4) + 'AAAA'

    let response = await get(routes.account.href(), tampered)
    assert.equal(response.status, 303)
  })

  it('rotates the session id on login', async () => {
    let email = await signUp()
    let first = sessionCookieFrom(await logIn(email))
    let second = sessionCookieFrom(await logIn(email))
    assert.notEqual(first, second)
  })
})
