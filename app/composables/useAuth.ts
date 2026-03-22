export const useAuth = createSharedComposable(() => {
  const cookieOptions = { sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 7, secure: true }
  const token = useCookie<string | null>('auth_token', cookieOptions)
  const userCookie = useCookie<UserProfile | null>('auth_user', { ...cookieOptions, default: () => null })

  const user = useState<UserProfile | null>('auth:user', () => userCookie.value)

  // keep cookie in sync with state
  watch(user, (val) => { userCookie.value = val })

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name} ${user.value.last_name}`.trim()
  })

  const initials = computed(() => {
    if (!user.value) return 'U'
    const first = user.value.first_name?.charAt(0) ?? ''
    const last = user.value.last_name?.charAt(0) ?? ''
    return (first + last).toUpperCase() || 'U'
  })

  const { api } = useApi()

  const setSession = (t: string, u: UserProfile) => {
    token.value = t
    user.value = u
  }

  const login = async (credentials: { email: string, password: string }) => {
    const res = await api<ApiResponse<{ token: string, user: UserProfile }>>('/auth/login', {
      method: 'POST',
      body: credentials
    })
    setSession(res.data.token, res.data.user)
    return res
  }

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    }
    finally {
      token.value = null
      user.value = null
      userCookie.value = null
      await navigateTo('/')
    }
  }

  const fetchSession = async () => {
    const { data } = await useAsyncData('auth:session', () =>
      api<ApiResponse<UserProfile>>('/auth/session')
    )
    if (data.value) {
      user.value = data.value.data
    }
  }

  return { user, token, isLoggedIn, isAdmin, fullName, initials, setSession, login, logout, fetchSession }
})
