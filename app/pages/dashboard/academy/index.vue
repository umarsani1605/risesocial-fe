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
    (a, b) =>
      (STATUS_ORDER[a.cohort?.status ?? ''] ?? 99) - (STATUS_ORDER[b.cohort?.status ?? ''] ?? 99)
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

    <div
      v-if="enrollments.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center gap-4 rounded-xl"
    >
      <div
        class="size-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center"
      >
        <UIcon name="i-ph-graduation-cap-bold-duotone" class="size-8 text-slate-400" />
      </div>
      <div>
        <p class="text-base font-semibold text-slate-800">No programs yet</p>
        <p class="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
          Explore our academy programs and start learning.
        </p>
      </div>
      <UButton to="/academy" color="primary" variant="solid" size="sm" class="mt-2">
        Explore Academy
      </UButton>
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
