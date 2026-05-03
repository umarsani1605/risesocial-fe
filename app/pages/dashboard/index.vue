<script setup lang="ts">
import type { CohortEnrollment, UpcomingSession } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'Dashboard - Rise Social',
  description: 'Dashboard pengguna Rise Social'
})

const { user } = useAuth()
const { api } = useApi()

const { data: enrollmentsData } = await useAsyncData('dashboard:enrollments', () =>
  api<PaginatedResponse<CohortEnrollment>>('/cohorts/my')
)

const enrollments = computed(() => enrollmentsData.value?.data ?? [])

const dynamicGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const titleIndex = ref(Math.floor(Math.random() * 5))

const dynamicTitle = computed(() => {
  const g = dynamicGreeting.value
  const n = user.value?.first_name ?? ''
  const templates = [
    `${g}, ${n}!`,
    `Ready, ${n}?`,
    `Let's go, ${n}!`,
    `${n}, go make impact!`,
    `${n}, lead the change!`
  ]
  return templates[titleIndex.value]
})

const activeEnrollment = computed(
  () => enrollments.value.find((e) => !e.completed_at) ?? null
)

const STATUS_ORDER: Record<string, number> = { ongoing: 0, not_started: 1, completed: 2 }

const recentEnrollments = computed(() =>
  [...enrollments.value]
    .sort(
      (a, b) =>
        (STATUS_ORDER[a.cohort?.status ?? ''] ?? 99) - (STATUS_ORDER[b.cohort?.status ?? ''] ?? 99)
    )
    .slice(0, 3)
)

const activeSubtitles = [
  'Your cohort meets live this week. Show up, learn, and shape a greener world!',
  'Every session is a step toward a future worth building. See you live!',
  'The planet needs people like you. Your next live session is coming!',
  'Sustainability starts with knowledge. Your cohort is ready when you are!',
  'Real change is built in community. Join your live session this week.'
]

const inactiveSubtitles = [
  'The future is sustainable — and it starts with what you learn today.',
  'Join a cohort of changemakers and start your journey toward a greener future.',
  "Your skills can drive real impact. Let's continue learning."
]

const subtitleIndex = ref(Math.floor(Math.random() * 5))

const dynamicSubtitle = computed(() => {
  const pool = activeEnrollment.value ? activeSubtitles : inactiveSubtitles
  return pool[subtitleIndex.value % pool.length]
})

const { data: upcomingData } = await useAsyncData('dashboard:upcoming', () =>
  api<ApiResponse<UpcomingSession[]>>('/cohorts/upcoming', { query: { limit: 7 } })
)

const upcomingSessions = computed(() => upcomingData.value?.data ?? [])
</script>

<template>
  <div class="flex flex-col flex-1 space-y-6">
    <div
      class="relative rounded-2xl bg-deep-teal-850 px-8 sm:px-12 py-8 sm:py-10 mb-4 overflow-hidden shadow-sm"
    >
      <div class="relative z-10 max-w-2xl">
        <h1
          class="text-2xl sm:text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-white"
        >
          {{ dynamicTitle }}
        </h1>

        <p class="text-base sm:text-lg text-white/80 leading-relaxed">
          {{ dynamicSubtitle }}
        </p>

        <!-- <div class="flex flex-wrap gap-3">
          <UButton
            v-if="activeEnrollment"
            color="primary"
            size="lg"
            :to="`/dashboard/academy/${activeEnrollment.cohort.id}`"
            icon="i-ph-play-bold"
          >
            Continue Learning
          </UButton>
          <UButton v-else color="primary" size="lg" to="/academy" icon="i-ph-magnifying-glass-bold">
            Explore Academy
          </UButton>
        </div> -->
      </div>

      <!-- Decorative graphic -->
      <img
        src="/images/dashboard/graphic.png"
        alt=""
        aria-hidden="true"
        class="absolute -right-16 -bottom-20 h-56 md:h-80 opacity-5 pointer-events-none"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
      <div class="lg:col-span-8 space-y-6">
        <UCard class="h-full border border-default/50" :ui="{ header: 'p-0!', body: 'p-4!' }">
          <template #header>
            <div class="flex items-center gap-4 px-6 pt-4 pb-0">
              <div
                class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
              >
                <UIcon name="i-ph-notebook-fill" class="size-4" />
              </div>
              <h2 class="font-bold text-xl text-slate-800">My Academy</h2>
            </div>
            <USeparator class="mt-4" :ui="{ border: 'border-slate-100' }" />
          </template>
          <div
            v-if="recentEnrollments.length === 0"
            class="flex flex-col items-center justify-center py-10 text-center gap-4 rounded-xl"
          >
            <UIcon name="i-ph-graduation-cap-bold" class="size-12 py-8 text-slate-400" />
            <div>
              <p class="font-semibold text-slate-800">No active program</p>
              <p class="text-sm text-slate-500 mt-1 max-w-xs">
                You are not currently enrolled in any learning program.
              </p>
            </div>
            <UButton to="/academy" color="primary" variant="solid" size="sm" class="mt-2">
              Explore Academy
            </UButton>
          </div>

          <div v-else class="space-y-4">
            <DashboardEnrollmentCard
              v-for="enrollment in recentEnrollments"
              :key="enrollment.id"
              :enrollment="enrollment"
            />
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-4">
        <UCard class="h-full border border-default/50" :ui="{ header: 'p-0!', body: 'p-4!' }">
          <template #header>
            <div class="flex items-center gap-4 px-6 pt-4 pb-0">
              <div
                class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
              >
                <UIcon name="i-ph-calendar-check-fill" class="size-4" />
              </div>
              <h2 class="font-bold text-lg text-slate-800">Upcoming</h2>
            </div>
            <USeparator class="mt-4" :ui="{ border: 'border-slate-100' }" />
          </template>

          <div>
            <div class="space-y-4">
              <DashboardUpcomingCard
                v-for="session in upcomingSessions"
                :key="session.id"
                :session="session"
              />
            </div>
            <div
              v-if="upcomingSessions.length === 0"
              class="py-10 text-center flex flex-col items-center gap-3"
            >
              <div
                class="size-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center"
              >
                <UIcon name="i-ph-calendar-blank-duotone" class="size-7 text-slate-400" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700">No upcoming schedules</p>
                <p class="text-xs text-slate-500 mt-1">Enjoy your free time!</p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
