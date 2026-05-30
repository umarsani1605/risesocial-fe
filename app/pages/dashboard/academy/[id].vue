<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { Cohort, CohortModule } from '@/types'
import { isModuleHash } from '@/utils/cohort'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

const route = useRoute()
const cohortId = route.params.id as string

const { api } = useApi()
const [
  { data: cohortData, error },
  { data: modulesData, error: modulesError },
  { data: certData }
] = await Promise.all([
  useAsyncData(`dashboard:cohort:${cohortId}`, () =>
    api<ApiResponse<Cohort>>(`/cohorts/${cohortId}`)
  ),
  useAsyncData(`dashboard:cohort:${cohortId}:modules`, () =>
    api<ApiResponse<CohortModule[]>>(`/cohorts/${cohortId}/modules`)
  ),
  useAsyncData(`dashboard:cohort:${cohortId}:certificate`, () =>
    api<ApiResponse<{ certificate_url: string }>>(`/cohorts/${cohortId}/certificate`).catch(
      () => null
    )
  )
])

// Ownership guard: backend returns 403 on /modules if user has no placement here.
// Redirect to dashboard instead of leaking other cohorts' details.
if (modulesError.value) {
  await navigateTo('/dashboard/academy', { replace: true })
}

if (error.value || !cohortData.value?.data) {
  throw createError({ statusCode: 404, message: 'Cohort not found' })
}

const cohort = computed(() => cohortData.value!.data)
const modules = computed(() => modulesData.value?.data ?? [])
const certificateUrl = computed(() => certData.value?.data?.certificate_url ?? null)

useSeoMeta({
  title: computed(() => `${cohort.value.academy.title} – ${cohort.value.name} – Rise Social`),
  description: computed(() => `${cohort.value.academy.title} cohort on Rise Social`)
})

const tabItems: TabsItem[] = [
  { label: 'Modules', slot: 'modules', icon: 'i-ph-stack-duotone' },
  { label: 'Mentors', slot: 'mentors', icon: 'i-ph-user-duotone' }
]

const activeTab = ref('0')
const tabModulesRef = ref<{
  isAnyOpen: () => boolean
  isAllOpen: () => boolean
  toggleAll: () => void
} | null>(null)
const isModulesAllOpen = computed(() => tabModulesRef.value?.isAllOpen() ?? false)

watch(
  () => route.hash,
  (hash) => {
    if (isModuleHash(hash)) activeTab.value = '0'
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-4">
    <div class="relative rounded-2xl bg-[#0E5C59] text-white p-2 overflow-hidden">
      <div class="relative flex flex-col sm:flex-row gap-6 md:gap-10 p-4">
        <div class="shrink-0 rounded-xl overflow-hidden size-56 md:size-36">
          <NuxtImg
            :src="cohort.academy.image_url"
            :alt="cohort.academy.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="flex flex-col justify-center px-2 md:px-0 gap-4 text-white">
          <div class="space-y-1">
            <p class="text-white/70 text-sm">{{ cohort.name }}</p>
            <h1 class="text-xl font-bold leading-snug">{{ cohort.academy.title }}</h1>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-ph-calendar-blank-bold" class="size-4 shrink-0" />
              {{ formatDateMonth(cohort.start_date) }} — {{ formatDateLong(cohort.end_date) }}
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon name="i-ph-users-bold" class="size-4 shrink-0" />
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

    <UCard v-if="certificateUrl">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <UIcon name="i-ph-certificate-duotone" class="size-10 text-primary shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-base">Congratulation, you have completed this academy!</p>
          <p class="text-sm text-muted mt-0.5">
            Keep learning and applying sustainability practices to make positive impact!
          </p>
        </div>
        <div
          class="flex flex-row-reverse md:flex-col-reverse xl:flex-row flex-wrap-reverse md:flex-nowrap items-center md:items-stretch xl:items-center justify-end gap-2 sm:shrink-0"
        >
          <UButton variant="ghost" :to="`/academy`" class="whitespace-nowrap">
            Explore Academies
          </UButton>
          <UButton
            v-if="certificateUrl"
            :to="certificateUrl"
            target="_blank"
            variant="dashboard"
            leading-icon="i-ph-medal-bold"
            class="whitespace-nowrap"
          >
            View Certificate
          </UButton>
        </div>
      </div>
    </UCard>

    <UCard v-if="cohort.academy.description">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-ph-info-duotone" class="text-primary size-8 md:size-6 shrink-0" />
          <h2 class="text-lg font-semibold">Information</h2>
        </div>
      </template>
      <p class="text-sm text-muted leading-relaxed max-w-4xl">
        {{ cohort.academy.description }}
      </p>
    </UCard>

    <UCard>
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        color="primary"
        :unmount-on-hide="false"
        :ui="{
          root: 'flex-1 min-h-0 gap-6',
          list: 'py-1 px-0! shrink-0',
          content: 'flex-1 min-h-0',
          trigger: 'px-3 sm:px-6 whitespace-nowrap'
        }"
      >
        <template #list-trailing>
          <div v-if="activeTab === '0'" class="ml-auto pr-1">
            <UButton
              :label="isModulesAllOpen ? 'Collapse All' : 'Expand All'"
              icon="i-ph-arrows-down-up"
              color="neutral"
              variant="link"
              size="sm"
              class="w-30"
              @click="tabModulesRef?.toggleAll()"
            />
          </div>
        </template>
        <template #modules>
          <DashboardAcademyTabModules
            ref="tabModulesRef"
            :modules="modules"
            :target-module-hash="route.hash"
          />
        </template>
        <template #mentors>
          <DashboardAcademyTabMentors :mentors="cohort.mentors" />
        </template>
      </UTabs>
    </UCard>
  </div>
</template>
