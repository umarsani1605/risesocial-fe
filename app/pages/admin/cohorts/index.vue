<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminCohort, AdminAcademy } from '@/types'
import { COHORT_STATUS_LABEL, COHORT_STATUS_COLOR, COHORT_STATUS_ITEMS } from '@/constants/cohort'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Cohorts',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Cohorts - Rise Social' })

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

const route = useRoute()

const search = ref('')
const academyFilter = ref('all')
const statusFilter = ref('all')

const idFilter = computed(() => (route.query.id ? Number(route.query.id) : null))

const academyOptions = computed(() => [
  { label: 'All Academy', value: 'all' },
  ...academies.value.map((a) => ({ label: a.title, value: String(a.id) }))
])

const statusOptions = [{ label: 'All Status', value: 'all' }, ...COHORT_STATUS_ITEMS]

const filteredData = computed(() => {
  let result = [...cohorts.value]
  if (idFilter.value) {
    return result.filter((c) => c.id === idFilter.value)
  }
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
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) =>
      h(UButton, {
        label: 'Detail',
        color: 'primary',
        variant: 'outline',
        size: 'sm',
        leadingIcon: 'i-ph-caret-double-right-bold',
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
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isAdding.value = false
  }
}
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :data="filteredData"
    :columns="columns"
    search-placeholder="Search name, description, or academy"
    search-class="w-full sm:w-80"
    table-class="px-4 sm:px-6"
  >
    <template #toolbar-left>
      <div class="flex w-full sm:w-auto gap-2">
        <USelect v-model="academyFilter" :items="academyOptions" class="flex-1 sm:flex-none sm:w-44" />
        <USelect v-model="statusFilter" :items="statusOptions" class="flex-1 sm:flex-none sm:w-36" />
      </div>
    </template>
    <template #toolbar-right>
      <UButton label="Add New" icon="i-ph-plus-bold" color="primary" @click="isAddOpen = true" />
    </template>
  </AdminDataTable>

  <AdminCohortCreateModal
    v-model:open="isAddOpen"
    v-model:form="addForm"
    :loading="isAdding"
    :academy-items="academySelectItems"
    @submit="onAddCohort"
  />
</template>
