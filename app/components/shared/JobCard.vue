<script setup lang="ts">
import type { Job } from '@/types'

const props = defineProps<{ job: Job }>()

const locationText = computed(() => formatLocation(props.job.location))

const handleClick = () => {
  navigateTo(`/opportunities/${props.job.company.slug}/${props.job.slug}`)
}
</script>

<template>
  <UCard
    class="rounded-2xl ring-default hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    @click="handleClick"
  >
    <div class="flex w-full relative gap-6">
      <div class="size-20 sm:size-24 md:size-28 shrink-0 flex items-center justify-center">
        <NuxtImg
          v-if="job.company.logo_url"
          :src="job.company.logo_url"
          :alt="`${job.company.name} logo`"
          class="size-full object-contain rounded-xl"
          loading="lazy"
        />
        <div v-else class="size-full bg-gray-100 rounded-full flex items-center justify-center">
          <UIcon name="i-ph-buildings-bold" class="size-8 text-gray-400" />
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
        <div class="space-y-2 min-w-0">
          <h3 class="font-bold text-gray-900 line-clamp-2">
            {{ job.title }}
          </h3>

          <p class="text-gray-600 text-sm line-clamp-1">
            {{ job.company.name }}
          </p>

          <UBadge
            v-if="job.company.industry"
            color="neutral"
            variant="subtle"
            class="text-xs font-medium w-fit"
          >
            {{ job.company.industry }}
          </UBadge>
          <div class="flex gap-2 text-gray-500 text-sm mt-auto">
            <div class="flex items-center min-w-0 shrink-0">
              <UIcon name="i-ph-calendar-bold" class="size-4 mr-2 shrink-0" />
              <span v-if="job.valid_until" class="text-xs whitespace-nowrap">Deadline: {{ formatDate(job.valid_until) }}</span>
              <span v-else class="text-xs whitespace-nowrap text-muted">No deadline</span>
            </div>
            <div class="flex items-center min-w-0 flex-1">
              <UIcon name="i-ph-map-pin-bold" class="size-4 mr-2 shrink-0" />
              <span class="line-clamp-1 text-xs">
                {{ locationText }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
