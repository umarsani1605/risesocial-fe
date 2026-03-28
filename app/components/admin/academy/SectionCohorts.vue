<script setup lang="ts">
import type { AdminCohort } from '@/types'
import type { TableColumn } from '@nuxt/ui'
import { COHORT_STATUS_LABEL, COHORT_STATUS_COLOR } from '@/constants/cohort'

const props = defineProps<{
  academyId: number
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AdminCohort[]>([])
const loading = ref(false)
const isModalOpen = ref(false)

async function fetchCohorts() {
  loading.value = true
  try {
    const res = await api<ApiResponse<AdminCohort[]>>(
      `/admin/cohorts?academy_id=${props.academyId}`
    )
    items.value = res.data
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'Failed to load cohorts', color: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchCohorts)

const columns: TableColumn<AdminCohort>[] = [
  {
    id: 'index',
    header: '#',
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
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
    <div class="flex justify-end">
      <UButton label="+ Add Cohort" color="primary" @click="isModalOpen = true" />
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
          <UBadge :color="COHORT_STATUS_COLOR[row.original.status] ?? 'neutral'" variant="subtle">
            {{ COHORT_STATUS_LABEL[row.original.status] ?? row.original.status }}
          </UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2 justify-end">
            <UButton
              label="Detail"
              trailing-icon="i-ph-caret-double-right-bold"
              size="sm"
              color="neutral"
              variant="outline"
              :to="`/admin/cohorts/${row.original.id}`"
            />
          </div>
        </template>
      </UTable>
    </div>
  </div>

  <AdminAcademyCohortModal
    v-model:open="isModalOpen"
    :academy-id="academyId"
    @saved="fetchCohorts"
  />
</template>
