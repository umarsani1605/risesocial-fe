<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

defineProps<{
  itemName?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <UModal v-model:open="open" title="Delete Confirmation" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-sm">
        Are you sure you want to delete
        <span v-if="itemName" class="font-semibold">{{ itemName }}</span
        ><template v-else>this item</template>? This action cannot be undone.
      </p>
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
        label="Delete"
        color="error"
        :loading="loading"
        :disabled="loading"
        @click="emit('confirm')"
      />
    </template>
  </UModal>
</template>
