import * as s from 'remix/data-schema'
import * as checks from 'remix/data-schema/checks'
import * as coerce from 'remix/data-schema/coerce'
import * as f from 'remix/data-schema/form-data'

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../data/password-rules.ts'

export const signupForm = f.object({
  email: f.field(
    coerce
      .string()
      .transform((value) => value.trim().toLowerCase())
      .pipe(checks.email()),
  ),
  password: f.field(s.string().pipe(checks.minLength(PASSWORD_MIN_LENGTH), checks.maxLength(PASSWORD_MAX_LENGTH))),
})
