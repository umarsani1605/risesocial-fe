<script setup lang="ts">
import type { CohortEnrollment } from '@/types'
import { getCohortPhase } from '@/utils/cohort'

const props = defineProps<{
  enrollment: CohortEnrollment
}>()

// Fallback ke cohort.academy untuk backward compat dengan response lama
const academy = computed(
  () => props.enrollment.academy ?? (props.enrollment.cohort as any)?.academy
)

const progressPercentage = computed(() => {
  if (!props.enrollment.total_modules) return 0
  return Math.round((props.enrollment.completed_modules / props.enrollment.total_modules) * 100)
})

const cohortPhase = computed(() => (props.enrollment.cohort ? getCohortPhase(props.enrollment.cohort) : null))
</script>

<template>
  <!-- Pending placement: cohort belum di-assign oleh admin -->
  <div
    v-if="!enrollment.cohort"
    class="group flex gap-4 items-stretch justify-between p-3 rounded-xl hover:bg-slate-100/50 transition-colors"
  >
    <div class="flex gap-6 w-4xl">
      <div class="size-28 shrink-0 rounded-lg overflow-hidden">
        <NuxtImg
          :src="academy?.image_url ?? ''"
          :alt="academy?.title ?? ''"
          class="size-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div class="flex flex-col flex-1 gap-2 py-2 pr-4 min-w-0">
        <p class="text-xs text-dimmed"></p>
        <p class="font-bold text-md text-slate-800">{{ academy?.title }}</p>
        <p class="text-sm text-dimmed">Kelas belum dimulai.</p>
      </div>
    </div>
  </div>

  <NuxtLink
    v-else
    :to="`/dashboard/academy/${enrollment.cohort.id}`"
    class="flex gap-4 group items-stretch justify-between p-3 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer"
  >
    <div class="flex gap-6 w-4xl">
      <div class="size-28 shrink-0 rounded-lg overflow-hidden">
        <NuxtImg
          :src="academy?.image_url ?? ''"
          :alt="academy?.title ?? ''"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div class="flex flex-col flex-1 gap-2 py-2 pr-4 min-w-0">
        <p class="text-xs text-dimmed">
          {{ enrollment.cohort.name }}
        </p>
        <p
          class="font-bold text-md text-slate-800 flex items-center gap-2 transition-colors duration-300"
        >
          <span class="line-clamp-2">{{ academy?.title }}</span>
          <UIcon
            v-if="cohortPhase === 'completed'"
            name="i-ph-check-circle-fill"
            class="size-4 text-success shrink-0"
          />
        </p>

        <template v-if="cohortPhase === 'ongoing'">
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

        <template v-else-if="cohortPhase === 'not_started'">
          <p class="text-sm text-dimmed">
            Starts on {{ formatDate(enrollment.cohort.start_date) }}
          </p>
        </template>

        <template v-else>
          <p class="text-sm text-dimmed">
            Completed on {{ formatDate(enrollment.cohort.end_date) }}
          </p>
        </template>
        <div v-if="enrollment.has_certificate" class="mt-2 grow-0" @click.stop>
          <UButton
            :to="enrollment.certificate_url"
            target="_blank"
            variant="dashboard"
            size="sm"
            leading-icon="i-ph-medal-bold"
          >
            Get Certificate
          </UButton>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
