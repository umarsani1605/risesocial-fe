export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
        await navigateTo('/login')
        return
      }
    }
  })

  return { api }
}
