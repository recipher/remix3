import type { Handle } from 'remix/component'

/** Hidden form field read by the `csrf()` middleware on unsafe requests. */
export function CsrfField(handle: Handle<{ token: string }>) {
  return () => <input type="hidden" name="_csrf" value={handle.props.token} />
}
