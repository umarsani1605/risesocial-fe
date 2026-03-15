export interface UserProfile {
  id: number
  username: string
  first_name: string
  last_name: string
  avatar: string
  email: string
  phone: string
  email_verified_at: string
  phone_verified_at: string
  role: string
  gender: string
  country: string
  province: string
  city: string
  last_education: string
  current_job: string
  current_company: string
  skills: string[]
  created_at: string
  updated_at: string
}

const defaultUser: UserProfile = {
  id: 1,
  username: 'admin',
  first_name: 'Admin',
  last_name: 'Rise',
  avatar:
    'https://api.risesocial.org/uploads/images/1759171725540-Frame 62 (1).jpg',
  email: 'admin@risesocial.org',
  phone: '+62-812-3456-7890',
  email_verified_at: '2025-07-23T00:42:46.755Z',
  phone_verified_at: '2025-07-23T00:42:46.755Z',
  role: 'ADMIN',
  gender: 'MALE',
  country: 'Indonesia',
  province: 'Jawa Barat',
  city: 'Bandung',
  last_education: 'S1 Computer Science',
  current_job: 'System Administrator',
  current_company: 'Rise Social',
  skills: [
    'Leadership',
    'Management',
    'System Administration',
    'Database Management'
  ],
  created_at: '2025-07-23T00:42:46.766Z',
  updated_at: '2025-09-29T18:48:45.628Z'
}

export function useMockUser() {
  const user = useState<UserProfile>('mock-user', () => ({ ...defaultUser }))

  const fullName = computed(
    () => `${user.value.first_name} ${user.value.last_name}`.trim()
  )

  const initials = computed(() => {
    const first = user.value.first_name?.charAt(0) ?? ''
    const last = user.value.last_name?.charAt(0) ?? ''
    return (first + last).toUpperCase() || 'U'
  })

  function updateProfile(updates: Partial<UserProfile>) {
    Object.assign(user.value, updates)
  }

  return {
    user,
    fullName,
    initials,
    updateProfile
  }
}
