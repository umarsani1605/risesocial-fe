<script setup lang="ts">
import type { Job } from '@/types'

definePageMeta({
  layout: 'default'
})

const {
  appliedFilters,
  pendingFilters,
  hasActiveFilters,
  applyFilters,
  clearAllFilters,
  goToPage
} = useJobFilters()

const { api } = useApi()

const {
  data: rawResult,
  refresh,
  status
} = await useAsyncData('jobs', () =>
  api<PaginatedResponse<Job>>('/jobs', {
    params: {
      search: appliedFilters.search || undefined,
      location: appliedFilters.location || undefined,
      company: appliedFilters.company || undefined,
      jobType: appliedFilters.jobType || undefined,
      experienceLevel: appliedFilters.experienceLevel || undefined,
      isRemote: appliedFilters.isRemote || undefined,
      page: appliedFilters.page,
      limit: appliedFilters.limit
    }
  })
)

const jobsResult = computed(() => ({
  data: rawResult.value?.data ?? [],
  meta: {
    page: rawResult.value?.meta?.page ?? 1,
    limit: rawResult.value?.meta?.limit ?? 12,
    total: rawResult.value?.meta?.total ?? 0,
    totalPages: rawResult.value?.meta?.totalPages ?? 0
  }
}))

const isLoading = computed(() => status.value === 'pending')
const isFilterOpen = ref(false)

const handleApplyFilters = (closeDrawer = false) => {
  applyFilters(() => {
    refresh()
    if (closeDrawer) isFilterOpen.value = false
  })
}

const handleClearFilters = () => clearAllFilters(() => refresh())

const handleGoToPage = (page: number) => {
  goToPage(page, jobsResult.value.meta.totalPages, () => refresh())
}

