<script setup>
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useJobsStore } from '@/store/jobs';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Job Opportunities - Rise Social',
  meta: [{ name: 'description', content: 'Find your dream green job from thousands of opportunities available' }],
});

// Initialize jobs store
const jobsStore = useJobsStore();

// Filter drawer state
const isFilterOpen = ref(false);

// Initialize jobs data on mount
onMounted(async () => {
  await jobsStore.initializeJobs();
});

// Helper functions for pagination
const goToPage = (page) => {
  jobsStore.setCurrentPage(page);
  // Scroll to top when changing pages
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const applyFilters = () => {
  isFilterOpen.value = false;
};

const clearFilters = () => {
  jobsStore.clearAllFilters();
};

// Watch for meta tag updates
watch(
  () => jobsStore.filteredJobs,
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
                  <Badge v-if="jobsStore.hasActiveFilters" class="ml-2 bg-orange-500 text-white"> Active </Badge>
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
                        :model-value="jobsStore.filters.title"
                        @update:model-value="(value) => jobsStore.updateFilter('title', value)"
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
                        :model-value="jobsStore.filters.organization"
                        @update:model-value="(value) => jobsStore.updateFilter('organization', value)"
                      />
                    </div>
                  </div>

                  <!-- Location -->
                  <div>
                    <label class="form-label">Location</label>
                    <Select :model-value="jobsStore.filters.location" @update:model-value="(value) => jobsStore.updateFilter('location', value)">
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem v-for="location in jobsStore.uniqueLocations.slice(0, 15)" :key="location" :value="location">
                          {{ location }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Industry -->
                  <div>
                    <label class="form-label">Industry</label>
                    <Select :model-value="jobsStore.filters.industry" @update:model-value="(value) => jobsStore.updateFilter('industry', value)">
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem v-for="industry in jobsStore.uniqueIndustries" :key="industry" :value="industry">
                          {{ industry }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Job Type -->
                  <div>
                    <label class="form-label">Job Type</label>
                    <Select :model-value="jobsStore.filters.jobType" @update:model-value="(value) => jobsStore.updateFilter('jobType', value)">
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="All Job Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Job Types</SelectItem>
                        <SelectItem v-for="jobType in jobsStore.uniqueJobTypes" :key="jobType" :value="jobType">
                          {{ jobType }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Action Buttons -->
                  <div class="space-y-3">
                    <Button class="w-full bg-green-600 hover:bg-green-700" @click="applyFilters">
                      <Icon name="lucide:search" class="mr-2 h-4 w-4" />
                      Show Results ({{ jobsStore.filteredJobs.length }})
                    </Button>
                    <Button variant="outline" class="w-full" @click="clearFilters">
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
                      :model-value="jobsStore.filters.title"
                      @update:model-value="(value) => jobsStore.updateFilter('title', value)"
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
                      :model-value="jobsStore.filters.organization"
                      @update:model-value="(value) => jobsStore.updateFilter('organization', value)"
                    />
                  </div>
                </div>

                <!-- Location -->
                <div>
                  <label class="form-label">Location</label>
                  <Select :model-value="jobsStore.filters.location" @update:model-value="(value) => jobsStore.updateFilter('location', value)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem v-for="location in jobsStore.uniqueLocations.slice(0, 15)" :key="location" :value="location">
                        {{ location }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Industry -->
                <div>
                  <label class="form-label">Industry</label>
                  <Select :model-value="jobsStore.filters.industry" @update:model-value="(value) => jobsStore.updateFilter('industry', value)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem v-for="industry in jobsStore.uniqueIndustries" :key="industry" :value="industry">
                        {{ industry }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Job Type -->
                <div>
                  <label class="form-label">Job Type</label>
                  <Select :model-value="jobsStore.filters.jobType" @update:model-value="(value) => jobsStore.updateFilter('jobType', value)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="All Job Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Job Types</SelectItem>
                      <SelectItem v-for="jobType in jobsStore.uniqueJobTypes" :key="jobType" :value="jobType">
                        {{ jobType }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                  <div class="text-sm text-gray-600 text-center">Showing {{ jobsStore.filteredJobs.length }} results</div>
                  <Button variant="outline" class="w-full" @click="clearFilters">
                    <Icon name="lucide:x" class="mr-2 h-4 w-4" />
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          <!-- Main Results -->
          <main class="col-span-1 lg:col-span-3">
            <!-- Loading State -->
            <div v-if="jobsStore.isLoading" class="text-center py-12">
              <Icon name="lucide:loader-2" class="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p class="text-gray-600">Loading job opportunities...</p>
            </div>

            <!-- No Results -->
            <div v-else-if="jobsStore.filteredJobs.length === 0" class="text-center py-12">
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
                  v-for="job in jobsStore.paginatedJobs"
                  :key="job.id"
                  class="py-0 hover:shadow! hover:-translate-y-1 cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col"
                  @click="$router.push(`/opportunities/${job.companySlug}/${job.jobSlug}`)"
                >
                  <CardContent class="px-3 flex-1 flex">
                    <div class="flex w-full relative">
                      <!-- Company Logo -->
                      <div class="h-full p-4 flex items-center justify-center flex-shrink-0 rounded-l-lg">
                        <div class="h-28 rounded-2xl overflow-hidden">
                          <img
                            :src="job.organization_logo"
                            :alt="`${job.organization} logo`"
                            class="w-full h-full object-contain"
                            @error="$event.target.style.display = 'none'"
                          />
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
                            {{ job.organization }}
                          </p>

                          <Badge v-if="job.linkedin_org_industry" class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2">
                            {{ job.linkedin_org_industry }}
                          </Badge>
                        </div>

                        <!-- Bottom Section - Meta Information -->
                        <div class="flex gap-2 text-gray-500 text-sm mt-auto">
                          <div class="flex items-center min-w-0 flex-shrink-0">
                            <Icon name="lucide:calendar" class="size-4 mr-2 flex-shrink-0" />
                            <span class="text-xs whitespace-nowrap">{{ job.relativeTime }}</span>
                          </div>
                          <div class="flex items-center min-w-0 flex-1">
                            <Icon name="lucide:map-pin" class="size-4 mr-2 flex-shrink-0" />
                            <span class="line-clamp-1 text-xs">{{ job.cleanLocation }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Pagination -->
              <div v-if="jobsStore.totalPages > 1" class="flex justify-center">
                <nav class="flex items-center space-x-2">
                  <!-- Previous Button -->
                  <Button variant="outline" size="sm" :disabled="jobsStore.currentPage === 1" @click="jobsStore.prevPage()">
                    <Icon name="lucide:chevron-left" class="h-4 w-4" />
                    Previous
                  </Button>

                  <!-- Page Numbers -->
                  <Button
                    v-for="page in jobsStore.visiblePages"
                    :key="page"
                    :variant="page === jobsStore.currentPage ? 'default' : 'outline'"
                    size="sm"
                    :class="page === jobsStore.currentPage ? 'bg-green-600 hover:bg-green-700 text-white' : ''"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </Button>

                  <!-- Next Button -->
                  <Button variant="outline" size="sm" :disabled="jobsStore.currentPage === jobsStore.totalPages" @click="jobsStore.nextPage()">
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
