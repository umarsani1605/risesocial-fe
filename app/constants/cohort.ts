export const COHORT_STATUS_COLOR: Record<string, 'success' | 'warning' | 'neutral'> = {
  not_started: 'neutral',
  ongoing: 'warning',
  completed: 'success',
}

export const COHORT_STATUS_ITEMS = [
  { label: 'Not Started', value: 'not_started' },
  { label: 'On Going', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
]

export const COHORT_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  COHORT_STATUS_ITEMS.map((i) => [i.value, i.label])
)

export const MODULE_PUBLISH_ITEMS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]
