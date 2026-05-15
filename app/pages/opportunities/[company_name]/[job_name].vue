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
    api<PaginatedResponse<Job>>('/jobs', { params: { jobSlug, companySlug, limit: 1 } })
  ),
  useAsyncData(`job-similar:${companySlug}:${jobSlug}`, () =>
    api<PaginatedResponse<Job>>('/jobs', { params: { companySlug, limit: 5 } })
  )
])

if (jobError.value || !jobRes.value?.data?.length) {
  throw createError({ statusCode: 404, statusMessage: 'Job not found' })
}

const job = computed(() => jobRes.value!.data[0]!)
const similarJobs = computed(() =>
  (similarJobsRes.value?.data ?? []).filter(j => j.id !== job.value.id).slice(0, 4)
)

const locationString = computed(() => formatLocation(job.value?.location))
const salaryDisplay = computed(() => {
  const raw = job.value?.salary_raw
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    const currency = parsed?.currency
    const value = parsed?.value
    const minValue = Number(value?.minValue)
    const maxValue = Number(value?.maxValue)
    const unitText = typeof value?.unitText === 'string' ? value.unitText : null

    if (!currency || (!Number.isFinite(minValue) && !Number.isFinite(maxValue))) {
      return raw
    }

    const fmt = (amount: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
      }).format(amount)

    const range = Number.isFinite(minValue) && Number.isFinite(maxValue)
      ? `${fmt(minValue)} - ${fmt(maxValue)}`
      : Number.isFinite(minValue)
        ? `From ${fmt(minValue)}`
        : `Up to ${fmt(maxValue)}`

    return unitText ? `${range} / ${unitText.toLowerCase()}` : range
  } catch {
    return raw
  }
})

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
  if (job.value?.external_url) {
    window.open(job.value.external_url, '_blank', 'noopener,noreferrer')
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
        <UIcon name="i-ph-arrow-left-bold" class="mr-2 size-4 text-muted" />
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
              <UBadge v-if="job.company?.industry" color="neutral" variant="soft">
                {{ job.company.industry }}
              </UBadge>
              <UBadge
                v-if="job.employment_type"
                color="neutral"
                variant="soft"
                class="capitalize"
              >
                {{ formatJobType(job.employment_type) }}
              </UBadge>
              <UBadge v-if="job.location?.is_remote" color="success" variant="soft">
                Remote
              </UBadge>
              <UBadge v-if="job.seniority_level" color="neutral" variant="soft">
                {{ formatExperienceLevel(job.seniority_level) }}
              </UBadge>
            </div>

            <div class="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
              <h1 class="text-2xl lg:text-3xl font-bold text-default">{{ job.title }}</h1>
              <div class="flex gap-3 flex-wrap">
                <UButton
                  color="primary"
                  icon="i-ph-paper-plane-tilt-bold"
                  class="whitespace-nowrap"
                  size="lg"
                  :disabled="!job.external_url"
                  @click="handleApply"
                >
                  Apply Now
                </UButton>
              </div>
            </div>

            <div class="flex flex-wrap gap-4 lg:gap-6 mb-4">
              <div v-if="job.valid_until" class="flex items-center">
                <UIcon name="i-ph-calendar-bold" class="mr-2 size-4 shrink-0 text-muted" />
                <span class="text-base whitespace-nowrap">Deadline: {{ formatDate(job.valid_until) }}</span>
              </div>
              <div class="flex items-center">
                <UIcon name="i-ph-map-pin-bold" class="mr-2 size-4 shrink-0 text-muted" />
                <span class="text-base">{{ locationString }}</span>
              </div>
              <div v-if="salaryDisplay" class="flex items-center">
                <UIcon name="i-ph-money-bold" class="mr-2 size-4 shrink-0 text-muted" />
                <span class="text-base">{{ salaryDisplay }}</span>
              </div>
            </div>
          </div>

          <!-- Description sections -->
          <div class="space-y-8">
            <div v-for="(section, index) in parsedDescription.sections" :key="index">
              <h2 class="mb-4 text-2xl font-semibold text-default">{{ section.title }}</h2>
              <div class="text-base text-muted leading-relaxed whitespace-pre-line">
                {{ section.content }}
              </div>
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
            <UIcon v-else name="i-ph-buildings-bold" class="size-8 text-primary" />
            <h3 class="text-2xl font-bold text-default">{{ job.company?.name }}</h3>
          </div>

          <div class="space-y-4 mb-4">
            <div class="flex items-center">
              <UIcon name="i-ph-map-pin-bold" class="mr-3 size-4 shrink-0 text-muted" />
              <span class="text-base">{{ locationString }}</span>
            </div>

            <div v-if="job.company?.industry" class="flex items-center">
              <UIcon name="i-ph-briefcase-bold" class="mr-3 size-4 shrink-0 text-muted" />
              <span class="text-base">{{ job.company.industry }}</span>
            </div>

            <div v-if="job.company?.website_url" class="flex items-center">
              <UIcon name="i-ph-globe-bold" class="mr-3 size-4 shrink-0 text-muted" />
              <ULink
                :to="job.company.website_url"
                target="_blank"
                class="text-base text-primary hover:underline"
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
          <h2 class="mb-6 text-2xl font-semibold text-default">Similar Jobs</h2>
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
