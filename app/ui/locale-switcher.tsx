import type { Handle } from 'remix/component'

import { LOCALES, LOCALE_NAMES } from '../i18n/index.ts'
import type { I18n } from '../i18n/index.ts'
import { routes } from '../routes.ts'

/** Plain form so switching language works without JavaScript. */
export function LocaleSwitcher(handle: Handle<{ i18n: I18n }>) {
  return () => {
    let { i18n } = handle.props

    return (
      <form
        method="post"
        action={routes.setLocale.href()}
        aria-label={i18n.t('language.label')}
        class="fixed right-4 top-4 z-10 flex gap-1 rounded-full bg-white/80 p-1 text-xs shadow backdrop-blur dark:bg-gray-800/80"
      >
        <input type="hidden" name="returnTo" value={i18n.returnTo} />
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="submit"
            name="locale"
            value={locale}
            lang={locale}
            aria-current={locale === i18n.locale ? 'true' : undefined}
            class={`cursor-pointer rounded-full px-3 py-1 font-medium transition-colors ${
              locale === i18n.locale
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {LOCALE_NAMES[locale]}
          </button>
        ))}
      </form>
    )
  }
}
