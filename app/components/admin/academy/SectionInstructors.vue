<script setup lang="ts">
import type { AcademyInstructor } from '@/types'

const props = defineProps<{
  academyId: number
  initialData: AcademyInstructor[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyInstructor[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const form = reactive({ name: '', job_title: '', description: '', order: '' })

const {
  file: avatarFile,
  previewUrl: avatarPreview,
  inputRef: avatarInputRef,
  onChange: onAvatarChange,
  remove: removeAvatar
} = useImageUpload()

watch(() => props.initialData, (val) => {
  items.value = structuredClone(val)
}, { deep: true })

async function refresh() {
  const res = await api<ApiResponse<AcademyInstructor[]>>(`/admin/academies/${props.academyId}/instructors`)
  items.value = res.data
}

function openAdd() {
  editingId.value = null
  form.name = ''
  form.job_title = ''
  form.description = ''
  form.order = String(items.value.length + 1)
  avatarFile.value = null
  avatarPreview.value = null
  isModalOpen.value = true
}

function openEdit(item: AcademyInstructor) {
  editingId.value = item.id
  form.name = item.name
  form.job_title = item.job_title
  form.description = item.description ?? ''
  form.order = String(item.order)
  avatarFile.value = null
  avatarPreview.value = item.avatar_url ?? null
  isModalOpen.value = true
}

async function save() {
  if (!form.name.trim()) {
    toast.add({ title: 'Name is required', color: 'error' })
    return
  }
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('job_title', form.job_title)
    if (form.description) fd.append('description', form.description)
    fd.append('order', form.order)
    if (avatarFile.value) fd.append('image', avatarFile.value)

    if (editingId.value !== null) {
      await api(`/admin/academies/${props.academyId}/instructors/${editingId.value}`, { method: 'PUT', body: fd })
    } else {
      await api(`/admin/academies/${props.academyId}/instructors`, { method: 'POST', body: fd })
    }
    await refresh()
    isModalOpen.value = false
    toast.add({ title: 'Instructor saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function remove(item: AcademyInstructor) {
  try {
    await api(`/admin/academies/${props.academyId}/instructors/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'Instructor deleted', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Instructors</h3>
      <UButton label="+ Add" color="primary" @click="openAdd" />
    </div>
    <div class="border border-default rounded-lg overflow-hidden">
      <div class="grid grid-cols-[2.5rem_auto_1fr_1fr_2fr_auto] gap-4 px-4 py-3 bg-elevated/50 border-b border-default text-sm font-medium">
        <span>Order</span>
        <span />
        <span>Name</span>
        <span>Job Title</span>
        <span>Description</span>
        <span>Actions</span>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[2.5rem_auto_1fr_1fr_2fr_auto] gap-4 px-4 py-3 border-b border-default last:border-b-0 items-center"
      >
        <span class="text-sm text-muted">{{ item.order }}</span>
        <UAvatar
          :src="item.avatar_url ?? undefined"
          :fallback="item.name.slice(0, 2).toUpperCase()"
          size="sm"
          color="primary"
          variant="subtle"
        />
        <span class="text-sm font-medium">{{ item.name }}</span>
        <span class="text-sm text-muted">{{ item.job_title }}</span>
        <span class="text-sm text-muted truncate">{{ item.description }}</span>
        <div class="flex items-center gap-2">
          <UButton label="Edit" size="xs" color="neutral" variant="outline" leading-icon="i-lucide-pencil" @click="openEdit(item)" />
          <UButton label="Delete" size="xs" color="error" variant="outline" leading-icon="i-lucide-trash-2" @click="remove(item)" />
        </div>
      </div>
      <div v-if="items.length === 0" class="px-4 py-8 text-center text-sm text-muted">
        No instructors available
      </div>
    </div>
  </div>

  <UModal v-model:open="isModalOpen" :title="editingId !== null ? 'Edit Instructor' : 'Add Instructor'" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Avatar">
          <input
            ref="avatarInputRef"
            type="file"
            accept="image/png,image/jpeg"
            class="hidden"
            @change="onAvatarChange"
          />
          <div class="flex items-center gap-4">
            <div
              v-if="!avatarPreview"
              class="size-16 rounded-full border-2 border-dashed border-default flex items-center justify-center cursor-pointer hover:bg-elevated/30 transition-colors"
              @click="avatarInputRef?.click()"
            >
              <UIcon name="i-lucide-user" class="size-6 text-muted" />
            </div>
            <div v-else class="relative">
              <img :src="avatarPreview" class="size-16 rounded-full object-cover" />
              <button
                class="absolute -top-1 -right-1 size-5 bg-white border border-default rounded-full flex items-center justify-center shadow-sm"
                @click="removeAvatar"
              >
                <UIcon name="i-lucide-x" class="size-3" />
              </button>
            </div>
            <UButton
              v-if="!avatarPreview"
              label="Upload Photo"
              size="sm"
              color="neutral"
              variant="outline"
              @click="avatarInputRef?.click()"
            />
          </div>
        </UFormField>
        <UFormField label="Name">
          <UInput v-model="form.name" placeholder="Instructor name" class="w-full" />
        </UFormField>
        <UFormField label="Job Title">
          <UInput v-model="form.job_title" placeholder="e.g. Senior Software Engineer" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="form.description" placeholder="Brief bio or description" :rows="3" class="w-full" />
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
