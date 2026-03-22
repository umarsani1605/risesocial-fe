// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxt/a11y',
    '@nuxt/hints',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxthub/core',
    'nuxt-csurf'
  ],
  
  imports: {
    dirs: ['constants', 'schemas']
  },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

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
      whatsappNumber: '6285111032928',
      midtransMode: process.env.MIDTRANS_MODE || 'SANDBOX',
      midtransClientKey: process.env.MIDTRANS_MODE === 'PRODUCTION'
        ? process.env.MIDTRANS_CLIENT_KEY
        : process.env.MIDTRANS_SANDBOX_CLIENT_KEY
    }
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  hub: {
    blob: true
  },

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        'yjs',
        'y-partykit/provider'
      ]
    }
  },
  
  a11y: {
    enabled: false,
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