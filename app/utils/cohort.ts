export type CohortPhase = 'not_started' | 'ongoing' | 'completed'

/**
 * Derive visual phase of a cohort from stored status + start_date.
 * Stored cohort.status only meaningfully has 'completed' as authoritative value.
 * 'not_started' vs 'ongoing' is purely a date-based label.
 */
export function getCohortPhase(
  cohort: { status: string; start_date: string | null },
  nowInput: string | Date = new Date()
): CohortPhase {
  const now = new Date(nowInput)

  if (cohort.status === 'completed') return 'completed'
  if (cohort.start_date && now < new Date(cohort.start_date)) return 'not_started'
  return 'ongoing'
}

export function isModuleHash(hash: string) {
  return /^#module-\d+$/.test(hash)
}

export function getOpenModuleIdsForHash(
  hash: string,
  modules: Array<{ id: number; order: number }>
) {
  const match = hash.match(/^#module-(\d+)$/)
  if (!match) return new Set<number>()

  const targetOrder = Number(match[1])
  const targetModule = modules.find((module) => module.order === targetOrder)
  return targetModule ? new Set([targetModule.id]) : new Set<number>()
}
