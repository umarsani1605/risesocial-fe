<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="border border-default rounded-lg overflow-hidden">
    <button
      type="button"
      class="group w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-elevated/50 transition-colors cursor-pointer"
      @click.stop="emit('toggle')"
    >
      <slot name="header" />
      <UIcon
        name="i-ph-caret-down-bold"
        class="size-4 text-muted transition-transform duration-250 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      class="grid transition-[grid-template-rows] duration-250 ease-in-out"
      :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div v-if="$slots.body" class="border-t border-default p-4">
          <slot name="body" />
        </div>
        <div v-if="$slots.footer" class="p-4">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
