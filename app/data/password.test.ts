import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { hashPassword, verifyPassword } from './password.ts'

describe('hashPassword', () => {
  it('returns hex-encoded salt and key separated by a colon', async () => {
    let hash = await hashPassword('correct horse battery')
    let [salt, key, ...rest] = hash.split(':')

    assert.equal(rest.length, 0)
    assert.match(salt, /^[0-9a-f]{32}$/) // 16 bytes
    assert.match(key, /^[0-9a-f]{128}$/) // 64 bytes
  })

  it('does not contain the password', async () => {
    let hash = await hashPassword('correct horse battery')
    assert.ok(!hash.includes('correct'))
  })

  it('uses a fresh salt, so the same password hashes differently each time', async () => {
    let [a, b] = await Promise.all([hashPassword('same password'), hashPassword('same password')])
    assert.notEqual(a, b)
    assert.notEqual(a.split(':')[0], b.split(':')[0])
  })
})

describe('verifyPassword', () => {
  it('accepts the original password', async () => {
    let hash = await hashPassword('correct horse battery')
    assert.equal(await verifyPassword('correct horse battery', hash), true)
  })

  it('rejects a wrong password', async () => {
    let hash = await hashPassword('correct horse battery')
    assert.equal(await verifyPassword('wrong horse battery', hash), false)
  })

  it('is case-sensitive and whitespace-sensitive', async () => {
    let hash = await hashPassword('Secret Pass')
    assert.equal(await verifyPassword('secret pass', hash), false)
    assert.equal(await verifyPassword('Secret Pass ', hash), false)
  })

  it('verifies each hash of the same password', async () => {
    let [a, b] = await Promise.all([hashPassword('same password'), hashPassword('same password')])
    assert.equal(await verifyPassword('same password', a), true)
    assert.equal(await verifyPassword('same password', b), true)
  })

  it('handles unicode, empty and very long passwords', async () => {
    for (let password of ['pässwörd-密码-🔑', '', 'x'.repeat(10_000)]) {
      let hash = await hashPassword(password)
      assert.equal(await verifyPassword(password, hash), true)
      assert.equal(await verifyPassword(password + 'x', hash), false)
    }
  })

  it('rejects a key taken from another salt', async () => {
    let [saltA] = (await hashPassword('same password')).split(':')
    let [, keyB] = (await hashPassword('same password')).split(':')
    assert.equal(await verifyPassword('same password', `${saltA}:${keyB}`), false)
  })

  it('rejects malformed stored values without throwing', async () => {
    let valid = await hashPassword('correct horse battery')
    let [salt, key] = valid.split(':')

    for (let stored of [
      '', // nothing stored
      'no-separator',
      ':', // both parts empty
      `:${key}`, // missing salt
      `${salt}:`, // missing key
      `${salt}:${key.slice(0, 64)}`, // key too short
      `${salt}:${key}00`, // key too long
      `${salt}:not-hex`, // key is not hex
    ]) {
      assert.equal(await verifyPassword('correct horse battery', stored), false, stored)
    }
  })

  it('ignores extra colon-separated parts after the key', async () => {
    let hash = await hashPassword('correct horse battery')
    assert.equal(await verifyPassword('correct horse battery', `${hash}:extra`), true)
  })
})
