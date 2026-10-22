import { clientEntry, on } from 'remix/component'
import type { Handle } from 'remix/component'

type CopyState = 'idle' | 'copied' | 'failed'

export interface CopyButtonProps {
  /** The text written to the clipboard. */
  text: string
  /** Label while idle. */
  label?: string
  /** Label shown after a successful copy. */
  copiedLabel?: string
  /** Label shown when the browser blocks clipboard access. */
  failedLabel?: string
  /** How long the confirmation stays visible before resetting. */
  resetMs?: number
}

/**
 * Copies `text` to the clipboard, confirms it to the user, then resets to the
 * idle label after `resetMs`. Hydrates on its own; the rest of the page stays static.
 */
export const CopyButton = clientEntry(
  import.meta.url,
  function CopyButton(handle: Handle<CopyButtonProps>) {
    let state: CopyState = 'idle'
    let timer: ReturnType<typeof setTimeout> | undefined

    handle.signal.addEventListener('abort', () => clearTimeout(timer))

    function show(next: CopyState) {
      state = next
      clearTimeout(timer)
      handle.update()
      timer = setTimeout(() => {
        state = 'idle'
        handle.update()
      }, handle.props.resetMs ?? 2000)
    }

    return () => {
      let {
        label = 'Copy',
        copiedLabel = 'Copied!',
        failedLabel = 'Copy failed',
      } = handle.props

      let text = state === 'copied' ? copiedLabel : state === 'failed' ? failedLabel : label
      let tone =
        state === 'copied'
          ? 'border-green-600 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200'
          : state === 'failed'
            ? 'border-red-600 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'

      return (
        <span class="inline-flex">
          <button
            type="button"
            class={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${tone}`}
            mix={on('click', async () => {
              try {
                await navigator.clipboard.writeText(handle.props.text)
                show('copied')
              } catch {
                show('failed')
              }
            })}
          >
            {state === 'copied' ? <CheckIcon /> : <ClipboardIcon />}
            {text}
          </button>
          {/* Announces the result to screen readers without changing the button's own name. */}
          <span role="status" aria-live="polite" class="sr-only">
            {state === 'idle' ? '' : text}
          </span>
        </span>
      )
    }
  },
)

function ClipboardIcon() {
  return () => (
    <svg
      viewBox="0 0 24 24"
      class="size-4"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return () => (
    <svg
      viewBox="0 0 24 24"
      class="size-4"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
