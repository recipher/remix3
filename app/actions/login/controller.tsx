import { completeAuth, verifyCredentials } from 'remix/auth'
import { redirect } from 'remix/response/redirect'
import { createController } from 'remix/router'

import { passwordProvider } from '../../data/auth.ts'
import { routes } from '../../routes.ts'
import { AUTH_SESSION_KEY } from '../../session.ts'
import { LoginPage } from './page.tsx'

export default createController(routes.login, {
  actions: {
    index(context) {
      return context.render(<LoginPage />)
    },
    async action(context) {
      let identity = await verifyCredentials(passwordProvider, context)

      if (identity == null) {
        let email = context.formData.get('email')
        return context.render(
          <LoginPage
            email={typeof email === 'string' ? email : ''}
            error="Invalid email or password."
          />,
          { status: 401 },
        )
      }

      // Rotates the session id to prevent session fixation.
      let session = completeAuth(context)
      session.set(AUTH_SESSION_KEY, { userId: identity.id })

      return redirect(routes.account.href(), 303)
    },
  },
})
