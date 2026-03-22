<script setup lang="ts">
import type { CohortEnrollment } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'My Programs - Rise Social',
  description: 'Kelola cohort dan progres pembelajaran Anda di Rise Social'
})

const { api } = useApi()
const { data: enrollmentsData } = await useAsyncData('dashboard:my-cohorts', () =>
  api<PaginatedResponse<CohortEnrollment>>('/cohorts/my')
)
const enrollments = computed(() => enrollmentsData.value?.data.filter(e => e.cohort) ?? [])
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="font-semibold text-lg">My Programs</h1>
        <UButton variant="link" color="neutral" size="sm" to="/academy" class="text-muted">
          View All Academy
        </UButton>
      </div>
    </template>

    <div v-if="enrollments.length === 0" class="text-center py-8">
      <UIcon name="i-lucide-graduation-cap" class="size-12 text-muted mx-auto mb-3" />
      <p class="font-medium mb-1">No programs yet</p>
      <p class="text-sm text-muted mb-4">Explore our academy programs and start learning</p>
      <UButton to="/academy" color="primary" variant="outline" size="sm">
        Explore Academy
      </UButton>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        class="flex items-start gap-4 p-4 border border-default rounded-lg bg-white"
      >
        <div class="w-32 md:w-44 aspect-video rounded-md overflow-hidden bg-gray-100 shrink-0">
          <NuxtImg
            :src="enrollment.cohort.academy.image_url"
            :alt="enrollment.cohort.academy.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="font-semibold mb-1 leading-tight">{{ enrollment.cohort.academy.title }}</h3>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mb-2">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-layers" class="size-3.5 shrink-0" />
              {{ enrollment.cohort.name }}
            </span>
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-calendar" class="size-3.5 shrink-0" />
              INTAKE: {{ formatDate(enrollment.cohort.start_date) }}
            </span>
            <UBadge
              :color="enrollment.status === 'completed' ? 'success' : enrollment.status === 'active' ? 'primary' : 'warning'"
              variant="subtle"
              size="xs"
            >
              {{ enrollment.status }}
            </UBadge>
          </div>

          <div class="flex justify-end">
            <UButton
              :to="`/dashboard/academy/${enrollment.cohort.id}`"
              variant="link"
              color="neutral"
              size="sm"
              class="text-muted"
            >
              More Detail
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
