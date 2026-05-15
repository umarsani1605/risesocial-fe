export const COHORT_PHASE_COLOR: Record<string, 'success' | 'primary' | 'neutral'> = {
  not_started: 'neutral',
  ongoing: 'success',
  completed: 'primary',
}

export const COHORT_PHASE_ITEMS = [
  { label: 'Not Started', value: 'not_started' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
]

export const COHORT_PHASE_LABEL: Record<string, string> = Object.fromEntries(
  COHORT_PHASE_ITEMS.map((i) => [i.value, i.label])
)

export const MODULE_PUBLISH_ITEMS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]