const locationOptions = [
  { label: 'All Locations', value: '' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Jakarta', value: 'Jakarta' },
  { label: 'Bandung', value: 'Bandung' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Australia', value: 'Australia' },
  { label: 'United States', value: 'United States' }
]

const jobTypeOptionsWithAll = [{ label: 'All Types', value: '' }, ...jobTypeOptions]
const experienceLevelOptionsWithAll = [{ label: 'All Levels', value: '' }, ...experienceLevelOptions]

useSeoMeta({
  title: computed(() => {
    if (hasActiveFilters.value) {
      return `${appliedFilters.search || 'Jobs'} - Job Opportunities | Rise Social`
    }
    return 'Job Opportunities - Rise Social'
  }),
  description: computed(
    () => `Find your dream green job from ${jobsResult.value.meta.total} opportunities available at Rise Social`
  )
})
</script>

<template>
  <UPageSection>
    <div class="text-center mb-8 lg:mb-12">
      <h1 class="text-3xl sm:text-4xl font-bold mb-4">Job Opportunities</h1>
      <p class="text-lg text-muted max-w-3xl mx-auto">
        Discover green career opportunities that match your passion and expertise
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      <!-- Mobile: drawer trigger -->
      <div class="lg:hidden">
        <UButton variant="outline" block @click="isFilterOpen = true">
          <UIcon name="i-lucide-filter" class="size-4 mr-2" />
          Show Filters
          <UBadge v-if="hasActiveFilters" color="primary" class="ml-2">Active</UBadge>
        </UButton>

        <UDrawer v-model:open="isFilterOpen" side="left">
          <div class="p-6 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Filter Jobs</h3>
              <UButton variant="ghost" size="sm" square @click="isFilterOpen = false">
                <UIcon name="i-lucide-x" class="size-5" />
              </UButton>
            </div>

            <UFormField label="Search">
              <UInput
                v-model="pendingFilters.search"
                placeholder="Job title, company..."
                icon="i-lucide-search"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Location">
              <USelectMenu
                v-model="pendingFilters.location"
                value-key="value"
                :items="locationOptions"
                placeholder="All Locations"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Job Type">
              <USelectMenu
                v-model="pendingFilters.jobType"
                value-key="value"
                :items="jobTypeOptionsWithAll"
                placeholder="All Types"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Experience Level">
              <USelectMenu
                v-model="pendingFilters.experienceLevel"
                value-key="value"
                :items="experienceLevelOptionsWithAll"
                placeholder="All Levels"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Company">
              <UInput
                v-model="pendingFilters.company"
                placeholder="Company name..."
                icon="i-lucide-building-2"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Remote Only">
              <UToggle v-model="pendingFilters.isRemote" />
            </UFormField>

            <div class="space-y-3 pt-2">
              <UButton color="primary" block @click="handleApplyFilters(true)">
                <UIcon name="i-lucide-search" class="mr-2 size-4" />
                Apply Filters
              </UButton>
              <UButton v-if="hasActiveFilters" variant="outline" block @click="handleClearFilters">
                <UIcon name="i-lucide-x" class="mr-2 size-4" />
                Clear All
              </UButton>
            </div>
          </div>
        </UDrawer>
      </div>

      <!-- Desktop: sticky sidebar -->
      <div class="hidden lg:block lg:col-span-1">
        <UCard class="sticky top-28">
          <div class="space-y-5">
            <UFormField label="Search">
              <UInput
                v-model="pendingFilters.search"
                placeholder="Job title, company..."
                icon="i-lucide-search"
                class="w-full"
                @keyup.enter="handleApplyFilters()"
              />
            </UFormField>

            <UFormField label="Location">
              <USelectMenu
                v-model="pendingFilters.location"
                value-key="value"
                :items="locationOptions"
                placeholder="All Locations"
                :search-input="{ placeholder: 'Search location...' }"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Job Type">
              <USelectMenu
                v-model="pendingFilters.jobType"
                value-key="value"
                :items="jobTypeOptionsWithAll"
                placeholder="All Types"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Experience Level">
              <USelectMenu
                v-model="pendingFilters.experienceLevel"
                value-key="value"
                :items="experienceLevelOptionsWithAll"
                placeholder="All Levels"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Company">
              <UInput
                v-model="pendingFilters.company"
                placeholder="Company name..."
                icon="i-lucide-building-2"
                class="w-full"
                @keyup.enter="handleApplyFilters()"
              />
            </UFormField>

            <UFormField label="Remote Only">
              <div class="flex items-center gap-2">
                <UToggle v-model="pendingFilters.isRemote" />
                <span class="text-sm text-muted">Show remote jobs only</span>
              </div>
            </UFormField>

            <UButton icon="i-lucide-search" block @click="handleApplyFilters()">
              Search Jobs
            </UButton>

            <UButton v-if="hasActiveFilters" variant="outline" block @click="handleClearFilters">
              <UIcon name="i-lucide-x" class="size-4 mr-2" />
              Clear All Filters
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Job list -->
      <div class="col-span-1 lg:col-span-3">
        <div v-if="isLoading" class="text-center py-12">
          <UIcon name="i-lucide-loader-2" class="size-8 text-muted mx-auto mb-4 animate-spin" />
          <p class="text-muted">Loading job opportunities...</p>
        </div>

        <div v-else-if="jobsResult.data.length === 0" class="text-center py-12">
          <UIcon name="i-lucide-search-x" class="size-16 text-muted mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2">No jobs found</h3>
          <p class="text-muted mb-4">Try adjusting your search criteria or clear all filters</p>
          <UButton variant="outline" @click="handleClearFilters">
            <UIcon name="i-lucide-refresh-cw" class="mr-2 size-4" />
            Clear all filters
          </UButton>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <SharedJobCard v-for="job in jobsResult.data" :key="job.id" :job="job" />
          </div>

          <div
            v-if="jobsResult.meta.totalPages > 1"
            class="flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <p class="text-sm text-muted">
              Page {{ jobsResult.meta.page }} of {{ jobsResult.meta.totalPages }}
            </p>
            <UPagination
              v-model="appliedFilters.page"
              :total="jobsResult.meta.total"
              :page-count="jobsResult.meta.limit"
              @update:model-value="handleGoToPage"
            />
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
