<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div data-slot="card" :class="cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-subtle', props.class)">
    <slot />
  </div>
</template>
<style>
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>
