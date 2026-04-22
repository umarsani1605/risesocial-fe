<script setup lang="ts">
import { generateCertificateSchema } from '~/schemas/cohort'

const props = defineProps<{
  loading: boolean
}>()

const open = defineModel<boolean>('open')
const form = defineModel<{
  assignments: string
  case_study: string
  final_test: string
  final_score: string
}>('form', { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const formRef = useTemplateRef('formRef')
</script>

<template>
  <UModal v-model:open="open" title="Generate Certificate" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm
        ref="formRef"
        :schema="generateCertificateSchema"
        :state="form"
        :validate-on="['submit']"
        class="space-y-4"
        @submit="emit('submit')"
      >
        <p class="text-sm text-muted">Enter student's grades:</p>

        <div class="flex flex-col gap-3">
          <UFormField
            label="Assignments"
            name="assignments"
            orientation="horizontal"
            class="justify-between"
          >
            <UInput
              v-model="form.assignments"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 8.50"
              class="w-40"
            />
          </UFormField>

          <UFormField
            label="Case Study"
            name="case_study"
            orientation="horizontal"
            class="justify-between"
          >
            <UInput
              v-model="form.case_study"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 8.25"
              class="w-40"
            />
          </UFormField>

          <UFormField
            label="Final Test"
            name="final_test"
            orientation="horizontal"
            class="justify-between"
          >
            <UInput
              v-model="form.final_test"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 10.00"
              class="w-40"
            />
          </UFormField>

          <UFormField
            label="Final Score"
            name="final_score"
            orientation="horizontal"
            class="justify-between"
          >
            <UInput
              v-model="form.final_score"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 9.00"
              class="w-40"
            />
          </UFormField>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="ghost"
        :disabled="props.loading"
        @click="emit('cancel')"
      />
      <UButton
        label="Generate"
        color="primary"
        icon="i-ph-certificate-bold"
        :loading="props.loading"
        :disabled="props.loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
