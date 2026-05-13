type AdminAccessLevel = 'VIEWER' | 'EDITOR'

type UserRole = 'SUPERADMIN' | 'ADMIN' | 'USER'

interface AdminPermissionResource {
  key: string
  name: string
  available_levels: AdminAccessLevel[]
}

interface UserAdminPermission {
  key: string
  access_level: AdminAccessLevel
}

interface UserProfile {
  id: number
  username: string
  first_name: string
  last_name: string
  avatar: string | null
  email: string
  phone: string | null
  email_verified_at: string | null
  phone_verified_at: string | null
  role: UserRole
  gender: string | null
  country: string | null
  province: string | null
  city: string | null
  last_education: string | null
  current_job: string | null
  current_company: string | null
  skills: string[]
  permissions?: UserAdminPermission[]
  created_at: string
  updated_at: string
}

interface AdminUser {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar: string | null
  role: UserRole
  created_at: string
}

interface NotificationPreferences {
  promo: boolean
  jobs: boolean
  programs: boolean
}
