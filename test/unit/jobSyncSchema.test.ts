import { describe, expect, it } from 'vitest'
import {
  DAY_OF_WEEK_OPTIONS,
  DEFAULT_SYNC_SCHEDULE,
  HIDE_AFTER_OPTIONS,
  linkedinSyncScheduleSchema
} from '../../app/schemas/jobSync'

describe('job sync schedule schema', () => {
  it('includes the hide_after_weeks field with a default of 2 weeks', () => {
    expect(linkedinSyncScheduleSchema.parse({
      enabled: true,
      job_limit: 25,
      interval_weeks: 1,
      day_of_week: 0,
      hour: 2,
      hide_after_weeks: 4
    })).toMatchObject({
      job_limit: 25,
      hide_after_weeks: 4
    })

    expect(DEFAULT_SYNC_SCHEDULE.hide_after_weeks).toBe(2)
    expect(DEFAULT_SYNC_SCHEDULE.job_limit).toBe(10)
    expect(HIDE_AFTER_OPTIONS.map((option) => option.value)).toEqual([1, 2, 3, 4])
  })

  it('lists weekdays starting from Monday in the admin schedule UI', () => {
    expect(DAY_OF_WEEK_OPTIONS.map((option) => option.label)).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ])
  })
})
