<script setup lang="ts">
import type { Job } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'Jobs - Rise Social',
  description: 'Kelola pekerjaan yang disimpan dan temukan rekomendasi pekerjaan baru'
})

const { api } = useApi()

const { data: jobsData } = await useAsyncData('dashboard:jobs', () =>
  api<PaginatedResponse<Job>>('/jobs', { params: { page: 1, limit: 6 } })
)

const latestJobs = computed(() => jobsData.value?.data ?? [])
const savedJobs = ref<Job[]>([])
</script>

<template>
  <div class="space-y-6">
    <!-- Saved Jobs -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-lg">Saved Jobs</h2>
      </template>

      <div v-if="savedJobs.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <UIcon name="i-lucide-bookmark" class="size-12 text-muted" />
        <p class="font-medium">No saved jobs</p>
        <p class="text-sm text-muted">Save jobs that interest you to see them here</p>
        <UButton variant="outline" size="sm" color="neutral" to="/opportunities">
          Explore Jobs
        </UButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SharedJobCard v-for="job in savedJobs" :key="job.id" :job="job" />
      </div>
    </UCard>

    <!-- Latest Jobs -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-lg">Latest Jobs</h2>
          <UButton variant="link" color="neutral" size="sm" to="/opportunities" class="text-muted">
            View All Jobs
          </UButton>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SharedJobCard v-for="job in latestJobs" :key="job.id" :job="job" />
      </div>
    </UCard>
  </div>
</template>
