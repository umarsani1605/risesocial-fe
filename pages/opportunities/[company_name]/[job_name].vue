<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobsStore } from '~/store/jobs';
import { storeToRefs } from 'pinia';
import { useAPI } from '@/composables/useAPI';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Get route params
const route = useRoute();
const companyName = route.params.company_name;
const jobName = route.params.job_name;

// Jobs store
const jobsStore = useJobsStore();
const {
  /* expose refs if needed */
} = storeToRefs(jobsStore);

// Fetch job data using useAPI composable
const {
  data: jobData,
  pending: isLoading,
  error: jobError,
} = await useAPI('/jobs', {
  key: `job-${companyName}-${jobName}`,
  query: {
    companySlug: companyName,
    jobSlug: jobName,
    limit: 1,
  },
  transform: (response) => {
    return response.data?.[0] || null;
  },
});

// Handle 404 if job not found
if (jobError.value || !jobData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Job not found',
  });
}

// Use job data directly
const job = jobData;

// Meta tags - Updated for rich data structure
useHead({
  title: computed(() => `${job.value?.title || 'Job'} - ${job.value?.company?.name || 'Company'} | Rise Social`),
});

// Fetch similar jobs using useAPI
const { data: similarJobsData, pending: similarJobsLoading } = await useAPI('/jobs', {
  key: `similar-jobs-${companyName}-${jobName}`,
  query: {
    companySlug: companyName,
    limit: 4,
  },
  transform: (response) => {
    // Filter out current job from similar jobs
    return response.data?.filter((j) => j.slug !== jobName) || [];
  },
});

// Use similar jobs data directly
const similarJobs = similarJobsData;

// Simple location display
const locationString = computed(() => {
  const loc = job.value?.location;
  if (!loc) return 'Location not specified';

  return [loc.city, loc.region, loc.country].filter(Boolean).join(', ') || 'Location not specified';
});

// Parse job description for structured sections
const parsedDescription = computed(() => {
  if (!job.value?.description) return { sections: [] };

  const text = job.value.description;
  const sections = [];

  // Split by common section headers
  const sectionHeaders = [
    'Job Description',
    'Responsibilities',
    'Requirements',
    'Qualifications',
    'Skills',
    'Benefits',
    'What We Offer',
    'About the Role',
    'Key Responsibilities',
    'Required Skills',
    'Nice to Have',
  ];

  let currentSection = { title: 'Overview', content: '' };
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if this line is a section header
    const isHeader = sectionHeaders.some((header) => trimmedLine.toLowerCase().includes(header.toLowerCase()));

    if (isHeader) {
      // Save previous section if it has content
      if (currentSection.content.trim()) {
        sections.push(currentSection);
      }
      // Start new section
      currentSection = { title: trimmedLine, content: '' };
    } else {
      // Add to current section
      currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
    }
  }

  // Add the last section
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }

  return { sections };
});

// Computed properties for filtered sections
const responsibilitiesSections = computed(() => {
  return parsedDescription.value.sections.filter((section) => section.title === 'Responsibilities' || section.title === 'Key Responsibilities');
});

const requirementsSections = computed(() => {
  return parsedDescription.value.sections.filter(
    (section) => section.title === 'Requirements' || section.title === 'Required Skills' || section.title === 'Nice to Have'
  );
});

// Function to handle apply button click
const handleApply = () => {
  if (job.value?.external_url) {
    window.open(job.value.external_url, '_blank');
  }
};
</script>

