import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const componentSource = readFileSync(
  resolve(import.meta.dirname, '../../app/components/admin/jobs/SyncSettingsModal.vue'),
  'utf8'
)

describe('SyncSettingsModal layout', () => {
  it('places schedule settings below the filter fields without tabs', () => {
    expect(componentSource.includes('<UTabs')).toBe(false)

    const jobsIndex = componentSource.indexOf('Jobs')
    const scheduleIndex = componentSource.indexOf('Enable automatic sync')
    const filterIndex = componentSource.indexOf('Job title keywords')
    const hideAfterIndex = componentSource.indexOf('Hide jobs after')

    expect(jobsIndex).toBeGreaterThan(-1)
    expect(scheduleIndex).toBeGreaterThan(-1)
    expect(filterIndex).toBeGreaterThan(-1)
    expect(hideAfterIndex).toBeGreaterThan(-1)
    expect(scheduleIndex).toBeGreaterThan(filterIndex)
    expect(jobsIndex).toBeGreaterThan(scheduleIndex)
  })
})
