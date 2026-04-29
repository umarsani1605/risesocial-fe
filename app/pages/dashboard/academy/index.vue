<script setup lang="ts">
import type { CohortEnrollment } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'My Programs - Rise Social',
  description: 'Kelola cohort dan progres pembelajaran Anda di Rise Social'
})

const { api } = useApi()
const { data: enrollmentsData } = await useAsyncData('dashboard:enrollments', () =>
  api<PaginatedResponse<CohortEnrollment>>('/cohorts/my')
)
const STATUS_ORDER: Record<string, number> = { ongoing: 0, not_started: 1, completed: 2 }

const enrollments = computed(() =>
  [...(enrollmentsData.value?.data ?? [])].sort(
    (a, b) => (STATUS_ORDER[a.cohort?.status ?? ''] ?? 99) - (STATUS_ORDER[b.cohort?.status ?? ''] ?? 99)
  )
)
</script>

<template>
  <UCard class="h-full border border-default/50" :ui="{ header: 'p-0!', body: 'p-6! pt-4!' }">
    <template #header>
      <div class="flex flex-col items-stretch">
        <div class="flex items-center justify-between gap-4 px-6 py-4 pb-0">
          <div class="flex items-center gap-4">
            <div
              class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <UIcon name="i-ph-notebook-fill" class="size-4" />
            </div>
            <h2 class="font-bold text-xl text-slate-800">My Academy</h2>
          </div>
          <UButton variant="link" color="neutral" size="md" to="/academy" class="text-muted">
            Explore All
          </UButton>
        </div>
        <USeparator class="mt-4" :ui="{ border: 'border-slate-100' }" />
      </div>
    </template>

    <div v-if="enrollments.length === 0" class="text-center py-8">
      <UIcon name="i-ph-graduation-cap-bold" class="size-12 text-muted mx-auto mb-3" />
      <p class="font-medium mb-1">No programs yet</p>
      <p class="text-sm text-muted mb-4">Explore our academy programs and start learning</p>
      <UButton to="/academy" color="primary" variant="outline" size="sm"> Explore Academy </UButton>
    </div>

    <div v-else class="flex flex-col gap-4">
      <DashboardAcademyEnrollmentItem
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        :enrollment="enrollment"
      />
    </div>
  </UCard>
</template>
