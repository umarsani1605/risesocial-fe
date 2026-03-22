declare interface UserProfile {
  id: number
  username: string
  first_name: string
  last_name: string
  avatar: string | null
  email: string
  phone: string | null
  email_verified_at: string | null
  phone_verified_at: string | null
  role: string
  gender: string | null
  country: string | null
  province: string | null
  city: string | null
  last_education: string | null
  current_job: string | null
  current_company: string | null
  skills: string[]
  created_at: string
  updated_at: string
}

declare interface AdminUser {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar: string | null
  role: string
  created_at: string
}

declare interface NotificationPreferences {
  promo: boolean
  jobs: boolean
  programs: boolean
}
