<script setup lang="ts">
import type { AcademyPricing, Academy } from '@/types'

defineProps<{
  tier: AcademyPricing
  academy: Academy
  enrollLink: string
}>()
</script>

<template>
  <div class="px-4 space-y-6">
    <div class="space-y-3 py-2">
      <div v-if="academy.duration" class="flex items-center gap-3">
        <UIcon name="i-lucide-calendar" class="size-4 shrink-0" />
        <span class="text-base">{{ academy.duration }}</span>
      </div>
      <div v-if="academy.format" class="flex items-center gap-3">
        <UIcon name="i-lucide-video" class="size-4 shrink-0" />
        <span class="text-base">{{ academy.format }}</span>
      </div>
      <div v-if="academy.certificate" class="flex items-center gap-3">
        <UIcon name="i-lucide-award" class="size-4 shrink-0" />
        <span class="text-base">Certificate</span>
      </div>
      <div v-if="academy.portfolio" class="flex items-center gap-3">
        <UIcon name="i-lucide-briefcase" class="size-4 shrink-0" />
        <span class="text-base">Portfolio</span>
      </div>
    </div>
    <div class="mb-4">
      <div class="text-base line-through mb-2">
        {{ tier.formatted_original_price || formatPrice(tier.original_price) }}
      </div>
      <div class="text-2xl font-bold mb-6">
        {{ tier.formatted_discount_price || formatPrice(tier.discount_price) }}
      </div>
      <UButton
        as="a"
        :href="enrollLink"
        target="_blank"
        label="Enroll Now"
        color="primary"
        size="md"
        class="flex items-center justify-center w-full rounded-lg"
      />
    </div>
  </div>
</template>
