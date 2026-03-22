// ── Job Enums (nilai di DB) ───────────────────────────────────────────────────

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'REMOTE'

export type SeniorityLevel = 'ENTRY_LEVEL' | 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'DIRECTOR'

// ── Core Types (sesuai Prisma schema) ────────────────────────────────────────

export interface JobLocation {
  id: number
  city: string | null
  region: string | null
  country: string
  is_remote: boolean
}

export interface JobCompany {
  id: number
  name: string
  slug: string
  logo_url: string | null
  website_url: string | null
  industry?: string | null
}

/** Job object dari GET /admin/jobs dan GET /admin/jobs/:id */
export interface Job {
  id: number
  title: string
  slug: string
  description: string
  company: JobCompany
  location: JobLocation | null
  employment_type: string
  seniority_level: string | null
  status: string               // 'active' | 'inactive'
  direct_apply: boolean
  external_url: string | null
  posted_date: string
  valid_until: string | null
  salary_raw: string | null
  created_at: string
  updated_at: string
  _count?: { applications: number }
}

/** Company detail dari GET /jobs/company */
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

/** Body untuk POST /admin/jobs dan PUT /admin/jobs/:id */
export interface AdminJobForm {
  title: string
  description: string
  company: string         // nama company — service akan find-or-create
  location: string        // "City, Country" — service akan find-or-create
  slug: string
  employment_type: string
  seniority_level: string
  is_remote: boolean
  valid_until: string     // date input value (YYYY-MM-DD), dikonversi ke ISO saat submit
  external_url: string
}
