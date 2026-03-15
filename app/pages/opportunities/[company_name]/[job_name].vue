<script setup lang="ts">
import type { Job } from '@/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const companySlug = route.params.company_name as string
const jobSlug = route.params.job_name as string

const { api } = useApi()

const [{ data: jobRes, error: jobError }, { data: similarJobsRes }] = await Promise.all([
  useAsyncData(`job:${companySlug}:${jobSlug}`, () =>
    api<ApiResponse<Job[]>>('/jobs', { params: { jobSlug, companySlug, limit: 1 } })
  ),
  useAsyncData(`job-similar:${companySlug}:${jobSlug}`, () =>
    api<ApiResponse<Job[]>>('/jobs', { params: { companySlug, limit: 5 } })
  )
])

if (jobError.value || !jobRes.value?.data?.length) {
  throw createError({ statusCode: 404, statusMessage: 'Job not found' })
}

const job = computed(() => jobRes.value!.data[0])
const similarJobs = computed(() =>
  (similarJobsRes.value?.data ?? []).filter(j => j.id !== job.value.id).slice(0, 4)
)

const locationString = computed(() => formatLocation(job.value?.location))

const parsedDescription = computed(() => {
  const text = job.value?.description ?? ''
  const sections: Array<{ title: string; content: string }> = []

  const sectionHeaders = [
    'Job Description',
    'Responsibilities',
    'Requirements',
    'Qualifications',
    'Skills',
    'Benefits',
    'What We Offer'
  ]

  let currentSection = { title: 'Overview', content: '' }
  const lines = text.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    const isHeader = sectionHeaders.some(header =>
      trimmedLine.toLowerCase().includes(header.toLowerCase())
    )

    if (isHeader) {
      if (currentSection.content.trim()) {
        sections.push(currentSection)
      }
      currentSection = { title: trimmedLine, content: '' }
    }
    else {
      currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine
    }
  }

  if (currentSection.content.trim()) {
    sections.push(currentSection)
  }

  return { sections }
})

const handleApply = () => {
  if (job.value?.applicationUrl) {
    window.open(job.value.applicationUrl, '_blank')
  }
}

useSeoMeta({
  title: computed(() => `${job.value?.title} - ${job.value?.company?.name} | Rise Social`),
  description: computed(() => job.value?.description?.substring(0, 155) ?? '')
})
</script>

