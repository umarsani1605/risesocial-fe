<script setup lang="ts">
const attrs = useAttrs()

const mergedUi = computed(() => ({
  ...(attrs.ui as Record<string, unknown> | undefined),
  header: 'p-0!',
  body: 'p-0!',
  footer: 'p-0!',
  ...(attrs.ui as Record<string, unknown> | undefined)
}))

defineOptions({ inheritAttrs: false })
</script>

<template>
  <UCard
    class="shadow-none! ring-transparent space-y-4 overflow-visible"
    v-bind="$attrs"
    :ui="mergedUi"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>
