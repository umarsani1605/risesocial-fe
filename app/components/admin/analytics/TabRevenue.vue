<script setup lang="ts">
const props = defineProps<{ dateRange: AnalyticsDateRange }>()

const analytics = useAnalytics()

const dateRange = computed(() => props.dateRange)

const revenueTrendData = useLazyAsyncData(
  'analytics:revenue-trend',
  () => analytics.fetchRevenueTrend(dateRange.value),
  { server: false, default: () => [] }
)
const paymentStatusData = useLazyAsyncData(
  'analytics:payment-status',
  () => analytics.fetchPaymentStatusBreakdown(dateRange.value),
  { server: false, default: () => [] }
)
const revenueByTypeData = useLazyAsyncData(
  'analytics:revenue-by-type',
  () => analytics.fetchRevenueByType(dateRange.value),
  { server: false, default: () => [] }
)

watch(
  dateRange,
  async () => {
    await Promise.all([
      revenueTrendData.refresh(),
      paymentStatusData.refresh(),
      revenueByTypeData.refresh()
    ])
  },
  { deep: true }
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

const isTrendLoading = computed(() =>
  revenueTrendData.status.value === 'idle' || revenueTrendData.status.value === 'pending'
)
const isPaymentStatusLoading = computed(() =>
  paymentStatusData.status.value === 'idle' || paymentStatusData.status.value === 'pending'
)
const isRevenueByTypeLoading = computed(() =>
  revenueByTypeData.status.value === 'idle' || revenueByTypeData.status.value === 'pending'
)
const isStatsLoading = computed(() => isTrendLoading.value || isPaymentStatusLoading.value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" :loading="isStatsLoading" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
      <div class="lg:col-span-3 flex">
        <LazyAnalyticsLineChart
          :data="revenueTrendData.data.value ?? []"
          title="Revenue Trend"
          :height="380"
          class="w-full h-full"
          :loading="isTrendLoading"
        />
      </div>
      <div class="lg:col-span-2 flex">
        <LazyAnalyticsDonutChart
          :data="revenueByTypeData.data.value ?? []"
          title="Revenue by Type"
          :height="320"
          :value-formatter="formatPriceCompact"
          class="w-full h-full"
          :loading="isRevenueByTypeLoading"
        />
      </div>
    </div>
  </div>
</template>
