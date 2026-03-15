<script setup lang="ts">
import type { AcademyFaq } from '@/types'

const props = defineProps<{
  academyId: number
  initialData: AcademyFaq[]
}>()

const { api } = useApi()
const toast = useToast()

const items = ref<AcademyFaq[]>(structuredClone(props.initialData))
const isModalOpen = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const form = reactive({ question: '', answer: '', order: '' })

watch(() => props.initialData, (val) => {
  items.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

async function refresh() {
  const res = await api<ApiResponse<AcademyFaq[]>>(`/admin/academies/${props.academyId}/faqs`)
  items.value = res.data
}

function openAdd() {
  editingId.value = null
  form.question = ''
  form.answer = ''
  form.order = String(items.value.length + 1)
  isModalOpen.value = true
}

function openEdit(item: AcademyFaq) {
  editingId.value = item.id
  form.question = item.question
  form.answer = item.answer
  form.order = String(item.order ?? '')
  isModalOpen.value = true
}

async function save() {
  if (!form.question.trim()) {
    toast.add({ title: 'Question is required', color: 'error' })
    return
  }
  loading.value = true
  try {
    const body = {
      question: form.question,
      answer: form.answer,
      faq_order: Number(form.order)
    }
    if (editingId.value !== null) {
      await api(`/admin/academies/${props.academyId}/faqs/${editingId.value}`, { method: 'PUT', body })
    } else {
      await api(`/admin/academies/${props.academyId}/faqs`, { method: 'POST', body })
    }
    await refresh()
    isModalOpen.value = false
    toast.add({ title: 'FAQ saved', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function remove(item: AcademyFaq) {
  try {
    await api(`/admin/academies/${props.academyId}/faqs/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.add({ title: 'FAQ deleted', color: 'success' })
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">FAQs</h3>
      <UButton label="+ Add" color="primary" @click="openAdd" />
    </div>
    <div class="border border-default rounded-lg overflow-hidden">
      <div class="grid grid-cols-[2.5rem_2fr_3fr_auto] gap-4 px-4 py-3 bg-elevated/50 border-b border-default text-sm font-medium">
        <span>Order</span>
        <span>Question</span>
        <span>Answer</span>
        <span>Actions</span>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[2.5rem_2fr_3fr_auto] gap-4 px-4 py-3 border-b border-default last:border-b-0 items-center"
      >
        <span class="text-sm text-muted">{{ item.order }}</span>
        <span class="text-sm font-medium">{{ item.question }}</span>
        <span class="text-sm text-muted">{{ item.answer }}</span>
        <div class="flex items-center gap-2">
          <UButton label="Edit" size="xs" color="neutral" variant="outline" leading-icon="i-lucide-pencil" @click="openEdit(item)" />
          <UButton label="Delete" size="xs" color="error" variant="outline" leading-icon="i-lucide-trash-2" @click="remove(item)" />
        </div>
      </div>
      <div v-if="items.length === 0" class="px-4 py-8 text-center text-sm text-muted">
        No FAQs available
      </div>
    </div>
  </div>

  <UModal v-model:open="isModalOpen" :title="editingId !== null ? 'Edit FAQ' : 'Add FAQ'" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Question">
          <UInput v-model="form.question" placeholder="e.g. What is the duration?" class="w-full" />
        </UFormField>
        <UFormField label="Answer">
          <UTextarea v-model="form.answer" placeholder="The answer to this question..." :rows="4" class="w-full" />
        </UFormField>
        <UFormField label="Order">
          <UInput v-model="form.order" type="number" placeholder="1" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="isModalOpen = false" />
      <UButton label="Save" color="primary" :loading="loading" :disabled="loading" @click="save" />
    </template>
  </UModal>
</template>
