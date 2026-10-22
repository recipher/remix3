import { Auth, requireAuth } from 'remix/middleware/auth'
import { redirect } from 'remix/response/redirect'
import { createController } from 'remix/router'
import { Session } from 'remix/session'
import type { GoodAuth } from 'remix/middleware/auth'

import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import type { Identity } from '../data/auth.ts'
import { AccountPage } from './account/page.tsx'
import { HomePage } from './home-page.tsx'
import { SignupSuccessPage } from './signup/page.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },
    home(context) {
      return context.render(<HomePage />)
    },
    logout(context) {
      let session = context.get(Session)
      session.unset('auth')
      session.regenerateId(true)
      return redirect(routes.login.index.href(), 303)
    },
    account: {
      middleware: [
        requireAuth({
          onFailure: () => redirect(routes.login.index.href(), 303),
        }),
      ],
      handler(context) {
        let auth = context.get(Auth) as GoodAuth<Identity>
        return context.render(<AccountPage email={auth.identity.email} />)
      },
    },
    signupSuccess(context) {
      return context.render(<SignupSuccessPage />)
    },
  },
})
