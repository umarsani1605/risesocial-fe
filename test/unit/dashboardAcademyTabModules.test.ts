import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('dashboard academy tab modules source', () => {
  it('shows a reduced-motion friendly Live Now badge for live module states and highlights module numbers from live onward', () => {
    const source = readFileSync(resolve('app/components/dashboard/academy/TabModules.vue'), 'utf8')

    expect(source).toContain("return ['live', 'closing_soon'].includes(getStatus(module))")
    expect(source).toContain("['live', 'closing_soon', 'completed'].includes(getStatus(module))")
    expect(source).toContain('Live Now')
    expect(source).toContain('motion-safe:animate-ping')
    expect(source).toContain('motion-reduce:animate-none')
    expect(source).toContain('border-red-200 bg-red-50')
  })
})
