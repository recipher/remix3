import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { get } from './test-utils.ts'

describe('asset route', () => {
  it('returns 404 for an asset that does not exist', async () => {
    let response = await get('/assets/app/does-not-exist.js')
    assert.equal(response.status, 404)
    assert.equal(await response.text(), 'Not Found')
  })

  it('returns 404 for files outside the allowed asset roots', async () => {
    for (let path of ['/assets/package.json', '/assets/app/db.ts', '/assets/db/app.sqlite']) {
      let response = await get(path)
      assert.equal(response.status, 404, path)
    }
  })

  it('serves a browser module that is allowed', async () => {
    let response = await get('/assets/app/ui/public/copy-button.tsx')
    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /javascript/)
  })
})
