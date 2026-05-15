<script setup lang="ts">
import { SCHOLARSHIP_TYPE_LABEL } from '@/constants/ryls'
import { DISCOVER_SOURCES, GENDER_OPTIONS } from '@/utils/ryls'

const DISCOVER_SOURCE_MAP = Object.fromEntries(DISCOVER_SOURCES.map((s) => [s.value, s.label]))
const GENDER_LABEL_MAP = Object.fromEntries(GENDER_OPTIONS.map((g) => [g.value, g.label]))

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Program Analytics',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Program Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>({
  period: '30d',
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

const [summaryData, trendData, demographicsData] = await Promise.all([
  useAsyncData('analytics:programs-summary', () =>
    analytics.fetchRylsAnalyticsSummary(dateRange.value).catch(() => null)
  ),
  useAsyncData('analytics:programs-trend', () =>
    analytics.fetchRylsAnalyticsTrend(dateRange.value).catch(() => [])
  ),
  useAsyncData('analytics:programs-demographics', () =>
    analytics.fetchRylsAnalyticsDemographics(dateRange.value).catch(() => null)
  )
])

watch(
  dateRange,
  () => {
    summaryData.refresh()
    trendData.refresh()
    demographicsData.refresh()
  },
  { deep: true }
)

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'Total Submitted',
    value: summaryData.data.value?.submitted ?? 0,
    icon: 'i-ph-check-circle-fill',
    color: 'green'
  },
  {
    title: 'Drafts',
    value: summaryData.data.value?.drafts ?? 0,
    icon: 'i-ph-files-fill',
    color: 'orange'
  }
])

const trendChartData = computed<TimeSeriesPoint[]>(() =>
  (trendData.data.value ?? []).map((p) => ({ date: p.date, value: p.count }))
)

const scholarshipChartData = computed<CategoryBreakdown[]>(() =>
  (demographicsData.data.value?.byScholarshipType ?? []).map((s) => ({
    name: SCHOLARSHIP_TYPE_LABEL[s.name] ?? s.name,
    value: s.count
  }))
)

const discoverSourceChartData = computed<CategoryBreakdown[]>(() =>
  (demographicsData.data.value?.byDiscoverSource ?? []).map((s) => ({
    name: DISCOVER_SOURCE_MAP[s.name] ?? s.name,
    value: s.count
  }))
)

const nationalityChartData = computed<CategoryBreakdown[]>(() =>
  (demographicsData.data.value?.byNationality ?? []).map((n) => ({ name: n.name, value: n.count }))
)

const genderChartData = computed<CategoryBreakdown[]>(() =>
  (demographicsData.data.value?.byGender ?? []).map((g) => ({
    name: GENDER_LABEL_MAP[g.name] ?? g.name,
    value: g.count
  }))
)

const ageChartData = computed<CategoryBreakdown[]>(() =>
  (demographicsData.data.value?.byAgeRange ?? []).map((a) => ({ name: a.name, value: a.count }))
)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-lg font-semibold">Program Analytics</h1>
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
    </div>

    <!-- Submission Trend -->
    <AnalyticsAreaChart :data="trendChartData" title="Submission Trend" :height="288" />

    <!-- Scholarship + Discover Source -->
    <div class="flex flex-col md:flex-row items-stretch gap-4">
      <div class="flex-1">
        <AnalyticsDonutChart
          class="h-full"
          :data="scholarshipChartData"
          title="Scholarship Type"
          :height="288"
        />
      </div>
      <div class="flex-2">
        <AnalyticsBarChart
          class="h-full"
          :data="discoverSourceChartData"
          title="Discover Source"
          :height="288"
        />
      </div>
    </div>

    <!-- Age Range + Gender -->
    <div class="flex flex-col md:flex-row items-stretch gap-4">
      <div class="flex-2">
        <AnalyticsBarChart
          class="h-full"
          :data="ageChartData"
          title="Age Range"
          :height="288"
        />
      </div>
      <div class="flex-1">
        <AnalyticsDonutChart
          class="h-full"
          :data="genderChartData"
          title="Gender"
          :height="288"
        />
      </div>
    </div>

    <!-- Nationality -->
    <AnalyticsBarChart
      class="h-full"
      :data="nationalityChartData"
      title="Nationality (Top 10)"
      :height="288"
    />
  </div>
</template>
