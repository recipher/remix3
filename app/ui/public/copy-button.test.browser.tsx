import * as assert from 'remix/assert'
import { render } from 'remix/component/test'
import { describe, it } from 'remix/test'

import { CopyButton } from './copy-button.tsx'
import type { CopyButtonProps } from './copy-button.tsx'

const RESET_MS = 40

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Replaces the browser clipboard for one test and restores it afterwards. */
function stubClipboard(writeText: (text: string) => Promise<void>) {
  let original = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

  return () => {
    if (original) Object.defineProperty(navigator, 'clipboard', original)
    else delete (navigator as { clipboard?: unknown }).clipboard
  }
}

function setup(props: Partial<CopyButtonProps> = {}) {
  let rendered = render(<CopyButton text="hello@example.com" resetMs={RESET_MS} {...props} />)
  let button = rendered.$('button')
  assert.ok(button instanceof HTMLButtonElement)
  return { ...rendered, button, status: rendered.$('[role="status"]')! }
}

describe('CopyButton', () => {
  it('starts with the idle label and an empty status region', async (t) => {
    let { button, status, cleanup } = setup({ label: 'Copy email' })
    t.after(cleanup)

    assert.equal(button.textContent, 'Copy email')
    assert.equal(button.type, 'button')
    assert.equal(status.textContent, '')
    assert.equal(status.getAttribute('aria-live'), 'polite')
  })

  it('uses the default labels when none are given', async (t) => {
    let { button, cleanup } = setup()
    t.after(cleanup)
    assert.equal(button.textContent, 'Copy')
  })

  it('copies the text, confirms it, and announces it', async (t) => {
    let copied: string[] = []
    t.after(
      stubClipboard(async (text) => {
        copied.push(text)
      }),
    )
    let { button, status, act, cleanup } = setup({ copiedLabel: 'Copied!' })
    t.after(cleanup)

    await act(() => button.click())
    await sleep(0)

    assert.deepEqual(copied, ['hello@example.com'])
    assert.equal(button.textContent, 'Copied!')
    assert.equal(status.textContent, 'Copied!')
    assert.match(button.className, /border-green-600/)
  })

  it('resets to the idle label after resetMs', async (t) => {
    t.after(stubClipboard(async () => {}))
    let { button, status, act, cleanup } = setup({ label: 'Copy', resetMs: RESET_MS })
    t.after(cleanup)

    await act(() => button.click())
    await sleep(0)
    assert.equal(button.textContent, 'Copied!')

    await sleep(RESET_MS + 60)
    await act(() => {})
    assert.equal(button.textContent, 'Copy')
    assert.equal(status.textContent, '')
    assert.doesNotMatch(button.className, /border-green-600/)
  })

  it('shows a failure message when the clipboard is unavailable', async (t) => {
    t.after(
      stubClipboard(async () => {
        throw new Error('NotAllowedError')
      }),
    )
    let { button, status, act, cleanup } = setup({ failedLabel: 'Copy failed' })
    t.after(cleanup)

    await act(() => button.click())
    await sleep(0)

    assert.equal(button.textContent, 'Copy failed')
    assert.equal(status.textContent, 'Copy failed')
    assert.match(button.className, /border-red-600/)

    await sleep(RESET_MS + 60)
    await act(() => {})
    assert.equal(button.textContent, 'Copy')
  })

  it('shows a failure message when navigator.clipboard is missing', async (t) => {
    let original = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    t.after(() => {
      if (original) Object.defineProperty(navigator, 'clipboard', original)
      else delete (navigator as { clipboard?: unknown }).clipboard
    })
    let { button, act, cleanup } = setup()
    t.after(cleanup)

    await act(() => button.click())
    await sleep(0)
    assert.equal(button.textContent, 'Copy failed')
  })

  it('keeps the confirmation visible for about two seconds by default', async (t) => {
    t.after(stubClipboard(async () => {}))
    let { button, act, cleanup } = setup({ resetMs: undefined })
    t.after(cleanup)

    await act(() => button.click())
    await sleep(150)
    assert.equal(button.textContent, 'Copied!')
  })

  it('restarts the reset timer when clicked again', async (t) => {
    t.after(stubClipboard(async () => {}))
    let { button, act, cleanup } = setup({ resetMs: 120 })
    t.after(cleanup)

    await act(() => button.click())
    await sleep(80)
    await act(() => button.click())
    await sleep(80)

    // 160ms after the first click, but only 80ms after the second: still confirmed.
    assert.equal(button.textContent, 'Copied!')

    await sleep(100)
    await act(() => {})
    assert.equal(button.textContent, 'Copy')
  })

  it('stops the reset timer when removed', async (t) => {
    t.after(stubClipboard(async () => {}))
    let { button, act, cleanup } = setup()

    await act(() => button.click())
    await sleep(0)
    cleanup()

    // The timer would call handle.update() on a removed component; this must not throw.
    await sleep(RESET_MS + 60)
    assert.ok(true)
  })
})
