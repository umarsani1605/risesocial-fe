<script setup lang="ts">
import type { AcademyInstructor } from '@/types'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  academyId: number
  initialData: AcademyInstructor[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyInstructor[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingItem = ref<AcademyInstructor | null>(null)

const deleteTarget = ref<AcademyInstructor | null>(null)
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
  const res = await api<ApiResponse<AcademyInstructor[]>>(
    `/admin/academies/${props.academyId}/instructors`
  )
  items.value = res.data
}

function openAdd() {
  editingItem.value = null
  isModalOpen.value = true
}

function openEdit(item: AcademyInstructor) {
  editingItem.value = item
  isModalOpen.value = true
}

function confirmRemove(item: AcademyInstructor) {
  deleteTarget.value = item
  isDeleteModalOpen.value = true
}

async function remove() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/academies/${props.academyId}/instructors/${deleteTarget.value.id}`, {
      method: 'DELETE'
    })
    await refresh()
    isDeleteModalOpen.value = false
    toast.add({ title: 'Instructor deleted', color: 'success' })
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const columns: TableColumn<AcademyInstructor>[] = [
  { accessorKey: 'order', header: 'Order' },
  { id: 'avatar', header: '' },
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'job_title',
    header: 'Job Title',
    meta: { class: { th: 'w-[160px]' } },
    cell: ({ row }) =>
      h(
        'span',
        { class: 'truncate block text-sm', title: row.getValue('job_title') },
        row.getValue('job_title')
      )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    meta: { class: { th: 'max-w-[650px]' } },
    cell: ({ row }) =>
      h(
        'span',
        {
          class: 'line-clamp-2 whitespace-normal text-sm text-muted',
          title: row.getValue('description')
        },
        row.getValue('description')
      )
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
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Instructors</h3>
      <UButton label="+ Add" color="primary" @click="openAdd" />
    </div>
    <div class="p-px overflow-x-auto">
      <UTable
        :data="items"
        :columns="columns"
        :ui="{ base: 'table-fixed' }"
        class="px-0 overflow-visible"
      >
        <template #avatar-cell="{ row }">
          <UAvatar
            :src="row.original.avatar_url ?? undefined"
            :fallback="row.original.name.slice(0, 2).toUpperCase()"
            size="sm"
            color="primary"
            variant="subtle"
          />
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2 justify-end">
            <UButton
              size="sm"
              color="primary"
              variant="outline"
              leading-icon="i-ph-pencil-simple-bold"
              label="Edit"
              @click="openEdit(row.original)"
            />
            <UButton
              size="sm"
              color="error"
              variant="outline"
              leading-icon="i-ph-trash-simple-bold"
              label="Delete"
              @click="confirmRemove(row.original)"
            />
          </div>
        </template>
      </UTable>
    </div>
  </div>

  <AdminAcademyInstructorModal
    v-model:open="isModalOpen"
    :academy-id="academyId"
    :item="editingItem"
    :next-order="items.length + 1"
    @saved="refresh"
  />

  <AdminConfirmDeleteModal
    v-model:open="isDeleteModalOpen"
    :item-name="deleteTarget?.name"
    :loading="isDeleting"
    @confirm="remove"
  />
</template>
