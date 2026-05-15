// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/scripts',
    '@nuxthub/core',
    'nuxt-charts',
    '@nuxtjs/seo'
  ],
  
  imports: {
    dirs: ['constants', 'schemas']
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://risesocial.org',
    name: 'Rise Social',
    description: 'Discover 40,000+ green job opportunities, sustainability academies, and youth leadership programs across Southeast Asia.',
    defaultLocale: 'en'
  },

  ui: {
    experimental: {
      componentDetection: true
    },
    colorMode: false,
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      partykitHost: '',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '6285111032928',
      midtransMode: process.env.MIDTRANS_MODE || 'SANDBOX',
      midtransClientKey: process.env.MIDTRANS_MODE === 'PRODUCTION'
        ? process.env.MIDTRANS_CLIENT_KEY
        : process.env.MIDTRANS_SANDBOX_CLIENT_KEY
    }
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/admin/**': { robots: false },
    '/dashboard/**': { robots: false },
    '/login': { robots: false },
    '/register': { robots: false },
    '/**/payment': { robots: false },
    '/**/registration/success': { robots: false },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      }
    }
  },

  compatibilityDate: '2024-07-11',

  hub: {
    blob: true
  },

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})