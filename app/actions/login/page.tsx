import type { Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { Document } from '../document.tsx'

export interface LoginPageProps {
  email?: string
  error?: string
}

export function LoginPage(handle: Handle<LoginPageProps>) {
  return () => {
    let { email = '', error } = handle.props

    return (
      <Document title="Log in">
        <main>
          <h1>Log in</h1>
          {error && <p role="alert">{error}</p>}
          <form method="post" action={routes.login.action.href()}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={email}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit">Log in</button>
          </form>
          <p>
            No account? <a href={routes.signup.index.href()}>Sign up</a>
          </p>
        </main>
      </Document>
    )
  }
}
