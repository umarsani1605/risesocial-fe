<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Analytics - Rise Social' })
navigateTo('/admin/analytics/revenue', { replace: true })
</script>

<template><div /></template>
