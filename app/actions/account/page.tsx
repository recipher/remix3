import type { Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { Document } from '../document.tsx'

export function AccountPage(handle: Handle<{ email: string }>) {
  return () => (
    <Document title="Account">
      <main>
        <h1>Account</h1>
        <p>Signed in as {handle.props.email}</p>
        <form method="post" action={routes.logout.href()}>
          <button type="submit">Log out</button>
        </form>
      </main>
    </Document>
  )
}
