<script setup>
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useJobsStore } from '@/store/jobs';
import { storeToRefs } from 'pinia';
import { useAPI } from '@/composables/useAPI';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Job Opportunities - Rise Social',
  meta: [{ name: 'description', content: 'Find your dream green job from thousands of opportunities available' }],
});

const {
  data: jobsData,
  pending: jobsPending,
  error: jobsError,
} = await useAPI('/jobs', {
  key: 'jobs-data',
  transform: (response) => {
    return response.data;
  },
});

const jobsStore = useJobsStore();
const { filteredJobs, paginatedJobs, isLoading, filters, hasActiveFilters, currentPage, totalPages } = storeToRefs(jobsStore);

const { updateFilter, clearAllFilters, setCurrentPage, nextPage, prevPage, getUniqueLocations, getUniqueIndustries, getUniqueJobTypes, setJobsData } =
  jobsStore;

watch(
  jobsData,
  (newData) => {
    if (newData) {
      setJobsData(newData);
    }
  },
  { immediate: true }
);

const isFilterOpen = ref(false);

const goToPage = (page) => {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const applyFilters = () => {
  isFilterOpen.value = false;
};

const clearFilters = () => {
  clearAllFilters();
};

const selectAndNavigate = (job) => {
  console.log('🎯 selectAndNavigate called with job:', job);
  console.log('🎯 Job company slug:', job.company?.slug);
  console.log('🎯 Job slug:', job.slug);

  jobsStore.setSelectedJob(job);
  console.log('🎯 selectedJob set, navigating to:', `/opportunities/${job.company.slug}/${job.slug}`);

  navigateTo(`/opportunities/${job.company.slug}/${job.slug}`);
};

watch(
  () => filteredJobs.value,
  (newJobs) => {
    useHead({
      meta: [
        {
          name: 'description',
          content: `Find your dream job from ${newJobs.length} opportunities available at Rise Social`,
        },
      ],
    });
  }
);
</script>

<template>
  <div class="bg-gray-50 mt-16">
    <!-- Main Content -->
    <section class="section-py-lg">
      <div class="container-wrapper">
        <div class="section-title-wrapper">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">Discover green career opportunities that match your passion and expertise</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <!-- Mobile Filter Button -->
          <div class="lg:hidden">
            <Sheet :open="isFilterOpen" @update:open="isFilterOpen = $event">
              <SheetTrigger as-child>
                <Button variant="outline" class="w-full">
                  <Icon name="lucide:filter" class="h-4 w-4 mr-2" />
                  Show Filters
                  <Badge v-if="hasActiveFilters" class="ml-2 bg-orange-500 text-white"> Active </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" class="w-80 overflow-y-auto px-5 py-6">
                <SheetHeader class="p-0">
                  <SheetTitle>Filter Jobs</SheetTitle>
                </SheetHeader>

                <div class="space-y-6">
                  <!-- Job Title Search -->
                  <div>
                    <label class="form-label">Job Title</label>
                    <div class="relative">
                      <Icon name="lucide:search" class="input-icon" />
                      <Input
                        type="text"
                        placeholder="Search job title..."
                        class="pl-10"
                        :model-value="filters.title"
                        @update:model-value="(value) => updateFilter('title', value)"
                      />
                    </div>
                  </div>

                  <!-- Organization Search -->
                  <div>
                    <label class="form-label">Organization</label>
                    <div class="relative">
                      <Icon name="lucide:building-2" class="input-icon" />
                      <Input
                        type="text"
                        placeholder="Search organization..."
                        class="pl-10"
                        :model-value="filters.company"
                        @update:model-value="(value) => updateFilter('company', value)"
                      />
                    </div>
                  </div>

                  <!-- Location -->
                  <div>
                    <label class="form-label">Location</label>
                    <Select position="popper" :model-value="filters.location" @update:model-value="(value) => updateFilter('location', value)">
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem v-for="location in getUniqueLocations().slice(0, 15)" :key="location" :value="location">
                          {{ location }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Industry -->
                  <div>
                    <label class="form-label">Industry</label>
                    <Select :model-value="filters.industry" @update:model-value="(value) => updateFilter('industry', value)">
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem v-for="industry in getUniqueIndustries()" :key="industry" :value="industry">
                          {{ industry }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Job Type -->
                  <div>
                    <label class="form-label">Job Type</label>
                    <Select :model-value="filters.jobType" @update:model-value="(value) => updateFilter('jobType', value)">
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="All Job Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Job Types</SelectItem>
                        <SelectItem v-for="jobType in getUniqueJobTypes()" :key="jobType" :value="jobType">
                          {{ jobType }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Action Buttons -->
                  <div class="space-y-3">
                    <Button class="w-full bg-green-600 hover:bg-green-700" @click="applyFilters">
                      <Icon name="lucide:search" class="mr-2 h-4 w-4" />
                      Show Results ({{ filteredJobs.length }})
                    </Button>
                    <Button v-if="hasActiveFilters" variant="outline" class="w-full" @click="clearFilters">
                      <Icon name="lucide:x" class="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <!-- Desktop Sidebar Filters -->
          <aside class="hidden lg:block lg:col-span-1">
            <Card class="sticky top-28">
              <CardContent class="space-y-6">
                <!-- Job Title Search -->
                <div>
                  <label class="form-label">Job Title</label>
                  <div class="relative">
                    <Icon name="lucide:search" class="input-icon" />
                    <Input
                      type="text"
                      placeholder="Search job title..."
                      class="pl-10"
                      :model-value="filters.title"
                      @update:model-value="(value) => updateFilter('title', value)"
                    />
                  </div>
                </div>

                <!-- Organization Search -->
                <div>
                  <label class="form-label">Organization</label>
                  <div class="relative">
                    <Icon name="lucide:building-2" class="input-icon" />
                    <Input
                      type="text"
                      placeholder="Search organization..."
                      class="pl-10"
                      :model-value="filters.company"
                      @update:model-value="(value) => updateFilter('company', value)"
                    />
                  </div>
                </div>

                <!-- Location -->
                <div>
                  <label class="form-label">Location</label>
                  <Select :model-value="filters.location" @update:model-value="(value) => updateFilter('location', value)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem v-for="location in getUniqueLocations().slice(0, 15)" :key="location" :value="location">
                        {{ location }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Industry -->
                <div>
                  <label class="form-label">Industry</label>
                  <Select :model-value="filters.industry" @update:model-value="(value) => updateFilter('industry', value)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem v-for="industry in getUniqueIndustries()" :key="industry" :value="industry">
                        {{ industry }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Job Type -->
                <div>
                  <label class="form-label">Job Type</label>
                  <Select :model-value="filters.jobType" @update:model-value="(value) => updateFilter('jobType', value)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="All Job Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Job Types</SelectItem>
                      <SelectItem v-for="jobType in getUniqueJobTypes()" :key="jobType" :value="jobType">
                        {{ jobType }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                  <Button v-if="hasActiveFilters" variant="outline" class="w-full" @click="clearFilters">
                    <Icon name="lucide:x" class="size-4" />
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          <!-- Main Results -->
          <main class="col-span-1 lg:col-span-3">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-12">
              <Icon name="lucide:loader-2" class="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p class="text-gray-600">Loading job opportunities...</p>
            </div>

            <!-- No Results -->
            <div v-else-if="filteredJobs.length === 0" class="text-center py-12">
              <Icon name="lucide:search-x" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p class="text-gray-600 mb-4">Try adjusting your search criteria or clear all filters</p>
              <Button variant="outline" @click="clearFilters">
                <Icon name="lucide:refresh-cw" class="mr-2 h-4 w-4" />
                Clear all filters
              </Button>
            </div>

            <!-- Job Cards Grid -->
            <div v-else>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <Card
                  v-for="job in paginatedJobs"
                  :key="job.id"
                  class="py-0 hover:shadow! hover:-translate-y-1 cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col"
                  @click="selectAndNavigate(job)"
                >
                  <CardContent class="px-3 flex-1 flex">
                    <div class="flex w-full relative">
                      <!-- Company Logo -->
                      <div class="h-full px-4 flex items-center justify-center flex-shrink-0 rounded-l-lg">
                        <div class="h-28 rounded-2xl overflow-hidden">
                          <img
                            v-if="job.company?.logo_url"
                            :src="job.company.logo_url"
                            :alt="`${job.company?.name || 'Company'} logo`"
                            class="w-full h-full object-contain"
                            loading="lazy"
                            @error="$event.target.style.display = 'none'"
                          />
                          <div v-else class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Icon name="lucide:building-2" class="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <!-- Content -->
                      <div class="flex-1 p-4 pl-2 flex flex-col justify-between min-h-[120px] min-w-0 overflow-hidden">
                        <!-- Top Section -->
                        <div class="space-y-2 min-w-0">
                          <!-- Job Title -->
                          <h3 class="font-bold text-gray-900 line-clamp-2">
                            {{ job.title }}
                          </h3>

                          <!-- Company Name -->
                          <p class="text-gray-600 text-sm line-clamp-1">
                            {{ job.company?.name }}
                          </p>

                          <Badge v-if="job.company?.industry" class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2">
                            {{ job.company.industry }}
                          </Badge>
                        </div>

                        <!-- Bottom Section - Meta Information -->
                        <div class="flex gap-2 text-gray-500 text-sm mt-auto">
                          <div class="flex items-center min-w-0 flex-shrink-0">
                            <Icon name="lucide:calendar" class="size-4 mr-2 flex-shrink-0" />
                            <span class="text-xs whitespace-nowrap">{{ job.relativePostedDate || 'N/A' }}</span>
                          </div>
                          <div class="flex items-center min-w-0 flex-1">
                            <Icon name="lucide:map-pin" class="size-4 mr-2 flex-shrink-0" />
                            <span class="line-clamp-1 text-xs">
                              {{
                                [job.location?.city, job.location?.region, job.location?.country].filter(Boolean).join(', ') ||
                                'Location not specified'
                              }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="hidden sm:block text-sm text-gray-600 text-center">Showing {{ filteredJobs.length }} results</div>
                <nav class="flex items-center justify-center space-x-2">
                  <!-- Previous Button -->
                  <Button variant="outline" size="sm" :disabled="currentPage === 1" @click="prevPage()">
                    <Icon name="lucide:chevron-left" class="h-4 w-4" />
                    Previous
                  </Button>

                  <!-- Page Numbers -->
                  <Button
                    v-for="page in Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + Math.max(1, currentPage - 2))"
                    :key="page"
                    :variant="page === currentPage ? 'default' : 'outline'"
                    size="sm"
                    :class="['border-none', page === currentPage ? 'bg-[#0a5c5b] hover:bg-[#095351] text-white' : '']"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </Button>

                  <!-- Next Button -->
                  <Button variant="outline" size="sm" :disabled="currentPage === totalPages" @click="nextPage()">
                    Next
                    <Icon name="lucide:chevron-right" class="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.4;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.4;
  max-height: 2.8em; /* 2 lines * 1.4 line-height */
}
</style>
