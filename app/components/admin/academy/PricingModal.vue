<script setup lang="ts">
import type { AcademyPricing } from '@/types'
import { pricingFormSchema } from '@/schemas/academy'

const props = defineProps<{
  open: boolean
  academyId: number
  item: AcademyPricing | null
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
const form = reactive({ name: '', original_price: '', discount_price: '', order: '' })
const formRef = useTemplateRef('formRef')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.item) {
      form.name = props.item.name
      form.original_price = String(props.item.original_price)
      form.discount_price = String(props.item.discount_price)
      form.order = String(props.item.order)
    } else {
      form.name = ''
      form.original_price = ''
      form.discount_price = ''
      form.order = String(props.nextOrder ?? 1)
    }
  }
)

async function save() {
  loading.value = true
  try {
    const body = {
      name: form.name,
      original_price: Number(form.original_price),
      discount_price: Number(form.discount_price),
      order: Number(form.order)
    }
    if (props.item) {
      await api(`/admin/academies/${props.academyId}/pricing/${props.item.id}`, {
        method: 'PUT',
        body
      })
    } else {
      await api(`/admin/academies/${props.academyId}/pricing`, { method: 'POST', body })
    }
    emit('saved')
    toast.add({ title: 'Pricing saved', color: 'success' })
    if (addMore.value) {
      form.name = ''
      form.original_price = ''
      form.discount_price = ''
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
    :title="item ? 'Edit Pricing' : 'Add Pricing'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm ref="formRef" :schema="pricingFormSchema" :state="form" class="space-y-4" @submit="save" :validate-on="['submit']">
        <UFormField name="name" label="Package Name" required>
          <UInput v-model="form.name" placeholder="e.g. Early Bird" class="w-full" />
        </UFormField>
        <UFormField name="original_price" label="Original Price" required>
          <UInput v-model="form.original_price" type="number" placeholder="5000000" class="w-full" />
        </UFormField>
        <UFormField name="discount_price" label="Discount Price">
          <UInput v-model="form.discount_price" type="number" placeholder="3500000" class="w-full" />
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
