import { describe, expect, it } from 'vitest'
import { getCohortPhase, getOpenModuleIdsForHash } from '../../app/utils/cohort'

describe('getOpenModuleIdsForHash', () => {
  const modules = [
    { id: 10, order: 1, is_published: true },
    { id: 20, order: 2, is_published: true },
    { id: 30, order: 3, is_published: true }
  ]

  it('opens only the module matching the module hash order', () => {
    expect([...getOpenModuleIdsForHash('#module-2', modules)]).toEqual([20])
  })

  it('returns an empty set when the hash does not match a visible module', () => {
    expect([...getOpenModuleIdsForHash('#module-99', modules)]).toEqual([])
  })

  it('ignores hashes that are not module targets', () => {
    expect([...getOpenModuleIdsForHash('#mentors', modules)]).toEqual([])
  })
})

describe('getCohortPhase', () => {
  it('uses the provided current time when deriving not_started vs ongoing', () => {
    expect(
      getCohortPhase(
        { status: 'published', start_date: '2026-06-01T00:00:00.000Z' },
        '2026-05-27T00:00:00.000Z'
      )
    ).toBe('not_started')

    expect(
      getCohortPhase(
        { status: 'published', start_date: '2026-05-01T00:00:00.000Z' },
        '2026-05-27T00:00:00.000Z'
      )
    ).toBe('ongoing')
  })
})
