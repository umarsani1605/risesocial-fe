<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Program Analytics',
  middleware: 'admin'
})

useSeoMeta({ title: 'Program Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>({
  period: '30d',
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

const [rylsTrendData, scholarshipData, jobPostingData] = await Promise.all([
  useAsyncData('analytics:ryls-trend', () => analytics.fetchRylsTrend(dateRange.value.period)),
  useAsyncData('analytics:scholarship-breakdown', () => analytics.fetchScholarshipBreakdown()),
  useAsyncData('analytics:job-postings', () =>
    analytics.fetchJobPostingStats(dateRange.value.period)
  )
])

watch(
  () => dateRange.value.period,
  async () => {
    await Promise.all([rylsTrendData.refresh(), jobPostingData.refresh()])
  }
)

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'RYLS Registrations',
    value: rylsTrendData.data.value?.reduce((s, p) => s + p.value, 0) ?? 0,
    icon: 'i-ph-medal-fill',
    color: 'text-purple-500'
  },
  {
    title: 'Fully Funded',
    value: scholarshipData.data.value?.find((d) => d.name === 'Fully Funded')?.value ?? 0,
    icon: 'i-ph-star-fill',
    color: 'text-warning'
  },
  {
    title: 'Job Postings',
    value: jobPostingData.data.value?.reduce((s, p) => s + p.value, 0) ?? 0,
    icon: 'i-ph-briefcase-fill',
    color: 'text-teal-500'
  }
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-lg font-semibold">Program Analytics</h1>
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
    </div>

    <LazyAnalyticsLineChart
      :data="rylsTrendData.data.value ?? []"
      title="RYLS Registrations Trend"
      :height="300"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LazyAnalyticsDonutChart
        :data="scholarshipData.data.value ?? []"
        title="Scholarship Type Distribution"
        :height="280"
      />
      <LazyAnalyticsBarChart
        :data="jobPostingData.data.value?.map((p) => ({ name: p.date, value: p.value })) ?? []"
        title="Job Postings"
        :height="280"
      />
    </div>
  </div>
</template>
