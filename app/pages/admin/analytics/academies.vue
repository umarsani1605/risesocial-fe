<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Academy Analytics',
  navbarIcon: 'i-ph-graduation-cap-fill',
  middleware: 'admin'
})

useSeoMeta({ title: 'Academy Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>({
  period: '30d',
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

const [enrollmentData, cohortFillData, completionData] = await Promise.all([
  useAsyncData('analytics:enrollment-by-academy', () => analytics.fetchEnrollmentByAcademy()),
  useAsyncData('analytics:cohort-fill-rates', () => analytics.fetchCohortFillRates()),
  useAsyncData('analytics:completion-rates', () => analytics.fetchCompletionRates())
])

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'Total Enrollments',
    value: enrollmentData.data.value?.reduce((s, d) => s + d.value, 0) ?? 0,
    icon: 'i-ph-student-fill',
    color: 'text-primary'
  },
  {
    title: 'Completion Rate',
    value: `${completionData.data.value?.find(d => d.name === 'Completed')?.value ?? 0}%`,
    icon: 'i-ph-check-circle-fill',
    color: 'text-success'
  },
  {
    title: 'Active Cohorts',
    value: cohortFillData.data.value?.length ?? 0,
    icon: 'i-ph-list-dashes-fill',
    color: 'text-blue-500'
  }
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-lg font-semibold">Academy Analytics</h1>
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
    </div>

    <LazyAnalyticsBarChart
      :data="enrollmentData.data.value ?? []"
      title="Enrollments by Academy"
      :height="300"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LazyAnalyticsBarChart
        :data="cohortFillData.data.value ?? []"
        title="Cohort Fill Rates (%)"
        :height="280"
      />
      <LazyAnalyticsDonutChart
        :data="completionData.data.value ?? []"
        title="Completion Status"
        :height="280"
      />
    </div>
  </div>
</template>
