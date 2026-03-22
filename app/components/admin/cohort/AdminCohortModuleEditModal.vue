<script setup lang="ts">
import { MODULE_PUBLISH_ITEMS } from '@/constants/cohort'
import { moduleFormSchema } from '@/schemas/cohort'

const { loading } = defineProps<{
  loading: boolean
}>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  title: string
  description: string
  sessionDate: string
  meetingLink: string
  attendanceLink: string
  assignmentLink: string
  isPublished: boolean
}>('form', { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('moduleEditForm')

const publishStatus = computed({
  get: () => (form.value.isPublished ? 'published' : 'draft'),
  set: (value) => {
    form.value.isPublished = value === 'published'
  }
})

function close() {
  emit('cancel')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Edit Module"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm ref="moduleEditForm" :schema="moduleFormSchema" :state="form" class="space-y-4" @submit="emit('submit')">
        <UFormField name="title" label="Title" required>
          <UInput v-model="form.title" placeholder="Module Title" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Module Description"
            :rows="3"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Session Date">
          <UInput v-model="form.sessionDate" type="datetime-local" class="w-full" />
        </UFormField>
        <UFormField label="Meeting Link">
          <UInput v-model="form.meetingLink" placeholder="Meeting Link" class="w-full" />
        </UFormField>
        <UFormField label="Attendance Link">
          <UInput
            v-model="form.attendanceLink"
            placeholder="Attendance Link"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Assignment Link">
          <UInput
            v-model="form.assignmentLink"
            placeholder="Assignment Link"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Status">
          <URadioGroup v-model="publishStatus" :items="MODULE_PUBLISH_ITEMS" orientation="horizontal" />
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
      <UButton
        label="Save Changes"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
