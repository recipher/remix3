import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.ts'
import { routes } from '../routes.ts'
import { get, getCsrf, password, post, sessionCookieFrom, uniqueEmail } from './test-utils.ts'

const forms = [
  ['signup', () => routes.signup.action.href(), () => ({ email: uniqueEmail('csrf'), password })],
  ['login', () => routes.login.action.href(), () => ({ email: uniqueEmail('csrf'), password })],
  ['logout', () => routes.logout.href(), () => ({})],
  ['locale', () => routes.setLocale.href(), () => ({ locale: 'es', returnTo: '/' })],
] as const

describe('csrf protection', () => {
  for (let [name, href, body] of forms) {
    it(`rejects a ${name} POST without a token`, async () => {
      let response = await post(href(), body(), undefined, { csrf: false })
      assert.equal(response.status, 403)
    })

    it(`rejects a ${name} POST with a wrong token`, async () => {
      let session = await getCsrf()
      let response = await post(href(), { ...body(), _csrf: 'not-the-token' }, session.cookie, {
        csrf: false,
      })
      assert.equal(response.status, 403)
    })
  }

  it('does not create a user when the token is missing', async () => {
    let email = uniqueEmail('blocked')
    await post(routes.signup.action.href(), { email, password }, undefined, { csrf: false })

    // The same signup succeeds with a token, so the earlier rejection was the token check.
    let ok = await post(routes.signup.action.href(), { email, password })
    assert.equal(ok.status, 303)
  })

  it('rejects a token from a different session', async () => {
    let first = await getCsrf()
    let second = await getCsrf()
    assert.notEqual(first.token, second.token)

    let response = await post(
      routes.login.action.href(),
      { _csrf: first.token, email: uniqueEmail('x'), password },
      second.cookie,
      { csrf: false },
    )
    assert.equal(response.status, 403)
  })

  it('rejects a valid token sent from another origin', async () => {
    let session = await getCsrf()
    let response = await router.fetch(
      new Request(new URL(routes.login.action.href(), 'http://localhost'), {
        method: 'POST',
        headers: { Cookie: session.cookie, Origin: 'https://evil.example' },
        body: new URLSearchParams({ _csrf: session.token, email: uniqueEmail('x'), password }),
      }),
    )
    assert.equal(response.status, 403)
  })

  it('accepts a token sent in the X-Csrf-Token header', async () => {
    let session = await getCsrf()
    let response = await router.fetch(
      new Request(new URL(routes.logout.href(), 'http://localhost'), {
        method: 'POST',
        headers: { Cookie: session.cookie, 'X-Csrf-Token': session.token },
      }),
    )
    assert.equal(response.status, 303)
  })

  it('does not require a token on GET requests', async () => {
    assert.equal((await get(routes.login.index.href())).status, 200)
  })

  it('renders a token into every form', async () => {
    let pages = [routes.home.href(), routes.login.index.href(), routes.signup.index.href()]
    for (let page of pages) {
      let html = await (await get(page)).text()
      assert.match(html, /name="_csrf"/, page)
    }

    let email = uniqueEmail('forms')
    await post(routes.signup.action.href(), { email, password })
    let login = await post(routes.login.action.href(), { email, password })
    let account = await (await get(routes.account.href(), sessionCookieFrom(login))).text()
    // Language switcher and logout form.
    assert.equal((account.match(/name="_csrf"/g) ?? []).length, 2)
  })

  it('keeps the user logged in after a failed (token-less) POST', async () => {
    let email = uniqueEmail('stay')
    await post(routes.signup.action.href(), { email, password })
    let cookie = sessionCookieFrom(await post(routes.login.action.href(), { email, password }))

    let blocked = await post(routes.logout.href(), {}, cookie, { csrf: false })
    assert.equal(blocked.status, 403)
    assert.equal((await get(routes.account.href(), cookie)).status, 200)
  })
})
