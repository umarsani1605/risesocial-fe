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

// Dashboard types
export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

// ── Jobs Types (see app/types/jobs.ts) ───────────────────────────────────────
export type { Job, JobCompany, JobCompanyDetail, JobLocation, JobType, ExperienceLevel, AdminJobForm } from './jobs'

// ── Academy Types (see app/types/academy.ts) ─────────────────────────────────
export type {
  Academy, AdminAcademy, AcademyForm, AdminCohort,
  AcademyPricing, AcademyFeature, AcademyInstructor,
  AcademyTopic, AcademyTheme, AcademyTestimonial, AcademyFaq
} from './academy'

// ── Cohort Types (User Dashboard) ────────────────────────────────────────────

export type CohortStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED'
export type EnrollmentStatus = 'active' | 'pending' | 'completed'
export type ModuleSessionStatus = 'upcoming' | 'live' | 'completed' | 'hidden'
export type ModuleAttachmentType = 'pdf' | 'docx' | 'jpg' | 'url'

export interface CohortModuleAttachment {
  id: number
  label: string
  type: ModuleAttachmentType
  url: string
  order: number
}

export interface CohortModule {
  id: number
  cohort_id: number
  title: string
  description: string | null
  order: number
  is_published: boolean
  session_timestamp: string | null
  meeting_link: string | null
  attendance_link: string | null
  assignment_link: string | null
  attachments: CohortModuleAttachment[]
  session_status?: ModuleSessionStatus
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
  }
}

export interface CohortEnrollment {
  id: number
  user_id: number
  cohort_id: number
  academy_id: number
  status: EnrollmentStatus
  created_at: string
  cohort: {
    id: number
    name: string
    status: CohortStatus
    start_date: string
    end_date: string
    academy: {
      id: number
      title: string
      image_url: string
    }
  }
}

// ── Blog Management types ─────────────────────────────────────────────────────
export type BlogStatus = 'draft' | 'published'

export interface BlogManagementPost {
  id: number
  title: string
  slug: string
  author: string
  status: BlogStatus
  content: string
  createdAt: string
  updatedAt: string
}
