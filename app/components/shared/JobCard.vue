<script setup lang="ts">
import type { Job } from '@/types'

const props = defineProps<{ job: Job }>()

const locationText = computed(() => formatLocation(props.job.location))
</script>

<template>
  <NuxtLink :to="`/opportunities/${job.company.slug}/${job.slug}`" class="block group">
    <UCard class="h-full rounded-2xl ring-default transition-all duration-300 ease-out will-change-transform group-hover:-translate-y-1 group-hover:shadow-md">
      <div class="flex w-full gap-6">
        <div class="size-20 sm:size-24 md:size-28 shrink-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          <NuxtImg
            v-if="job.company.logo_url"
            :src="job.company.logo_url"
            :alt="`${job.company.name} logo`"
            class="size-full object-contain rounded-xl"
            loading="lazy"
          />
          <div v-else class="size-full bg-gray-100 rounded-full flex items-center justify-center">
            <UIcon name="i-ph-buildings-bold" class="size-8 text-muted" />
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
          <div class="space-y-2 min-w-0">
            <h3 class="font-bold text-default line-clamp-2 transition-colors duration-300 ease-out group-hover:text-highlighted">{{ job.title }}</h3>
            <p class="text-muted text-sm line-clamp-1">{{ job.company.name }}</p>
            <UBadge
              v-if="job.company.industry"
              color="neutral"
              variant="subtle"
              class="w-fit text-xs font-medium transition-colors duration-300 ease-out"
            >
              {{ job.company.industry }}
            </UBadge>
            <div class="flex gap-2 text-muted text-sm mt-auto">
              <div class="flex items-center min-w-0 shrink-0">
                <UIcon name="i-ph-calendar-bold" class="size-4 mr-2 shrink-0" />
                <span v-if="job.valid_until" class="text-xs whitespace-nowrap">
                  Deadline: {{ formatDate(job.valid_until) }}
                </span>
                <span v-else class="text-xs whitespace-nowrap text-muted">No deadline</span>
              </div>
              <div class="flex items-center min-w-0 flex-1">
                <UIcon name="i-ph-map-pin-bold" class="size-4 mr-2 shrink-0" />
                <span class="line-clamp-1 text-xs">{{ locationText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
