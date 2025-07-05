<template>
  <div class="bg-slate-50 mt-10">
    <div class="container-wrapper section-py-md space-y-6">
      <!-- Saved Jobs Section -->
      <Card class="border border-gray-50">
        <CardContent>
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="heading-card">Saved Jobs</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- No Saved Jobs Message -->
              <div v-if="favoriteJobs.length === 0" class="text-center py-12">
                <Icon name="lucide:bookmark" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
                <p class="text-gray-500 text-sm mb-4">Save jobs that interest you to see them here</p>
                <Button @click="navigateTo('/opportunities')">Explore Jobs</Button>
              </div>

              <!-- Saved Job Cards -->
              <div
                v-for="job in favoriteJobs"
                :key="job.id"
                class="flex items-center h-[8rem] space-x-3 sm:space-x-6 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                @click="navigateTo(getJobDetailUrl(job))"
              >
                <div class="size-12 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img :src="getJobImage(job)" :alt="job.organization" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                  <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">{{ job.title }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 truncate">{{ job.organization }}</p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <Icon name="lucide:map-pin" class="h-3 w-3" />
                    <span>{{ job.cleanLocation }}</span>
                    <span>•</span>
                    <span>{{ formatEmploymentType(job.employment_type) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="heading-card">Recommended Jobs</div>
              <Button variant="link" size="sm" class="text-slate-500 hover:text-slate-600" @click="navigateTo('/opportunities')">
                View All Jobs
              </Button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- No Saved Jobs Message -->
              <div v-if="recommendedJobs.length === 0" class="text-center py-12">
                <Icon name="lucide:bookmark" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No recommended jobs</h3>
                <p class="text-gray-500 text-sm mb-4">Recommended jobs that interest you to see them here</p>
                <Button @click="navigateTo('/opportunities')">Explore Jobs</Button>
              </div>

              <!-- Saved Job Cards -->
              <div
                v-for="job in recommendedJobs"
                :key="job.id"
                class="flex items-center h-[8rem] space-x-3 sm:space-x-6 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                @click="navigateTo(getJobDetailUrl(job))"
              >
                <div class="size-12 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img :src="getJobImage(job)" :alt="job.organization" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                  <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">{{ job.title }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 truncate">{{ job.organization }}</p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <Icon name="lucide:map-pin" class="h-3 w-3" />
                    <span>{{ job.cleanLocation }}</span>
                    <span>•</span>
                    <span>{{ formatEmploymentType(job.employment_type) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
// Set layout untuk halaman ini
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

// Get jobs data
const { getFavoriteJobs, formatEmploymentType, getJobImage, getJobDetailUrl, toggleFavorite, isFavorite, jobsStore } = useJobs();

// Get favorite jobs (saved jobs)
const favoriteJobs = computed(() => {
  return getFavoriteJobs.value;
});

// Get recommended jobs (first 9 jobs that are not favorites)
const recommendedJobs = computed(() => {
  if (!jobsStore.processedJobs.length) return [];

  const favoriteIds = new Set(getFavoriteJobs.value.map((job) => job.id));
  return jobsStore.processedJobs.filter((job) => !favoriteIds.has(job.id)).slice(0, 9);
});

// Meta tags
useSeoMeta({
  title: 'Jobs Management - Rise Social',
  description: 'Kelola pekerjaan yang disimpan dan temukan rekomendasi pekerjaan baru',
});
</script>
