<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import jobsData from '@/data/jobs.json';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Get route params
const route = useRoute();
const companyName = route.params.company_name;
const jobName = route.params.job_name;

// Function to normalize company name for URL
const normalizeCompanyName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .trim();
};

// Function to normalize job name for URL
const normalizeJobName = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .trim();
};

// Find job by matching company name and job title
const job = computed(() => {
  return jobsData.find((j) => {
    const normalizedOrgName = normalizeCompanyName(j.organization);
    const normalizedJobTitle = normalizeJobName(j.title);
    return normalizedOrgName === companyName && normalizedJobTitle === jobName;
  });
});

// If job not found, redirect to 404
if (!job.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Job not found',
  });
}

// Meta tags
useHead({
  title: `${job.value.title} - ${job.value.organization} | Rise Social`,
  meta: [
    {
      name: 'description',
      content: `${job.value.title} position at ${job.value.organization}. Apply now for this exciting opportunity.`,
    },
  ],
});

// Function to convert date to relative time
const getRelativeTime = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now - postDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1d ago';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 14) return '1w ago';
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 60) return '1mo ago';
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  return `${Math.floor(diffInDays / 365)}y ago`;
};

// Function to get clean location
const getCleanLocation = (job) => {
  if (job.cities_derived && job.cities_derived.length > 0 && job.countries_derived && job.countries_derived.length > 0) {
    return `${job.cities_derived[0]}, ${job.countries_derived[0]}`;
  }
  if (job.countries_derived && job.countries_derived.length > 0) {
    return job.countries_derived[0];
  }
  return 'Remote';
};

// Get similar jobs (same industry, different job)
const similarJobs = computed(() => {
  return jobsData
    .filter((j) => j.id !== job.value.id && j.linkedin_org_industry === job.value.linkedin_org_industry)
    .slice(0, 4)
    .map((j) => ({
      ...j,
      cleanLocation: getCleanLocation(j),
      relativeTime: getRelativeTime(j.date_posted),
      companySlug: normalizeCompanyName(j.organization),
      jobSlug: normalizeJobName(j.title),
    }));
});

// Parse job description for structured sections
const parseJobDescription = (description) => {
  if (!description) return { overview: '', responsibilities: [], requirements: [] };

  const lines = description.split('\n').filter((line) => line.trim());
  let currentSection = 'overview';
  let overview = '';
  let responsibilities = [];
  let requirements = [];

  for (let line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.toLowerCase().includes('responsibilities') || trimmedLine.toLowerCase().includes('job description')) {
      currentSection = 'responsibilities';
      continue;
    }

    if (
      trimmedLine.toLowerCase().includes('requirements') ||
      trimmedLine.toLowerCase().includes('requirement') ||
      trimmedLine.toLowerCase().includes('qualification')
    ) {
      currentSection = 'requirements';
      continue;
    }

    if (currentSection === 'overview' && overview.length < 500) {
      overview += trimmedLine + ' ';
    } else if (currentSection === 'responsibilities') {
      if (trimmedLine.length > 10) {
        responsibilities.push(trimmedLine);
      }
    } else if (currentSection === 'requirements') {
      if (trimmedLine.length > 10) {
        requirements.push(trimmedLine);
      }
    }
  }

  // Fallback: if no structured sections found, create basic ones
  if (responsibilities.length === 0 && requirements.length === 0) {
    const sentences = overview.split('.').filter((s) => s.trim().length > 20);
    if (sentences.length > 3) {
      responsibilities = sentences.slice(0, Math.ceil(sentences.length / 2));
      requirements = sentences.slice(Math.ceil(sentences.length / 2));
      overview = sentences.slice(0, 2).join('. ') + '.';
    }
  }

  return {
    overview: overview.trim(),
    responsibilities: responsibilities.slice(0, 5),
    requirements: requirements.slice(0, 5),
  };
};

const jobDetails = computed(() => parseJobDescription(job.value.description_text));

// Function to handle apply button click
const handleApply = () => {
  if (job.value.url) {
    window.open(job.value.url, '_blank');
  }
};
</script>

