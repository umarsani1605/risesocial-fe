<script setup lang="ts">
import { TRANSACTION_STATUS_ITEMS } from '@/constants/transaction'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  currentStatus: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: [status: string]
}>()

const selected = ref<string | undefined>(undefined)

const statusOptions = computed(() =>
  TRANSACTION_STATUS_ITEMS.filter((item) => item.value !== props.currentStatus)
)

watch(open, (isOpen) => {
  if (!isOpen) selected.value = undefined
})

function onConfirm() {
  if (!selected.value) return
  emit('confirm', selected.value)
}
</script>

<template>
  <UModal v-model:open="open" title="Change Transaction Status" :ui="{ footer: 'justify-end' }">
    <template #body>
      <USelect
        v-model="selected"
        :items="statusOptions"
        placeholder="Select new status"
        class="w-full"
      />
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="light"
        :disabled="loading"
        @click="open = false"
      />
      <UButton
        label="Confirm"
        color="primary"
        :loading="loading"
        :disabled="loading || !selected"
        @click="onConfirm"
      />
    </template>
  </UModal>
</template>
