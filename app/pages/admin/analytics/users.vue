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

const [userGrowthData, registrationsTrendData, userDistributionData] = await Promise.all([
  useAsyncData('analytics:user-growth', () => analytics.fetchUserGrowth(dateRange.value.period)),
  useAsyncData('analytics:registrations-trend', () =>
    analytics.fetchRegistrationsTrend(dateRange.value.period)
  ),
  useAsyncData('analytics:user-distribution', () => analytics.fetchUserDistribution())
])

watch(
  () => dateRange.value.period,
  async () => {
    await Promise.all([userGrowthData.refresh(), registrationsTrendData.refresh()])
  }
)

const statCards = computed<AnalyticsStat[]>(() => {
  const lastPoint = userGrowthData.data.value?.at(-1)
  const firstPoint = userGrowthData.data.value?.[0]
  const trend =
    firstPoint && lastPoint && firstPoint.value > 0
      ? Math.round(((lastPoint.value - firstPoint.value) / firstPoint.value) * 100)
      : 0
  return [
    {
      title: 'Total Users',
      value: lastPoint?.value ?? 0,
      icon: 'i-ph-users-fill',
      trend,
      trendLabel: 'in period',
      color: 'text-blue-500'
    },
    {
      title: 'New Registrations',
      value: registrationsTrendData.data.value?.reduce((s, p) => s + p.value, 0) ?? 0,
      icon: 'i-ph-user-plus-fill',
      color: 'text-success'
    },
    {
      title: 'Total Enrollments',
      value: userDistributionData.data.value?.reduce((s, d) => s + d.value, 0) ?? 0,
      icon: 'i-ph-student-fill',
      color: 'text-primary'
    }
  ]
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-lg font-semibold">User Analytics</h1>
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
    </div>

    <LazyAnalyticsAreaChart
      :data="userGrowthData.data.value ?? []"
      title="User Growth"
      :height="300"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LazyAnalyticsLineChart
        :data="registrationsTrendData.data.value ?? []"
        title="New Registrations"
        :height="280"
      />
      <LazyAnalyticsBarChart
        :data="userDistributionData.data.value ?? []"
        title="Enrollments by Academy"
        :height="280"
      />
    </div>
  </div>
</template>
