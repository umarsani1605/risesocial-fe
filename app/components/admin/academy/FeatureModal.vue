<script setup lang="ts">
import type { AcademyFeature } from '@/types'
import { featureFormSchema } from '@/schemas/academy'

const props = defineProps<{
  open: boolean
  academyId: number
  item: AcademyFeature | null
  nextOrder?: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const { api } = useApi()
const toast = useToast()

const loading = ref(false)
const addMore = ref(false)
const form = reactive({ title: '', description: '', icon: '', order: '' })
const formRef = useTemplateRef('formRef')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.item) {
      form.title = props.item.title
      form.description = props.item.description
      form.icon = props.item.icon
      form.order = String(props.item.order ?? '')
    } else {
      form.title = ''
      form.description = ''
      form.icon = ''
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
      icon: form.icon,
      feature_order: Number(form.order)
    }
    if (props.item) {
      await api(`/admin/academies/${props.academyId}/features/${props.item.id}`, {
        method: 'PUT',
        body
      })
    } else {
      await api(`/admin/academies/${props.academyId}/features`, { method: 'POST', body })
    }
    emit('saved')
    toast.add({ title: 'Feature saved', color: 'success' })
    if (addMore.value) {
      form.title = ''
      form.description = ''
      form.icon = ''
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
    :title="item ? 'Edit Feature' : 'Add Feature'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm
        :validate-on="['submit']"
        ref="formRef"
        :schema="featureFormSchema"
        :state="form"
        class="space-y-4"
        @submit="save"
      >
        <UFormField name="title" label="Title" required>
          <UInput v-model="form.title" placeholder="e.g. Live Sessions" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description" required>
          <UTextarea
            v-model="form.description"
            placeholder="Describe this benefit"
            :rows="3"
            class="w-full"
          />
        </UFormField>
        <UFormField name="icon" label="Icon" required>
          <template #hint>
            Use Phospor icon name, see all icons:
            <a href="https://phosphoricons.com/" target="_blank" class="underline text-primary"
              >phosphoricons.com</a
            >
          </template>
          <div class="flex items-center gap-3">
            <UInput v-model="form.icon" placeholder="video" class="flex-1" />
            <UIcon
              v-if="form.icon"
              :name="`i-ph-${form.icon}-fill`"
              class="size-8 text-muted shrink-0"
            />
          </div>
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
          <UButton
            label="Cancel"
            color="neutral"
            variant="outline"
            @click="emit('update:open', false)"
          />
          <UButton
            label="Save"
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="formRef?.submit()"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
