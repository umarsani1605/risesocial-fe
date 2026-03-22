<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminPayment } from '~/composables/useMockAdminData'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Payments',
  navbarIcon: 'i-lucide-credit-card',
  middleware: 'admin'
})
const { getPayments, academyOptions } = useMockAdminData()

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const search = ref('')
const academyFilter = ref('all')
const statusFilter = ref('all')

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Expired', value: 'Expired' }
]

const filteredData = computed(() =>
  getPayments({
    search: search.value,
    academy: academyFilter.value,
    status: statusFilter.value
  })
)

const columns: TableColumn<AdminPayment>[] = [
  {
    id: 'no',
    header: '',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.index + 1)
  },
  {
    accessorKey: 'invoiceNo',
    header: 'No. Invoice',
    cell: ({ row }) => h('span', { class: 'text-primary font-medium' }, row.getValue('invoiceNo'))
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
      const status = row.getValue('status') as string
      const colorMap: Record<string, 'success' | 'warning' | 'error'> = {
        Paid: 'success',
        Pending: 'warning',
        Expired: 'error'
      }
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
      <UCard :ui="{ body: 'p-0' }">
        <div class="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-default">
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <UInput v-model="search" icon="i-lucide-search" placeholder="Search..." class="w-full sm:w-56" />
            <div class="flex w-full sm:w-auto gap-2">
              <USelect v-model="academyFilter" :items="academyOptions" class="flex-1 sm:flex-none sm:w-44" />
              <USelect v-model="statusFilter" :items="statusOptions" class="flex-1 sm:flex-none sm:w-36" />
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <UTable
            ref="table"
            v-model:pagination="pagination"
            :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
            :data="filteredData"
            :columns="columns"
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
              td: 'border-b border-default'
            }"
          />
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 border-t border-default">
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

</template>
