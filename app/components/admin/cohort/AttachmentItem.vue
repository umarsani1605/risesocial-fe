<script setup lang="ts">
defineProps<{
  href?: string
  name: string
  background: string
  foreground: string
  border: string
  icon: string
  removable?: boolean
  removeLoading?: boolean
}>()

const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :target="href ? '_blank' : undefined"
    class="border border-default rounded-lg hover:bg-slate-50 transition-colors"
    :class="
      removable
        ? 'grid grid-cols-[40px_minmax(0,1fr)_auto] items-center'
        : 'grid grid-cols-[40px_minmax(0,1fr)] items-center'
    "
  >
    <div
      class="flex items-center justify-center size-10 min-w-10 rounded-l-lg bg-white border-r border-slate-100"
      :class="[foreground]"
    >
      <UIcon :name="icon" class="size-4" />
    </div>
    <span class="text-sm px-2 truncate">{{ name }}</span>
    <UButton
      v-if="removable"
      icon="i-ph-x-bold"
      color="neutral"
      variant="ghost"
      class="mr-0.5"
      :loading="removeLoading"
      @click.prevent="emit('remove')"
    />
  </component>
</template>
