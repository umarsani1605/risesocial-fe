import type { LinkedinSyncSchedule } from '@/schemas/jobSync'

const MS_PER_DAY = 86_400_000
/** Jakarta is UTC+7 year-round (no DST), so a fixed offset is exact. */
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000

/**
 * Next time the scheduled sync will run, mirroring the backend due-check
 * (`jobSyncSchedulerService.isDue`): the configured weekday + hour in
 * Asia/Jakarta, no sooner than `interval_weeks` (minus 1-day slack) after the
 * last sync. Returns null when the schedule is disabled.
 */
export function computeNextSync(
  schedule: LinkedinSyncSchedule,
  lastSyncedAt: string | null,
  now: Date = new Date()
): Date | null {
  if (!schedule?.enabled) return null

  const intervalMs = schedule.interval_weeks * 7 * MS_PER_DAY
  const intervalGate = lastSyncedAt
    ? new Date(lastSyncedAt).getTime() + (schedule.interval_weeks * 7 - 1) * MS_PER_DAY
    : now.getTime() + intervalMs
  const start = Math.max(now.getTime(), intervalGate)

  // Scan forward up to 8 days (covers "later today" through "same weekday next week").
  for (let i = 0; i < 8; i++) {
    const probeJakarta = new Date(start + JAKARTA_OFFSET_MS + i * MS_PER_DAY)
    if (probeJakarta.getUTCDay() !== schedule.day_of_week) continue
    const runUtc =
      Date.UTC(
        probeJakarta.getUTCFullYear(),
        probeJakarta.getUTCMonth(),
        probeJakarta.getUTCDate(),
        schedule.hour
      ) - JAKARTA_OFFSET_MS
    if (runUtc >= start) return new Date(runUtc)
  }
  return null
}
