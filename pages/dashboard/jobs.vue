<script setup>
// Set layout untuk halaman ini
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

// Import store
import { useJobsStore } from '~/store/jobs';
import { storeToRefs } from 'pinia';

// Jobs store
const jobsStore = useJobsStore();
const { jobsData, isLoading } = storeToRefs(jobsStore);
const { getJobDetailUrl } = jobsStore;

// Get favorite jobs (saved jobs)
const favoriteJobs = computed(() => {
  if (!jobsData.value) return [];
  return jobsStore.getFavoriteJobs(jobsData.value);
});

// Get latest jobs (9 most recent jobs)
const latestJobs = computed(() => {
  if (!jobsData.value?.length) return [];
  return [...jobsData.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 9);
});

onMounted(async () => {
  // no-op for jobs; expect jobsData to be prefilled elsewhere or future SSR on this page
});

// Meta tags
useSeoMeta({
  title: 'Jobs Management - Rise Social',
  description: 'Kelola pekerjaan yang disimpan dan temukan rekomendasi pekerjaan baru',
});
</script>
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
            <div v-if="favoriteJobs.length === 0" class="text-center py-12">
              <Icon name="lucide:bookmark" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
              <p class="text-gray-500 text-sm mb-4">Save jobs that interest you to see them here</p>
              <Button variant="outline" size="sm" class="shadow-none" @click="navigateTo('/opportunities')">Explore Jobs</Button>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Saved Job Cards -->
              <div
                v-for="job in favoriteJobs"
                :key="job.id"
                class="flex items-center h-[8rem] space-x-3 sm:space-x-6 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                @click="navigateTo(getJobDetailUrl(job))"
              >
                <div class="size-12 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img :src="job.company?.logo_url" :alt="job.company?.name || 'Company Logo'" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                  <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">{{ job.title }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 truncate">{{ job.company?.name || 'Perusahaan tidak tersedia' }}</p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <Icon name="lucide:map-pin" class="h-3 w-3" />
                    {{ [job.location?.city, job.location?.country].filter(Boolean).join(', ') || 'Location not specified' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="heading-card">Latest Jobs</div>
              <Button variant="link" size="sm" class="text-slate-500 hover:text-slate-600" @click="navigateTo('/opportunities')">
                View All Jobs
              </Button>
            </div>
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-500">Loading jobs...</p>
            </div>

            <!-- No Jobs State -->
            <div v-else-if="!isLoading && latestJobs.length === 0" class="text-center py-12">
              <Icon name="lucide:briefcase" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada lowongan terbaru</h3>
              <p class="text-gray-500 text-sm mb-4">Silakan cek kembali nanti</p>
              <Button variant="outline" size="sm" class="shadow-none" @click="navigateTo('/opportunities')">Lihat Semua Lowongan</Button>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="job in latestJobs"
                :key="job.id"
                class="flex items-center h-[8rem] space-x-3 sm:space-x-6 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300 hover:shadow-subtle"
                @click="navigateTo(getJobDetailUrl(job))"
              >
                <div class="size-12 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img :src="job.company?.logo_url" :alt="job.company?.name || 'Company Logo'" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                  <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">{{ job.title }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 truncate">
                    {{ job.company?.name || 'Perusahaan tidak tersedia' }}
                  </p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <Icon name="lucide:map-pin" class="h-3 w-3" />
                    <span>
                      {{ [job.location?.city, job.location?.country].filter(Boolean).join(', ') || 'Location not specified' }}
                    </span>
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
<style scoped>
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>
