// ── Status enum ───────────────────────────────────────────────────────────────

export type AcademyStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'

// ── Sub-resource types ────────────────────────────────────────────────────────

export interface AcademyPricing {
  id: number
  name: string
  original_price: number
  discount_price: number
  discount_percentage?: number
  order?: number
}

export interface AcademyFeature {
  id: number
  title: string
  description: string
  icon: string
  order?: number
}

export interface AcademyInstructor {
  id: number
  name: string
  job_title: string
  avatar_url: string | null
  description?: string
  order?: number
}

export interface AcademyTopic {
  id: number
  theme_id?: number
  title: string
  description: string
  order: number
}

/** Form/draft shape used by SectionSyllabus + TopicModal (mirrors AcademyTopic) */
export interface AcademyTopicForm {
  id: number
  theme_id?: number
  title: string
  description: string
  order: number
}

export interface AcademyTheme {
  id: number
  title: string
  description: string
  order: number
  topics: AcademyTopic[]
}

export interface AcademyTestimonial {
  id: number
  name: string
  comment: string
  avatar_url?: string | null
  order?: number
}

export interface AcademyFaq {
  id: number
  question: string
  answer: string
  order: number
}

export interface SyllabusRow {
  id: number
  _kind: 'theme' | 'topic'
  order: number
  title: string
  description: string
  theme_id?: number
}

// ── Main types ────────────────────────────────────────────────────────────────

export interface Academy {
  id: number
  title: string
  slug: string
  description: string
  duration: string
  format: string
  category: string
  image_url: string
  certificate: boolean
  portfolio: boolean
  status: AcademyStatus
  pixel_id?: string | null
  pricing: AcademyPricing[]
  features: AcademyFeature[]
  instructors: AcademyInstructor[]
  themes: AcademyTheme[]
  testimonials: AcademyTestimonial[]
  faqs: AcademyFaq[]
  topicCount?: number
  instructorCount?: number
  has_cohort?: boolean
}

export interface AdminAcademy {
  id: number
  title: string
  slug: string
  category: string
  duration: string
  format: string
  status: AcademyStatus
  cohort_count: number
}

// ── Form & admin-UI types ─────────────────────────────────────────────────────

export interface AcademyForm {
  title: string
  description: string
  duration: string
  format: string
  category: string
  status: AcademyStatus
  certificate: string
  portfolio: string
  pixel_id?: string
}

export interface AdminCohort {
  id: number
  name: string
  description: string | null
  academy_id: number
  academy: { id: number; title: string; slug: string }
  status: 'not_started' | 'ongoing' | 'completed'
  enrollment_count: number
  start_date: string
  end_date: string
}
