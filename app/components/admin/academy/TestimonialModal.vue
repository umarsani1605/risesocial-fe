<script setup lang="ts">
import type { AcademyTestimonial } from '@/types'
import { testimonialFormSchema } from '@/schemas/academy'

const props = defineProps<{
  open: boolean
  academyId: number
  item: AcademyTestimonial | null
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
const form = reactive({ name: '', comment: '', order: '' })
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
      form.comment = props.item.comment
      form.order = String(props.item.order ?? '')
      avatarFile.value = null
      avatarPreview.value = props.item.avatar_url ?? null
    } else {
      form.name = ''
      form.comment = ''
      form.order = String(props.nextOrder ?? 1)
      avatarFile.value = null
      avatarPreview.value = null
    }
  }
)

async function save() {
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('comment', form.comment)
    fd.append('testimonial_order', form.order)
    if (avatarFile.value) fd.append('image', avatarFile.value)

    if (props.item) {
      await api(`/admin/academies/${props.academyId}/testimonials/${props.item.id}`, {
        method: 'PUT',
        body: fd
      })
    } else {
      await api(`/admin/academies/${props.academyId}/testimonials`, { method: 'POST', body: fd })
    }
    emit('saved')
    toast.add({ title: 'Testimonial saved', color: 'success' })
    if (addMore.value) {
      form.name = ''
      form.comment = ''
      avatarFile.value = null
      avatarPreview.value = null
    } else {
      emit('update:open', false)
    }
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    :title="item ? 'Edit Testimonial' : 'Add Testimonial'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm ref="formRef" :schema="testimonialFormSchema" :state="form" class="space-y-4" @submit="save">
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
              class="size-12 rounded-full border-2 border-dashed border-default flex items-center justify-center cursor-pointer hover:bg-elevated/30 transition-colors"
              @click="avatarInputRef?.click()"
            >
              <UIcon name="i-ph-user-bold" class="size-5 text-muted" />
            </div>
            <div v-else class="relative">
              <img :src="avatarPreview" class="size-12 rounded-full object-cover" />
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
        <UFormField name="name" label="Student Name" required>
          <UInput v-model="form.name" placeholder="e.g. Alice Johnson" class="w-full" />
        </UFormField>
        <UFormField name="comment" label="Testimonial" required>
          <UTextarea v-model="form.comment" placeholder="What they said..." :rows="4" class="w-full" />
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
