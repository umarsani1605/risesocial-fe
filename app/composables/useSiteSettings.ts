export interface SiteContact {
  phone: string
  email: string
  address: string
}

export interface SiteSocialMedia {
  instagram: string
  facebook: string
  linkedin: string
  tiktok: string
}

export interface SiteSettings {
  contact: SiteContact
  social_media: SiteSocialMedia
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
 * Public site settings (footer social media + contact page details).
 *
 * Fetched server-side through the SWR-cached `/api/site-settings` Nitro route
 * and shared across every component via a fixed `useAsyncData` key, so the
 * global footer triggers exactly one request and the data is SSR-rendered
 * (crawlable, no flicker). `getCachedData` reuses the payload across route
 * navigations instead of refetching.
 */
export const useSiteSettings = () => {
  const { data, refresh, status } = useAsyncData<SiteSettings>(
    'site-settings',
    () => $fetch<SiteSettings>('/api/site-settings'),
    {
      default: () => FALLBACK,
      getCachedData: (key, nuxtApp) =>
        nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    }
  )

  const contact = computed(() => data.value?.contact ?? FALLBACK.contact)
  const socialMedia = computed(() => data.value?.social_media ?? FALLBACK.social_media)

  return { settings: data, contact, socialMedia, refresh, status }
}
