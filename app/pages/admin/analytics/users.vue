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

const [registrationsTrendData, userDistributionData] = await Promise.all([
  useAsyncData('analytics:registrations-trend', () =>
    analytics.fetchRegistrationsTrend(dateRange.value.period)
  ),
  useAsyncData('analytics:user-distribution', () => analytics.fetchUserDistribution())
])

watch(
  () => dateRange.value.period,
  async () => {
    await registrationsTrendData.refresh()
  }
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
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-end">
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LazyAnalyticsLineChart
        :data="registrationsTrendData.data.value ?? []"
        title="New Registrations"
        :height="280"
      />
      <LazyAnalyticsBarChart
        :data="userDistributionData.data.value ?? []"
        title="Students Enrollment"
        :height="280"
      />
    </div>
  </div>
</template>
