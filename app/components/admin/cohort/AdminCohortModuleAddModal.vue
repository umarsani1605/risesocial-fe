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
  attachmentTab: 'files' | 'links'
}>('form', { required: true })
const saveAndAddMore = defineModel<boolean>('saveAndAddMore', { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('moduleAddForm')

const attachmentItems = [
  { label: 'Files', value: 'files' },
  { label: 'Links', value: 'links' }
]
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
  <UModal v-model:open="open" title="Add New Module">
    <template #body>
      <UForm ref="moduleAddForm" :schema="moduleFormSchema" :state="form" class="space-y-4" @submit="emit('submit')">
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

        <UFormField label="Attachment">
          <URadioGroup v-model="form.attachmentTab" :items="attachmentItems" orientation="horizontal" />
          <div class="mt-3 border border-default rounded-lg overflow-hidden">
            <div class="p-4">
              <div
                class="border-2 border-dashed border-default rounded-lg py-6 flex flex-col items-center gap-2 text-muted"
              >
                <UIcon name="i-lucide-upload" class="size-6" />
                <p class="text-sm">Drop your files here</p>
              </div>
            </div>
          </div>
        </UFormField>

        <UFormField label="Status">
          <URadioGroup v-model="publishStatus" :items="MODULE_PUBLISH_ITEMS" orientation="horizontal" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex items-center justify-between w-full">
        <UCheckbox v-model="saveAndAddMore" label="Save and add more" />
        <div class="flex gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="outline"
            :disabled="loading"
            @click="close"
          />
          <UButton
            label="Add Module"
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="formRef?.submit()"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
