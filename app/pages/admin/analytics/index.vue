<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Analytics - Rise Social' })

const { hasPermission } = useAuth()
const target =
  hasPermission('admin.transactions')
    ? '/admin/analytics/revenue'
    : hasPermission('admin.users')
      ? '/admin/analytics/users'
      : hasPermission('admin.ryls')
        ? '/admin/analytics/programs'
        : getAdminFallbackPath(hasPermission)

navigateTo(target ?? '/admin', { replace: true })
</script>

<template><div /></template>
