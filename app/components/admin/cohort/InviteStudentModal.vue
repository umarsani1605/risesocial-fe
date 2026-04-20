<script setup lang="ts">
import { inviteStudentSchema } from '@/schemas/cohort'

const { loading } = defineProps<{
  loading: boolean
}>()

const open = defineModel<boolean>('open', { required: true })
const email = defineModel<string>('email', { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('inviteStudentForm')
const state = computed(() => ({ email: email.value }))

function close() {
  emit('cancel')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Invite Student"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm ref="inviteStudentForm" :schema="inviteStudentSchema" :state="state" @submit="emit('submit')" :validate-on="['submit']">
        <UFormField name="email" label="Email">
          <UInput
            v-model="email"
            placeholder="Enter student email"
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
      <UButton
        label="Invite"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
