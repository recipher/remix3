import type { Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { CardPage } from '../../ui/layout.tsx'
import { CopyButton } from '../../ui/public/copy-button.tsx'

export function AccountPage(handle: Handle<{ email: string }>) {
  return () => (
    <CardPage title="Account">
      <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
      <p class="mb-3 break-all font-medium">{handle.props.email}</p>
      <div class="mb-6">
        <CopyButton text={handle.props.email} label="Copy email" />
      </div>
      <form method="post" action={routes.logout.href()}>
        <button
          type="submit"
          class="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Log out
        </button>
      </form>
    </CardPage>
  )
}
