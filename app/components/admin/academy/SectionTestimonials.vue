<script setup lang="ts">
import type { AcademyTestimonial } from '@/types'

const props = defineProps<{
  academyId: number
  initialData: AcademyTestimonial[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyTestimonial[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const form = reactive({ name: '', comment: '', order: '' })

watch(() => props.initialData, (val) => {
  items.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

async function refresh() {
  const res = await api<ApiResponse<AcademyTestimonial[]>>(`/admin/academies/${props.academyId}/testimonials`)
  items.value = res.data
}

function openAdd() {
  editingId.value = null
  form.name = ''
  form.comment = ''
  form.order = String(items.value.length + 1)
  isModalOpen.value = true
}

function openEdit(item: AcademyTestimonial) {
  editingId.value = item.id
  form.name = item.name
  form.comment = item.comment
  form.order = String(item.order ?? '')
  isModalOpen.value = true
}

async function save() {
  if (!form.name.trim()) {
    toast.add({ title: 'Name is required', color: 'error' })
    return
  }
  loading.value = true
  try {
    const body = {
      name: form.name,
      comment: form.comment,
      testimonial_order: Number(form.order)
    }
    if (editingId.value !== null) {
      await api(`/admin/academies/${props.academyId}/testimonials/${editingId.value}`, { method: 'PUT', body })
    } else {
      await api(`/admin/academies/${props.academyId}/testimonials`, { method: 'POST', body })
    }
    await refresh()
    isModalOpen.value = false
    toast.add({ title: 'Testimonial saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function remove(item: AcademyTestimonial) {
  try {
    await api(`/admin/academies/${props.academyId}/testimonials/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'Testimonial deleted', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Testimonials</h3>
      <UButton label="+ Add" color="primary" @click="openAdd" />
    </div>
    <div class="border border-default rounded-lg overflow-hidden">
      <div class="grid grid-cols-[2.5rem_1fr_3fr_auto] gap-4 px-4 py-3 bg-elevated/50 border-b border-default text-sm font-medium">
        <span>Order</span>
        <span>Name</span>
        <span>Comment</span>
        <span>Actions</span>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[2.5rem_1fr_3fr_auto] gap-4 px-4 py-3 border-b border-default last:border-b-0 items-center"
      >
        <span class="text-sm text-muted">{{ item.order }}</span>
        <span class="text-sm font-medium">{{ item.name }}</span>
        <span class="text-sm text-muted">{{ item.comment }}</span>
        <div class="flex items-center gap-2">
          <UButton label="Edit" size="xs" color="neutral" variant="outline" leading-icon="i-lucide-pencil" @click="openEdit(item)" />
          <UButton label="Delete" size="xs" color="error" variant="outline" leading-icon="i-lucide-trash-2" @click="remove(item)" />
        </div>
      </div>
      <div v-if="items.length === 0" class="px-4 py-8 text-center text-sm text-muted">
        No testimonials available
      </div>
    </div>
  </div>

  <UModal v-model:open="isModalOpen" :title="editingId !== null ? 'Edit Testimonial' : 'Add Testimonial'" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Student Name">
          <UInput v-model="form.name" placeholder="e.g. Alice Johnson" class="w-full" />
        </UFormField>
        <UFormField label="Testimonial">
          <UTextarea v-model="form.comment" placeholder="What they said..." :rows="4" class="w-full" />
        </UFormField>
        <UFormField label="Order">
          <UInput v-model="form.order" type="number" placeholder="1" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="isModalOpen = false" />
      <UButton label="Save" color="primary" :loading="loading" :disabled="loading" @click="save" />
    </template>
  </UModal>
</template>