<template>
  <div class="bg-gray-50 mt-16">
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
                <div v-if="job.organization_logo" class="lg:hidden h-28 w-fit rounded-lg overflow-hidden mb-4">
                  <img :src="job.organization_logo" :alt="`${job.organization} logo`" class="size-full object-contain" loading="lazy" />
                </div>
                <div class="flex flex-wrap gap-2">
                  <Badge class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2">
                    {{ job.linkedin_org_industry }}
                  </Badge>
                  <Badge class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2 capitalize">
                    {{ job.employment_type?.[0]?.toLowerCase().replace('_', ' ') || 'Full Time' }}
                  </Badge>
                </div>

                <div class="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
                  <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ job.title }}</h1>
                  <!-- Action Buttons -->
                  <div class="flex gap-3 flex-wrap min-w-[15rem]">
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
                    <span class="text-sm whitespace-nowrap">{{ getRelativeTime(job.date_posted) }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="lucide:map-pin" class="mr-2 h-4 w-4 flex-shrink-0" />
                    <span class="text-sm">{{ getCleanLocation(job) }}</span>
                  </div>
                </div>
              </div>

              <!-- Job Description -->
              <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p class="text-gray-700 leading-relaxed">
                  {{ jobDetails.overview || job.description_text?.slice(0, 300) + '...' }}
                </p>
              </div>

              <!-- Responsibilities -->
              <div class="mb-8" v-if="jobDetails.responsibilities.length > 0">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <ul class="space-y-3">
                  <li v-for="(responsibility, index) in jobDetails.responsibilities" :key="index" class="flex items-start">
                    <div class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span class="text-gray-700">{{ responsibility }}</span>
                  </li>
                </ul>
              </div>

              <!-- Requirements -->
              <div class="mb-8" v-if="jobDetails.requirements.length > 0">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul class="space-y-3">
                  <li v-for="(requirement, index) in jobDetails.requirements" :key="index" class="flex items-start">
                    <div class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span class="text-gray-700">{{ requirement }}</span>
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
              <!-- Company Logo & Info -->
              <div class="text-left mb-6">
                <div class="mb-4 rounded-2xl">
                  <div v-if="job.organization_logo" class="size-20 rounded-lg overflow-hidden">
                    <img :src="job.organization_logo" :alt="`${job.organization} logo`" class="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <Icon v-else name="lucide:building-2" class="w-8 h-8 text-orange-500" />
                </div>
                <h3 class="font-bold text-gray-900 text-lg">{{ job.organization }}</h3>
              </div>

              <!-- Company Details -->
              <div class="space-y-4 mb-6">
                <div class="flex items-center text-gray-600">
                  <Icon name="lucide:map-pin" class="mr-3 h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ getCleanLocation(job) }}</span>
                </div>

                <div v-if="job.linkedin_org_employees" class="flex items-center text-gray-600">
                  <Icon name="lucide:users" class="mr-3 h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ job.linkedin_org_size || `${job.linkedin_org_employees} Employees` }}</span>
                </div>

                <div v-if="job.linkedin_org_industry" class="flex items-center text-gray-600">
                  <Icon name="lucide:briefcase" class="mr-3 h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ job.linkedin_org_industry }}</span>
                </div>
              </div>

              <!-- About -->
              <div v-if="job.linkedin_org_description" class="mb-6">
                <h4 class="font-semibold text-gray-900 mb-3">About</h4>
                <p class="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {{ job.linkedin_org_description }}
                </p>
              </div>

              <!-- Specialties -->
              <div v-if="job.linkedin_org_specialties?.length && job.linkedin_org_specialties[0]" class="mb-6">
                <h4 class="font-semibold text-gray-900 mb-3">Specialties</h4>
                <div class="flex flex-wrap gap-2">
                  <Badge v-for="specialty in job.linkedin_org_specialties.slice(0, 3)" :key="specialty" variant="secondary" class="text-xs">
                    {{ specialty }}
                  </Badge>
                </div>
              </div>

              <!-- Company Profile Button -->
              <NuxtLink :to="`/opportunities/${normalizeCompanyName(job.organization)}`">
                <Button variant="outline" class="w-full"> View Company Profile </Button>
              </NuxtLink>
            </CardContent>
          </Card>
        </div>

        <!-- Similar Jobs - Order 3 on mobile, spans full width on mobile -->
        <div class="lg:col-span-2 order-3">
          <div v-if="similarJobs.length > 0">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Similar Jobs</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card
                v-for="similarJob in similarJobs"
                :key="similarJob.id"
                class="hover:shadow-lg cursor-pointer transition-shadow duration-300"
                @click="$router.push(`/opportunities/${similarJob.companySlug}/${similarJob.jobSlug}`)"
              >
                <CardContent class="p-4">
                  <div class="flex items-start space-x-3">
                    <div class="rounded-lg flex items-center justify-center flex-shrink-0">
                      <div v-if="similarJob.organization_logo" class="size-14 rounded overflow-hidden">
                        <img
                          :src="similarJob.organization_logo"
                          :alt="`${similarJob.organization} logo`"
                          class="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <Icon v-else name="lucide:building-2" class="w-6 h-6 text-orange-500" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="font-semibold text-gray-900 text-sm line-clamp-1">{{ similarJob.title }}</h3>
                      <p class="text-gray-600 text-xs line-clamp-1">{{ similarJob.organization }}</p>
                      <p class="text-gray-500 text-xs mt-1">{{ similarJob.cleanLocation }}</p>
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
