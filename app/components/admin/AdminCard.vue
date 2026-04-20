<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <UCard
    class="shadow-none! ring-transparent space-y-4 overflow-visible"
    v-bind="$attrs"
    :ui="{
      header: 'p-0!',
      body: 'p-0!',
      footer: 'p-0!'
    }"
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
