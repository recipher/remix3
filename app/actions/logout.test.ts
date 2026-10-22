import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { routes } from '../routes.ts'
import { get, password, post, sessionCookieFrom, uniqueEmail } from './test-utils.ts'

async function loggedInCookie() {
  let email = uniqueEmail('logout')
  await post(routes.signup.action.href(), { email, password })
  let response = await post(routes.login.action.href(), { email, password })
  return sessionCookieFrom(response)
}

describe('logout', () => {
  it('redirects to /login and ends the session', async () => {
    let cookie = await loggedInCookie()
    assert.equal((await get(routes.account.href(), cookie)).status, 200)

    let response = await post(routes.logout.href(), {}, cookie)
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.login.index.href())

    // The cookie returned by logout no longer grants access.
    let next = sessionCookieFrom(response)
    assert.equal((await get(routes.account.href(), next)).status, 303)
  })

  it('is safe to call when not logged in', async () => {
    let response = await post(routes.logout.href(), {})
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.login.index.href())
  })

  it('does not log out on GET', async () => {
    let cookie = await loggedInCookie()
    let response = await get(routes.logout.href(), cookie)
    assert.notEqual(response.status, 303)
    assert.equal((await get(routes.account.href(), cookie)).status, 200)
  })
})
