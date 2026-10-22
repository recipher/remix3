import { createContextKey } from 'remix/router'
import type { Middleware } from 'remix/router'

import { createI18n, localeCookie, negotiateLocale } from '../i18n/index.ts'
import type { I18n } from '../i18n/index.ts'

export const i18nContext = createContextKey<I18n>()

/** Resolves the request's locale and exposes translations as `context.i18n`. */
export function loadLocale(): Middleware<{
  key: typeof i18nContext
  value: I18n
  property: 'i18n'
}> {
  return async (context, next) => {
    let locale = negotiateLocale({
      cookie: await localeCookie.parse(context.request.headers.get('Cookie')),
      acceptLanguage: context.request.headers.get('Accept-Language'),
    })

    context.set(i18nContext, createI18n(locale, context.url.pathname + context.url.search), {
      property: 'i18n',
    })

    return next()
  }
}
