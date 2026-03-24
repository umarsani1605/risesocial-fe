<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { Cohort, CohortModule } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

const route = useRoute()
const cohortId = route.params.id as string

interface CohortStudent {
  id: number
  status: string
  user: { id: number; first_name: string; last_name: string; avatar: string | null }
}

const { api } = useApi()
const [{ data: cohortData, error }, { data: modulesData }, { data: studentsData }] = await Promise.all([
  useAsyncData(`dashboard:cohort:${cohortId}`, () =>
    api<ApiResponse<Cohort>>(`/cohorts/${cohortId}`)
  ),
  useAsyncData(`dashboard:cohort:${cohortId}:modules`, () =>
    api<ApiResponse<CohortModule[]>>(`/cohorts/${cohortId}/modules`)
  ),
  useAsyncData(`dashboard:cohort:${cohortId}:students`, () =>
    api<ApiResponse<CohortStudent[]>>(`/cohorts/${cohortId}/students`)
  ),
])

if (error.value || !cohortData.value?.data) {
  throw createError({ statusCode: 404, message: 'Cohort not found' })
}

const cohort = computed(() => cohortData.value!.data)
const modules = computed(() => modulesData.value?.data ?? [])
const students = computed(() => studentsData.value?.data ?? [])

useSeoMeta({
  title: computed(() => `${cohort.value.academy.title} – ${cohort.value.name} – Rise Social`),
  description: computed(() => `${cohort.value.academy.title} cohort on Rise Social`)
})

const tabItems: TabsItem[] = [
  { label: 'Modules', slot: 'modules' },
  { label: 'Students', slot: 'students' },
  { label: 'Mentors', slot: 'mentors' },
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
            <span v-if="cohort.academy.duration" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-calendar" class="size-4 shrink-0" />
              {{ cohort.academy.duration }}
            </span>
            <span v-else class="flex items-center gap-1.5">
              <UIcon name="i-lucide-calendar" class="size-4 shrink-0" />
              {{ formatDate(cohort.start_date) }} – {{ formatDate(cohort.end_date) }}
            </span>
            <span v-if="cohort.academy.certificate" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-award" class="size-4 shrink-0" />
              Certificate
            </span>
            <span v-if="cohort.academy.portfolio" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-briefcase" class="size-4 shrink-0" />
              Portfolio
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-users" class="size-4 shrink-0" />
              {{ cohort.current_students }} students
            </span>
          </div>
          <p v-if="cohort.academy.description" class="text-sm text-white/70 leading-relaxed max-w-lg line-clamp-3">
            {{ cohort.academy.description }}
          </p>
        </div>
      </div>
      <img
        src="/images/dashboard/graphic.png"
        alt=""
        aria-hidden="true"
        class="absolute -right-16 -bottom-8 h-56 md:h-80 opacity-5 pointer-events-none"
      />
    </div>

    <UCard v-if="cohort.status === 'COMPLETED'">
      <div class="flex items-center gap-4">
        <div class="shrink-0 size-16 rounded-lg bg-primary/10 flex items-center justify-center">
          <UIcon name="i-lucide-trophy" class="size-8 text-primary" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-base">Congratulation, you have completed this academy!</p>
          <p class="text-sm text-muted mt-0.5">Keep learning and applying sustainability practices to make positive impact!</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UButton variant="outline" color="primary" leading-icon="i-lucide-award">
            View Certificate
          </UButton>
          <UButton variant="ghost" color="primary" :to="`/academy/${cohort.academy.slug}`">
            Explore Academy
          </UButton>
        </div>
      </div>
    </UCard>

    <UCard>
      <UTabs :items="tabItems" variant="link" color="primary" :unmount-on-hide="false">
        <template #modules>
          <DashboardAcademyTabModules :modules="modules" />
        </template>
        <template #students>
          <DashboardAcademyTabStudents :students="students" />
        </template>
        <template #mentors>
          <DashboardAcademyTabMentors :mentors="cohort.mentors" />
        </template>
      </UTabs>
    </UCard>
  </div>
</template>
