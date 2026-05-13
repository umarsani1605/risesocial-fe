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
          <p class="text-sm lg:text-base leading-relaxed">
            {{ testimonial.quote }}
          </p>
        </div>
        <div class="mt-6 space-y-2">
          <div class="flex justify-center space-x-1">
            <UIcon
              v-for="i in 5"
              :key="i"
              name="i-heroicons-star-solid"
              class="size-4 text-yellow-400"
            />
          </div>
          <h4 class="text-sm lg:text-base font-semibold text-gray-900">
            {{ testimonial.name }}
          </h4>
          <p class="text-xs lg:text-sm text-emerald-600 font-medium">
            {{ testimonial.country }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
