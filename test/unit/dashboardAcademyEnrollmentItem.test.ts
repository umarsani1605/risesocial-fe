import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('dashboard academy enrollment item source', () => {
  it('renders a Live Now badge before the completed icon when the cohort has a live session', () => {
    const source = readFileSync(resolve('app/components/dashboard/academy/EnrollmentItem.vue'), 'utf8')

    expect(source).toContain('currentTime?: string')
    expect(source).toContain('isLiveNow?: boolean')
    expect(source).toContain('getCohortPhase(props.enrollment.cohort, props.currentTime)')
    expect(source).toContain('function openEnrollment()')
    expect(source).toContain('role="link"')
    expect(source).toContain('@click="openEnrollment"')
    expect(source).toContain('v-if="isLiveNow"')
    expect(source).toContain('Live Now')
    expect(source).toContain('motion-safe:animate-ping')
  })
})
