import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { verifyPassword } from '../../data/password.ts'
import { users } from '../../data/tables.ts'
import { db } from '../../db.ts'
import { routes } from '../../routes.ts'
import { get, password, post, uniqueEmail } from '../test-utils.ts'

describe('signup', () => {
  it('GET /signup renders the form', async () => {
    let response = await get(routes.signup.index.href())
    assert.equal(response.status, 200)
    let html = await response.text()
    assert.match(html, /<form[^>]*method="post"/)
    assert.match(html, /name="email"/)
    assert.match(html, /name="password"/)
  })

  it('creates a user with a hashed password and redirects', async () => {
    let email = uniqueEmail('new')
    let response = await post(routes.signup.action.href(), { email, password })

    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.signupSuccess.href())

    let user = await db.findOne(users, { where: { email } })
    assert.ok(user)
    assert.notEqual(user.password_hash, password)
    assert.ok(await verifyPassword(password, user.password_hash))
  })

  it('normalizes the email to lowercase and trims it', async () => {
    let email = uniqueEmail('mixed')
    await post(routes.signup.action.href(), { email: `  ${email.toUpperCase()}  `, password })
    assert.ok(await db.findOne(users, { where: { email } }))
  })

  it('rejects a duplicate email, case-insensitively, with 409', async () => {
    let email = uniqueEmail('dupe')
    await post(routes.signup.action.href(), { email, password })

    let response = await post(routes.signup.action.href(), { email: email.toUpperCase(), password })
    assert.equal(response.status, 409)
    assert.match(await response.text(), /already exists/)
    assert.equal(await db.count(users, { where: { email } }), 1)
  })

  it('rejects an invalid email with 400 and creates no user', async () => {
    let before = await db.count(users)
    let response = await post(routes.signup.action.href(), { email: 'not-an-email', password })
    assert.equal(response.status, 400)
    assert.match(await response.text(), /not-an-email/)
    assert.equal(await db.count(users), before)
  })

  it('rejects a short password with 400 and does not echo the password', async () => {
    let email = uniqueEmail('short')
    let response = await post(routes.signup.action.href(), { email, password: 'short' })
    assert.equal(response.status, 400)
    let html = await response.text()
    assert.ok(html.includes(email))
    assert.ok(!html.includes('value="short"'))
    assert.equal(await db.findOne(users, { where: { email } }), null)
  })

  it('rejects missing fields with 400', async () => {
    let response = await post(routes.signup.action.href(), {})
    assert.equal(response.status, 400)
  })

  it('GET /signup/success renders a confirmation', async () => {
    let response = await get(routes.signupSuccess.href())
    assert.equal(response.status, 200)
    assert.match(await response.text(), /Account created/)
  })
})
