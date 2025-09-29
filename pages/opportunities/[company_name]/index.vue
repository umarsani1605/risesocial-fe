<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAPI } from '@/composables/useAPI';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Get route params
const route = useRoute();
const companyName = route.params.company_name;

// Fetch company data using useAPI composable
const {
  data: companyData,
  pending: companyLoading,
  error: companyError,
} = await useAPI('/jobs/company', {
  key: `company-${companyName}`,
  query: {
    slug: companyName,
    limit: 1,
  },
  transform: (response) => {
    return response.data?.[0] || null;
  },
});

// Handle 404 if company not found
if (companyError.value || !companyData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Company not found',
  });
}

// Use company data directly
const company = companyData;

// Fetch company jobs using useAPI composable
const {
  data: jobsData,
  pending: jobsLoading,
  error: jobsError,
} = await useAPI('/jobs', {
  key: `company-jobs-${companyName}`,
  query: {
    companySlug: companyName,
    limit: 50,
  },
  transform: (response) => {
    return response.data || [];
  },
});

// Use jobs data directly
const companyJobs = jobsData;

// Combined loading state
const isLoading = computed(() => companyLoading.value || jobsLoading.value);

// Meta tags
useHead({
  title: computed(() => {
    const name = company.value?.name || 'Company';
    return `${name} - Jobs | Rise Social`;
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const name = company.value?.name || 'this company';
        const industry = company.value?.industry || '';
        return `Explore career opportunities at ${name}${industry ? ` in ${industry}` : ''}.`;
      }),
    },
  ],
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen mt-16">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>

    <!-- Content -->
    <div v-else class="container-wrapper py-6 lg:py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <Button variant="ghost" @click="$router.push('/opportunities')" class="text-gray-600 hover:text-gray-900">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Back to Job Opportunities
        </Button>
      </div>

      <!-- Company Header -->
      <Card class="mb-4">
        <CardContent class="p-6 lg:p-8">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Company Logo -->
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-full size-24 rounded-lg overflow-hidden">
                <div v-if="company?.logo_url" class="flex items-center w-full size-24 rounded-lg overflow-hidden">
                  <NuxtImg :src="company.logo_url" :alt="`${company.name} logo`" class="w-full h-full object-contain" loading="lazy" />
                </div>
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                  <Icon name="lucide:building-2" class="size-8 text-orange-500" />
                </div>
              </div>
            </div>

            <!-- Company Info -->
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ company?.name || 'Company' }}</h1>

              <!-- Company Tags -->
              <div class="flex flex-wrap gap-4 mb-4">
                <div v-if="company?.industry" class="flex items-center text-gray-600">
                  <Icon name="lucide:building" class="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span><span class="font-medium">Industry:</span> {{ company.industry }}</span>
                </div>
                <div v-if="company?.linkedin_size" class="flex items-center text-gray-600">
                  <Icon name="lucide:users" class="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span><span class="font-medium">Size:</span> {{ company.linkedin_size }}</span>
                </div>
                <div v-if="company?.headquarters" class="flex items-center text-gray-600">
                  <Icon name="lucide:map-pin" class="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span><span class="font-medium">HQ:</span> {{ company.headquarters }}</span>
                </div>
                <div v-if="company?.linkedin_founded_date" class="flex items-center text-gray-600">
                  <Icon name="lucide:calendar" class="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span><span class="font-medium">Founded:</span> {{ company.linkedin_founded_date }}</span>
                </div>
                <div v-if="company?.website_url" class="inline-flex items-center">
                  <Icon name="lucide:globe" class="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span class="font-medium text-gray-600"
                    >Website: <a :href="company.website_url" target="_blank" class="text-primary"> {{ company.website_url }}</a></span
                  >
                </div>
                <div v-if="company?.linkedin_url" class="inline-flex items-center">
                  <Icon name="lucide:linkedin" class="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span class="font-medium text-gray-600"
                    >LinkedIn: <a :href="company.linkedin_url" target="_blank" class="text-primary"> {{ company.linkedin_url }}</a></span
                  >
                </div>
              </div>

              <!-- Company Description -->
              <div v-if="company?.description" class="mt-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">About Us</h3>
                <p class="text-gray-700 whitespace-pre-line">{{ company.description }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Jobs Section -->
      <Card>
        <CardContent class="p-6 lg:p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Available Positions ({{ companyJobs.length }})</h2>
          </div>

          <!-- Jobs Grid -->
          <div v-if="companyJobs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              v-for="job in companyJobs"
              :key="job.id"
              class="py-0 hover:shadow! hover:-translate-y-1 cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col"
              @click="
                $router.push(
                  `/opportunities/${job.company?.slug || job.company?.name?.toLowerCase().replace(/\s+/g, '-')}/${
                    job.slug || job.title?.toLowerCase().replace(/\s+/g, '-')
                  }`
                )
              "
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

                      <Badge v-if="job.employment_type" class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2">
                        {{ job.employment_type.replace('_', ' ') }}
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
                            [job.location?.city, job.location?.region, job.location?.country].filter(Boolean).join(', ') || 'Location not specified'
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- No Jobs Found -->
          <div v-else class="text-center py-12">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Icon name="lucide:briefcase" class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No open positions</h3>
            <p class="mt-1 text-gray-500">There are currently no open positions at this company.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
</style>
