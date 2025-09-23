import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  css: ['~/assets/main.css'],

  ssr: true,

  app: {
    head: {
      title: 'Rise Social - Green Jobs Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Platform pekerjaan hijau terdepan untuk karir berkelanjutan' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    },
    pageTransition: { 
      name: 'fade', 
      mode: 'out-in' 
    },
    layoutTransition: { 
      name: 'fade', 
      mode: 'out-in' 
    }
  },

  nitro: {
    compressPublicAssets: {
      brotli: true
    },
  },

  routeRules: {
    '/programs/rise-young-leaders-summit': { 
      prerender: true 
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-easy-lightbox',
    '@nuxt/scripts',
    '@sidebase/nuxt-auth'
  ],

  piniaPluginPersistedstate: {
    storage: 'cookies',
    debug: true,
  },
  
  runtimeConfig: {
    public: {
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'https://api.risesocial.org',
      midtransMode: process.env.MIDTRANS_MODE || 'SANDBOX', 
      midtransClientKey:
        (process.env.MIDTRANS_MODE === 'PRODUCTION'
          ? process.env.MIDTRANS_CLIENT_KEY
          : process.env.MIDTRANS_SANDBOX_CLIENT_KEY),
      scripts: {
        metaPixel: {
          id: process.env.NUXT_PUBLIC_SCRIPTS_META_PIXEL_ID, 
        },
      },
    }
  },


  auth: {
    originEnvKey: 'NUXT_PUBLIC_BACKEND_URL',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/auth/login', method: 'post' },
        signOut: { path: '/auth/logout', method: 'post' },
        signUp: { path: '/auth/register', method: 'post' },
        getSession: { path: '/auth/session', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 2592000, // 30 days (sesuai dengan backend)
        sameSiteAttribute: 'lax',
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },
      session: {
        dataType: {
          id: 'number',
          first_name: 'string',
          last_name: 'string',
          email: 'string',
          phone: 'string | null',
          avatar: 'string | null',
          role: 'string',
          created_at: 'string',
          updated_at: 'string',
        },
      },
    },
  },

  piniaPluginPersistedstate: {
    storage: 'cookies',
    debug: true,
  },

  scripts: {
    registry: {
      metaPixel: true,
    }
  },
  
  image: {
    dir: 'public'
  },
  
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})