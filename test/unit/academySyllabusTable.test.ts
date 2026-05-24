import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('academy syllabus table source', () => {
  it('constrains description column width and wraps text like other admin tables', () => {
    const source = readFileSync(resolve('app/components/admin/academy/SectionSyllabus.vue'), 'utf8')

    expect(source).toContain("meta: { class: { th: 'max-w-[650px]', td: 'align-top' } }")
    expect(source).toContain('line-clamp-2 whitespace-normal text-sm text-muted')
    expect(source).toContain('align-top')
  })
})
