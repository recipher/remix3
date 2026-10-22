import { form, get, post, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  signup: form('/signup'),
  signupSuccess: get('/signup/success'),
  login: form('/login'),
  logout: post('/logout'),
  account: get('/account'),
  setLocale: post('/locale'),
})
