<script setup lang="ts">
interface Props {
  step: number
  title: string
  description: string
  image: string
  isLast?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div class="group relative flex-1">
    <div
      class="flex flex-row-reverse lg:flex-col items-center text-center gap-2 md:p-6 rounded-2xl"
    >
      <!-- Step Image -->
      <div
        class="flex-2 h-40 lg:h-48 mx-auto bg-transparent rounded-lg flex items-center justify-center transition-transform duration-300 lg:group-hover:scale-105"
      >
        <NuxtImg :src="image" :alt="title" class="h-full object-contain" loading="lazy" />
      </div>

      <!-- Step Content -->
      <div class="flex-3 flex flex-col lg:items-center lg:justify-center lg:pb-8 text-wrap">
        <!-- Step Indicator & Title -->
        <div class="flex mb-4 flex-row lg:flex-col items-center lg:justify-center gap-4">
          <!-- Number Indicator with Connector Line -->
          <div class="relative">
            <div
              class="size-7 lg:size-10 rounded-full flex items-center justify-center font-semibold text-sm bg-primary text-white border border-primary transition-all duration-300 lg:bg-white lg:text-primary lg:group-hover:bg-primary lg:group-hover:text-white"
            >
              {{ step }}
            </div>
            <!-- Horizontal connector line for mobile, after indicator -->
            <div
              v-if="!isLast"
              class="lg:hidden absolute top-1/2 left-[150%] w-56 h-0.5 rounded-full bg-orange-400 z-10"
            />
            <!-- Horizontal connector line for desktop -->
            <div
              v-if="!isLast"
              class="hidden lg:block absolute top-1/2 left-[150%] w-56 h-0.5 rounded-full bg-orange-400 z-10"
            />
          </div>

          <h3 class="text-xl text-left lg:text-center font-bold text-gray-900">
            {{ title }}
          </h3>
        </div>

        <p class="text-gray-600 text-sm text-left lg:text-center leading-relaxed max-w-xs">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
