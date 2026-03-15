<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { Cohort, CohortModule } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

const route = useRoute()
const cohortId = route.params.id as string

const { api } = useApi()
const [{ data: cohortData, error }, { data: modulesData }] = await Promise.all([
  useAsyncData(`dashboard:cohort:${cohortId}`, () =>
    api<ApiResponse<Cohort>>(`/cohorts/${cohortId}`)
  ),
  useAsyncData(`dashboard:cohort:${cohortId}:modules`, () =>
    api<ApiResponse<CohortModule[]>>(`/cohorts/${cohortId}/modules`)
  )
])

if (error.value || !cohortData.value?.data) {
  throw createError({ statusCode: 404, message: 'Cohort not found' })
}

const cohort = computed(() => cohortData.value!.data)
const modules = computed(() => modulesData.value?.data ?? [])

useSeoMeta({
  title: computed(() => `${cohort.value.academy.title} – ${cohort.value.name} – Rise Social`),
  description: computed(() => `${cohort.value.academy.title} cohort on Rise Social`)
})

const tabItems: TabsItem[] = [
  { label: 'Modules', slot: 'modules' },
  { label: 'Mentors', slot: 'mentors' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="relative rounded-2xl bg-[#0E5C59] text-white p-2 overflow-hidden">
      <div class="relative flex flex-col sm:flex-row gap-10 p-6">
        <div class="shrink-0 rounded-xl overflow-hidden size-48">
          <NuxtImg
            :src="cohort.academy.image_url"
            :alt="cohort.academy.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="flex flex-col justify-center gap-4 text-white">
          <div class="space-y-1">
            <p class="text-white/70 text-sm">{{ cohort.name }}</p>
            <h1 class="text-xl font-bold leading-snug">{{ cohort.academy.title }}</h1>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-calendar" class="size-4 shrink-0" />
              {{ formatDate(cohort.start_date) }} – {{ formatDate(cohort.end_date) }}
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-users" class="size-4 shrink-0" />
              {{ cohort.current_students }} students
            </span>
          </div>
        </div>
      </div>
      <img
        src="/images/dashboard/graphic.png"
        alt=""
        aria-hidden="true"
        class="absolute -right-16 -bottom-8 h-56 md:h-80 opacity-5 pointer-events-none"
      />
    </div>

    <UCard>
      <UTabs :items="tabItems" variant="link" color="primary" :unmount-on-hide="false">
        <template #modules>
          <DashboardAcademyTabModules :modules="modules" />
        </template>
        <template #mentors>
          <DashboardAcademyTabMentors :mentors="cohort.mentors" />
        </template>
      </UTabs>
    </UCard>
  </div>
</template>
