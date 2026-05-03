export interface PendingAttachment {
  id: string
  type: 'file' | 'external_link'
  label: string
  url?: string
  file?: File
}

export interface AdminCohortAttachment {
  id: number
  type: 'file' | 'external_link' | 'embed_video'
  label: string | null
  file_path: string | null
  file_mime: string | null
  file_size_kb: number | null
  url: string | null
  embed_provider: string | null
  file_url: string | null
  order: number
}

export interface AdminCohortModule {
  id: number
  order: number
  title: string
  description: string | null
  session_start_time: string | null
  session_end_time: string | null
  meeting_link: string | null
  attendance_link: string | null
  assignment_title: string | null
  assignment_link: string | null
  assignment_deadline: string | null
  is_published: boolean
  attachments: AdminCohortAttachment[]
}

export interface AdminCohortMentor {
  id: number
  name: string
  job_title: string | null
  avatar: string | null
  email?: string
  phone?: string
}

export interface AdminCohortDetail {
  id: number
  name: string
  description: string | null
  academy_id: number
  academy: { id: number; title: string; slug: string }
  start_date: string
  end_date: string
  max_students: number
  status: 'not_started' | 'ongoing' | 'completed'
  enrollment_count: number
  modules: AdminCohortModule[]
  mentors?: AdminCohortMentor[]
}

/** Placement record dari GET /admin/cohorts/:id/enrollments (tab Students di Cohort Detail) */
export interface AdminCohortPlacement {
  id: number                         // placement_id — untuk /drop dan /certificate
  academy_enrollment_id: number | null // untuk /assign (transfer)
  cohort_id: number                  // cohort saat ini — untuk badge "saat ini" di slideover
  academy_id: number
  user_id: number
  status: string
  placed_at: string | null
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string | null
    avatar: string | null
  }
  certificate: {
    id: number
    certificate_code: string
    file_path: string | null
    file_url: string | null
  } | null
}

/** @deprecated Gunakan AdminCohortPlacement */
export type AdminCohortEnrollment = AdminCohortPlacement

/** Enrollment record dari GET /admin/academy-enrollments (Students page) */
export interface AcademyEnrollmentItem {
  id: number
  user_id: number
  academy_id: number
  completed_at: string | null
  created_at: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string | null
    avatar: string | null
  }
  academy: { id: number; title: string }
  transaction: {
    id: number
    paid_at: string | null
    status: string
    transaction_code: string | null
  } | null
  placement: {
    id: number
    cohort_id: number
    cohort: { id: number; name: string; status: string } | null
  } | null
}

/** Cohort summary dari GET /admin/cohorts (untuk picker di assign slideover) */
export interface AdminCohortSummary {
  id: number
  name: string
  status: 'not_started' | 'ongoing' | 'completed'
  start_date: string | null
  end_date: string | null
  enrollment_count: number
}
