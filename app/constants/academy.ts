export const ACADEMY_DURATION_OPTIONS = ['1 Month', '2 Months', '3 Months', '6 Months'].map(
  (v) => ({ label: v, value: v })
)

export const ACADEMY_FORMAT_OPTIONS = ['Online Live Classes'].map((v) => ({ label: v, value: v }))

export const ACADEMY_STATUS_OPTIONS: { label: string; value: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' }[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Archived', value: 'ARCHIVED' }
]

export const ACADEMY_STATUS_FILTER_OPTIONS: { label: string; value: 'all' | 'DRAFT' | 'ACTIVE' | 'ARCHIVED' }[] = [
  { label: 'All Status', value: 'all' },
  ...ACADEMY_STATUS_OPTIONS,
]

export const ACADEMY_YES_NO_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
]

export const ACADEMY_TAB_ITEMS = [
  { label: 'Information', slot: 'information' as const },
  { label: 'Syllabus', slot: 'syllabus' as const },
  { label: 'Cohorts', slot: 'cohorts' as const },
  { label: 'Students', slot: 'students' as const },
  { label: 'Mentors', slot: 'mentors' as const }
]
