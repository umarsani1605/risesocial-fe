import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('dashboard academy index source', () => {
  it('derives live cohort ids from upcoming sessions and passes the flag into enrollment items', () => {
    const source = readFileSync(resolve('app/pages/dashboard/academy/index.vue'), 'utf8')

    expect(source).toContain("useAsyncData('dashboard:upcoming'")
    expect(source).toContain("query: { limit: 4 }")
    expect(source).toContain("const currentTime = useState('dashboard:academy:current-time'")
    expect(source).toContain('const liveCohortIds = computed')
    expect(source).toContain(':current-time="currentTime"')
    expect(source).toContain(":is-live-now=\"enrollment.cohort ? liveCohortIds.has(enrollment.cohort.id) : false\"")
  })
})
