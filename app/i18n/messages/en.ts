// English is the source of truth: other locales must define every key below.
export const en = {
  'language.label': 'Language',

  'home.welcome': 'Welcome to',
  'home.welcomeLabel': 'Welcome',
  'home.gettingStartedLabel': 'Getting started',
  'home.getStarted': 'Get started',
  'home.signup': 'Sign up',
  'home.login': 'Log in',
  'home.api': 'Remix API',
  'home.discord': 'Join Discord',
  'home.aiTitle': 'Coding with AI?',
  'home.aiIntro':
    'Navigate to this project folder using your preferred AI-powered tool, and try copying any of these prompts into the agent chat:',
  'home.socialLabel': 'Remix social links',
  'home.license': 'DOCS AND EXAMPLES LICENSED UNDER MIT',

  'copy.copy': 'Copy',
  'copy.copied': 'Copied!',
  'copy.failed': 'Copy failed',

  'login.title': 'Log in',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.submit': 'Log in',
  'login.noAccount': 'No account?',
  'login.signupLink': 'Sign up',
  'login.invalid': 'Invalid email or password.',

  'signup.title': 'Sign up',
  'signup.email': 'Email',
  'signup.password': 'Password',
  'signup.passwordHint': 'At least {min} characters.',
  'signup.submit': 'Create account',
  'signup.haveAccount': 'Already have an account?',
  'signup.loginLink': 'Log in',
  'signup.emailInvalid': 'Enter a valid email address.',
  'signup.passwordLength': 'Password must be between {min} and {max} characters.',
  'signup.emailTaken': 'An account with that email already exists.',

  'success.pageTitle': 'Welcome',
  'success.title': 'Account created',
  'success.body': 'Thanks for signing up. You can now log in.',
  'success.login': 'Log in',

  'account.title': 'Account',
  'account.signedInAs': 'Signed in as',
  'account.copyEmail': 'Copy email',
  'account.logout': 'Log out',

  'nav.label': 'Main',
  'nav.home': 'Home',
  'nav.dashboard': 'Dashboard',
  'nav.account': 'Account',

  'dashboard.title': 'Dashboard',
  'dashboard.welcome': 'Welcome back, {email}.',
  'dashboard.empty': 'Nothing here yet.',
} as const

export type MessageKey = keyof typeof en
export type Messages = Record<MessageKey, string>
