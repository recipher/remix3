import type { Handle, RemixNode } from 'remix/component'

import { Document } from '../actions/document.tsx'
import type { I18n } from '../i18n/index.ts'

export const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 aria-[invalid=true]:border-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'

export const buttonClass =
  'w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60'

export const linkClass = 'font-medium text-blue-600 hover:underline dark:text-blue-400'

/** Centered card on a tinted page background, used by the auth pages. */
export function CardPage(
  handle: Handle<{
    i18n: I18n
    csrfToken: string
    title: string
    heading?: string
    children?: RemixNode
  }>,
) {
  return () => {
    let { i18n, csrfToken, title, heading = title, children } = handle.props
    return (
      <Document i18n={i18n} csrfToken={csrfToken} title={title}>
        <main class="flex min-h-screen items-center justify-center bg-gray-100 p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <h1 class="mb-6 text-2xl font-bold tracking-tight">{heading}</h1>
            {children}
          </div>
        </main>
      </Document>
    )
  }
}

export function Field(
  handle: Handle<{
    id: string
    label: string
    type?: 'text' | 'email' | 'password'
    autoComplete?: string
    defaultValue?: string
    minLength?: number
    error?: string
  }>,
) {
  return () => {
    let { id, label, type = 'text', autoComplete, defaultValue, minLength, error } = handle.props
    return (
      <div class="flex flex-col gap-1">
        <label htmlFor={id} class="text-sm font-medium">
          {label}
        </label>
        <input
          id={id}
          name={id}
          type={type as 'text'}
          class={inputClass}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          minLength={minLength}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
          <p id={`${id}-error`} class="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
}

export function ErrorAlert(handle: Handle<{ children?: RemixNode }>) {
  return () => (
    <p
      role="alert"
      class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200"
    >
      {handle.props.children}
    </p>
  )
}
