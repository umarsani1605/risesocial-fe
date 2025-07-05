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

// Find company jobs by matching normalized company name
const companyJobs = computed(() => {
  return jobsData.filter((job) => {
    const normalizedOrgName = normalizeCompanyName(job.organization);
    return normalizedOrgName === companyName;
  });
});

// Get company info from first job (since all jobs are from same company)
const companyInfo = computed(() => {
  return companyJobs.value[0] || null;
});

// If no company found, redirect to 404
if (!companyInfo.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Company not found',
  });
}

// Meta tags
useHead({
  title: `${companyInfo.value.organization} - Jobs | Rise Social`,
  meta: [
    {
      name: 'description',
      content: `Explore career opportunities at ${companyInfo.value.organization}. Find jobs in ${companyInfo.value.linkedin_org_industry}.`,
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

// Process jobs with additional data
const processedJobs = computed(() => {
  return companyJobs.value.map((job) => ({
    ...job,
    cleanLocation: getCleanLocation(job),
    relativeTime: getRelativeTime(job.date_posted),
    jobSlug: normalizeJobName(job.title),
  }));
});
</script>

<template>
  <div class="bg-gray-50 mt-16">
    <div class="container-wrapper py-6 lg:py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <Button variant="ghost" @click="$router.push('/opportunities')" class="text-gray-600 hover:text-gray-900">
          <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
          Back to Job Opportunities
        </Button>
      </div>

      <!-- Company Header -->
      <Card class="mb-8">
        <CardContent class="p-6 lg:p-8">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Company Logo -->
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-full size-24 rounded-lg overflow-hidden">
                <div v-if="companyInfo.organization_logo" class="flex items-center w-full size-24 rounded-lg overflow-hidden">
                  <NuxtImg
                    :src="companyInfo.organization_logo"
                    :alt="`${companyInfo.organization} logo`"
                    class="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <Icon v-else name="lucide:building-2" class="size-8 text-orange-500" />
              </div>
            </div>

            <!-- Company Info -->
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ companyInfo.organization }}</h1>

              <!-- Company Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <Badge v-if="companyInfo.linkedin_org_industry" class="bg-green-100 text-green-800 font-medium px-3 py-1">
                  {{ companyInfo.linkedin_org_industry }}
                </Badge>
                <Badge v-if="companyInfo.linkedin_org_size" class="bg-blue-100 text-blue-800 font-medium px-3 py-1">
                  {{ companyInfo.linkedin_org_size }}
                </Badge>
                <Badge v-if="companyInfo.linkedin_org_foundeddate" class="bg-purple-100 text-purple-800 font-medium px-3 py-1">
                  Founded {{ companyInfo.linkedin_org_foundeddate }}
                </Badge>
              </div>

              <!-- Company Details -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div class="flex items-center text-gray-600">
                  <Icon name="lucide:map-pin" class="mr-3 h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ getCleanLocation(companyInfo) }}</span>
                </div>

                <div v-if="companyInfo.linkedin_org_employees" class="flex items-center text-gray-600">
                  <Icon name="lucide:users" class="mr-3 h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ companyInfo.linkedin_org_size || `${companyInfo.linkedin_org_employees} Employees` }}</span>
                </div>

                <div v-if="companyInfo.linkedin_org_url" class="flex items-center text-gray-600">
                  <Icon name="lucide:globe" class="mr-3 h-4 w-4 flex-shrink-0" />
                  <a :href="companyInfo.linkedin_org_url" target="_blank" class="text-sm text-blue-600 hover:underline"> Website </a>
                </div>
              </div>

              <!-- Company Slogan -->
              <!-- <p v-if="companyInfo.linkedin_org_slogan" class="text-gray-600 text-lg italic mb-4">"{{ companyInfo.linkedin_org_slogan }}"</p> -->
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- About Section -->
      <Card v-if="companyInfo.linkedin_org_description" class="mb-8">
        <CardContent class="p-6 lg:p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">About {{ companyInfo.organization }}</h2>
          <p class="text-gray-700 leading-relaxed">{{ companyInfo.linkedin_org_description }}</p>
        </CardContent>
      </Card>

      <!-- Specialties Section -->
      <Card v-if="companyInfo.linkedin_org_specialties?.length && companyInfo.linkedin_org_specialties[0]" class="mb-8">
        <CardContent class="p-6 lg:p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Specialties</h2>
          <div class="flex flex-wrap gap-3">
            <Badge v-for="specialty in companyInfo.linkedin_org_specialties" :key="specialty" variant="secondary" class="px-3 py-1">
              {{ specialty }}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Jobs Section -->
      <Card>
        <CardContent class="p-6 lg:p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Available Positions ({{ processedJobs.length }})</h2>
          </div>

          <!-- Jobs Grid -->
          <div v-if="processedJobs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              v-for="job in processedJobs"
              :key="job.id"
              class="hover:shadow-lg cursor-pointer transition-all duration-300"
              @click="$router.push(`/opportunities/${companyName}/${job.jobSlug}`)"
            >
              <CardContent class="p-6">
                <!-- Job Header -->
                <div class="mb-4">
                  <h3 class="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                    {{ job.title }}
                  </h3>

                  <!-- Job Type Badge -->
                  <Badge class="bg-blue-100 text-blue-800 font-medium px-3 py-1">
                    {{ job.employment_type?.[0]?.replace('_', ' ') || 'Full Time' }}
                  </Badge>
                </div>

                <!-- Job Meta Information -->
                <div class="flex flex-col gap-3 text-gray-500 text-sm">
                  <div class="flex items-center">
                    <Icon name="lucide:calendar" class="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{{ job.relativeTime }}</span>
                  </div>
                  <div class="flex items-center">
                    <Icon name="lucide:map-pin" class="mr-2 h-4 w-4 flex-shrink-0" />
                    <span class="line-clamp-1">{{ job.cleanLocation }}</span>
                  </div>
                </div>

                <!-- Job Description Preview -->
                <div class="mt-4">
                  <p class="text-gray-600 text-sm line-clamp-3">
                    {{ job.description_text?.slice(0, 150) + '...' }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- No Jobs State -->
          <div v-else class="text-center py-12">
            <Icon name="lucide:briefcase" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No jobs available</h3>
            <p class="text-gray-600">Check back later for new opportunities at {{ companyInfo.organization }}</p>
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
