import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('admin cohort module item source', () => {
  it('shows a Live Now badge for live module states and highlights module numbers from live onward', () => {
    const source = readFileSync(resolve('app/components/admin/cohort/ModuleItem.vue'), 'utf8')

    expect(source).toContain("return ['live', 'closing_soon'].includes(getStatus(module))")
    expect(source).toContain("['live', 'closing_soon', 'completed'].includes(getStatus(module))")
    expect(source).toContain('Live Now')
    expect(source).toContain('motion-safe:animate-ping')
  })
})
