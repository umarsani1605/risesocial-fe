export default defineNuxtPlugin(async () => {
  const { hasToken, fetchSession } = useAuth()

  if (hasToken.value) {
    try {
      await fetchSession()
    }
    catch {
      // 401 handled by useApi (clears token + redirects)
      // Network errors: fallback to cookie data
    }
  }
})
