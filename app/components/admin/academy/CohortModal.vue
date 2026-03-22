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
const form = reactive({ name: '', description: '' })
const formRef = useTemplateRef('cohortForm')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    form.name = ''
    form.description = ''
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
        description: form.description || null
      }
    })
    emit('update:open', false)
    emit('saved')
    toast.add({ title: 'Cohort created', color: 'success' })
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
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
      <UForm ref="cohortForm" :schema="cohortCreateSchema" :state="form" class="space-y-4" @submit="save">
        <UFormField name="name" label="Name" required>
          <UInput v-model="form.name" placeholder="Cohort Name" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="form.description" placeholder="Cohort Description" :rows="3" class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" :disabled="loading" @click="emit('update:open', false)" />
      <UButton label="Add Cohort" color="primary" :loading="loading" :disabled="loading" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
