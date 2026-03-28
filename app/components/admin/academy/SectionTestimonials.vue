<script setup lang="ts">
import type { AcademyTestimonial } from '@/types'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  academyId: number
  initialData: AcademyTestimonial[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyTestimonial[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingItem = ref<AcademyTestimonial | null>(null)

const deleteTarget = ref<AcademyTestimonial | null>(null)
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
  const res = await api<ApiResponse<AcademyTestimonial[]>>(
    `/admin/academies/${props.academyId}/testimonials`
  )
  items.value = res.data
}

function openAdd() {
  editingItem.value = null
  isModalOpen.value = true
}

function openEdit(item: AcademyTestimonial) {
  editingItem.value = item
  isModalOpen.value = true
}

function confirmRemove(item: AcademyTestimonial) {
  deleteTarget.value = item
  isDeleteModalOpen.value = true
}

async function remove() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/academies/${props.academyId}/testimonials/${deleteTarget.value.id}`, {
      method: 'DELETE'
    })
    await refresh()
    isDeleteModalOpen.value = false
    toast.add({ title: 'Testimonial deleted', color: 'success' })
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const columns: TableColumn<AcademyTestimonial>[] = [
  { accessorKey: 'order', header: 'Order' },
  { accessorKey: 'avatar_url', header: 'Avatar' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'comment', header: 'Comment' },
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
      <h3 class="text-lg font-semibold">Testimonials</h3>
      <UButton label="+ Add" color="primary" @click="openAdd" />
    </div>
    <div class="p-px overflow-x-auto">
      <UTable :data="items" :columns="columns" class="px-0 overflow-visible">
        <template #avatar_url-cell="{ row }">
          <img
            v-if="row.original.avatar_url"
            :src="row.original.avatar_url"
            class="size-8 rounded-full object-cover"
          />
          <div v-else class="size-8 rounded-full bg-elevated flex items-center justify-center">
            <UIcon name="i-ph-user-bold" class="size-4 text-muted" />
          </div>
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

  <AdminAcademyTestimonialModal
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
