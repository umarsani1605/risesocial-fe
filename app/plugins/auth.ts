export default defineNuxtPlugin(async () => {
  const { hasToken, user, fetchSession } = useAuth()

  if (hasToken.value) {
    try {
      await fetchSession()
      identifyPostHogUser(user.value)
    }
    catch {
      identifyPostHogUser(user.value)
      // 401 handled by useApi (clears token + redirects)
      // Network errors: fallback to cookie data
    }
  } else {
    identifyPostHogUser(user.value)
  }
})
