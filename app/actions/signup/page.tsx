import type { Handle } from 'remix/component'
import type { Issue } from 'remix/data-schema'

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../data/password-rules.ts'
import type { I18n } from '../../i18n/index.ts'
import { routes } from '../../routes.ts'
import { buttonClass, CardPage, ErrorAlert, Field, linkClass } from '../../ui/layout.tsx'

export interface SignupPageProps {
  i18n: I18n
  email?: string
  issues?: readonly Issue[]
  error?: string
}

export function SignupPage(handle: Handle<SignupPageProps>) {
  return () => {
    let { i18n, email = '', issues = [], error } = handle.props
    let { t } = i18n
    let params = { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH }
    // Schema messages are English, so show a translated message per failing field.
    let hasIssue = (name: string) => issues.some((issue) => issue.path?.[0] === name)

    return (
      <CardPage i18n={i18n} title={t('signup.title')}>
        {error && <ErrorAlert>{error}</ErrorAlert>}
        <form method="post" action={routes.signup.action.href()} class="flex flex-col gap-4">
          <Field
            id="email"
            label={t('signup.email')}
            type="email"
            autoComplete="email"
            defaultValue={email}
            error={hasIssue('email') ? t('signup.emailInvalid') : undefined}
          />
          <Field
            id="password"
            label={t('signup.password')}
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            error={hasIssue('password') ? t('signup.passwordLength', params) : undefined}
          />
          <p class="-mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('signup.passwordHint', params)}
          </p>
          <button type="submit" class={buttonClass}>
            {t('signup.submit')}
          </button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('signup.haveAccount')}{' '}
          <a href={routes.login.index.href()} class={linkClass}>
            {t('signup.loginLink')}
          </a>
        </p>
      </CardPage>
    )
  }
}

export function SignupSuccessPage(handle: Handle<{ i18n: I18n }>) {
  return () => {
    let { i18n } = handle.props
    let { t } = i18n

    return (
      <CardPage i18n={i18n} title={t('success.pageTitle')} heading={t('success.title')}>
        <p class="mb-6 text-gray-600 dark:text-gray-400">{t('success.body')}</p>
        <a href={routes.login.index.href()} class={buttonClass + ' block text-center'}>
          {t('success.login')}
        </a>
      </CardPage>
    )
  }
}
