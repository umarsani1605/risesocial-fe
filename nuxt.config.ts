import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})