<script setup lang="ts">
defineProps<{
  testimonial: {
    quote: string
    name: string
    country: string
    rating: number
  }
}>()
</script>

<template>
  <div class="h-full">
    <UCard class="text-center h-full">
      <div class="flex flex-col justify-between h-full">
        <div class="space-y-4">
          <p class="text-base text-muted leading-relaxed">
            {{ testimonial.quote }}
          </p>
        </div>
        <div class="mt-6 space-y-2">
          <div class="flex justify-center space-x-1">
            <UIcon
              v-for="i in 5"
              :key="i"
              name="i-heroicons-star-solid"
              class="size-4 text-warning"
            />
          </div>
          <h4 class="text-base font-semibold text-default">
            {{ testimonial.name }}
          </h4>
          <p class="text-sm font-medium text-slate-600">
            {{ testimonial.country }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
