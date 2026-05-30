import { describe, expect, it } from 'vitest'
import { computeNextSync } from '../../app/utils/nextSync'
import type { LinkedinSyncSchedule } from '../../app/schemas/jobSync'

// A UTC Date whose Asia/Jakarta (UTC+7) wall-clock is the given Y/M/D/H[:M].
const jakartaTime = (y: number, mo: number, d: number, h: number, mi = 0) =>
  new Date(Date.UTC(y, mo, d, h, mi) - 7 * 60 * 60 * 1000)
// Read back the Jakarta wall-clock components of a UTC instant.
const inJakarta = (date: Date) => new Date(date.getTime() + 7 * 60 * 60 * 1000)

// 2024-01-01 is Monday (day_of_week 0 in Monday-first indexing).
const schedule = (over: Partial<LinkedinSyncSchedule> = {}): LinkedinSyncSchedule => ({
  enabled: true,
  interval_weeks: 2,
  day_of_week: 0,
  hour: 2,
  ...over
})

describe('computeNextSync', () => {
  it('returns null when disabled', () => {
    expect(computeNextSync(schedule({ enabled: false }), null, jakartaTime(2024, 0, 3, 10))).toBeNull()
  })

  it('bases an unsynced schedule on today plus the configured interval', () => {
    // Now: Wed 2024-01-03 10:00 WIB; interval gate lands on Wed 2024-01-17,
    // then the next configured Monday is Mon 2024-01-22 02:00 WIB.
    const next = computeNextSync(schedule(), null, jakartaTime(2024, 0, 3, 10))!
    const jak = inJakarta(next)
    expect(jak.getUTCDay()).toBe(1)
    expect(jak.getUTCDate()).toBe(22)
    expect(jak.getUTCHours()).toBe(2)
  })

  it('ignores weekday alignment for the UI preview and uses the current date plus interval', () => {
    // Now: Mon 2024-01-01 01:00 WIB; interval 2 weeks -> Mon 2024-01-15 02:00 WIB.
    const next = computeNextSync(schedule(), null, jakartaTime(2024, 0, 1, 1))!
    const jak = inJakarta(next)
    expect(jak.getUTCDate()).toBe(15)
    expect(jak.getUTCHours()).toBe(2)
  })

  it('respects the interval since the last sync', () => {
    // Last sync advances the interval gate with the same 1-day slack as the
    // backend due-check, so the next configured Monday is 2024-01-15.
    const next = computeNextSync(
      schedule({ interval_weeks: 2 }),
      jakartaTime(2024, 0, 1, 2).toISOString(),
      jakartaTime(2024, 0, 3, 10)
    )!
    const jak = inJakarta(next)
    expect(jak.getUTCDay()).toBe(1)
    expect(jak.getUTCDate()).toBe(15)
    expect(jak.getUTCHours()).toBe(2)
  })

  it('weekly interval previews exactly one week ahead', () => {
    const next = computeNextSync(
      schedule({ interval_weeks: 1 }),
      jakartaTime(2024, 0, 1, 2).toISOString(),
      jakartaTime(2024, 0, 1, 2)
    )!
    expect(inJakarta(next).getUTCDate()).toBe(8)
    expect(inJakarta(next).getUTCDay()).toBe(1)
  })
})
