import type { Handle } from 'remix/component'

import type { I18n } from '../../i18n/index.ts'
import { routes } from '../../routes.ts'
import { CsrfField } from '../../ui/csrf-field.tsx'
import { CardPage } from '../../ui/layout.tsx'
import { NavBar } from '../../ui/nav-bar.tsx'
import { CopyButton } from '../../ui/public/copy-button.tsx'

export function AccountPage(handle: Handle<{ i18n: I18n; csrfToken: string; email: string }>) {
  return () => {
    let { i18n, csrfToken, email } = handle.props
    let { t } = i18n

    return (
      <CardPage i18n={i18n} csrfToken={csrfToken} title={t('account.title')}>
        <NavBar i18n={i18n} current="account" />
        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">{t('account.signedInAs')}</p>
        <p class="mb-3 break-all font-medium">{email}</p>
        <div class="mb-6">
          <CopyButton
            text={email}
            label={t('account.copyEmail')}
            copiedLabel={t('copy.copied')}
            failedLabel={t('copy.failed')}
          />
        </div>
        <form method="post" action={routes.logout.href()}>
          <CsrfField token={csrfToken} />
          <button
            type="submit"
            class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t('account.logout')}
          </button>
        </form>
      </CardPage>
    )
  }
}
