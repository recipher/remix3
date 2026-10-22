import * as s from 'remix/data-schema'
import { redirect } from 'remix/response/redirect'
import { createController } from 'remix/router'

import { hashPassword } from '../../data/password.ts'
import { users } from '../../data/tables.ts'
import { db } from '../../db.ts'
import { routes } from '../../routes.ts'
import { SignupPage } from './page.tsx'
import { signupForm } from './schema.ts'

export default createController(routes.signup, {
  actions: {
    index(context) {
      return context.render(<SignupPage />)
    },
    async action(context) {
      let parsed = s.parseSafe(signupForm, context.formData)
      if (!parsed.success) {
        let email = context.formData.get('email')
        return context.render(
          <SignupPage email={typeof email === 'string' ? email : ''} issues={parsed.issues} />,
          { status: 400 },
        )
      }

      let { email, password } = parsed.value
      let existing = await db.findOne(users, { where: { email } })
      if (existing) {
        return context.render(
          <SignupPage email={email} error="An account with that email already exists." />,
          { status: 409 },
        )
      }

      await db.create(users, {
        id: crypto.randomUUID(),
        email,
        password_hash: await hashPassword(password),
        created_at: Date.now(),
      })

      return redirect(routes.signupSuccess.href(), 303)
    },
  },
})
