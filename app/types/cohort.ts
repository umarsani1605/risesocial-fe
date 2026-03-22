export interface AdminCohortAttachment {
  id: number
  label: string
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'url' | 'file'
  url: string | null
}

export interface AdminCohortModule {
  id: number
  order: number
  title: string
  description: string | null
  session_timestamp: string | null
  meeting_link: string | null
  attendance_link: string | null
  assignment_link: string | null
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
}
