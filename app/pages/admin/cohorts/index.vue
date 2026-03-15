<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Cohort {
  id: number
  academy: string
  name: string
  description: string | null
  students: number
  status: 'completed' | 'on_going' | 'not_started' | 'cancelled'
}

// ─── Page meta ───────────────────────────────────────────────────────────────
definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Cohorts',
  navbarIcon: 'i-lucide-layout-list',
  middleware: 'admin',
})

// ─── Static data ─────────────────────────────────────────────────────────────
const staticCohorts: Cohort[] = [
  { id: 1, academy: 'Carbon Accounting', name: 'Batch 1', description: 'November 2025', students: 5, status: 'completed' },
  { id: 2, academy: 'Carbon Accounting', name: 'Batch 2', description: null, students: 10, status: 'on_going' },
  { id: 3, academy: 'ESG (Environmental, Social, and Governance)', name: 'Summer Class', description: 'Summer Class', students: 20, status: 'not_started' },
  { id: 4, academy: 'LCA (Life Cycle Assessment)', name: 'Batch 1', description: 'April 2026', students: 15, status: 'completed' },
  { id: 5, academy: 'LCA (Life Cycle Assessment)', name: 'Batch 2', description: null, students: 8, status: 'on_going' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  completed: 'Completed',
  on_going: 'On Going',
  not_started: 'Not Starded',
  cancelled: 'Cancelled',
}
const STATUS_COLOR: Record<string, 'success' | 'warning' | 'neutral' | 'error'> = {
  completed: 'success',
  on_going: 'warning',
  not_started: 'neutral',
  cancelled: 'error',
}

// ─── Filters ─────────────────────────────────────────────────────────────────
const search = ref('')
const academyFilter = ref('all')
const statusFilter = ref('all')

const academyOptions = computed(() => {
  const academies = [...new Set(staticCohorts.map(c => c.academy))]
  return [
    { label: 'All Academy', value: 'all' },
    ...academies.map(a => ({ label: a, value: a })),
  ]
})

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'On Going', value: 'on_going' },
  { label: 'Not Started', value: 'not_started' },
]

const filteredData = computed(() => {
  let result = [...staticCohorts]
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(c =>
      c.academy.toLowerCase().includes(s) || c.name.toLowerCase().includes(s)
    )
  }
  if (academyFilter.value !== 'all') {
    result = result.filter(c => c.academy === academyFilter.value)
  }
  if (statusFilter.value !== 'all') {
    result = result.filter(c => c.status === statusFilter.value)
  }
  return result
})

// ─── Table columns ────────────────────────────────────────────────────────────
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const columns: TableColumn<Cohort>[] = [
  {
    id: 'no',
    header: '',
    size: 48,
    cell: ({ row }) => h('span', { class: 'text-muted text-sm' }, row.index + 1),
  },
  {
    accessorKey: 'academy',
    header: 'Academy',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.getValue('academy')),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) =>
      h('span', { class: 'text-primary font-medium text-sm' }, row.getValue('name')),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const val = row.getValue('description') as string | null
      return h('span', { class: val ? 'text-primary text-sm' : 'text-muted text-sm' }, val ?? '-')
    },
  },
  {
    accessorKey: 'students',
    header: 'Students',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.getValue('students')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.getValue('status') as string
      return h(UBadge, { variant: 'subtle', color: STATUS_COLOR[s] ?? 'neutral', size: 'sm' }, () => STATUS_LABEL[s] ?? s)
    },
  },
  {
    id: 'actions',
    size: 100,
    cell: ({ row }) =>
      h(UButton, {
        label: 'Detail',
        size: 'xs',
        color: 'primary',
        variant: 'outline',
        leadingIcon: 'i-lucide-chevrons-right',
        to: `/admin/cohorts/${row.original.id}`,
      }),
  },
]

// ─── Add New modal ────────────────────────────────────────────────────────────
const isAddOpen = ref(false)
const addForm = reactive({ academy: '', name: '', description: '' })

const academySelectItems = computed(() =>
  [...new Set(staticCohorts.map(c => c.academy))].map(a => ({ label: a, value: a }))
)
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-default">
      <div class="flex flex-wrap items-center gap-2">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search..."
          size="sm"
          class="w-56"
        />
        <USelect
          v-model="academyFilter"
          :items="academyOptions"
          size="sm"
          class="w-44"
        />
        <USelect
          v-model="statusFilter"
          :items="statusOptions"
          size="sm"
          class="w-36"
        />
      </div>
      <UButton
        label="Add New"
        icon="i-lucide-plus"
        color="primary"
        size="sm"
        @click="isAddOpen = true"
      />
    </div>

    <!-- Table -->
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
        th: 'py-2 text-xs font-semibold text-muted first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'py-3 border-b border-default',
      }"
    />

    <!-- Footer pagination -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-default">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length ?? 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length ?? 0 }} row(s) selected.
      </p>
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex ?? 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        size="sm"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </UCard>

  <!-- Modal: Add New Cohort -->
  <UModal v-model:open="isAddOpen" title="Add New Cohort">
    <template #body>
      <div class="space-y-5">
        <UFormField label="Academy">
          <USelect
            v-model="addForm.academy"
            :items="academySelectItems"
            placeholder="Select Academy"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Name">
          <UInput v-model="addForm.name" placeholder="Cohort Name" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea
            v-model="addForm.description"
            placeholder="Cohort Description"
            :rows="4"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          label="Cancel"
          color="neutral"
          variant="outline"
          @click="isAddOpen = false"
        />
        <UButton label="Add Cohort" color="primary" @click="isAddOpen = false" />
      </div>
    </template>
  </UModal>
</template>
