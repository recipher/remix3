import type { Handle } from 'remix/component'

import type { I18n } from '../../i18n/index.ts'
import { routes } from '../../routes.ts'
import { buttonClass, CardPage, ErrorAlert, Field, linkClass } from '../../ui/layout.tsx'

export interface LoginPageProps {
  i18n: I18n
  email?: string
  error?: string
}

export function LoginPage(handle: Handle<LoginPageProps>) {
  return () => {
    let { i18n, email = '', error } = handle.props
    let { t } = i18n

    return (
      <CardPage i18n={i18n} title={t('login.title')}>
        {error && <ErrorAlert>{error}</ErrorAlert>}
        <form method="post" action={routes.login.action.href()} class="flex flex-col gap-4">
          <Field
            id="email"
            label={t('login.email')}
            type="email"
            autoComplete="email"
            defaultValue={email}
          />
          <Field
            id="password"
            label={t('login.password')}
            type="password"
            autoComplete="current-password"
          />
          <button type="submit" class={buttonClass}>
            {t('login.submit')}
          </button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('login.noAccount')}{' '}
          <a href={routes.signup.index.href()} class={linkClass}>
            {t('login.signupLink')}
          </a>
        </p>
      </CardPage>
    )
  }
}
