import type { Handle } from 'remix/component'

import type { I18n, MessageKey } from '../i18n/index.ts'
import { routes } from '../routes.ts'

type NavKey = 'home' | 'dashboard' | 'account'

const ITEMS: { key: NavKey; href: () => string; label: MessageKey }[] = [
  { key: 'home', href: () => routes.home.href(), label: 'nav.home' },
  { key: 'dashboard', href: () => routes.dashboard.href(), label: 'nav.dashboard' },
  { key: 'account', href: () => routes.account.href(), label: 'nav.account' },
]

const BASE = 'rounded-full px-4 py-1 font-medium transition-colors'
const ACTIVE = 'bg-blue-600 text-white'
const INACTIVE =
  'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'

export function NavBar(handle: Handle<{ i18n: I18n; current: NavKey }>) {
  return () => {
    let { i18n, current } = handle.props
    let { t } = i18n

    return (
      <nav
        aria-label={t('nav.label')}
        class="fixed left-4 top-4 z-10 flex gap-1 rounded-full bg-white/80 p-1 text-sm shadow backdrop-blur dark:bg-gray-800/80"
      >
        {ITEMS.map((item) => (
          <a
            key={item.key}
            href={item.href()}
            aria-current={item.key === current ? 'page' : undefined}
            class={`${BASE} ${item.key === current ? ACTIVE : INACTIVE}`}
          >
            {t(item.label)}
          </a>
        ))}
      </nav>
    )
  }
}
