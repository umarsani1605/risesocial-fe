<script setup lang="ts">
interface Props {
  step: number
  title: string
  description: string
  image: string
  isLast?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="group relative flex-1">
    <div
      class="flex flex-row-reverse md:flex-col items-center text-center gap-2 md:p-6 rounded-2xl"
    >
      <!-- Step Image -->
      <div
        class="flex-2 h-40 md:h-48 mx-auto bg-transparent rounded-lg flex items-center justify-center transition-transform duration-300 md:group-hover:scale-105"
      >
        <NuxtImg :src="image" :alt="title" class="h-full w-auto object-contain" loading="lazy" />
      </div>

      <!-- Step Content -->
      <div class="flex-3 flex flex-col md:items-center md:justify-center md:pb-8 text-wrap">
        <!-- Step Indicator & Title -->
        <div class="flex mb-4 flex-row md:flex-col items-center md:justify-center gap-4">
          <!-- Number Indicator with Connector Line -->
          <div class="relative">
            <div
              class="size-7 md:size-10 rounded-full flex items-center justify-center font-semibold text-sm bg-primary text-white border border-primary transition-all duration-300 md:bg-white md:text-primary md:group-hover:bg-primary md:group-hover:text-white"
            >
              {{ step }}
            </div>
            <!-- Horizontal connector line — only shown on md+ (grid layout) -->
            <div
              v-if="!isLast"
              class="hidden md:block absolute top-1/2 left-[150%] w-56 h-0.5 rounded-full bg-orange-400 z-10"
            />
          </div>

          <h3 class="text-xl text-left md:text-center font-bold text-gray-900">
            {{ title }}
          </h3>
        </div>

        <p class="text-gray-600 text-sm text-left md:text-center leading-relaxed max-w-xs">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
