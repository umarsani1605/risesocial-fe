import type { AcademyStatus } from '@/types'

export const ACADEMY_DURATION_OPTIONS = ['1 Month', '2 Months', '3 Months', '6 Months'].map(
  (v) => ({ label: v, value: v })
)

export const ACADEMY_FORMAT_OPTIONS = ['Online Live Classes'].map((v) => ({ label: v, value: v }))

export const ACADEMY_STATUS_OPTIONS: { label: string; value: AcademyStatus }[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Archived', value: 'ARCHIVED' }
]

export const ACADEMY_STATUS_FILTER_OPTIONS: { label: string; value: 'all' | AcademyStatus }[] = [
  { label: 'All Status', value: 'all' },
  ...ACADEMY_STATUS_OPTIONS,
]

export const ACADEMY_STATUS_COLOR: Record<AcademyStatus, 'success' | 'warning' | 'neutral'> = {
  DRAFT: 'warning',
  ACTIVE: 'success',
  ARCHIVED: 'neutral'
}

export const ACADEMY_YES_NO_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
]

export const ACADEMY_TAB_ITEMS = [
  { label: 'Information', slot: 'information' as const },
  { label: 'Syllabus', slot: 'syllabus' as const },
  { label: 'Cohorts', slot: 'cohorts' as const },
]
