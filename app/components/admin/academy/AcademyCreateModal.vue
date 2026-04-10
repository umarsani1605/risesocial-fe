<script setup lang="ts">
import { academyCreateSchema } from '@/schemas/academy'
import { ACADEMY_DURATION_OPTIONS, ACADEMY_FORMAT_OPTIONS } from '@/constants/academy'

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  title: string
  description: string
  duration: string
  format: string
  category: string
}>('form', { required: true })

defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ submit: [] }>()
const formRef = useTemplateRef('formRef')
</script>

<template>
  <UModal v-model:open="open" title="Add New Academy" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm
        ref="formRef"
        :schema="academyCreateSchema"
        :state="form"
        class="space-y-4"
        @submit="emit('submit')"
      >
        <UFormField name="title" label="Title" required>
          <UInput v-model="form.title" placeholder="Academy title" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description" required>
          <UTextarea
            v-model="form.description"
            placeholder="Academy description"
            :rows="3"
            class="w-full"
          />
        </UFormField>
        <UFormField name="duration" label="Duration" required>
          <USelect
            v-model="form.duration"
            :items="ACADEMY_DURATION_OPTIONS"
            placeholder="Select duration"
            class="w-full"
          />
        </UFormField>
        <UFormField name="format" label="Format" required>
          <USelect
            v-model="form.format"
            :items="ACADEMY_FORMAT_OPTIONS"
            placeholder="Select format"
            class="w-full"
          />
        </UFormField>
        <UFormField name="category" label="Category" required>
          <UInput
            v-model="form.category"
            placeholder="e.g. Carbon Accounting"
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
        @click="open = false"
      />
      <UButton
        label="Create"
        color="primary"
        :loading="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
