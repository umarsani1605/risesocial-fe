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

export interface AdminCohortEnrollment {
  id: number
  user_id: number
  status: string
  created_at: string
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
