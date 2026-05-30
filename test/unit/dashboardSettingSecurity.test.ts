import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('dashboard security settings source', () => {
  it('submits both password and repeatPassword to the security endpoint', () => {
    const source = readFileSync(resolve('app/pages/dashboard/setting/security.vue'), 'utf8')

    expect(source).toContain("await api('/users/security'")
    expect(source).toContain('password: form.password')
    expect(source).toContain('repeatPassword: form.repeatPassword')
  })
})
