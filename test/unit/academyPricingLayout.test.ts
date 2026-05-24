import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('academy pricing layout source', () => {
  it('renders single pricing without an extra padded wrapper around AcademyPricingContent', () => {
    const source = readFileSync(resolve('app/pages/academy/[slug]/index.vue'), 'utf8')

    expect(source).not.toContain('<div class="px-6 pb-6 pt-4">')
    expect(source).toContain('<div class="pt-6">')
  })
})
