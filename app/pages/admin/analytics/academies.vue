<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Academy Analytics',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Academy Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>({
  period: '30d',
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

const [enrollmentData, cohortFillData] = await Promise.all([
  useAsyncData('analytics:enrollment-by-academy', () => analytics.fetchEnrollmentByAcademy()),
  useAsyncData('analytics:cohort-fill-rates', () => analytics.fetchCohortFillRates())
])

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'Total Enrollments',
    value: enrollmentData.data.value?.reduce((s, d) => s + d.value, 0) ?? 0,
    icon: 'i-ph-student-fill',
    color: 'blue'
  },
  {
    title: 'Active Cohorts',
    value: cohortFillData.data.value?.length ?? 0,
    icon: 'i-ph-list-dashes-fill',
    color: 'green'
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

    <LazyAnalyticsBarChart
      :data="enrollmentData.data.value ?? []"
      title="Enrollments by Academy"
      :height="300"
    />
  </div>
</template>
