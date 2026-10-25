import type { Handle } from 'remix/component'

import type { I18n } from '../../i18n/index.ts'
import { NavBar } from '../../ui/nav-bar.tsx'
import { Document } from '../document.tsx'

export function DashboardPage(handle: Handle<{ i18n: I18n; csrfToken: string; email: string }>) {
  return () => {
    let { i18n, csrfToken, email } = handle.props
    let { t } = i18n

    return (
      <Document i18n={i18n} csrfToken={csrfToken} title={t('dashboard.title')}>
        <NavBar i18n={i18n} current="dashboard" />
        <main class="min-h-screen bg-gray-100 px-6 pb-6 pt-24 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <div class="mx-auto w-full max-w-3xl">
            <h1 class="mb-2 text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
            <p class="mb-8 break-all text-gray-600 dark:text-gray-400">
              {t('dashboard.welcome', { email })}
            </p>
            <section class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
              <p class="text-gray-600 dark:text-gray-400">{t('dashboard.empty')}</p>
            </section>
          </div>
        </main>
      </Document>
    )
  }
}
