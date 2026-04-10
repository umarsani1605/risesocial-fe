<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

const { data: navigation } = await useAsyncData(
  'navigation',
  () => queryCollectionNavigation('docs'),
  {
    transform: (data) => data.find((item) => item.path === '/docs')?.children || []
  }
)
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

const links = [
  {
    label: 'Docs',
    icon: 'i-ph-book-bold',
    to: '/docs/getting-started'
  },
  {
    label: 'Pricing',
    icon: 'i-ph-credit-card-bold',
    to: '/pricing'
  },
  {
    label: 'Blog',
    icon: 'i-ph-pencil-simple-bold',
    to: '/blog'
  }
]
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />
    <UToaster />
  </div>
</template>
