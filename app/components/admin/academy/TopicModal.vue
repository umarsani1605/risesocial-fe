<script setup lang="ts">
import type { AcademyTopic } from '@/types'
import { topicFormSchema } from '@/schemas/academy'

const props = defineProps<{
  open: boolean
  academyId: number
  item: AcademyTopic | null
  themes: { label: string; value: number }[]
  defaultThemeId?: number
  nextOrder?: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'saved': []
}>()

const { api } = useApi()
const toast = useToast()

const loading = ref(false)
const addMore = ref(false)
const form = reactive({ title: '', description: '', theme_id: 0, order: '' })
const formRef = useTemplateRef('formRef')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.item) {
      form.title = props.item.title
      form.description = props.item.description ?? ''
      form.theme_id = props.item.theme_id ?? 0
      form.order = String(props.item.order)
    } else {
      form.title = ''
      form.description = ''
      form.theme_id = props.defaultThemeId ?? 0
      form.order = String(props.nextOrder ?? 1)
    }
  }
)

async function save() {
  loading.value = true
  try {
    const body = {
      theme_id: form.theme_id,
      title: form.title,
      description: form.description,
      topic_order: Number(form.order)
    }
    if (props.item) {
      await api(`/admin/academies/${props.academyId}/topics/${props.item.id}`, {
        method: 'PUT',
        body
      })
    } else {
      await api(`/admin/academies/${props.academyId}/topics`, { method: 'POST', body })
    }
    emit('saved')
    toast.add({ title: 'Topic saved', color: 'success' })
    if (addMore.value) {
      form.title = ''
      form.description = ''
    } else {
      emit('update:open', false)
    }
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
    :title="item ? 'Edit Topic' : 'Add Topic'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm ref="formRef" :schema="topicFormSchema" :state="form" class="space-y-4" @submit="save">
        <UFormField v-if="!defaultThemeId" label="Theme">
          <USelect v-model="form.theme_id" :items="themes" placeholder="Select theme" class="w-full" />
        </UFormField>
        <UFormField name="title" label="Title" required>
          <UInput v-model="form.title" placeholder="e.g. What is Carbon Accounting?" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description">
          <UTextarea v-model="form.description" placeholder="Topic description" :rows="3" class="w-full" />
        </UFormField>
        <UFormField name="order" label="Order">
          <UInput v-model="form.order" type="number" placeholder="1" class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex items-center justify-between w-full">
        <UCheckbox v-if="!item" v-model="addMore" label="Add more" />
        <div class="flex gap-2 ml-auto">
          <UButton label="Cancel" color="neutral" variant="outline" @click="emit('update:open', false)" />
          <UButton label="Save" color="primary" :loading="loading" :disabled="loading" @click="formRef?.submit()" />
        </div>
      </div>
    </template>
  </UModal>
</template>
