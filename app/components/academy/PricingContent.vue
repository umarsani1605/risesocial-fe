<script setup lang="ts">
import type { AcademyPricing, Academy } from '@/types'

const props = defineProps<{
  tier: AcademyPricing
  academy: Academy
  academySlug: string
  isEnrolled?: boolean
  hasPendingPayment?: boolean
}>()

const { isLoggedIn } = useAuth()

const onEnroll = () => {
  const paymentPath = `/academy/${props.academySlug}/payment?pricing_id=${props.tier.id}`
  if (!isLoggedIn.value) {
    navigateTo(`/login?redirect=${encodeURIComponent(paymentPath)}`)
    return
  }
  navigateTo(paymentPath)
}
</script>

<template>
  <div class="px-4 space-y-6">
    <div class="space-y-3 py-2">
      <div v-if="academy.duration" class="flex items-center gap-3">
        <UIcon name="i-ph-calendar-bold" class="size-4 shrink-0 text-muted" />
        <span class="text-base">{{ academy.duration }}</span>
      </div>
      <div v-if="academy.format" class="flex items-center gap-3">
        <UIcon name="i-ph-video-bold" class="size-4 shrink-0 text-muted" />
        <span class="text-base">{{ academy.format }}</span>
      </div>
      <div v-if="academy.certificate" class="flex items-center gap-3">
        <UIcon name="i-ph-medal-bold" class="size-4 shrink-0 text-muted" />
        <span class="text-base">Certificate</span>
      </div>
      <div v-if="academy.portfolio" class="flex items-center gap-3">
        <UIcon name="i-ph-briefcase-bold" class="size-4 shrink-0 text-muted" />
        <span class="text-base">Portfolio</span>
      </div>
    </div>
    <div class="mb-4">
      <div class="text-base line-through mb-2">
        {{ formatPrice(tier.original_price) }}
      </div>
      <div class="text-2xl font-bold mb-6">
        {{ formatPrice(tier.discount_price) }}
      </div>
      <UButton
        v-if="isEnrolled"
        label="Go to Academy"
        icon="i-ph-squares-four-bold"
        color="primary"
        variant="outline"
        size="md"
        to="/dashboard/academy"
        class="flex items-center justify-center w-full rounded-lg"
      />
      <UButton
        v-else-if="hasPendingPayment"
        label="Complete Payment"
        icon="i-ph-clock-bold"
        size="lg"
        class="flex items-center justify-center w-full rounded-lg"
        @click="onEnroll"
      />
      <UButton
        v-else
        label="Enroll Now"
        size="lg"
        class="flex items-center justify-center w-full rounded-lg"
        @click="onEnroll"
      />
    </div>
  </div>
</template>
