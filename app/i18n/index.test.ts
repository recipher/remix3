import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { createI18n, DEFAULT_LOCALE, LOCALES, negotiateLocale, safeReturnTo } from './index.ts'
import { en } from './messages/en.ts'
import { es } from './messages/es.ts'

describe('negotiateLocale', () => {
  it('prefers the saved cookie over Accept-Language', () => {
    assert.equal(negotiateLocale({ cookie: 'es', acceptLanguage: 'en-US,en;q=0.9' }), 'es')
  })

  it('uses Accept-Language when there is no cookie', () => {
    assert.equal(negotiateLocale({ acceptLanguage: 'es-MX,es;q=0.9,en;q=0.5' }), 'es')
    assert.equal(negotiateLocale({ acceptLanguage: 'fr-FR,es;q=0.5' }), 'es')
  })

  it('falls back to the default for unsupported or missing languages', () => {
    assert.equal(negotiateLocale({ acceptLanguage: 'fr-FR,de;q=0.8' }), DEFAULT_LOCALE)
    assert.equal(negotiateLocale({ cookie: 'klingon' }), DEFAULT_LOCALE)
    assert.equal(negotiateLocale({}), DEFAULT_LOCALE)
  })
})

describe('createI18n', () => {
  it('translates and interpolates params', () => {
    assert.equal(createI18n('en').t('signup.passwordHint', { min: 8 }), 'At least 8 characters.')
    assert.equal(createI18n('es').t('signup.passwordHint', { min: 8 }), 'Mínimo 8 caracteres.')
  })

  it('leaves a placeholder untouched when its param is not provided', () => {
    assert.equal(createI18n('en').t('signup.passwordHint', {}), 'At least {min} characters.')
    assert.equal(
      createI18n('es').t('signup.passwordLength', { min: 8 }),
      'La contraseña debe tener entre 8 y {max} caracteres.',
    )
  })

  it('every locale defines exactly the same keys as English', () => {
    assert.deepEqual(Object.keys(es).sort(), Object.keys(en).sort())
    assert.deepEqual(LOCALES.sort(), ['en', 'es'])
  })

  it('keeps the same placeholders in every translation', () => {
    let placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort()
    for (let key of Object.keys(en) as (keyof typeof en)[]) {
      assert.deepEqual(placeholders(es[key]), placeholders(en[key]), key)
    }
  })
})

describe('safeReturnTo', () => {
  it('allows same-site paths', () => {
    assert.equal(safeReturnTo('/account?tab=1'), '/account?tab=1')
  })

  it('rejects external and malformed targets', () => {
    for (let value of [
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      'account',
      42,
      null,
    ]) {
      assert.equal(safeReturnTo(value), '/')
    }
  })
})
