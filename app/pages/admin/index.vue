<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminPayment } from '~/composables/useMockAdminData'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Dashboard',
  navbarIcon: 'i-ph-squares-four-fill',
  middleware: 'admin'
})

useSeoMeta({
  title: 'Admin Dashboard - Rise Social',
  description: 'Dashboard for admin to manage the platform'
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const analytics = useAnalytics()
const { api } = useApi()

const [overviewData, academyStats] = await Promise.all([
  useAsyncData('admin:analytics-overview', () => analytics.fetchOverview()),
  useAsyncData('admin:academies-count', () =>
    api<PaginatedResponse<unknown>>('/admin/academies', { params: { limit: 1 } })
  )
])

const overview = computed(() => overviewData.data.value)

const statCards = computed<AnalyticsStat[]>(() => [
  {
    title: 'Total Revenue',
    value: overview.value?.totalRevenue ?? 0,
    icon: 'i-ph-currency-circle-dollar-fill',
    trend: overview.value?.totalRevenueTrend,
    trendLabel: 'vs last month',
    color: 'text-success',
    to: '/admin/analytics/revenue'
  },
  {
    title: 'Total Users',
    value: overview.value?.totalUsers ?? 0,
    icon: 'i-ph-users-fill',
    trend: overview.value?.totalUsersTrend,
    trendLabel: 'vs last month',
    color: 'text-blue-500',
    to: '/admin/analytics/users'
  },
  {
    title: 'Active Enrollments',
    value: overview.value?.activeEnrollments ?? 0,
    icon: 'i-ph-student-fill',
    color: 'text-primary',
    to: '/admin/analytics/academies'
  },
  {
    title: 'Active Academies',
    value: academyStats.data.value?.pagination?.total ?? overview.value?.totalAcademies ?? 0,
    icon: 'i-ph-graduation-cap-fill',
    color: 'text-purple-500',
    to: '/admin/academies'
  },
  {
    title: 'RYLS Registrations',
    value: overview.value?.rylsRegistrations ?? 0,
    icon: 'i-ph-medal-fill',
    color: 'text-orange-500',
    to: '/admin/analytics/programs'
  },
  {
    title: 'Job Postings',
    value: overview.value?.jobPostings ?? 0,
    icon: 'i-ph-briefcase-fill',
    color: 'text-teal-500',
    to: '/admin/jobs'
  }
])

const { getPayments } = useMockAdminData()
const recentPayments = getPayments().slice(0, 5)

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 5 })

const columns: TableColumn<AdminPayment>[] = [
  { accessorKey: 'invoiceNo', header: 'No. Invoice' },
  { accessorKey: 'studentName', header: 'Name' },
  {
    accessorKey: 'academy',
    header: 'Academy',
    cell: ({ row }) => h('span', { class: 'text-primary' }, row.getValue('academy'))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const colorMap: Record<string, 'success' | 'warning' | 'error'> = {
        Paid: 'success',
        Pending: 'warning',
        Expired: 'error'
      }
      const status = row.getValue('status') as string
      return h(UBadge, { variant: 'subtle', color: colorMap[status] ?? 'neutral', class: 'capitalize' }, () => status)
    }
  },
  { accessorKey: 'createdAt', header: 'Created At' },
  {
    id: 'actions',
    cell: () => h(UButton, { label: 'Detail', size: 'xs', color: 'primary', variant: 'outline', leadingIcon: 'i-ph-caret-double-right-fill' })
  }
]
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
    <AnalyticsStatCard
      v-for="stat in statCards"
      :key="stat.title"
      :stat="stat"
    />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <UCard class="ring-transparent shadow-none border border-default">
      <template #header>
        <p class="text-sm font-semibold">Revenue Trend (30d)</p>
      </template>
      <div class="h-20">
        <LazyAnalyticsLineChart
          v-if="overview?.revenueTrend?.length"
          :data="overview.revenueTrend"
          :mini="true"
          :height="80"
        />
      </div>
    </UCard>

    <UCard class="ring-transparent shadow-none border border-default">
      <template #header>
        <p class="text-sm font-semibold">User Growth (30d)</p>
      </template>
      <div class="h-20">
        <LazyAnalyticsLineChart
          v-if="overview?.usersTrend?.length"
          :data="overview.usersTrend"
          :mini="true"
          :height="80"
        />
      </div>
    </UCard>
  </div>

  <div class="mt-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold">Recent Payments</h2>
      <UButton
        label="View All"
        color="neutral"
        variant="ghost"
        trailing-icon="i-ph-arrow-right-fill"
        size="sm"
        to="/admin/transactions"
      />
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <UTable
        ref="table"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="recentPayments"
        :columns="columns"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default'
        }"
      />
      <div class="flex items-center justify-between px-4 py-3 border-t border-default">
        <p class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </p>
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </UCard>
  </div>
</template>
