<script setup lang="ts">
import { cohortCreateSchema } from '@/schemas/cohort'

const props = defineProps<{
  open: boolean
  academyId: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'saved': []
}>()

const { api } = useApi()
const toast = useToast()

const loading = ref(false)
const form = reactive({ name: '', description: '', start_date: '', end_date: '' })
const formRef = useTemplateRef('cohortForm')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    form.name = ''
    form.description = ''
    form.start_date = ''
    form.end_date = ''
  }
)

async function save() {
  loading.value = true
  try {
    await api('/admin/cohorts', {
      method: 'POST',
      body: {
        academy_id: props.academyId,
        name: form.name,
        description: form.description || null,
        start_date: form.start_date,
        end_date: form.end_date,
      }
    })
    emit('update:open', false)
    emit('saved')
    toast.add({ title: 'Cohort created', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Add Cohort"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm ref="cohortForm" :schema="cohortCreateSchema" :state="form" class="space-y-4" @submit="save" :validate-on="['submit']">
        <UFormField name="name" label="Name" required>
          <UInput v-model="form.name" placeholder="Cohort Name" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description">
          <UTextarea v-model="form.description" placeholder="Cohort Description" :rows="3" class="w-full" />
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
      <UButton label="Cancel" color="neutral" variant="outline" :disabled="loading" @click="emit('update:open', false)" />
      <UButton label="Add Cohort" color="primary" :loading="loading" :disabled="loading" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
