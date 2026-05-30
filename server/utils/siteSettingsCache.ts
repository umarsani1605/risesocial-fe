export const SITE_SETTINGS_CACHE_NAME = 'site-settings'
export const SITE_SETTINGS_CACHE_PUBLIC_KEY = 'public'

function escapeCacheKey(key: string) {
  return String(key).replace(/\W/g, '')
}

export function getSiteSettingsCacheStorageKey(key = SITE_SETTINGS_CACHE_PUBLIC_KEY) {
  return `/cache:nitro/handlers:${SITE_SETTINGS_CACHE_NAME}:${escapeCacheKey(key)}.json`
}
