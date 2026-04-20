<script setup lang="ts">
import type { AcademyFeature } from '@/types'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  academyId: number
  initialData: AcademyFeature[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyFeature[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingItem = ref<AcademyFeature | null>(null)

const deleteTarget = ref<AcademyFeature | null>(null)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)

watch(
  () => props.initialData,
  (val) => {
    items.value = structuredClone(val)
  },
  { deep: true }
)

async function refresh() {
  const res = await api<ApiResponse<AcademyFeature[]>>(
    `/admin/academies/${props.academyId}/features`
  )
  items.value = res.data
}

function openAdd() {
  editingItem.value = null
  isModalOpen.value = true
}

function openEdit(item: AcademyFeature) {
  editingItem.value = item
  isModalOpen.value = true
}

function confirmRemove(item: AcademyFeature) {
  deleteTarget.value = item
  isDeleteModalOpen.value = true
}

async function remove() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/academies/${props.academyId}/features/${deleteTarget.value.id}`, {
      method: 'DELETE'
    })
    await refresh()
    isDeleteModalOpen.value = false
    toast.add({ title: 'Feature deleted', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const columns: TableColumn<AcademyFeature>[] = [
  { accessorKey: 'order', header: 'Order' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'icon', header: 'Icon' },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } }
  }
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Featured Benefits</h3>
      <UButton label="Add" color="primary" @click="openAdd" />
    </div>
    <div class="p-px overflow-x-auto">
      <UTable :data="items" :columns="columns" class="px-0 overflow-visible">
        <template #icon-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon :name="`i-ph-${row.original.icon}-fill`" class="size-4 text-muted" />
            <span class="text-muted">{{ row.original.icon }}</span>
          </div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2 justify-end">
            <UButton
              size="sm"
              color="primary"
              variant="light"
              leading-icon="i-ph-pencil-simple-bold"
              label="Edit"
              @click="openEdit(row.original)"
            />
            <UButton
              size="sm"
              color="error"
              variant="light"
              leading-icon="i-ph-trash-simple-bold"
              label="Delete"
              @click="confirmRemove(row.original)"
            />
          </div>
        </template>
      </UTable>
    </div>
  </div>

  <AdminAcademyFeatureModal
    v-model:open="isModalOpen"
    :academy-id="academyId"
    :item="editingItem"
    :next-order="items.length + 1"
    @saved="refresh"
  />

  <AdminConfirmDeleteModal
    v-model:open="isDeleteModalOpen"
    :item-name="deleteTarget?.title"
    :loading="isDeleting"
    @confirm="remove"
  />
</template>
