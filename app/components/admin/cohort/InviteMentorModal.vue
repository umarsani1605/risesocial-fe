<script setup lang="ts">
import { mentorFormSchema } from '@/schemas/cohort'

const props = defineProps<{
  loading: boolean
  item: AdminCohortMentor | null
}>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  name: string
  jobTitle: string
}>('form', { required: true })

const emit = defineEmits<{
  submit: [payload: { avatarFile: File | null; removeAvatar: boolean }]
  cancel: []
}>()

const formRef = useTemplateRef('inviteMentorForm')
const toast = useToast()

const modalTitle = computed(() => props.item ? 'Edit Mentor' : 'Add Mentor')
const submitLabel = computed(() => props.item ? 'Save Changes' : 'Add Mentor')

const {
  file: avatarFile,
  previewUrl: avatarPreview,
  inputRef: avatarInputRef,
  onChange: onAvatarChange,
  remove: removeSelectedAvatar,
} = useImageUpload()

const removedAvatar = ref(false)

watch(
  () => [open.value, props.item] as const,
  ([isOpen, item]) => {
    if (!isOpen) return
    avatarFile.value = null
    avatarPreview.value = item?.avatar ?? null
    removedAvatar.value = false
  },
  { immediate: true },
)

function removeAvatar() {
  removedAvatar.value = true
  removeSelectedAvatar()
}

function validateAvatarFile() {
  if (!avatarFile.value) return true

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(avatarFile.value.type)) {
    toast.add({ title: 'Avatar must be JPG, PNG, or WebP', color: 'error' })
    return false
  }

  if (avatarFile.value.size > 5 * 1024 * 1024) {
    toast.add({ title: 'Avatar must be under 5MB', color: 'error' })
    return false
  }

  return true
}

function onSubmit() {
  if (!validateAvatarFile()) return
  emit('submit', {
    avatarFile: avatarFile.value,
    removeAvatar: removedAvatar.value && !avatarFile.value,
  })
}

function close() {
  emit('cancel')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="modalTitle"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm ref="inviteMentorForm" :schema="mentorFormSchema" :state="form" class="space-y-4" @submit="onSubmit" :validate-on="['submit']">
        <UFormField label="Avatar">
          <input
            ref="avatarInputRef"
            type="file"
            accept="image/png,image/jpeg,image/webp"
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
                @click.prevent="removeAvatar"
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
        <UFormField name="name" label="Name">
          <UInput v-model="form.name" placeholder="Mentor Name" class="w-full" />
        </UFormField>
        <UFormField name="jobTitle" label="Job Title">
          <UInput
            v-model="form.jobTitle"
            placeholder="e.g. Senior Consultant"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="loading"
        @click="close"
      />
      <UButton :label="submitLabel" color="primary" :disabled="loading" :loading="loading" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
