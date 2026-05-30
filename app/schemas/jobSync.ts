import { z } from 'zod'

/** Admin-configured schedule for the automatic LinkedIn job update. */
export const linkedinSyncScheduleSchema = z.object({
  enabled: z.boolean(),
  job_limit: z.number().int().min(1).max(100),
  interval_weeks: z.number().int().min(1).max(4),
  day_of_week: z.number().int().min(0).max(6),
  hour: z.number().int().min(0).max(23),
  hide_after_weeks: z.number().int().min(1).max(4)
})

export type LinkedinSyncSchedule = z.infer<typeof linkedinSyncScheduleSchema>

export const LINKEDIN_SYNC_SCHEDULE_KEY = 'linkedin_sync_schedule'

export const DEFAULT_SYNC_SCHEDULE: LinkedinSyncSchedule = {
  enabled: false,
  job_limit: 10,
  interval_weeks: 2,
  day_of_week: 0,
  hour: 2,
  hide_after_weeks: 2
}

export const JOB_LIMIT_OPTIONS = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]

export const SYNC_INTERVAL_OPTIONS = [
  { label: 'Every week', value: 1 },
  { label: 'Every 2 weeks', value: 2 },
  { label: 'Every 3 weeks', value: 3 },
  { label: 'Every 4 weeks', value: 4 }
]

export const DAY_OF_WEEK_OPTIONS = [
  { label: 'Monday', value: 0 },
  { label: 'Tuesday', value: 1 },
  { label: 'Wednesday', value: 2 },
  { label: 'Thursday', value: 3 },
  { label: 'Friday', value: 4 },
  { label: 'Saturday', value: 5 },
  { label: 'Sunday', value: 6 }
]

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => ({
  label: `${String(h).padStart(2, '0')}:00`,
  value: h
}))

export const HIDE_AFTER_OPTIONS = [
  { label: '1 week', value: 1 },
  { label: '2 weeks', value: 2 },
  { label: '3 weeks', value: 3 },
  { label: '4 weeks', value: 4 }
]
