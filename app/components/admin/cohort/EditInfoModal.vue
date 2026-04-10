<script setup lang="ts">
import type { AdminCohortDetail } from '~/types/cohort'
import { COHORT_STATUS_ITEMS } from '@/constants/cohort'
import { cohortEditSchema } from '@/schemas/cohort'

const { loading } = defineProps<{
  loading: boolean
}>()

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  name: string
  description: string
  status: AdminCohortDetail['status']
  start_date: string
  end_date: string
}>('form', { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('editInfoForm')

function close() {
  emit('cancel')
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="Edit Cohort Info" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm
        ref="editInfoForm"
        :schema="cohortEditSchema"
        :state="form"
        class="space-y-4"
        @submit="emit('submit')"
      >
        <UFormField name="name" label="Name">
          <UInput v-model="form.name" placeholder="Cohort Name" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Cohort Description"
            :rows="3"
            class="w-full"
          />
        </UFormField>
        <UFormField name="status" label="Status">
          <USelect v-model="form.status" :items="COHORT_STATUS_ITEMS" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField name="start_date" label="Start Date">
            <UInput v-model="form.start_date" type="date" class="w-full" />
          </UFormField>
          <UFormField name="end_date" label="End Date">
            <UInput v-model="form.end_date" type="date" class="w-full" />
          </UFormField>
        </div>
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
