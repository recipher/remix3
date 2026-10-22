import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const KEY_LENGTH = 64

const scryptAsync = promisify(scrypt)

async function derive(password: string, salt: Buffer): Promise<Buffer> {
  return (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
}

/** Returns `salt:hash`, both hex-encoded. */
export async function hashPassword(password: string): Promise<string> {
  let salt = randomBytes(16)
  let key = await derive(password, salt)
  return `${salt.toString('hex')}:${key.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  let [saltHex, keyHex] = stored.split(':')
  if (!saltHex || !keyHex) return false
  let expected = Buffer.from(keyHex, 'hex')
  let actual = await derive(password, Buffer.from(saltHex, 'hex'))
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
