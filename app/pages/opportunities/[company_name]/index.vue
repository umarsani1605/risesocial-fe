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
    api<PaginatedResponse<JobCompanyDetail>>('/jobs/company', {
      params: { slug: companySlug, limit: 1 }
    })
  ),
  useAsyncData(`company-jobs:${companySlug}`, () =>
    api<PaginatedResponse<Job>>('/jobs', { params: { companySlug, limit: 50 } })
  )
])

if (companyError.value || !companyRes.value?.data?.length) {
  throw createError({ statusCode: 404, statusMessage: 'Company not found' })
}

const company = computed(() => companyRes.value!.data[0]!)
const companyJobs = computed(() => jobsRes.value?.data ?? [])
const companySummary = computed(
  () => company.value.description || company.value.linkedin_slogan || ''
)
const companyHeadquarters = computed(() => {
  if (company.value.headquarters) return company.value.headquarters

  const locations = company.value.linkedin_locations
  if (Array.isArray(locations) && locations.length > 0) {
    return locations
      .map((location) => {
        if (typeof location === 'string') return location
        if (location && typeof location === 'object') {
          const parts = [location.city, location.region, location.country].filter(Boolean)
          if (parts.length > 0) return parts.join(', ')
        }
        return null
      })
      .filter(Boolean)
      .join(' • ')
  }

  return ''
})

const companySpecialties = computed(() => {
  const specialties = company.value.linkedin_specialties
  if (Array.isArray(specialties)) {
    return specialties.filter((item): item is string => typeof item === 'string' && item.length > 0)
  }

  if (typeof specialties === 'string' && specialties.length > 0) {
    return specialties
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
})

useSeoMeta({
  title: computed(() => `${company.value.name} - Jobs | Rise Social`),
  description: computed(
    () =>
      `Explore career opportunities at ${company.value.name}${company.value.industry ? ` in ${company.value.industry}` : ''}.`
  )
})
</script>

<template>
  <UPageSection class="py-6">
    <div class="space-y-6">
      <div>
        <UButton
          icon="i-ph-arrow-left-bold"
          variant="ghost"
          color="neutral"
          @click="router.push('/opportunities')"
        >
          Back to Job Opportunities
        </UButton>
      </div>

      <UCard>
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
              <div
                v-else
                class="w-full h-full bg-elevated flex items-center justify-center rounded-lg"
              >
                <UIcon name="i-ph-buildings-bold" class="size-8 text-primary" />
              </div>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h1 class="text-3xl font-bold mb-2">{{ company.name }}</h1>
            <div class="grid gap-4 mb-4 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div class="flex flex-wrap gap-x-6 gap-y-3">
                <div v-if="company.industry" class="flex items-center text-muted">
                  <UIcon name="i-ph-building-bold" class="mr-2 size-4 shrink-0" />
                  <span><span class="font-medium">Industry:</span> {{ company.industry }}</span>
                </div>
                <div v-else-if="company.linkedin_type" class="flex items-center text-muted">
                  <UIcon name="i-ph-buildings-bold" class="mr-2 size-4 shrink-0" />
                  <span><span class="font-medium">Type:</span> {{ company.linkedin_type }}</span>
                </div>
                <div v-if="company.linkedin_size" class="flex items-center text-muted">
                  <UIcon name="i-ph-users-bold" class="mr-2 size-4 shrink-0" />
                  <span><span class="font-medium">Size:</span> {{ company.linkedin_size }}</span>
                </div>
                <div v-else-if="company.linkedin_employees" class="flex items-center text-muted">
                  <UIcon name="i-ph-users-three-bold" class="mr-2 size-4 shrink-0" />
                  <span
                    ><span class="font-medium">Employees:</span>
                    {{ formatNumber(company.linkedin_employees) }}</span
                  >
                </div>
                <div v-if="companyHeadquarters" class="flex items-center text-muted">
                  <UIcon name="i-ph-map-pin-bold" class="mr-2 size-4 shrink-0" />
                  <span><span class="font-medium">HQ:</span> {{ companyHeadquarters }}</span>
                </div>
                <div v-if="company.linkedin_followers" class="flex items-center text-muted">
                  <UIcon name="i-ph-user-plus-bold" class="mr-2 size-4 shrink-0" />
                  <span
                    ><span class="font-medium">Followers:</span>
                    {{ formatNumber(company.linkedin_followers) }}</span
                  >
                </div>
                <div v-if="company.linkedin_founded_date" class="flex items-center text-muted">
                  <UIcon name="i-ph-calendar-bold" class="mr-2 size-4 shrink-0" />
                  <span
                    ><span class="font-medium">Founded:</span>
                    {{ company.linkedin_founded_date }}</span
                  >
                </div>
              </div>

              <div class="flex flex-col items-start gap-3 lg:items-end">
                <div v-if="company.website_url" class="inline-flex items-center">
                  <UIcon name="i-ph-globe-bold" class="mr-2 size-4 shrink-0" />
                  <ULink
                    :to="company.website_url"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ company.website_url }}
                  </ULink>
                </div>
                <div v-if="company.linkedin_url" class="inline-flex items-center">
                  <UIcon name="i-ph-linkedin-logo-bold" class="mr-2 size-4 shrink-0" />
                  <ULink
                    :to="company.linkedin_url"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    LinkedIn
                  </ULink>
                </div>
              </div>
            </div>
            <div v-if="companySummary" class="mt-4">
              <h3 class="text-lg font-semibold mb-2">About Us</h3>
              <p class="text-muted whitespace-pre-line">{{ companySummary }}</p>
            </div>
            <div v-if="companySpecialties.length" class="mt-4">
              <h3 class="text-lg font-semibold mb-2">Specialties</h3>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="specialty in companySpecialties"
                  :key="specialty"
                  color="neutral"
                  variant="soft"
                >
                  {{ specialty }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold">Available Positions ({{ companyJobs.length }})</h2>
        </div>
        <div v-if="companyJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="job in companyJobs" :key="job.id" class="rounded-2xl">
            <SharedJobCard
              :job="job"
              class="[&_div.rounded-2xl]:border [&_div.rounded-2xl]:border-default/60 [&_div.rounded-2xl]:shadow-none"
            />
          </div>
        </div>
        <div v-else class="text-center py-12">
          <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-elevated">
            <UIcon name="i-ph-briefcase-bold" class="size-6 text-muted" />
          </div>
          <h3 class="mt-4 text-lg font-medium">No open positions</h3>
          <p class="mt-1 text-muted">There are currently no open positions at this company.</p>
        </div>
      </UCard>
    </div>
  </UPageSection>
</template>
