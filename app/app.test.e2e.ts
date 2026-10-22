import * as assert from 'remix/assert'
import { createTestServer } from 'remix/node-fetch-server/test'
import { describe, it } from 'remix/test'

import { router } from './router.ts'
import { routes } from './routes.ts'

describe('auth flow', () => {
  it('signs up, logs in, copies the email, and logs out', async (t) => {
    let page = await t.serve(await createTestServer(router.fetch))
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    let email = `e2e-${Date.now()}@example.com`

    // Home page links to signup.
    await page.goto(routes.home.href())
    await page.getByRole('link', { name: 'Sign up' }).click()
    await page.getByRole('heading', { name: 'Sign up' }).waitFor()

    // Sign up.
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill('correct horse battery')
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.getByRole('heading', { name: 'Account created' }).waitFor()
    assert.equal(new URL(page.url()).pathname, routes.signupSuccess.href())

    // Log in.
    await page.getByRole('link', { name: 'Log in' }).click()
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill('correct horse battery')
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByRole('heading', { name: 'Account' }).waitFor()
    assert.equal(new URL(page.url()).pathname, routes.account.href())
    await page.getByText(email).waitFor()

    // The copy button confirms, then resets.
    let copy = page.getByRole('button', { name: 'Copy email' })
    await copy.click()
    await page.getByRole('button', { name: 'Copied!' }).waitFor()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), email)
    await page.getByRole('button', { name: 'Copy email' }).waitFor({ timeout: 5000 })

    // Log out.
    await page.getByRole('button', { name: 'Log out' }).click()
    await page.getByRole('heading', { name: 'Log in' }).waitFor()
    assert.equal(new URL(page.url()).pathname, routes.login.index.href())

    // The account page is protected again.
    await page.goto(routes.account.href())
    await page.getByRole('heading', { name: 'Log in' }).waitFor()
  })

  it('shows an error for bad credentials', async (t) => {
    let page = await t.serve(await createTestServer(router.fetch))

    await page.goto(routes.login.index.href())
    await page.getByLabel('Email').fill('nobody@example.com')
    await page.getByLabel('Password').fill('wrong password')
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByRole('alert').getByText('Invalid email or password.').waitFor()
  })
})