<template>
  <UPageSection :ui="{ container: 'gap-0!' }">
    <div class="my-2 hidden lg:block mb-6">
      <UButton variant="ghost" color="neutral" @click="router.push('/opportunities')">
        <UIcon name="i-lucide-arrow-left" class="mr-2 size-4" />
        Back to Job Opportunities
      </UButton>
    </div>

    <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      <!-- Main: job detail -->
      <div class="lg:col-span-2 order-1">
        <UCard>
          <div class="mb-6">
            <div v-if="job.company?.logo_url" class="lg:hidden h-28 w-fit rounded-lg overflow-hidden mb-4">
              <NuxtImg
                :src="job.company.logo_url"
                :alt="`${job.company?.name || 'Company'} logo`"
                class="size-full object-contain"
                loading="lazy"
              />
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              <UBadge v-if="job.company?.industry" color="neutral" variant="soft" size="sm">
                {{ job.company.industry }}
              </UBadge>
              <UBadge color="neutral" variant="soft" size="sm" class="capitalize">
                {{ formatJobType(job.jobType) }}
              </UBadge>
              <UBadge v-if="job.isRemote" color="success" variant="soft" size="sm">
                Remote
              </UBadge>
              <UBadge v-if="job.experienceLevel" color="neutral" variant="soft" size="sm">
                {{ formatExperienceLevel(job.experienceLevel) }}
              </UBadge>
            </div>

            <div class="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
              <h1 class="text-2xl lg:text-3xl font-bold">{{ job.title }}</h1>
              <div class="flex gap-3 flex-wrap">
                <UButton
                  color="primary"
                  icon="i-lucide-send"
                  class="whitespace-nowrap"
                  size="lg"
                  :disabled="!job.applicationUrl"
                  @click="handleApply"
                >
                  Apply Now
                </UButton>
              </div>
            </div>

            <div class="flex flex-wrap gap-4 lg:gap-6 mb-4">
              <div v-if="job.applicationDeadline" class="flex items-center">
                <UIcon name="i-lucide-calendar" class="mr-2 size-4 shrink-0" />
                <span class="text-sm whitespace-nowrap">Deadline: {{ formatDate(job.applicationDeadline) }}</span>
              </div>
              <div class="flex items-center">
                <UIcon name="i-lucide-map-pin" class="mr-2 size-4 shrink-0" />
                <span class="text-sm">{{ locationString }}</span>
              </div>
              <div v-if="job.minSalary || job.maxSalary" class="flex items-center">
                <UIcon name="i-lucide-banknote" class="mr-2 size-4 shrink-0" />
                <span class="text-sm">{{ formatSalary(job.minSalary, job.maxSalary) }}</span>
              </div>
            </div>

            <!-- Skills -->
            <div v-if="job.skills?.length" class="flex flex-wrap gap-2 mb-2">
              <UBadge
                v-for="skill in job.skills"
                :key="skill"
                color="primary"
                variant="subtle"
                size="sm"
              >
                {{ skill }}
              </UBadge>
            </div>
          </div>

          <!-- Description sections -->
          <div class="space-y-8">
            <div v-for="(section, index) in parsedDescription.sections" :key="index">
              <h2 class="text-xl font-semibold mb-4">{{ section.title }}</h2>
              <div class="text-muted leading-relaxed whitespace-pre-line">
                {{ section.content }}
              </div>
            </div>

            <!-- Requirements -->
            <div v-if="job.requirements?.length">
              <h2 class="text-xl font-semibold mb-4">Requirements</h2>
              <ul class="list-disc list-inside space-y-1 text-muted">
                <li v-for="req in job.requirements" :key="req">{{ req }}</li>
              </ul>
            </div>

            <!-- Benefits -->
            <div v-if="job.benefits?.length">
              <h2 class="text-xl font-semibold mb-4">Benefits</h2>
              <ul class="list-disc list-inside space-y-1 text-muted">
                <li v-for="benefit in job.benefits" :key="benefit">{{ benefit }}</li>
              </ul>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Sidebar: company info -->
      <div class="lg:col-span-1 order-2">
        <UCard>
          <div class="mb-4 space-y-4">
            <div v-if="job.company?.logo_url" class="size-24 rounded-lg overflow-hidden">
              <NuxtImg
                :src="job.company.logo_url"
                :alt="`${job.company?.name || 'Company'} logo`"
                class="size-full object-contain"
                loading="lazy"
              />
            </div>
            <UIcon v-else name="i-lucide-building-2" class="size-8 text-primary" />
            <h3 class="font-bold text-lg">{{ job.company?.name }}</h3>
          </div>

          <div class="space-y-4 mb-4">
            <div class="flex items-center">
              <UIcon name="i-lucide-map-pin" class="mr-3 size-4 shrink-0" />
              <span class="text-sm">{{ locationString }}</span>
            </div>

            <div v-if="job.company?.industry" class="flex items-center">
              <UIcon name="i-lucide-briefcase" class="mr-3 size-4 shrink-0" />
              <span class="text-sm">{{ job.company.industry }}</span>
            </div>

            <div v-if="job.company?.website_url" class="flex items-center">
              <UIcon name="i-lucide-globe" class="mr-3 size-4 shrink-0" />
              <ULink
                :to="job.company.website_url"
                target="_blank"
                class="text-sm text-primary hover:underline"
              >
                {{ job.company.website_url }}
              </ULink>
            </div>
          </div>

          <ULink :to="`/opportunities/${job.company?.slug}`">
            <UButton variant="outline" color="neutral" block>View Company Profile</UButton>
          </ULink>
        </UCard>
      </div>

      <!-- Similar jobs -->
      <div class="lg:col-span-2 order-3">
        <div v-if="similarJobs.length > 0">
          <h2 class="text-xl font-semibold mb-6">Similar Jobs</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <SharedJobCard
              v-for="similarJob in similarJobs"
              :key="similarJob.id"
              :job="similarJob"
            />
          </div>
          <div class="text-center">
            <UButton variant="outline" @click="router.push('/opportunities')">
              See All Jobs
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
