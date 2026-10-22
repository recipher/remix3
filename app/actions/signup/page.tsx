import type { Handle } from 'remix/component'
import type { Issue } from 'remix/data-schema'

import { routes } from '../../routes.ts'
import { Document } from '../document.tsx'

export interface SignupPageProps {
  email?: string
  issues?: readonly Issue[]
  error?: string
}

export function SignupPage(handle: Handle<SignupPageProps>) {
  return () => {
    let { email = '', issues = [], error } = handle.props
    let issueFor = (name: string) => issues.find((issue) => issue.path?.[0] === name)
    let emailIssue = issueFor('email')
    let passwordIssue = issueFor('password')

    return (
      <Document title="Sign up">
        <main>
          <h1>Sign up</h1>
          {error && <p role="alert">{error}</p>}
          <form method="post" action={routes.signup.action.href()}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={email}
                required
                aria-invalid={emailIssue ? true : undefined}
              />
              {emailIssue && <p>{emailIssue.message}</p>}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                aria-invalid={passwordIssue ? true : undefined}
              />
              {passwordIssue && <p>{passwordIssue.message}</p>}
            </div>
            <button type="submit">Create account</button>
          </form>
        </main>
      </Document>
    )
  }
}

export function SignupSuccessPage() {
  return () => (
    <Document title="Welcome">
      <main>
        <h1>Account created</h1>
        <p>Thanks for signing up.</p>
      </main>
    </Document>
  )
}
