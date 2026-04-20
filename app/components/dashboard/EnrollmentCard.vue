<script setup lang="ts">
import type { CohortEnrollment } from '@/types'

const props = defineProps<{
  enrollment: CohortEnrollment
}>()

const progressPercentage = computed(() => {
  if (!props.enrollment.total_modules) return 0
  return Math.round((props.enrollment.completed_modules / props.enrollment.total_modules) * 100)
})
</script>

<template>
  <NuxtLink
    :to="`/dashboard/academy/${enrollment.cohort.id}`"
    class="flex gap-4 group items-stretch justify-between p-2 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer"
  >
    <div class="size-28 shrink-0 rounded-lg overflow-hidden">
      <NuxtImg
        :src="enrollment.cohort.academy.image_url ?? ''"
        :alt="enrollment.cohort.academy.title"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    <div class="flex flex-col flex-1 gap-2 py-2 pr-4 min-w-0">
      <p class="text-xs text-dimmed">
        {{ enrollment.cohort.name }}
      </p>
      <h3 class="font-bold text-md text-slate-800 flex items-center gap-2">
        <span class="line-clamp-2">
          {{ enrollment.cohort.academy.title }}
        </span>
        <UIcon
          v-if="enrollment.cohort.status === 'completed'"
          name="i-ph-check-circle-fill"
          class="size-4 text-success shrink-0"
        />
      </h3>

      <template v-if="enrollment.cohort.status === 'ongoing'">
        <div class="mt-1 flex flex-col gap-2">
          <UProgress :model-value="progressPercentage" color="primary" />
          <div class="flex items-center justify-between">
            <span class="text-sm text-dimmed">Learning Progress</span>
            <span class="text-sm text-dimmed">
              {{
                enrollment.completed_modules > 0
                  ? `${enrollment.completed_modules} / ${enrollment.total_modules} sessions`
                  : `- / ${enrollment.total_modules} sessions`
              }}
            </span>
          </div>
        </div>
      </template>

      <template v-else-if="enrollment.cohort.status === 'not_started'">
        <p class="text-sm text-dimmed">
          Starts on
          {{
            new Date(enrollment.cohort.start_date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          }}
        </p>
      </template>

      <template v-else>
        <p class="text-sm text-dimmed">
          Completed on
          {{
            new Date(enrollment.cohort.end_date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          }}
        </p>
      </template>
    </div>
  </NuxtLink>
</template>
