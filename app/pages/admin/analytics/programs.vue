<script setup lang="ts">
import { SCHOLARSHIP_TYPE_LABEL } from '@/constants/ryls'
import { DISCOVER_SOURCES, GENDER_OPTIONS } from '@/utils/ryls'

const DISCOVER_SOURCE_MAP = Object.fromEntries(DISCOVER_SOURCES.map((s) => [s.value, s.label]))
const GENDER_LABEL_MAP = Object.fromEntries(GENDER_OPTIONS.map((g) => [g.value, g.label]))

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Rise Young Leaders Analytics',
  middleware: ['auth', 'admin', 'admin-permission'],
  requiredPermission: 'admin.ryls'
})

useSeoMeta({ title: 'Rise Young Leaders Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>(periodToDateRange('30d'))

const summaryData = useLazyAsyncData(
  'analytics:programs-summary',
  () => analytics.fetchRylsAnalyticsSummary(dateRange.value).catch(() => null),
  { server: false, default: () => null }
)
const trendData = useLazyAsyncData(
  'analytics:programs-trend',
  () => analytics.fetchRylsAnalyticsTrend(dateRange.value).catch(() => []),
  { server: false, default: () => [] }
)
const demographicsData = useLazyAsyncData(
  'analytics:programs-demographics',
  () => analytics.fetchRylsAnalyticsDemographics(dateRange.value).catch(() => null),
  { server: false, default: () => null }
)

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

const isSummaryLoading = computed(() => summaryData.status.value === 'idle' || summaryData.status.value === 'pending')
const isTrendLoading = computed(() => trendData.status.value === 'idle' || trendData.status.value === 'pending')
const isDemographicsLoading = computed(() =>
  demographicsData.status.value === 'idle' || demographicsData.status.value === 'pending'
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-start lg:justify-end">
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" :loading="isSummaryLoading" />
    </div>

    <!-- Submission Trend -->
    <AnalyticsAreaChart
      :data="trendChartData"
      title="Submission Trend"
      :height="280"
      :loading="isTrendLoading"
    />

    <!-- Scholarship + Discover Source -->
    <div class="flex flex-col md:flex-row items-stretch gap-4">
      <div class="flex-1">
        <AnalyticsDonutChart
          class="h-full"
          :data="scholarshipChartData"
          title="Scholarship Type"
          :height="288"
          :loading="isDemographicsLoading"
        />
      </div>
      <div class="flex-2">
        <AnalyticsBarChart
          class="h-full"
          :data="discoverSourceChartData"
          title="Discover Source"
          :height="288"
          :loading="isDemographicsLoading"
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
          :loading="isDemographicsLoading"
        />
      </div>
      <div class="flex-1">
        <AnalyticsDonutChart
          class="h-full"
          :data="genderChartData"
          title="Gender"
          :height="288"
          :loading="isDemographicsLoading"
        />
      </div>
    </div>

    <!-- Nationality -->
    <AnalyticsBarChart
      class="h-full"
      :data="nationalityChartData"
      title="Nationality (Top 10)"
      :height="240"
      :loading="isDemographicsLoading"
    />
  </div>
</template>
