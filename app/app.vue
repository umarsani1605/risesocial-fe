<script setup lang="ts">
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: 'white' }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Rise Social',
  ogImage: '/og-image.png',
  twitterImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})

const { data: navigation } = await useAsyncData(
  'navigation',
  () => queryCollectionNavigation('docs'),
  {
    transform: (data) => data.find((item) => item.path === '/docs')?.children || []
  }
)
provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--color-rise-orange-400)" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
