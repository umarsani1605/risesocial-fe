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

const enrollmentData = useLazyAsyncData(
  'analytics:enrollment-by-academy',
  () => analytics.fetchEnrollmentByAcademy(dateRange.value),
  { server: false, default: () => [] }
)
const cohortFillData = useLazyAsyncData(
  'analytics:cohort-students',
  () => analytics.fetchCohortFillRates(dateRange.value),
  { server: false, default: () => [] }
)

watch(
  dateRange,
  async () => {
    await Promise.all([
      enrollmentData.refresh(),
      cohortFillData.refresh()
    ])
  },
  { deep: true }
)

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'Total Enrollments',
    value: enrollmentData.data.value?.reduce((s, d) => s + d.value, 0) ?? 0,
    icon: 'i-ph-student-fill',
    color: 'blue'
  },
  {
    title: 'Cohorts with Students',
    value: cohortFillData.data.value?.length ?? 0,
    icon: 'i-ph-list-dashes-fill',
    color: 'green'
  }
])

const isLoading = computed(() =>
  [enrollmentData.status.value, cohortFillData.status.value].some((status) => status === 'idle' || status === 'pending')
)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-end">
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" :loading="isLoading" />
    </div>

    <LazyAnalyticsBarChart
      :data="enrollmentData.data.value ?? []"
      title="Enrollments by Academy"
      :height="300"
      :loading="isLoading"
    />

    <LazyAnalyticsBarChart
      :data="cohortFillData.data.value ?? []"
      title="Students by Cohort"
      :height="300"
      :loading="isLoading"
    />
  </div>
</template>
