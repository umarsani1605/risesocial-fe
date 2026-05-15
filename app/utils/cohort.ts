export type CohortPhase = 'not_started' | 'ongoing' | 'completed'

/**
 * Derive visual phase of a cohort from stored status + start_date.
 * Stored cohort.status only meaningfully has 'completed' as authoritative value.
 * 'not_started' vs 'ongoing' is purely a date-based label.
 */
export function getCohortPhase(
  cohort: { status: string; start_date: string | null }
): CohortPhase {
  if (cohort.status === 'completed') return 'completed'
  if (cohort.start_date && new Date() < new Date(cohort.start_date)) return 'not_started'
  return 'ongoing'
}
