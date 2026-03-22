<script setup lang="ts">
import type { AcademyTheme } from '@/types'
import { themeFormSchema } from '@/schemas/academy'

const props = defineProps<{
  open: boolean
  academyId: number
  item: AcademyTheme | null
  nextOrder?: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'saved': [newThemeId?: number]
}>()

const { api } = useApi()
const toast = useToast()

const loading = ref(false)
const addMore = ref(false)
const form = reactive({ title: '', description: '', order: '' })
const formRef = useTemplateRef('formRef')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.item) {
      form.title = props.item.title
      form.description = props.item.description
      form.order = String(props.item.order)
    } else {
      form.title = ''
      form.description = ''
      form.order = String(props.nextOrder ?? 1)
    }
  }
)

async function save() {
  loading.value = true
  try {
    const body = {
      title: form.title,
      description: form.description,
      order: Number(form.order)
    }
    if (props.item) {
      await api(`/admin/academies/${props.academyId}/themes/${props.item.id}`, {
        method: 'PUT',
        body
      })
      emit('saved')
      toast.add({ title: 'Theme saved', color: 'success' })
      emit('update:open', false)
    } else {
      const res = await api<ApiResponse<AcademyTheme>>(
        `/admin/academies/${props.academyId}/themes`,
        { method: 'POST', body }
      )
      emit('saved', res.data.id)
      toast.add({ title: 'Theme saved', color: 'success' })
      if (addMore.value) {
        form.title = ''
        form.description = ''
      } else {
        emit('update:open', false)
      }
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
    :title="item ? 'Edit Theme' : 'Add Theme'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm ref="formRef" :schema="themeFormSchema" :state="form" class="space-y-4" @submit="save">
        <UFormField name="title" label="Title" required>
          <UInput v-model="form.title" placeholder="e.g. Introduction to Carbon Accounting" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description">
          <UTextarea v-model="form.description" placeholder="Theme description" :rows="3" class="w-full" />
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
