import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const pageSource = readFileSync(
  resolve(import.meta.dirname, '../../app/pages/admin/jobs/index.vue'),
  'utf8'
)

describe('Admin jobs manual sync popover', () => {
  it('uses standalone button variants inside the confirmation popover', () => {
    expect(pageSource).toContain('Perform manual job sync?')
    expect(pageSource).toContain('label="No"')
    expect(pageSource).toContain('label="Yes"')
    expect(pageSource).toContain('variant="outline"')
    expect(pageSource).toContain('variant="solid"')
  })
})
