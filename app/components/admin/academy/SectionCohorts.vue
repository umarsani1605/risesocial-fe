<script setup lang="ts">
import type { AdminCohort } from '@/types'
import type { TableColumn } from '@nuxt/ui'
import { COHORT_PHASE_LABEL, COHORT_PHASE_COLOR } from '@/constants/cohort'
import { getCohortPhase } from '@/utils/cohort'

const props = defineProps<{
  academyId: number
  academyTitle: string
}>()

const { api } = useApi()
const toast = useToast()
const { canEdit } = useAdminPermission('admin.cohort')

const items = ref<AdminCohort[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const isAdding = ref(false)
const addForm = reactive<{
  academy_id: number | undefined
  name: string
  description: string
  start_date: string
  end_date: string
  copy_from_academy: boolean
}>({
  academy_id: props.academyId,
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  copy_from_academy: false
})

const academySelectItems = computed(() => [
  {
    label: props.academyTitle,
    value: props.academyId
  }
])

function resetAddForm() {
  addForm.academy_id = props.academyId
  addForm.name = ''
  addForm.description = ''
  addForm.start_date = ''
  addForm.end_date = ''
  addForm.copy_from_academy = false
}

watch(isModalOpen, (open) => {
  if (open) resetAddForm()
})

async function fetchCohorts() {
  loading.value = true
  try {
    const res = await api<ApiResponse<AdminCohort[]>>(
      `/admin/cohorts?academy_id=${props.academyId}`
    )
    items.value = res.data
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error, 'Failed to load cohorts'), color: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchCohorts)

async function onAddCohort() {
  isAdding.value = true
  try {
    await api('/admin/cohorts', {
      method: 'POST',
      body: {
        academy_id: props.academyId,
        name: addForm.name,
        description: addForm.description || null,
        start_date: addForm.start_date,
        end_date: addForm.end_date,
        copy_from_academy: addForm.copy_from_academy
      }
    })
    toast.add({ title: 'Cohort created', color: 'success' })
    isModalOpen.value = false
    resetAddForm()
    await fetchCohorts()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isAdding.value = false
  }
}

const columns: TableColumn<AdminCohort>[] = [
  {
    id: 'index',
    header: '#',
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description', meta: { class: { th: 'max-w-[250px]' } } },
  {
    accessorKey: 'enrollment_count',
    header: 'Students',
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  },
  {
    id: 'status',
    header: 'Status',
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  }
]
</script>

<template>
  <div class="space-y-4">
    <div v-if="canEdit" class="flex justify-end">
      <UButton
        label="Add Cohort"
        color="primary"
        leading-icon="i-ph-plus-bold"
        @click="isModalOpen = true"
      />
    </div>

    <div class="p-px overflow-x-auto">
      <UTable
        :data="items"
        :columns="columns"
        :loading="loading"
        empty="No cohorts yet. Click + Add Cohort to add one."
        class="px-0 overflow-visible"
      >
        <template #index-cell="{ row }">
          <span class="text-sm text-muted">{{ row.index + 1 }}</span>
        </template>
        <template #name-cell="{ row }">
          <span class="text-sm font-medium">{{ row.original.name }}</span>
        </template>
        <template #description-cell="{ row }">
          <span class="text-sm text-muted">{{ row.original.description ?? '-' }}</span>
        </template>
        <template #enrollment_count-cell="{ row }">
          <span class="text-sm">{{ row.original.enrollment_count ?? 0 }}</span>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="COHORT_PHASE_COLOR[getCohortPhase(row.original)] ?? 'neutral'" variant="subtle">
            {{ COHORT_PHASE_LABEL[getCohortPhase(row.original)] }}
          </UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2 justify-end">
            <AdminRowAction
              :to="`/admin/cohorts/${row.original.id}`"
              :can-edit="canEdit"
            />
          </div>
        </template>
      </UTable>
    </div>
  </div>

  <AdminCohortCreateModal
    v-model:open="isModalOpen"
    v-model:form="addForm"
    :loading="isAdding"
    :academy-items="academySelectItems"
    :fixed-academy-id="academyId"
    title="Add Cohort"
    @submit="onAddCohort"
  />
</template>
