<script setup lang="ts">
import type { Job, JobCompanyDetail } from '@/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const companySlug = route.params.company_name as string

const { api } = useApi()

const [{ data: companyRes, error: companyError }, { data: jobsRes }] = await Promise.all([
  useAsyncData(`company:${companySlug}`, () =>
    api<PaginatedResponse<JobCompanyDetail>>('/jobs/companies', { params: { search: companySlug, limit: 1 } })
  ),
  useAsyncData(`company-jobs:${companySlug}`, () =>
    api<PaginatedResponse<Job>>('/jobs', { params: { company: companySlug, limit: 50 } })
  )
])

if (companyError.value || !companyRes.value?.data?.length) {
  throw createError({ statusCode: 404, statusMessage: 'Company not found' })
}

const company = computed(() => companyRes.value!.data[0]!)
const companyJobs = computed(() => jobsRes.value?.data ?? [])

useSeoMeta({
  title: computed(() => `${company.value.name} - Jobs | Rise Social`),
  description: computed(() => `Explore career opportunities at ${company.value.name}${company.value.industry ? ` in ${company.value.industry}` : ''}.`)
})
</script>

<template>
  <UPageSection>
    <div class="mb-6">
      <UButton
        icon="i-ph-arrow-left-bold"
        variant="ghost"
        color="neutral"
        @click="router.push('/opportunities')"
      >
        Back to Job Opportunities
      </UButton>
    </div>

    <UCard class="mb-4">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="shrink-0">
          <div class="flex items-center justify-center size-24 rounded-lg overflow-hidden">
            <NuxtImg
              v-if="company.logo_url"
              :src="company.logo_url"
              :alt="`${company.name} logo`"
              class="size-full object-contain"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-elevated flex items-center justify-center rounded-lg">
              <UIcon name="i-ph-buildings-bold" class="size-8 text-primary" />
            </div>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h1 class="text-3xl font-bold mb-2">{{ company.name }}</h1>
          <div class="flex flex-wrap gap-4 mb-4">
            <div v-if="company.industry" class="flex items-center text-muted">
              <UIcon name="i-ph-building-bold" class="mr-2 size-4 shrink-0" />
              <span><span class="font-medium">Industry:</span> {{ company.industry }}</span>
            </div>
            <div v-if="company.linkedin_size" class="flex items-center text-muted">
              <UIcon name="i-ph-users-bold" class="mr-2 size-4 shrink-0" />
              <span><span class="font-medium">Size:</span> {{ company.linkedin_size }}</span>
            </div>
            <div v-if="company.headquarters" class="flex items-center text-muted">
              <UIcon name="i-ph-map-pin-bold" class="mr-2 size-4 shrink-0" />
              <span><span class="font-medium">HQ:</span> {{ company.headquarters }}</span>
            </div>
            <div v-if="company.website_url" class="inline-flex items-center">
              <UIcon name="i-ph-globe-bold" class="mr-2 size-4 shrink-0" />
              <ULink :to="company.website_url" target="_blank" class="text-primary hover:underline">
                {{ company.website_url }}
              </ULink>
            </div>
            <div v-if="company.linkedin_url" class="inline-flex items-center">
              <UIcon name="i-ph-linkedin-logo-bold" class="mr-2 size-4 shrink-0" />
              <ULink :to="company.linkedin_url" target="_blank" class="text-primary hover:underline">
                LinkedIn
              </ULink>
            </div>
          </div>
          <div v-if="company.description" class="mt-4">
            <h3 class="text-lg font-semibold mb-2">About Us</h3>
            <p class="text-muted whitespace-pre-line">{{ company.description }}</p>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold">
          Available Positions ({{ companyJobs.length }})
        </h2>
      </div>
      <div v-if="companyJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SharedJobCard v-for="job in companyJobs" :key="job.id" :job="job" />
      </div>
      <div v-else class="text-center py-12">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-elevated">
          <UIcon name="i-ph-briefcase-bold" class="size-6 text-muted" />
        </div>
        <h3 class="mt-4 text-lg font-medium">No open positions</h3>
        <p class="mt-1 text-muted">There are currently no open positions at this company.</p>
      </div>
    </UCard>
  </UPageSection>
</template>
