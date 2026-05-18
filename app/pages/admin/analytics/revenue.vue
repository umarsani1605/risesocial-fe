<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Revenue Analytics',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Revenue Analytics - Rise Social' })

const analytics = useAnalytics()

const dateRange = ref<AnalyticsDateRange>({
  period: '30d',
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  end: new Date()
})

const [revenueTrendData, paymentStatusData, revenueByTypeData] = await Promise.all([
  useAsyncData('analytics:revenue-trend', () =>
    analytics.fetchRevenueTrend(dateRange.value.period)
  ),
  useAsyncData('analytics:payment-status', () => analytics.fetchPaymentStatusBreakdown()),
  useAsyncData('analytics:revenue-by-type', () => analytics.fetchRevenueByType())
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
    color: 'blue'
  },
  {
    title: 'Paid Transactions',
    value: paymentStatusData.data.value?.find((d) => d.name === 'Paid')?.value ?? 0,
    icon: 'i-ph-check-circle-fill',
    color: 'green'
  },
  {
    title: 'Pending',
    value: paymentStatusData.data.value?.find((d) => d.name === 'Pending')?.value ?? 0,
    icon: 'i-ph-clock-fill',
    color: 'yellow'
  },
  {
    title: 'Expired',
    value: paymentStatusData.data.value?.find((d) => d.name === 'Expired')?.value ?? 0,
    icon: 'i-ph-x-circle-fill',
    color: 'red'
  }
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-end">
      <AnalyticsTimeRangeFilter v-model="dateRange" />
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
      <div class="lg:col-span-3 flex">
        <LazyAnalyticsLineChart
          :data="revenueTrendData.data.value ?? []"
          title="Revenue Trend"
          :height="380"
          class="w-full h-full"
        />
      </div>
      <div class="lg:col-span-2 flex">
        <LazyAnalyticsDonutChart
          :data="revenueByTypeData.data.value ?? []"
          title="Revenue by Type"
          :height="320"
          :value-formatter="formatPriceCompact"
          class="w-full h-full"
        />
      </div>
    </div>
  </div>
</template>
