<script setup lang="ts">
import type { AcademyInstructor } from '@/types'
import { instructorFormSchema } from '@/schemas/academy'

const props = defineProps<{
  open: boolean
  academyId: number
  item: AcademyInstructor | null
  nextOrder?: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'saved': []
}>()

const { api } = useApi()
const toast = useToast()

const loading = ref(false)
const addMore = ref(false)
const form = reactive({ name: '', job_title: '', description: '', order: '' })
const formRef = useTemplateRef('formRef')

const {
  file: avatarFile,
  previewUrl: avatarPreview,
  inputRef: avatarInputRef,
  onChange: onAvatarChange,
  remove: removeAvatar
} = useImageUpload()

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.item) {
      form.name = props.item.name
      form.job_title = props.item.job_title
      form.description = props.item.description ?? ''
      form.order = String(props.item.order)
      avatarFile.value = null
      avatarPreview.value = props.item.avatar_url ?? null
    } else {
      form.name = ''
      form.job_title = ''
      form.description = ''
      form.order = String(props.nextOrder ?? 1)
      avatarFile.value = null
      avatarPreview.value = null
    }
  }
)

async function save() {
  loading.value = true
  if (avatarFile.value) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(avatarFile.value.type)) {
      toast.add({ title: 'Avatar must be JPG, PNG, or WebP', color: 'error' })
      loading.value = false
      return
    }
    if (avatarFile.value.size > 5 * 1024 * 1024) {
      toast.add({ title: 'Avatar must be under 5MB', color: 'error' })
      loading.value = false
      return
    }
  }
  try {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('job_title', form.job_title)
    if (form.description) fd.append('description', form.description)
    fd.append('order', form.order)
    if (avatarFile.value) fd.append('image', avatarFile.value)

    if (props.item) {
      await api(`/admin/academies/${props.academyId}/instructors/${props.item.id}`, {
        method: 'PUT',
        body: fd
      })
    } else {
      await api(`/admin/academies/${props.academyId}/instructors`, { method: 'POST', body: fd })
    }
    emit('saved')
    toast.add({ title: 'Instructor saved', color: 'success' })
    if (addMore.value) {
      form.name = ''
      form.job_title = ''
      form.description = ''
      avatarFile.value = null
      avatarPreview.value = null
    } else {
      emit('update:open', false)
    }
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    :title="item ? 'Edit Instructor' : 'Add Instructor'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm ref="formRef" :schema="instructorFormSchema" :state="form" class="space-y-4" @submit="save">
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
              <UIcon name="i-ph-user-bold" class="size-6 text-muted" />
            </div>
            <div v-else class="relative">
              <img :src="avatarPreview" class="size-16 rounded-full object-cover" />
              <button
                class="absolute -top-1 -right-1 size-5 bg-white border border-default rounded-full flex items-center justify-center shadow-sm"
                @click="removeAvatar"
              >
                <UIcon name="i-ph-x-bold" class="size-3" />
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
        <UFormField name="name" label="Name" required>
          <UInput v-model="form.name" placeholder="Instructor name" class="w-full" />
        </UFormField>
        <UFormField name="job_title" label="Job Title" required>
          <UInput v-model="form.job_title" placeholder="e.g. Senior Software Engineer" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description">
          <UTextarea v-model="form.description" placeholder="Brief bio or description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField name="order" label="Order">
          <UInput v-model="form.order" type="number" placeholder="1" class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex items-center justify-between w-full">
        <UCheckbox v-if="!item" v-model="addMore" label="Add more" />
        <div class="flex gap-2 ml-auto">
          <UButton label="Cancel" color="neutral" variant="outline" @click="emit('update:open', false)" />
          <UButton label="Save" color="primary" :loading="loading" :disabled="loading" @click="formRef?.submit()" />
        </div>
      </div>
    </template>
  </UModal>
</template>
