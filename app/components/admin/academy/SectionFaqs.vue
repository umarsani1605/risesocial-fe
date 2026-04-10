<script setup lang="ts">
import type { AcademyFaq } from '@/types'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  academyId: number
  initialData: AcademyFaq[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyFaq[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingItem = ref<AcademyFaq | null>(null)

const deleteTarget = ref<AcademyFaq | null>(null)
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
  const res = await api<ApiResponse<AcademyFaq[]>>(`/admin/academies/${props.academyId}/faqs`)
  items.value = res.data
}

function openAdd() {
  editingItem.value = null
  isModalOpen.value = true
}

function openEdit(item: AcademyFaq) {
  editingItem.value = item
  isModalOpen.value = true
}

function confirmRemove(item: AcademyFaq) {
  deleteTarget.value = item
  isDeleteModalOpen.value = true
}

async function remove() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/academies/${props.academyId}/faqs/${deleteTarget.value.id}`, {
      method: 'DELETE'
    })
    await refresh()
    isDeleteModalOpen.value = false
    toast.add({ title: 'FAQ deleted', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const columns: TableColumn<AcademyFaq>[] = [
  { accessorKey: 'order', header: 'Order' },
  {
    accessorKey: 'question',
    header: 'Question',
    cell: ({ row }) =>
      h(
        'span',
        {
          class: 'line-clamp-2 whitespace-normal text-sm font-medium',
          title: row.getValue('question')
        },
        row.getValue('question')
      )
  },
  {
    accessorKey: 'answer',
    header: 'Answer',
    meta: { class: { th: 'max-w-[650px]' } },
    cell: ({ row }) =>
      h(
        'span',
        {
          class: 'line-clamp-2 whitespace-normal text-sm text-muted',
          title: row.getValue('answer')
        },
        row.getValue('answer')
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
      <h3 class="text-lg font-semibold">FAQs</h3>
      <UButton label="Add" color="primary" @click="openAdd" />
    </div>
    <div class="p-px overflow-x-auto">
      <UTable
        :data="items"
        :columns="columns"
        :ui="{ base: 'table-fixed' }"
        class="px-0 overflow-visible"
      >
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

  <AdminAcademyFaqModal
    v-model:open="isModalOpen"
    :academy-id="academyId"
    :item="editingItem"
    :next-order="items.length + 1"
    @saved="refresh"
  />

  <AdminConfirmDeleteModal
    v-model:open="isDeleteModalOpen"
    :item-name="deleteTarget?.question"
    :loading="isDeleting"
    @confirm="remove"
  />
</template>
