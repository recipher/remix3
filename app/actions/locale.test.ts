import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { routes } from '../routes.ts'
import { router } from '../router.ts'
import { get, password, post, sessionCookieFrom, uniqueEmail } from './test-utils.ts'

function withLanguage(path: string, headers: Record<string, string>) {
  return router.fetch(new Request(new URL(path, 'http://localhost'), { headers }))
}

describe('localization', () => {
  it('renders English by default', async () => {
    let html = await (await get(routes.login.index.href())).text()
    assert.match(html, /<html lang="en"/)
    assert.match(html, /Log in/)
  })

  it('follows the Accept-Language header', async () => {
    let html = await (
      await withLanguage(routes.login.index.href(), { 'Accept-Language': 'es-ES,es;q=0.9' })
    ).text()
    assert.match(html, /<html lang="es"/)
    assert.match(html, /Iniciar sesión/)
    assert.match(html, /Correo electrónico/)
  })

  it('falls back to English for unsupported languages', async () => {
    let html = await (
      await withLanguage(routes.login.index.href(), { 'Accept-Language': 'fr-FR,fr;q=0.9' })
    ).text()
    assert.match(html, /<html lang="en"/)
  })

  it('POST /locale saves the choice in a cookie and redirects back', async () => {
    let response = await post(routes.setLocale.href(), { locale: 'es', returnTo: '/signup' })
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), '/signup')

    let cookie = (response.headers.get('Set-Cookie') ?? '').split(';')[0]
    assert.match(cookie, /^locale=/)

    // The cookie wins over the browser's Accept-Language.
    let html = await (
      await withLanguage(routes.signup.index.href(), {
        Cookie: cookie,
        'Accept-Language': 'en-US',
      })
    ).text()
    assert.match(html, /<html lang="es"/)
    assert.match(html, /Crear cuenta/)
  })

  it('does not redirect to other sites or save unknown locales', async () => {
    let response = await post(routes.setLocale.href(), {
      locale: 'tlh',
      returnTo: 'https://evil.example',
    })
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), '/')
    assert.equal(response.headers.get('Set-Cookie'), null)
  })

  it('translates validation and login errors', async () => {
    let headers = { 'Accept-Language': 'es' }
    let signup = await post(
      routes.signup.action.href(),
      { email: 'nope', password: 'x' },
      undefined,
      { headers },
    )
    assert.equal(signup.status, 400)
    let html = await signup.text()
    assert.match(html, /Introduce un correo electrónico válido/)
    assert.match(html, /entre 8 y 200 caracteres/)

    let login = await post(
      routes.login.action.href(),
      { email: uniqueEmail('x'), password },
      undefined,
      { headers },
    )
    assert.equal(login.status, 401)
    assert.match(await login.text(), /Correo o contraseña incorrectos/)
  })

  it('translates the protected account page', async () => {
    let email = uniqueEmail('i18n')
    await post(routes.signup.action.href(), { email, password })
    let login = await post(routes.login.action.href(), { email, password })
    let cookie = sessionCookieFrom(login)

    let html = await (
      await withLanguage(routes.account.href(), { Cookie: cookie, 'Accept-Language': 'es' })
    ).text()
    assert.match(html, /Sesión iniciada como/)
    assert.match(html, /Cerrar sesión/)
    assert.match(html, /Copiar correo/)
  })
})
