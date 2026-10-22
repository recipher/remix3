import { Auth, requireAuth } from 'remix/middleware/auth'
import { redirect } from 'remix/response/redirect'
import { createController } from 'remix/router'
import { Session } from 'remix/session'
import type { GoodAuth } from 'remix/middleware/auth'

import { assets } from '../assets.ts'
import { isLocale, localeCookie, safeReturnTo } from '../i18n/index.ts'
import { routes } from '../routes.ts'
import { AUTH_SESSION_KEY } from '../session.ts'
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
      return context.render(<HomePage i18n={context.i18n} />)
    },
    async setLocale(context) {
      let locale = context.formData.get('locale')
      let response = redirect(safeReturnTo(context.formData.get('returnTo')), 303)

      if (isLocale(locale)) {
        response.headers.append('Set-Cookie', await localeCookie.serialize(locale))
      }

      return response
    },
    logout(context) {
      let session = context.get(Session)
      session.unset(AUTH_SESSION_KEY)
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
        return context.render(<AccountPage i18n={context.i18n} email={auth.identity.email} />)
      },
    },
    signupSuccess(context) {
      return context.render(<SignupSuccessPage i18n={context.i18n} />)
    },
  },
})
