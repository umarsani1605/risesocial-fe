// https://nuxt.com/docs/api/configuration/nuxt-config
/* eslint-disable nuxt/nuxt-config-keys-order */
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/scripts',
    '@nuxthub/core',
    'nuxt-charts',
    '@nuxtjs/seo',
    '@posthog/nuxt'
  ],

  imports: {
    dirs: ['constants', 'schemas']
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://risesocial.org',
    name: 'Rise Social',
    description:
      'Discover 40,000+ green job opportunities, sustainability academies, and youth leadership programs across Southeast Asia.',
    defaultLocale: 'en'
  },

  ogImage: {
    enabled: false
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
      midtransMode: process.env.MIDTRANS_MODE || 'SANDBOX',
      midtransClientKey:
        process.env.MIDTRANS_MODE === 'PRODUCTION'
          ? process.env.MIDTRANS_CLIENT_KEY
          : process.env.MIDTRANS_SANDBOX_CLIENT_KEY,
      metaPixelId: process.env.META_PIXEL_ID || '779046444865930',
      metaPixel2Id: process.env.META_PIXEL_ID_2 || '1446243567200775',
      scripts: {
        metaPixel: {
          id: process.env.META_PIXEL_ID || '779046444865930'
        }
      },
      posthog: {
        publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN || '',
        host: process.env.NUXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com'
      }
    }
  },

  scripts: {
    registry: {
      metaPixel: {
        id: process.env.META_PIXEL_ID || '779046444865930'
      }
    }
  },

  posthogConfig: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN || '',
    host: process.env.NUXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    clientConfig: {
      capture_exceptions: true,
      __add_tracing_headers: ['localhost', 'risesocial.org']
    },
    serverConfig: {
      enableExceptionAutocapture: true
    }
  },

  routeRules: {
    '/programs/rise-young-leaders-summit': { prerender: true },
    '/admin/**': { ssr: false, robots: false },
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
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      }
    }
  } as any,

  compatibilityDate: '2024-07-11',

  hub: {
    blob: true
  },

  nitro: {
    handlers: []
  },

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
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
