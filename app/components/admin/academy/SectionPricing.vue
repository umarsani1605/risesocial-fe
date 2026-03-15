<script setup lang="ts">
import type { AcademyPricing } from '@/types'

const props = defineProps<{
  academyId: number
  initialData: AcademyPricing[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyPricing[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const form = reactive({ name: '', original_price: '', discount_price: '', order: '' })

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
  editingId.value = null
  form.name = ''
  form.original_price = ''
  form.discount_price = ''
  form.order = String(items.value.length + 1)
  isModalOpen.value = true
}

function openEdit(item: AcademyPricing) {
  editingId.value = item.id
  form.name = item.name
  form.original_price = String(item.original_price)
  form.discount_price = String(item.discount_price)
  form.order = String(item.order)
  isModalOpen.value = true
}

async function save() {
  if (!form.name.trim()) {
    toast.add({ title: 'Package name is required', color: 'error' })
    return
  }
  loading.value = true
  try {
    const body = {
      name: form.name,
      original_price: Number(form.original_price),
      discount_price: Number(form.discount_price),
      order: Number(form.order)
    }
    if (editingId.value !== null) {
      await api(`/admin/academies/${props.academyId}/pricing/${editingId.value}`, {
        method: 'PUT',
        body
      })
    } else {
      await api(`/admin/academies/${props.academyId}/pricing`, { method: 'POST', body })
    }
    await refresh()
    isModalOpen.value = false
    toast.add({ title: 'Pricing saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function remove(item: AcademyPricing) {
  try {
    await api(`/admin/academies/${props.academyId}/pricing/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'Pricing deleted', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  }
}

function formatPrice(val: number) {
  return `Rp ${val.toLocaleString('id-ID')}`
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Pricing</h3>
      <UButton label="+ Add New" color="primary" @click="openAdd" />
    </div>
    <div class="border border-default rounded-lg overflow-hidden">
      <div
        class="grid grid-cols-[2.5rem_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-elevated/50 border-b border-default text-sm font-medium"
      >
        <span>Order</span>
        <span>Name</span>
        <span>Original Price</span>
        <span>Discount Price</span>
        <span>Actions</span>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[2.5rem_1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-default last:border-b-0 items-center"
      >
        <span class="text-sm text-muted">{{ item.order }}</span>
        <span class="text-sm font-medium">{{ item.name }}</span>
        <span class="text-sm">{{
          item.formatted_original_price ?? formatPrice(item.original_price)
        }}</span>
        <span class="text-sm">{{
          item.formatted_discount_price ?? formatPrice(item.discount_price)
        }}</span>
        <div class="flex items-center gap-2">
          <UButton
            label="Edit"
            size="xs"
            color="neutral"
            variant="outline"
            leading-icon="i-lucide-pencil"
            @click="openEdit(item)"
          />
          <UButton
            label="Delete"
            size="xs"
            color="error"
            variant="outline"
            leading-icon="i-lucide-trash-2"
            @click="remove(item)"
          />
        </div>
      </div>
      <div v-if="items.length === 0" class="px-4 py-8 text-center text-sm text-muted">
        No pricing data available
      </div>
    </div>
  </div>

  <UModal
    v-model:open="isModalOpen"
    :title="editingId !== null ? 'Edit Pricing' : 'Add Pricing'"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField label="Package Name">
          <UInput v-model="form.name" placeholder="e.g. Early Bird" class="w-full" />
        </UFormField>
        <UFormField label="Original Price">
          <UInput
            v-model="form.original_price"
            type="number"
            placeholder="5000000"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Discount Price">
          <UInput
            v-model="form.discount_price"
            type="number"
            placeholder="3500000"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Order">
          <UInput v-model="form.order" type="number" placeholder="1" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="isModalOpen = false" />
      <UButton
        label="Save"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="save"
      />
    </template>
  </UModal>
</template>
