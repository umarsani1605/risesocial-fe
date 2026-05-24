import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getAuthCookieOptions } from '../../app/utils/auth'

describe('getAuthCookieOptions', () => {
  it('disables secure cookies for localhost over http', () => {
    expect(getAuthCookieOptions({ isHttps: false, isProduction: false }).secure).toBe(false)
  })

  it('enables secure cookies for https contexts', () => {
    expect(getAuthCookieOptions({ isHttps: true, isProduction: false }).secure).toBe(true)
  })
})

describe('login page security fallback', () => {
  it('uses POST method so native form submission does not leak credentials in query params', () => {
    const source = readFileSync(resolve('app/pages/login.vue'), 'utf8')

    expect(source).toContain('method="post"')
  })
})
