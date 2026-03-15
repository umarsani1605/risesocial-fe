<script setup lang="ts">
import type { CohortMentor } from '@/types'

defineProps<{
  mentors: CohortMentor[]
}>()
</script>

<template>
  <div class="space-y-1 pt-2 min-h-[600px]">
    <div
      v-for="mentor in mentors"
      :key="mentor.id"
      class="flex items-center gap-4 p-2.5 rounded-lg hover:bg-elevated/50 transition-colors"
    >
      <UAvatar :src="mentor.avatar" :alt="mentor.name" size="2xl" class="rounded-full" />
      <div>
        <p class="text-base font-medium">{{ mentor.name }}</p>
        <p class="text-sm text-muted">{{ mentor.job_title }}</p>
      </div>
    </div>
  </div>
</template>
