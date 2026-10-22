import { createRouter, type MiddlewareContext } from 'remix/router'
import { auth, requireAuth } from 'remix/middleware/auth'
import { formData } from 'remix/middleware/form-data'
import { compression } from 'remix/middleware/compression'
import { render } from 'remix/middleware/render'
import { session } from 'remix/middleware/session'
import { staticFiles } from 'remix/middleware/static'

import controller from './actions/controller.tsx'
import signupController from './actions/signup/controller.tsx'
import loginController from './actions/login/controller.tsx'
import { assets } from './assets.ts'
import { sessionAuthScheme } from './data/auth.ts'
import { routes } from './routes.ts'
import { sessionCookie, sessionStorage } from './session.ts'

const renderMiddleware = render({ assets })
const sessionMiddleware = session(sessionCookie, sessionStorage)
const formDataMiddleware = formData()
const authMiddleware = auth({ schemes: [sessionAuthScheme] })
type AppContext = MiddlewareContext<
  [typeof sessionMiddleware, typeof formDataMiddleware, typeof authMiddleware, typeof renderMiddleware]
>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [compression(), staticFiles('./public', { index: false }), sessionMiddleware, formDataMiddleware, authMiddleware, renderMiddleware],
})

router.map(routes, controller)
router.map(routes.signup, signupController)
router.map(routes.login, loginController)
