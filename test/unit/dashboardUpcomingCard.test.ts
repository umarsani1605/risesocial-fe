import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('dashboard upcoming card source', () => {
  it('replaces the Live Session label with a red Live Now ping badge for ongoing sessions', () => {
    const source = readFileSync(resolve('app/components/dashboard/UpcomingCard.vue'), 'utf8')

    expect(source).toContain('const isLiveNow = computed')
    expect(source).toContain('const isToday = computed')
    expect(source).toContain('const isAssignmentDeadlineToday = computed')
    expect(source).toContain('Live Now')
    expect(source).toContain('Deadline Today')
    expect(source).toContain('motion-safe:animate-ping')
    expect(source).toContain('border-red-200 bg-red-50')
    expect(source).toContain('v-if="isLiveNow"')
    expect(source).toContain('v-else-if="isAssignmentDeadlineToday"')
    expect(source).toContain("v-else-if=\"session.type === 'session'\"")
    expect(source).toContain("isToday ? 'border-deep-teal-850 bg-deep-teal-700' : 'border border-default bg-white'")
    expect(source).toContain("isToday ? 'text-white/70 font-black' : 'text-slate-500 font-bold'")
    expect(source).toContain("isToday ? 'text-white font-black' : 'text-slate-800 font-extrabold'")
  })
})
