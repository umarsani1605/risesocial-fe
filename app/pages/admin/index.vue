<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminPayment } from '~/composables/useMockAdminData'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Dashboard',
  navbarIcon: 'i-lucide-layout-dashboard',
  middleware: 'admin'
})

useSeoMeta({
  title: 'Admin Dashboard - Rise Social',
  description: 'Dashboard for admin to manage the platform'
})

const { api } = useApi()
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const [academyStats, cohortStats, userStats] = await Promise.all([
  useAsyncData('admin:academies-count', () =>
    api<PaginatedResponse<unknown>>('/admin/academies', { params: { limit: 1 } })
  ),
  useAsyncData('admin:cohorts-count', () =>
    api<PaginatedResponse<unknown>>('/admin/cohorts', { params: { limit: 1 } })
  ),
  useAsyncData('admin:users-count', () =>
    api<PaginatedResponse<unknown>>('/admin/users', { params: { limit: 1 } })
  )
])

const { getPayments } = useMockAdminData()
const recentPayments = getPayments().slice(0, 5)

const stats = {
  totalAcademies: computed(() => academyStats.data.value?.pagination?.total ?? 0),
  totalCohorts: computed(() => cohortStats.data.value?.pagination?.total ?? 0),
  totalStudents: computed(() => userStats.data.value?.pagination?.total ?? 0),
  totalPayments: recentPayments.filter(p => p.status === 'Paid').length
}

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 5 })

const statCards = computed(() => [
  {
    title: 'Active Academies',
    value: stats.totalAcademies.value,
    icon: 'i-lucide-graduation-cap',
    to: '/admin/academies',
    color: 'text-primary'
  },
  {
    title: 'Total Cohorts',
    value: stats.totalCohorts.value,
    icon: 'i-lucide-layout-list',
    to: '/admin/cohorts',
    color: 'text-blue-500'
  },
  {
    title: 'Total Students',
    value: stats.totalStudents.value,
    icon: 'i-lucide-users',
    to: '/admin/users',
    color: 'text-green-500'
  },
  {
    title: 'Paid Transactions',
    value: stats.totalPayments,
    icon: 'i-lucide-credit-card',
    to: '/admin/payments',
    color: 'text-orange-500'
  }
])

const columns: TableColumn<AdminPayment>[] = [
  {
    accessorKey: 'invoiceNo',
    header: 'No. Invoice'
  },
  {
    accessorKey: 'studentName',
    header: 'Name'
  },
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
      return h(
        UBadge,
        { variant: 'subtle', color: colorMap[status] ?? 'neutral', class: 'capitalize' },
        () => status
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At'
  },
  {
    id: 'actions',
    cell: () =>
      h(UButton, {
        label: 'Detail',
        size: 'xs',
        color: 'primary',
        variant: 'outline',
        leadingIcon: 'i-lucide-chevrons-right'
      })
  }
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <UCard
      v-for="stat in statCards"
      :key="stat.title"
      class="ring-transparent shadow-none! border border-default transition-shadow"
      :to="stat.to"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted">{{ stat.title }}</p>
          <p class="text-3xl font-bold mt-1">{{ stat.value }}</p>
        </div>
        <div class="size-16 flex items-center justify-center rounded-full bg-elevated">
          <UIcon :name="stat.icon" class="size-6" :class="stat.color" />
        </div>
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
        trailing-icon="i-lucide-arrow-right"
        size="sm"
        to="/admin/payments"
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
