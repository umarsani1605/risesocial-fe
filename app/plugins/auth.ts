export default defineNuxtPlugin(async () => {
  const { token, fetchSession } = useAuth()

  if (token.value) {
    try {
      await fetchSession()
    }
    catch {
      // 401 handled by useApi (clears token + redirects)
      // Network errors: fallback to cookie data
    }
  }
})
