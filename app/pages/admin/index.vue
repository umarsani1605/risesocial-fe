<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminTransaction } from '@/types'
import { PRODUCT_TYPE_LABEL, PAYMENT_METHOD_LABEL, PROVIDER_LABEL } from '@/constants/transaction'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Dashboard',
  middleware: ['auth', 'admin']
})

useSeoMeta({
  title: 'Admin Dashboard - Rise Social',
  description: 'Dashboard for admin to manage the platform'
})

const UBadge = resolveComponent('UBadge')

const { api } = useApi()
const analytics = useAnalytics()

const { data: overviewData, pending: isOverviewPending } = await useAsyncData('admin:analytics-overview', () =>
  analytics.fetchOverview()
)

const overview = computed(() => overviewData.value)

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'Total Revenue',
    value: overview.value?.totalRevenue ?? 0,
    icon: 'ph:wallet',
    trend: overview.value?.totalRevenueTrend,
    trendLabel: 'vs last week',
    color: 'green',
    to: '/admin/analytics/revenue'
  },
  {
    title: 'Total Users',
    value: overview.value?.totalUsers ?? 0,
    icon: 'ph:users-three',
    trend: overview.value?.totalUsersTrend,
    trendLabel: 'vs last week',
    color: 'blue',
    to: '/admin/analytics/users'
  },
  {
    title: 'Active Cohorts',
    value: overview.value?.activeCohorts ?? 0,
    icon: 'ph:graduation-cap',
    trend: overview.value?.activeCohortsTrend,
    trendLabel: 'vs last week',
    color: 'purple',
    to: '/admin/cohorts'
  },
  {
    title: 'RYLS Registrations',
    value: overview.value?.rylsRegistrations ?? 0,
    icon: 'ph:medal',
    trend: overview.value?.rylsRegistrationsTrend,
    trendLabel: 'vs last week',
    color: 'orange',
    to: '/admin/analytics/programs'
  }
])

const { data: txData } = await useAsyncData('admin:recent-transactions', () =>
  api<PaginatedResponse<AdminTransaction>>('/admin/transactions', { query: { limit: 5, page: 1 } })
)

const recentTransactions = computed(() => txData.value?.data ?? [])

const columns: TableColumn<AdminTransaction>[] = [
  {
    accessorKey: 'transaction_code',
    header: 'Transaction Code',
    cell: ({ row }) => h('span', { class: 'font-mono text-sm' }, row.getValue('transaction_code'))
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const tx = row.original
      return h('div', { class: 'text-sm space-y-0.5' }, [
        h('div', tx.customer_name),
        h('div', { class: 'text-muted' }, tx.customer_email),
        tx.customer_phone ? h('div', { class: 'text-muted' }, tx.customer_phone) : null
      ])
    }
  },
  {
    accessorKey: 'product_type',
    header: 'Product Type',
    cell: ({ row }) => {
      const tx = row.original
      const label = PRODUCT_TYPE_LABEL[tx.product_type] ?? tx.product_type
      return h('div', { class: 'text-sm space-y-0.5 max-w-48' }, [
        h('span', { class: 'font-medium block truncate', title: label }, label),
        tx.product_name
          ? h(
              'span',
              { class: 'text-muted text-sm block truncate', title: tx.product_name },
              tx.product_name
            )
          : null
      ])
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatPrice(row.getValue('amount')))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const label = status.charAt(0).toUpperCase() + status.slice(1)
      return h(
        UBadge,
        { variant: 'subtle', color: TRANSACTION_STATUS_COLOR[status] ?? 'neutral' },
        () => label
      )
    }
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({ row }) => {
      const provider = row.getValue('provider') as string | null
      return h(
        'span',
        { class: 'text-sm' },
        provider ? (PROVIDER_LABEL[provider] ?? provider) : '—'
      )
    }
  },
  {
    accessorKey: 'payment_method',
    header: 'Method',
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as string | null
      return h(
        'span',
        { class: 'text-sm' },
        method ? (PAYMENT_METHOD_LABEL[method] ?? method) : '—'
      )
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatDatetime(row.getValue('created_at')))
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="isOverviewPending">
        <USkeleton v-for="i in 4" :key="i" class="h-28 rounded-xl" />
      </template>
      <template v-else>
        <AnalyticsStatCard v-for="stat in statCards" :key="stat.title" :stat="stat" />
      </template>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnalyticsAreaChart
        v-if="overview?.revenueTrend?.length"
        :data="overview.revenueTrend"
        title="Revenue Trend (30d)"
        color="primary"
        :height="300"
      />
      <AnalyticsAreaChart
        v-if="overview?.usersTrend?.length"
        :data="overview.usersTrend"
        title="RYLS Registrations Trend (30d)"
        color="primary"
        :height="300"
      />
    </div>

    <div class="mt-2">
      <AdminCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold">Recent Transactions</h2>
            <UButton
              label="View All"
              color="neutral"
              variant="ghost"
              trailing-icon="i-ph-arrow-right-bold"
              to="/admin/transactions"
            />
          </div>
        </template>
        <div class="overflow-x-auto">
          <UTable
            :data="recentTransactions"
            :columns="columns"
            :ui="{ td: 'align-top' }"
            class="px-4 sm:px-6"
          />
        </div>
      </AdminCard>
    </div>
  </div>
</template>
