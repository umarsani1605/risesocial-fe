<script setup lang="ts">
import { cohortCreatePageSchema } from '@/schemas/cohort'

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  academy_id: number | undefined
  name: string
  description: string
  start_date: string
  end_date: string
}>('form', { required: true })

defineProps<{
  loading?: boolean
  academyItems: { label: string; value: number }[]
}>()
const emit = defineEmits<{ submit: [] }>()
const formRef = useTemplateRef('formRef')
</script>

<template>
  <UModal v-model:open="open" title="Add New Cohort" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm
        :validate-on="['submit']"
        ref="formRef"
        :schema="cohortCreatePageSchema"
        :state="form"
        class="space-y-5"
        @submit="emit('submit')"
      >
        <UFormField name="academy_id" label="Academy" required>
          <USelectMenu
            v-model="form.academy_id"
            value-key="value"
            :items="academyItems"
            placeholder="Select Academy"
            class="w-full"
          />
        </UFormField>
        <UFormField name="name" label="Name" required>
          <UInput v-model="form.name" placeholder="Cohort Name" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Cohort Description"
            :rows="4"
            class="w-full"
          />
        </UFormField>
        <UFormField name="start_date" label="Start Date" required>
          <UInput v-model="form.start_date" type="date" class="w-full" />
        </UFormField>
        <UFormField name="end_date" label="End Date" required>
          <UInput v-model="form.end_date" type="date" class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="loading"
        @click="open = false"
      />
      <UButton
        label="Add Cohort"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
