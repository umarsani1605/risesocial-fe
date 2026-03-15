import type { UserProfile } from './useMockUser'

export const useAuth = createSharedComposable(() => {
  const token = useCookie<string | null>('auth_token', { sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
  const userCookie = useCookie<UserProfile | null>('auth_user', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    default: () => null
  })

  const user = useState<UserProfile | null>('auth:user', () => userCookie.value)

  // keep cookie in sync with state
  watch(user, (val) => { userCookie.value = val })

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const { api } = useApi()

  const login = async (credentials: { email: string, password: string }) => {
    const res = await api<ApiResponse<{ token: string, user: UserProfile }>>('/auth/login', {
      method: 'POST',
      body: credentials
    })
    token.value = res.data.token
    user.value = res.data.user
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
      await navigateTo('/login')
    }
  }

  const fetchSession = () =>
    useAsyncData('auth:session', () => api<ApiResponse<UserProfile>>('/auth/session'), {
      immediate: !!token.value
    })

  return { user, token, isLoggedIn, isAdmin, login, logout, fetchSession }
})
