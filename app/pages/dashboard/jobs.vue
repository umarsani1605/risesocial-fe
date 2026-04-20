<script setup lang="ts">
import type { Job } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'Jobs - Rise Social',
  description: 'Browse the latest jobs and manage your saved opportunities'
})

const { api } = useApi()

const { data: jobsData } = await useAsyncData('dashboard:jobs', () =>
  api<PaginatedResponse<Job>>('/jobs', { params: { page: 1, limit: 8 } })
)

const latestJobs = computed(() => jobsData.value?.data ?? [])
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
              <UIcon name="i-ph-briefcase-fill" class="size-4" />
            </div>
            <h2 class="font-bold text-xl text-slate-800">Latest Jobs</h2>
          </div>
          <UButton variant="link" color="neutral" size="md" to="/opportunities" class="text-muted">
            Explore All
          </UButton>
        </div>
        <USeparator class="mt-4" :ui="{ border: 'border-slate-100' }" />
      </div>
    </template>

    <div v-if="latestJobs.length === 0" class="text-center py-8">
      <UIcon name="i-ph-briefcase-bold" class="size-12 text-muted mx-auto mb-3" />
      <p class="font-medium mb-1">No jobs yet</p>
      <p class="text-sm text-muted mb-4">Explore our jobs and find your dream job</p>
      <UButton to="/opportunities" color="primary" variant="outline" size="sm">
        Explore Jobs
      </UButton>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DashboardJobCard v-for="job in latestJobs" :key="job.id" :job="job" />
    </div>
  </UCard>
</template>
