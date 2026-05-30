import {
  getSiteSettingsCacheStorageKey,
  SITE_SETTINGS_CACHE_PUBLIC_KEY
} from '../../utils/siteSettingsCache'

interface SessionResponse {
  data?: {
    role?: string
  }
}

export default eventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const apiBaseUrl = useRuntimeConfig(event).public.apiBaseUrl
  if (!apiBaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'API base URL is not configured' })
  }

  let session: SessionResponse

  try {
    session = await $fetch<SessionResponse>(`${apiBaseUrl}/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (session?.data?.role !== 'SUPERADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  await useStorage().removeItem(getSiteSettingsCacheStorageKey(SITE_SETTINGS_CACHE_PUBLIC_KEY))

  return { success: true }
})
