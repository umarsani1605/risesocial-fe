<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Statistics',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Statistics - Rise Social' })

const { hasPermission, isSuperAdmin } = useAuth()

// Global date range, shared by every statistics tab.
const dateRange = ref<AnalyticsDateRange>(periodToDateRange('30d'))

const tabItems = computed<TabsItem[]>(() => [
  ...(hasPermission('admin.transactions')
    ? [{ label: 'Revenue', icon: 'i-ph-chart-line-duotone', slot: 'revenue' }]
    : []),
  ...(hasPermission('admin.users')
    ? [{ label: 'Users', icon: 'i-ph-users-three-duotone', slot: 'users' }]
    : []),
  ...(hasPermission('admin.ryls')
    ? [{ label: 'Rise Young Leaders', icon: 'i-ph-medal-duotone', slot: 'programs' }]
    : []),
  ...(isSuperAdmin.value
    ? [{ label: 'Academy', icon: 'i-ph-graduation-cap-duotone', slot: 'academy' }]
    : [])
])

// No analytics permission at all, send the admin somewhere they can access.
if (import.meta.client && tabItems.value.length === 0) {
  navigateTo(getAdminFallbackPath(hasPermission) ?? '/admin', { replace: true })
}

const activeTab = ref('0')
</script>

<template>
  <UTabs
    v-model="activeTab"
    :items="tabItems"
    variant="link"
    color="primary"
    :unmount-on-hide="false"
    :ui="{
      root: 'gap-6',
      list: 'p-0! shrink-0 items-center gap-y-2 flex-wrap',
      trigger: 'px-3 sm:px-6 whitespace-nowrap'
    }"
  >
    <template #list-trailing>
      <AnalyticsTimeRangeFilter v-model="dateRange" class="ms-auto pb-2" />
    </template>

    <template #revenue>
      <AdminAnalyticsTabRevenue :date-range="dateRange" />
    </template>
    <template #users>
      <AdminAnalyticsTabUsers :date-range="dateRange" />
    </template>
    <template #programs>
      <AdminAnalyticsTabPrograms :date-range="dateRange" />
    </template>
    <template #academy>
      <AdminAnalyticsTabAcademy :date-range="dateRange" />
    </template>
  </UTabs>
</template>
