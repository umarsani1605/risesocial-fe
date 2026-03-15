<script setup lang="ts">
import type { AcademyFeature } from '@/types'

const props = defineProps<{
  academyId: number
  initialData: AcademyFeature[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyFeature[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const form = reactive({ title: '', description: '', icon: '', order: '' })

watch(() => props.initialData, (val) => {
  items.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

async function refresh() {
  const res = await api<ApiResponse<AcademyFeature[]>>(`/admin/academies/${props.academyId}/features`)
  items.value = res.data
}

function openAdd() {
  editingId.value = null
  form.title = ''
  form.description = ''
  form.icon = ''
  form.order = String(items.value.length + 1)
  isModalOpen.value = true
}

function openEdit(item: AcademyFeature) {
  editingId.value = item.id
  form.title = item.title
  form.description = item.description
  form.icon = item.icon
  form.order = String(item.order ?? '')
  isModalOpen.value = true
}

async function save() {
  if (!form.title.trim()) {
    toast.add({ title: 'Title is required', color: 'error' })
    return
  }
  loading.value = true
  try {
    const body = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      feature_order: Number(form.order)
    }
    if (editingId.value !== null) {
      await api(`/admin/academies/${props.academyId}/features/${editingId.value}`, { method: 'PUT', body })
    } else {
      await api(`/admin/academies/${props.academyId}/features`, { method: 'POST', body })
    }
    await refresh()
    isModalOpen.value = false
    toast.add({ title: 'Feature saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function remove(item: AcademyFeature) {
  try {
    await api(`/admin/academies/${props.academyId}/features/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'Feature deleted', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Featured Benefits</h3>
      <UButton label="+ Add" color="primary" @click="openAdd" />
    </div>
    <div class="border border-default rounded-lg overflow-hidden">
      <div class="grid grid-cols-[2.5rem_1fr_2fr_1fr_auto] gap-4 px-4 py-3 bg-elevated/50 border-b border-default text-sm font-medium">
        <span>Order</span>
        <span>Title</span>
        <span>Description</span>
        <span>Icon</span>
        <span>Actions</span>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[2.5rem_1fr_2fr_1fr_auto] gap-4 px-4 py-3 border-b border-default last:border-b-0 items-center"
      >
        <span class="text-sm text-muted">{{ item.order }}</span>
        <span class="text-sm font-medium">{{ item.title }}</span>
        <span class="text-sm text-muted">{{ item.description }}</span>
        <div class="flex items-center gap-1.5">
          <UIcon :name="`i-lucide-${item.icon}`" class="size-4 text-muted" />
          <span class="text-sm text-muted">{{ item.icon }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UButton label="Edit" size="xs" color="neutral" variant="outline" leading-icon="i-lucide-pencil" @click="openEdit(item)" />
          <UButton label="Delete" size="xs" color="error" variant="outline" leading-icon="i-lucide-trash-2" @click="remove(item)" />
        </div>
      </div>
      <div v-if="items.length === 0" class="px-4 py-8 text-center text-sm text-muted">
        No features available
      </div>
    </div>
  </div>

  <UModal v-model:open="isModalOpen" :title="editingId !== null ? 'Edit Feature' : 'Add Feature'" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title">
          <UInput v-model="form.title" placeholder="e.g. Live Sessions" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="form.description" placeholder="Describe this benefit" :rows="3" class="w-full" />
        </UFormField>
        <UFormField label="Icon" hint="Lucide icon name (e.g. video, star, check-circle)">
          <div class="flex items-center gap-2">
            <UInput v-model="form.icon" placeholder="video" class="flex-1" />
            <UIcon v-if="form.icon" :name="`i-lucide-${form.icon}`" class="size-5 text-muted shrink-0" />
          </div>
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
