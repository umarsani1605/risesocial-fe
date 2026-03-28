<script setup lang="ts">
import type { AcademyPricing } from '@/types'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  academyId: number
  initialData: AcademyPricing[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyPricing[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingItem = ref<AcademyPricing | null>(null)

const deleteTarget = ref<AcademyPricing | null>(null)
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
  const res = await api<ApiResponse<AcademyPricing[]>>(
    `/admin/academies/${props.academyId}/pricing`
  )
  items.value = res.data
}

function openAdd() {
  editingItem.value = null
  isModalOpen.value = true
}

function openEdit(item: AcademyPricing) {
  editingItem.value = item
  isModalOpen.value = true
}

function confirmRemove(item: AcademyPricing) {
  deleteTarget.value = item
  isDeleteModalOpen.value = true
}

async function remove() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/academies/${props.academyId}/pricing/${deleteTarget.value.id}`, {
      method: 'DELETE'
    })
    await refresh()
    isDeleteModalOpen.value = false
    toast.add({ title: 'Pricing deleted', color: 'success' })
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

function formatPrice(val: number) {
  return `Rp ${val.toLocaleString('id-ID')}`
}

const columns: TableColumn<AcademyPricing>[] = [
  { accessorKey: 'order', header: 'Order' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'original_price', header: 'Original Price' },
  { accessorKey: 'discount_price', header: 'Discount Price' },
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
      <h3 class="text-lg font-semibold">Pricing</h3>
      <UButton label="+ Add" color="primary" @click="openAdd" />
    </div>
    <div class="p-px overflow-x-auto">
      <UTable :data="items" :columns="columns" class="px-0 overflow-visible">
        <template #original_price-cell="{ row }">
          {{ formatPrice(row.original.original_price) }}
        </template>
        <template #discount_price-cell="{ row }">
          {{ formatPrice(row.original.discount_price) }}
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2 justify-end">
            <UButton
              size="sm"
              color="primary"
              variant="outline"
              leading-icon="i-ph-pencil-bold"
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

  <AdminAcademyPricingModal
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