<template>
  <div class="min-h-screen">
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>

    <div v-else class="bg-gray-50 pt-16">
      <div class="container-wrapper py-6 lg:py-8">
        <div class="my-2 hidden lg:block">
          <Button variant="ghost" @click="$router.push('/opportunities')" class="text-gray-600 hover:text-gray-900">
            <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
            Back to Job Opportunities
          </Button>
        </div>
        <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8">
          <!-- Main Job Content - Order 1 on all screens -->
          <div class="lg:col-span-2 order-1">
            <Card>
              <CardContent>
                <!-- Job Header -->
                <div class="mb-6">
                  <div v-if="job.company?.logo_url" class="lg:hidden h-28 w-fit rounded-lg overflow-hidden mb-4">
                    <NuxtImg
                      :src="job.company.logo_url"
                      :alt="`${job.company?.name || 'Company'} logo`"
                      class="size-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Badge v-if="job.company?.industry" class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2">
                      {{ job.company.industry }}
                    </Badge>
                    <Badge class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2 capitalize">
                      {{ job?.employment_type?.toLowerCase().replace('_', ' ') || 'Full Time' }}
                    </Badge>
                  </div>

                  <div class="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ job?.title }}</h1>
                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-wrap">
                      <Button variant="outline" class="flex items-center">
                        <Icon name="lucide:bookmark" class="size-4" />
                        Save
                      </Button>
                      <Button @click="handleApply">
                        <Icon name="lucide:send" class="size-4" />
                        Apply Now
                      </Button>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-4 lg:gap-6 text-gray-600 mb-6">
                    <div class="flex items-center">
                      <Icon name="lucide:calendar" class="mr-2 h-4 w-4 flex-shrink-0" />
                      <span class="text-sm whitespace-nowrap">{{ job?.relativePostedDate }}</span>
                    </div>
                    <div class="flex items-center">
                      <Icon name="lucide:map-pin" class="mr-2 h-4 w-4 flex-shrink-0" />
                      <span class="text-sm">{{ locationString }}</span>
                    </div>
                  </div>
                </div>

                <!-- Job Description -->
                <div class="mb-8">
                  <h2 class="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                  <div class="text-gray-700 leading-relaxed whitespace-pre-line">
                    {{ job?.description }}
                  </div>
                </div>

                <!-- Responsibilities -->
                <div class="mb-8" v-if="responsibilitiesSections.length > 0">
                  <h2 class="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                  <ul class="space-y-3">
                    <li v-for="(section, index) in responsibilitiesSections" :key="index">
                      <p class="text-gray-700">{{ section.content }}</p>
                    </li>
                  </ul>
                </div>

                <!-- Requirements -->
                <div class="mb-8" v-if="requirementsSections.length > 0">
                  <h2 class="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <ul class="space-y-3">
                    <li v-for="(section, index) in requirementsSections" :key="index">
                      <p class="text-gray-700">{{ section.content }}</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Company Info - Order 2 on mobile, normal position on desktop -->
          <div class="lg:col-span-1 order-2 lg:order-2">
            <Card>
              <CardContent class="p-6">
                <!-- Company Logo & Info - Backend structure -->
                <div class="mb-6 space-y-4">
                  <div v-if="job.company?.logo_url" class="size-24 rounded-lg overflow-hidden">
                    <NuxtImg
                      :src="job.company.logo_url"
                      :alt="`${job.company?.name || 'Company'} logo`"
                      class="size-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <Icon v-else name="lucide:building-2" class="size-8 text-orange-500" />
                  <h3 class="font-bold text-gray-900 text-lg">{{ job.company?.name }}</h3>
                </div>

                <!-- Company Details - Backend structure -->
                <div class="space-y-4 mb-6">
                  <div class="flex items-center text-gray-600">
                    <Icon name="lucide:map-pin" class="mr-3 h-4 w-4 flex-shrink-0" />
                    <span class="text-sm">{{ locationString }}</span>
                  </div>

                  <div v-if="job.company?.linkedin_size" class="flex items-center text-gray-600">
                    <Icon name="lucide:users" class="mr-3 h-4 w-4 flex-shrink-0" />
                    <span class="text-sm">{{ job.company.linkedin_size }}</span>
                  </div>

                  <div v-if="job.company?.industry" class="flex items-center text-gray-600">
                    <Icon name="lucide:briefcase" class="mr-3 h-4 w-4 flex-shrink-0" />
                    <span class="text-sm">{{ job.company.industry }}</span>
                  </div>

                  <div v-if="job.company?.website_url" class="flex items-center text-gray-600">
                    <Icon name="lucide:globe" class="mr-3 h-4 w-4 flex-shrink-0" />
                    <a :href="job.company.website_url" target="_blank" class="text-sm text-blue-600 hover:underline"> Visit Website </a>
                  </div>
                </div>

                <!-- About -->
                <div v-if="job.company?.description" class="mb-6">
                  <h4 class="font-semibold text-gray-900 mb-3">About</h4>
                  <p class="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {{ job.company.description }}
                  </p>
                </div>

                <!-- Company Profile Button -->
                <NuxtLink :to="`/opportunities/${job.company?.slug}`">
                  <Button variant="outline" class="w-full"> View Company Profile </Button>
                </NuxtLink>
              </CardContent>
            </Card>
          </div>

          <!-- Similar Jobs - Order 3 on mobile, spans full width on mobile -->
          <div class="lg:col-span-2 order-3">
            <div v-if="similarJobsLoading" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
            <div v-else-if="similarJobs && similarJobs.length > 0">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Similar Jobs</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card
                  v-for="similarJob in similarJobs"
                  :key="similarJob.id"
                  class="hover:shadow-lg cursor-pointer transition-shadow duration-300"
                  @click="$router.push(`/opportunities/${similarJob.company.slug}/${similarJob.slug}`)"
                >
                  <CardContent class="p-4">
                    <div class="flex items-start space-x-3">
                      <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div v-if="similarJob.company?.logo_url" class="w-8 h-8 rounded overflow-hidden">
                          <NuxtImg
                            :src="similarJob.company.logo_url"
                            :alt="`${similarJob.company.name} logo`"
                            class="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <Icon v-else name="lucide:building-2" class="w-6 h-6 text-orange-500" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <h3 class="font-semibold text-gray-900 text-sm line-clamp-1">{{ similarJob.title }}</h3>
                        <p class="text-gray-600 text-xs line-clamp-1">{{ similarJob.company.name }}</p>
                        <p class="text-gray-500 text-xs mt-1">
                          {{
                            [similarJob.location?.city, similarJob.location?.region, similarJob.location?.country].filter(Boolean).join(', ') ||
                            'Location not specified'
                          }}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div class="text-center">
                <Button variant="outline">See All</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
</style>
