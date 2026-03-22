<script setup lang="ts">
import { mentorFormSchema } from '@/schemas/cohort'

const { loading } = defineProps<{
  loading: boolean
}>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  name: string
  jobTitle: string
}>('form', { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('inviteMentorForm')

function close() {
  emit('cancel')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Invite Mentor"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm ref="inviteMentorForm" :schema="mentorFormSchema" :state="form" class="space-y-4" @submit="emit('submit')">
        <UFormField name="name" label="Name">
          <UInput v-model="form.name" placeholder="Mentor Name" class="w-full" />
        </UFormField>
        <UFormField label="Job Title">
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
      <UButton label="Add Mentor" color="primary" :disabled="loading" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
