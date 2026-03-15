<script setup lang="ts">
const selectedLocation = ref('')
const searchQuery = ref('')

const locationOptions: string[] = [
  'All Location',
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bali'
]
</script>

<template>
  <div class="bg-white rounded-2xl p-2 shadow-2xl">
    <div class="flex flex-col lg:flex-row gap-5 lg:gap-0">
      <div class="lg:flex-1 flex justify-center items-center relative">
        <div class="flex items-center w-full h-full px-4">
          <UIcon name="i-lucide-map-pin" class="size-5 text-gray-400 mr-3 shrink-0" />
          <USelect
            v-model="selectedLocation"
            :items="locationOptions"
            placeholder="All Location"
            :ui="{
              base: 'border-none ring-0 focus:ring-0 shadow-none'
            }"
          />
        </div>
        <div
          class="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-200"
        />
      </div>

      <div class="lg:flex-2 flex justify-start items-center relative">
        <div class="flex items-center w-full h-full px-4">
          <UIcon name="i-lucide-search" class="size-5 text-gray-400 mr-3" />
          <UInput
            v-model="searchQuery"
            type="text"
            placeholder="Job title, key words or company"
            :ui="{
              base: 'border-none ring-0 focus-visible:ring-0 shadow-none'
            }"
          />
        </div>
      </div>

      <div class="lg:flex-initial">
        <UButton color="primary" size="xl">
          <UIcon name="i-lucide-search" class="size-5 px-4" />
          Find Jobs
        </UButton>
      </div>
    </div>
  </div>
</template>
