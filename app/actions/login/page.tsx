import type { Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { buttonClass, CardPage, ErrorAlert, Field, linkClass } from '../../ui/layout.tsx'

export interface LoginPageProps {
  email?: string
  error?: string
}

export function LoginPage(handle: Handle<LoginPageProps>) {
  return () => {
    let { email = '', error } = handle.props

    return (
      <CardPage title="Log in">
        {error && <ErrorAlert>{error}</ErrorAlert>}
        <form method="post" action={routes.login.action.href()} class="flex flex-col gap-4">
          <Field id="email" label="Email" type="email" autoComplete="email" defaultValue={email} />
          <Field id="password" label="Password" type="password" autoComplete="current-password" />
          <button type="submit" class={buttonClass}>
            Log in
          </button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          No account?{' '}
          <a href={routes.signup.index.href()} class={linkClass}>
            Sign up
          </a>
        </p>
      </CardPage>
    )
  }
}
