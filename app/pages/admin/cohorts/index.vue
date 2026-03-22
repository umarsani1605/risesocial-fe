<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminCohort, AdminAcademy } from '@/types'
import {
  COHORT_STATUS_LABEL,
  COHORT_STATUS_COLOR,
  COHORT_STATUS_ITEMS
} from '@/constants/cohort'
import { cohortCreatePageSchema } from '@/schemas/cohort'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Cohorts',
  navbarIcon: 'i-lucide-layout-list',
  middleware: 'admin'
})

const { api } = useApi()
const toast = useToast()

const { data: cohortsData, refresh } = await useAsyncData('admin-cohorts', () =>
  api<ApiResponse<AdminCohort[]>>('/admin/cohorts')
)
const { data: academiesData } = await useAsyncData('admin-academy-list', () =>
  api<ApiResponse<AdminAcademy[]>>('/admin/academies')
)

const cohorts = computed(() => cohortsData.value?.data ?? [])
const academies = computed(() => academiesData.value?.data ?? [])

const search = ref('')
const academyFilter = ref('all')
const statusFilter = ref('all')

const academyOptions = computed(() => [
  { label: 'All Academy', value: 'all' },
  ...academies.value.map((a) => ({ label: a.title, value: String(a.id) }))
])

const statusOptions = [{ label: 'All Status', value: 'all' }, ...COHORT_STATUS_ITEMS]

const filteredData = computed(() => {
  let result = [...cohorts.value]
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(
      (c) => c.academy?.title.toLowerCase().includes(s) || c.name.toLowerCase().includes(s)
    )
  }
  if (academyFilter.value !== 'all') {
    result = result.filter((c) => String(c.academy?.id) === academyFilter.value)
  }
  if (statusFilter.value !== 'all') {
    result = result.filter((c) => c.status === statusFilter.value)
  }
  return result
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const columns: TableColumn<AdminCohort>[] = [
  {
    id: 'no',
    header: '',
    size: 48,
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.index + 1)
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => h('span', { class: 'text-muted text-sm' }, row.getValue('name'))
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const val = row.getValue('description') as string | null
      return h('span', { class: val ? 'text-sm' : 'text-muted text-sm' }, val ?? '-')
    }
  },
  {
    id: 'academy',
    header: 'Academy',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.academy?.title ?? '-')
  },
  {
    accessorKey: 'enrollment_count',
    header: 'Students',
    cell: ({ row }) => h('span', { class: 'text-sm' }, String(row.original.enrollment_count ?? '-'))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.getValue('status') as string
      return h(
        UBadge,
        { variant: 'subtle', color: COHORT_STATUS_COLOR[s] ?? 'neutral' },
        () => COHORT_STATUS_LABEL[s] ?? s
      )
    }
  },
  {
    id: 'actions',
    size: 100,
    cell: ({ row }) =>
      h(UButton, {
        label: 'Detail',
        color: 'primary',
        variant: 'outline',
        size: 'sm',
        leadingIcon: 'i-lucide-chevrons-right',
        to: `/admin/cohorts/${row.original.id}`
      })
  }
]

const isAddOpen = ref(false)
const isAdding = ref(false)
const addForm = reactive<{ academy_id: number | undefined; name: string; description: string }>({
  academy_id: undefined,
  name: '',
  description: ''
})
const addFormRef = useTemplateRef('addCohortForm')

const academySelectItems = computed(() =>
  academies.value.map((a) => ({ label: a.title, value: a.id }))
)

async function onAddCohort() {
  isAdding.value = true
  try {
    await api('/admin/cohorts', {
      method: 'POST',
      body: {
        academy_id: addForm.academy_id,
        name: addForm.name,
        description: addForm.description || null
      }
    })
    toast.add({ title: 'Cohort created', color: 'success' })
    isAddOpen.value = false
    addForm.academy_id = undefined
    addForm.name = ''
    addForm.description = ''
    await refresh()
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isAdding.value = false
  }
}
</script>

<template>
  <UCard :ui="{ root: 'overflow-scroll', body: 'p-0! border-none' }">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search name, description, or academy"
            class="w-full sm:w-80"
          />
          <div class="flex w-full sm:w-auto gap-2">
            <USelect v-model="academyFilter" :items="academyOptions" class="flex-1 sm:flex-none sm:w-44" />
            <USelect v-model="statusFilter" :items="statusOptions" class="flex-1 sm:flex-none sm:w-36" />
          </div>
        </div>
        <UButton label="Add New" icon="i-lucide-plus" color="primary" @click="isAddOpen = true" />
      </div>
    </template>
    <div class="overflow-x-auto">
      <UTable
        ref="table"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="filteredData"
        :columns="columns"
        class="px-4 sm:px-6"
      />
    </div>
    <template #footer>
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p class="text-sm text-muted">
          {{ table?.tableApi?.getPaginationRowModel().rows.length ?? 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length ?? 0 }} data shown.
        </p>
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex ?? 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          variant="ghost"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </template>
  </UCard>

  <UModal v-model:open="isAddOpen" title="Add New Cohort" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm ref="addCohortForm" :schema="cohortCreatePageSchema" :state="addForm" class="space-y-5" @submit="onAddCohort">
        <UFormField name="academy_id" label="Academy" required>
          <USelectMenu
            v-model="addForm.academy_id"
            value-key="value"
            :items="academySelectItems"
            placeholder="Select Academy"
            class="w-full"
          />
        </UFormField>
        <UFormField name="name" label="Name" required>
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
      </UForm>
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="isAdding"
        @click="isAddOpen = false"
      />
      <UButton
        label="Add Cohort"
        color="primary"
        :loading="isAdding"
        :disabled="isAdding"
        @click="addFormRef?.submit()"
      />
    </template>
  </UModal>
</template>
