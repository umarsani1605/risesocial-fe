import type { ParsedContent } from '@nuxt/content'
import type { Avatar, Badge, Link } from '#ui/types'
import type { AvatarProps } from '@nuxt/ui'

export interface BlogPost extends ParsedContent {
  title: string
  description: string
  date: string
  image?: HTMLImageElement
  badge?: Badge
  authors?: ({
    name: string
    description?: string
    avatar: Avatar
  } & Link)[]
}

export interface Notification {
  id: number
  unread?: boolean
  sender: {
    name: string
    avatar: AvatarProps
  }
  body: string
  date: string
}

// ── Jobs Types (see app/types/jobs.ts) ───────────────────────────────────────
export type { Job, JobCompany, JobCompanyDetail, JobLocation, JobType, ExperienceLevel, AdminJobForm } from './jobs'

// ── Academy Types (see app/types/academy.ts) ─────────────────────────────────
export type {
  Academy, AdminAcademy, AcademyForm, AdminCohort,
  AcademyPricing, AcademyFeature, AcademyInstructor,
  AcademyTopic, AcademyTheme, AcademyTestimonial, AcademyFaq
} from './academy'

// ── Cohort Types (Admin) — defined in cohort.d.ts as ambient globals ────────

// ── Cohort Types (User Dashboard) ────────────────────────────────────────────

export interface UpcomingSession {
  id: number
  type: 'session' | 'assignment'
  title: string
  link: string
  cohort_id: number
  session_start_time: string | null
  session_end_time: string | null
  assignment_deadline: string | null
}

export type CohortStatus = 'not_started' | 'ongoing' | 'completed'
export type ModuleSessionStatus = 'upcoming' | 'live' | 'completed' | 'hidden'
export interface CohortModuleAttachment {
  id: number
  label: string | null
  type: 'file' | 'external_link' | 'embed_video'
  url: string | null
  file_url: string | null
  file_path: string | null
  file_mime: string | null
  order: number
}

export interface CohortModule {
  id: number
  cohort_id: number
  title: string
  description: string | null
  order: number
  is_published: boolean
  session_start_time: string | null
  session_end_time: string | null
  meeting_link: string | null
  attendance_link: string | null
  assignment_title: string | null
  assignment_link: string | null
  assignment_deadline: string | null
  attachments: CohortModuleAttachment[]
}

export interface CohortMentor {
  id: number
  name: string
  job_title: string
  avatar: string
}

export interface Cohort {
  id: number
  name: string
  academy_id: number
  start_date: string
  end_date: string
  max_students: number
  current_students: number
  status: CohortStatus
  enrollment_count: number
  mentors: CohortMentor[]
  modules?: CohortModule[]
  academy: {
    id: number
    title: string
    slug: string
    image_url?: string
    description?: string | null
    duration?: string | null
    certificate?: boolean | null
    portfolio?: boolean | null
    format?: string | null
  }
}

export interface CohortEnrollment {
  id: number
  user_id: number
  cohort_id: number | null
  academy_id: number
  completed_at: string | null
  created_at: string
  next_session: string | null
  total_modules: number
  completed_modules: number
  has_certificate: boolean
  certificate_url: string | null
  transaction: {
    id: number
    status: string
    transaction_code: string | null
  } | null
  academy: {
    id: number
    title: string
    slug: string | null
    image_url: string | null
    duration: string | null
    format: string | null
    certificate: boolean | null
    description: string | null
  }
  cohort: {
    id: number
    name: string
    status: CohortStatus
    start_date: string
    end_date: string
  } | null
}

// ── User Transaction Types ───────────────────────────────────────────────────

export interface UserTransaction {
  id: number
  transaction_code: string
  product_type: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'expired'
  payment_method: string | null
  created_at: string
  paid_at: string | null
  expired_at: string | null
  items: { product_name: string, quantity: number, unit_price: number, total_price: number }[]
}

export interface UserTransactionDetail extends UserTransaction {
  customer_name: string
  customer_email: string
  provider: string
  provider_reference: string | null
}

// ── Admin Transaction Types ───────────────────────────────────────────────────

export interface AdminTransaction {
  id: number
  transaction_code: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  product_type: string
  product_name: string | null
  amount: number
  currency: string
  status: string
  provider: string
  payment_method: string | null
  created_at: string
}

export interface AdminTransactionItem {
  id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface AdminTransactionDetail {
  id: number
  transaction_code: string
  amount: number
  currency: string
  status: string
  provider: string
  payment_method: string | null
  created_at: string
  paid_at: string | null
  expired_at: string | null
  customer_details: {
    user_id: number | null
    user_name: string | null
    name: string
    email: string
    phone: string | null
    address: string | null
    city: string | null
    postal_code: string | null
    country_code: string | null
  }
  product_details: {
    type: string
    items: AdminTransactionItem[]
    enrollment: { cohort_id: number; cohort_name: string } | null
    ryls_registration: { id: number; full_name: string; scholarship_type: string } | null
  }
}

