import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { readAppDisplayName } from './document.tsx'

describe('readAppDisplayName', () => {
  it('uses a generic name while the scaffold placeholder is unreplaced', () => {
    assert.equal(readAppDisplayName('%%APP_NAME%%'), 'Remix App')
  })

  it('returns the configured name', () => {
    assert.equal(readAppDisplayName('Remix3'), 'Remix3')
  })

  it('decodes a URL-encoded name', () => {
    assert.equal(readAppDisplayName('My%20App'), 'My App')
  })
})
