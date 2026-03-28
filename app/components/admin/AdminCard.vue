<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <UCard class="shadow-none!" v-bind="$attrs">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>
