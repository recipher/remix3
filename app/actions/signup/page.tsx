import type { Handle } from 'remix/component'
import type { Issue } from 'remix/data-schema'

import { routes } from '../../routes.ts'
import { buttonClass, CardPage, ErrorAlert, Field, linkClass } from '../../ui/layout.tsx'

export interface SignupPageProps {
  email?: string
  issues?: readonly Issue[]
  error?: string
}

export function SignupPage(handle: Handle<SignupPageProps>) {
  return () => {
    let { email = '', issues = [], error } = handle.props
    let issueFor = (name: string) => issues.find((issue) => issue.path?.[0] === name)?.message

    return (
      <CardPage title="Sign up">
        {error && <ErrorAlert>{error}</ErrorAlert>}
        <form method="post" action={routes.signup.action.href()} class="flex flex-col gap-4">
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            defaultValue={email}
            error={issueFor('email')}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            error={issueFor('password')}
          />
          <p class="-mt-2 text-xs text-gray-500 dark:text-gray-400">At least 8 characters.</p>
          <button type="submit" class={buttonClass}>
            Create account
          </button>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href={routes.login.index.href()} class={linkClass}>
            Log in
          </a>
        </p>
      </CardPage>
    )
  }
}

export function SignupSuccessPage() {
  return () => (
    <CardPage title="Welcome" heading="Account created">
      <p class="mb-6 text-gray-600 dark:text-gray-400">Thanks for signing up. You can now log in.</p>
      <a href={routes.login.index.href()} class={buttonClass + ' block text-center'}>
        Log in
      </a>
    </CardPage>
  )
}
