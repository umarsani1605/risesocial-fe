<script setup lang="ts">
const props = defineProps<{
  href?: string
  name: string
  color: string
  icon: string
  removable?: boolean
  removeLoading?: boolean
  flexible?: boolean // flex-1 min-w-0 instead of fixed w-120 — use in constrained containers like modals
}>()

const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :target="href ? '_blank' : undefined"
    class="flex items-center border border-default rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
  >
    <div class="flex items-center justify-center size-10 text-white shrink-0" :class="color">
      <UIcon :name="icon" class="size-4" />
    </div>
    <span class="text-sm pr-3 pl-2 truncate" :class="flexible ? 'flex-1 min-w-0' : 'w-120'">{{ name }}</span>
    <UButton
      v-if="removable"
      icon="i-ph-x-bold"
      color="neutral"
      variant="ghost"
      class="mr-0.5 shrink-0"
      :loading="removeLoading"
      @click.prevent="emit('remove')"
    />
  </component>
</template>
