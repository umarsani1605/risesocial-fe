export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ options }) {
      const { distinctId, sessionId } = getPostHogRequestHeaders()
      const headers = {
        ...(options.headers as Record<string, string> | undefined),
      }

      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }

      if (distinctId) {
        headers['X-POSTHOG-DISTINCT-ID'] = distinctId
      }

      if (sessionId) {
        headers['X-POSTHOG-SESSION-ID'] = sessionId
      }

      options.headers = headers
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
        resetPostHogUser()
        await navigateTo('/login')
        return
      }
    }
  })

  return { api }
}
