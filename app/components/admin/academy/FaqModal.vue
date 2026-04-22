<script setup lang="ts">
import type { AcademyFaq } from '@/types'
import { faqFormSchema } from '@/schemas/academy'

const props = defineProps<{
  open: boolean
  academyId: number
  item: AcademyFaq | null
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
const form = reactive({ question: '', answer: '', order: '' })
const formRef = useTemplateRef('formRef')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.item) {
      form.question = props.item.question
      form.answer = props.item.answer
      form.order = String(props.item.order ?? '')
    } else {
      form.question = ''
      form.answer = ''
      form.order = String(props.nextOrder ?? 1)
    }
  }
)

async function save() {
  loading.value = true
  try {
    const body = {
      question: form.question,
      answer: form.answer,
      faq_order: Number(form.order)
    }
    if (props.item) {
      await api(`/admin/academies/${props.academyId}/faqs/${props.item.id}`, {
        method: 'PUT',
        body
      })
    } else {
      await api(`/admin/academies/${props.academyId}/faqs`, { method: 'POST', body })
    }
    emit('saved')
    toast.add({ title: 'FAQ saved', color: 'success' })
    if (addMore.value) {
      form.question = ''
      form.answer = ''
    } else {
      emit('update:open', false)
    }
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
    :title="item ? 'Edit FAQ' : 'Add FAQ'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm ref="formRef" :schema="faqFormSchema" :state="form" class="space-y-4" @submit="save" :validate-on="['submit']">
        <UFormField name="question" label="Question" required>
          <UInput v-model="form.question" placeholder="e.g. What is the duration?" class="w-full" />
        </UFormField>
        <UFormField name="answer" label="Answer" required>
          <UTextarea v-model="form.answer" placeholder="The answer to this question..." :rows="4" class="w-full" />
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
