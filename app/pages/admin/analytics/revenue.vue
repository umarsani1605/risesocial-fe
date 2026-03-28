<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Revenue Analytics',
  middleware: 'admin'
})

useSeoMeta({ title: 'Revenue Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>({
  period: '30d',
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

const [revenueTrendData, revenueBreakdownData, paymentStatusData] = await Promise.all([
  useAsyncData('analytics:revenue-trend', () =>
    analytics.fetchRevenueTrend(dateRange.value.period)
  ),
  useAsyncData('analytics:revenue-breakdown', () => analytics.fetchRevenueBreakdown()),
  useAsyncData('analytics:payment-status', () => analytics.fetchPaymentStatusBreakdown())
])

watch(
  () => dateRange.value.period,
  async () => {
    await revenueTrendData.refresh()
  }
)

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'Total Revenue',
    value: revenueTrendData.data.value?.reduce((s, p) => s + p.value, 0) ?? 0,
    icon: 'i-ph-currency-circle-dollar-fill',
    color: 'text-success'
  },
  {
    title: 'Paid Transactions',
    value: paymentStatusData.data.value?.find((d) => d.name === 'Paid')?.value ?? 0,
    icon: 'i-ph-check-circle-fill',
    color: 'text-success'
  },
  {
    title: 'Pending',
    value: paymentStatusData.data.value?.find((d) => d.name === 'Pending')?.value ?? 0,
    icon: 'i-ph-clock-fill',
    color: 'text-warning'
  },
  {
    title: 'Expired',
    value: paymentStatusData.data.value?.find((d) => d.name === 'Expired')?.value ?? 0,
    icon: 'i-ph-x-circle-fill',
    color: 'text-error'
  }
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-lg font-semibold">Revenue Analytics</h1>
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
    </div>

    <LazyAnalyticsLineChart
      :data="revenueTrendData.data.value ?? []"
      title="Revenue Trend"
      :height="300"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LazyAnalyticsBarChart
        :data="revenueBreakdownData.data.value ?? []"
        title="Revenue by Academy"
        :height="280"
      />
      <LazyAnalyticsDonutChart
        :data="paymentStatusData.data.value ?? []"
        title="Payment Status"
        :height="280"
      />
    </div>
  </div>
</template>
