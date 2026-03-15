// ── Job Enums ─────────────────────────────────────────────────────────────────

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'REMOTE'

export type ExperienceLevel = 'ENTRY_LEVEL' | 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'DIRECTOR'

// ── Core Types ────────────────────────────────────────────────────────────────

export interface JobLocation {
  city: string
  country: string
}

/** Company embedded in GET /jobs response */
export interface JobCompany {
  id: number
  name: string
  slug: string
  logo_url: string | null
  website_url: string | null
  industry?: string | null
}

/** Full job object from GET /jobs and GET /jobs/:id */
export interface Job {
  id: number
  title: string
  slug: string
  description: string
  company: JobCompany
  location: JobLocation
  jobType: JobType
  experienceLevel: ExperienceLevel
  minSalary: number | null
  maxSalary: number | null
  skills: string[]
  requirements: string[]
  benefits: string[]
  isRemote: boolean
  applicationDeadline: string | null
  applicationUrl: string | null
  isActive: boolean
}

/** Company detail from GET /jobs/companies */
export interface JobCompanyDetail {
  id: number
  name: string
  slug: string
  logo_url: string | null
  website_url: string | null
  industry: string | null
  headquarters: string | null
  description: string | null
  linkedin_url: string | null
  linkedin_employees: number | null
  linkedin_size: string | null
  _count: { jobs: number }
}

/** Body for POST /admin/jobs and PUT /admin/jobs/:id */
export interface AdminJobForm {
  title: string
  description: string
  company: string
  location: string
  slug: string
  jobType: JobType
  experienceLevel: ExperienceLevel
  salary_min: number | null
  salary_max: number | null
  skills: string[]
  requirements: string[]
  benefits: string[]
  isRemote: boolean
  application_deadline: string
  applicationUrl: string
  contactEmail: string
}
