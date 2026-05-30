import {
  SITE_SETTINGS_CACHE_NAME,
  SITE_SETTINGS_CACHE_PUBLIC_KEY
} from '../utils/siteSettingsCache'

interface SiteSettings {
  contact: { phone: string; email: string; address: string }
  social_media: { instagram: string; facebook: string; linkedin: string; tiktok: string }
}

const FALLBACK: SiteSettings = {
  contact: {
    phone: '',
    email: 'risesocial.official@gmail.com',
    address: 'Bandung, West Java 40286, Indonesia'
  },
  social_media: {
    instagram: 'https://www.instagram.com/risesocial_/',
    facebook: '',
    linkedin: 'https://www.linkedin.com/company/rise-social-org/',
    tiktok: 'https://www.tiktok.com/@risesocial_'
  }
}

/**
 * SWR-cached proxy for the public site settings (footer social media + contact
 * page details). Served from the Nitro cache and revalidated in the background,
 * so the global footer never hits the backend on every render. Falls back to
 * static defaults if the backend is unreachable, keeping prerender/SSR safe.
 */
export default defineCachedEventHandler(
  async (event): Promise<SiteSettings> => {
    const apiBaseUrl = useRuntimeConfig(event).public.apiBaseUrl
    if (!apiBaseUrl) return FALLBACK

    try {
      const res = await $fetch<{ data: SiteSettings }>(`${apiBaseUrl}/settings/public`)
      return res?.data ?? FALLBACK
    } catch {
      return FALLBACK
    }
  },
  {
    maxAge: 60 * 60, // serve cached for 1 hour
    swr: true, // then revalidate in the background
    name: SITE_SETTINGS_CACHE_NAME,
    getKey: () => SITE_SETTINGS_CACHE_PUBLIC_KEY
  }
)
