<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'User Analytics',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'User Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>({
  period: '30d',
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

const registrationsTrendData = useLazyAsyncData(
  'analytics:registrations-trend',
  () => analytics.fetchRegistrationsTrend(dateRange.value),
  { server: false, default: () => [] }
)
const userDistributionData = useLazyAsyncData(
  'analytics:user-distribution',
  () => analytics.fetchUserDistribution(dateRange.value),
  { server: false, default: () => [] }
)

watch(
  dateRange,
  async () => {
    await Promise.all([
      registrationsTrendData.refresh(),
      userDistributionData.refresh()
    ])
  },
  { deep: true }
)

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'New Registrations',
    value: registrationsTrendData.data.value?.reduce((s, p) => s + p.value, 0) ?? 0,
    icon: 'i-ph-user-plus-fill',
    color: 'green'
  },
  {
    title: 'Students Enrollment',
    value: userDistributionData.data.value?.reduce((s, d) => s + d.value, 0) ?? 0,
    icon: 'i-ph-student-fill',
    color: 'blue'
  }
])

const isRegistrationsLoading = computed(() =>
  registrationsTrendData.status.value === 'idle' || registrationsTrendData.status.value === 'pending'
)
const isUserDistributionLoading = computed(() =>
  userDistributionData.status.value === 'idle' || userDistributionData.status.value === 'pending'
)
const isStatsLoading = computed(() => isRegistrationsLoading.value || isUserDistributionLoading.value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" :loading="isStatsLoading" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LazyAnalyticsLineChart
        :data="registrationsTrendData.data.value ?? []"
        title="New Registrations"
        :height="280"
        :loading="isRegistrationsLoading"
      />
      <LazyAnalyticsBarChart
        :data="userDistributionData.data.value ?? []"
        title="Students Enrollment"
        :height="280"
        :loading="isUserDistributionLoading"
      />
    </div>
  </div>
</template>
