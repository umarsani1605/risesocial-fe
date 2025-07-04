import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  // SSR enabled for better SEO and performance
  ssr: true,

  // Nitro configuration for Netlify deployment
  nitro: {
    preset: 'netlify'
  },

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
    // Page transitions - simple fade only
    pageTransition: { 
      name: 'fade', 
      mode: 'out-in' 
    },
    // Layout transitions - simple fade only
    layoutTransition: { 
      name: 'fade', 
      mode: 'out-in' 
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@sidebase/nuxt-auth', 'shadcn-nuxt', '@nuxt/icon', '@nuxt/fonts', '@nuxt/image', '@pinia/nuxt'],
  
  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    authSecret: process.env.NUXT_AUTH_SECRET || 'your-super-secret-key-change-in-production',
    
    // Public keys (exposed to client-side)
    public: {
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
      authUrl: process.env.NUXT_AUTH_BASE_URL || process.env.AUTH_ORIGIN || 'http://localhost:3000'
    }
  },
  
  // Image configuration - now using public folder
  image: {
    dir: 'public'
  },
  
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})