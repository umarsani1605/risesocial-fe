// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxthub/core',
    'nuxt-csurf',
    'nuxt-charts'
  ],
  
  imports: {
    dirs: ['constants', 'schemas']
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
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
      cors: true,
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
