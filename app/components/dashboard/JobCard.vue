<script setup lang="ts">
import type { Job } from '@/types'

const props = defineProps<{ job: Job }>()

const locationText = computed(() => formatLocation(props.job.location ?? {}))
</script>

<template>
  <NuxtLink
    :to="`/opportunities/${job.company.slug}/${job.slug}`"
    class="flex gap-4 group items-stretch justify-between p-3 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer"
  >
    <div class="size-20 sm:size-24 md:size-28 shrink-0 flex items-center justify-center">
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

    <div class="flex-1 flex flex-col gap-2 min-w-0">
      <div class="flex flex-col gap-2">
        <p
          class="font-bold text-default hover:text-primary line-clamp-2 transition-colors duration-300"
        >
          {{ job.title }}
        </p>
        <p
          class="font-semibold text-muted text-sm line-clamp-1 hover:text-default transition-colors duration-300"
        >
          {{ job.company.name }}
        </p>
      </div>
      <div class="flex gap-6 text-muted text-sm mt-auto">
        <div class="flex items-center min-w-0">
          <UIcon name="i-ph-map-pin-bold" class="size-4 mr-2 shrink-0" />
          <span class="line-clamp-1 text-xs">{{ locationText }}</span>
        </div>
        <div v-if="job.valid_until" class="flex items-center min-w-0 shrink-0">
          <UIcon name="i-ph-calendar-blank-bold" class="size-4 mr-2 shrink-0" />
          <span class="text-xs whitespace-nowrap">
            {{ formatDate(job.valid_until) }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
