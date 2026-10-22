import { createCookie } from 'remix/cookie'
import { AcceptLanguage } from 'remix/headers/accept-language'

import { en } from './messages/en.ts'
import type { MessageKey, Messages } from './messages/en.ts'
import { es } from './messages/es.ts'

export type { MessageKey }

/** Supported locales, with the name each one is shown under in the language switcher. */
export const LOCALE_NAMES = { en: 'English', es: 'Español' } as const

export type Locale = keyof typeof LOCALE_NAMES

export const LOCALES = Object.keys(LOCALE_NAMES) as Locale[]
export const DEFAULT_LOCALE: Locale = 'en'

const catalogs: Record<Locale, Messages> = { en, es }

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/** Remembers the visitor's explicit language choice. */
export const localeCookie = createCookie('locale', {
  path: '/',
  sameSite: 'lax',
  maxAge: ONE_YEAR_SECONDS,
})

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value)
}

/** Picks a locale: the saved cookie choice, then Accept-Language, then the default. */
export function negotiateLocale(options: {
  cookie?: string | null
  acceptLanguage?: string | null
}): Locale {
  if (isLocale(options.cookie)) return options.cookie

  if (options.acceptLanguage) {
    let preferred = AcceptLanguage.from(options.acceptLanguage).getPreferred(LOCALES)
    if (isLocale(preferred)) return preferred
  }

  return DEFAULT_LOCALE
}

export type MessageParams = Record<string, string | number>

export interface I18n {
  locale: Locale
  /** Where the language switcher should send the visitor back to. */
  returnTo: string
  t(key: MessageKey, params?: MessageParams): string
}

export function createI18n(locale: Locale, returnTo = '/'): I18n {
  let messages = catalogs[locale]

  return {
    locale,
    returnTo,
    t(key, params) {
      let message = messages[key]
      if (!params) return message
      return message.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      )
    },
  }
}

/** Only allows same-site absolute paths, so the switcher can't be used as an open redirect. */
export function safeReturnTo(value: unknown): string {
  if (typeof value !== 'string') return '/'
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/'
  return value
}
