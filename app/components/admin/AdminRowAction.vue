<script setup lang="ts">
/**
 * Row-level action button for admin list tables.
 * Renders as "Edit" (pencil) for editors and "Detail" (eye) for viewers.
 */
defineProps<{
  to: string
  canEdit: boolean
}>()
</script>

<template>
  <UButton
    :label="canEdit ? 'Edit' : 'Detail'"
    :leading-icon="canEdit ? 'i-ph-pencil-simple-bold' : 'i-ph-eye-bold'"
    size="sm"
    color="primary"
    variant="light"
    :to="to"
  />
</template>
