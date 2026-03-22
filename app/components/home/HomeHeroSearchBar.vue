<script setup lang="ts">
const router = useRouter()
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

function handleSearch() {
  const query: Record<string, string> = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedLocation.value && selectedLocation.value !== 'All Location') {
    query.location = selectedLocation.value
  }
  router.push({ path: '/opportunities', query })
}
</script>

<template>
  <div class="bg-white rounded-2xl p-2 shadow-2xl">
    <div class="flex flex-col lg:flex-row lg:gap-0">
      <div class="lg:flex-1 flex justify-center items-center relative">
        <div class="flex items-center w-full h-12 px-4">
          <UIcon name="i-lucide-map-pin" class="size-5 text-gray-400 mr-3 shrink-0" />
          <USelect
            v-model="selectedLocation"
            :items="locationOptions"
            placeholder="All Location"
            class="flex-1"
            :ui="{
              base: 'border-none ring-0 focus:ring-0 shadow-none'
            }"
          />
        </div>
        <div
          class="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-200"
        />
      </div>

      <div class="lg:hidden h-px bg-gray-100 mx-2" />

      <div class="lg:flex-2 flex justify-start items-center relative">
        <div class="flex items-center w-full h-12 px-4">
          <UIcon name="i-lucide-search" class="size-5 text-gray-400 mr-3 shrink-0" />
          <UInput
            v-model="searchQuery"
            type="text"
            placeholder="Job title, key words or company"
            class="flex-1"
            :ui="{
              base: 'border-none ring-0 focus-visible:ring-0 shadow-none'
            }"
          />
        </div>
      </div>

      <div class="lg:flex-initial mt-2 lg:mt-0">
        <UButton
          color="primary"
          size="xl"
          class="w-full lg:w-auto justify-center gap-2"
          @click="handleSearch"
        >
          <UIcon name="i-lucide-search" class="size-5" />
          Find Jobs
        </UButton>
      </div>
    </div>
  </div>
</template>
