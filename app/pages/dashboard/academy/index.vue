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
      <NuxtLink
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        :to="`/dashboard/academy/${enrollment.cohort.id}`"
        class="block group"
      >
        <UCard :ui="{ root: 'shadow-sm' }">
          <div class="flex gap-4 md:gap-6">
            <!-- Image: small, left, rectangular -->
            <div class="w-36 md:w-44 shrink-0 rounded-lg overflow-hidden bg-gray-100 aspect-video self-start">
              <NuxtImg
                v-if="enrollment.cohort.academy.image_url"
                :src="enrollment.cohort.academy.image_url"
                :alt="enrollment.cohort.academy.title"
                class="w-full h-full object-cover"
                format="webp"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-lucide-image" class="size-8 text-gray-400" />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h3 class="font-bold text-lg leading-tight mb-2">
                  {{ enrollment.cohort.academy.title }}
                </h3>
                <!-- Metadata: inline row -->
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mb-3">
                  <span v-if="enrollment.cohort.academy.duration" class="flex items-center gap-1">
                    <UIcon name="i-lucide-clock" class="size-3.5 shrink-0" />
                    {{ enrollment.cohort.academy.duration }}
                  </span>
                  <span v-if="enrollment.cohort.academy.format" class="flex items-center gap-1">
                    <UIcon name="i-lucide-video" class="size-3.5 shrink-0" />
                    {{ enrollment.cohort.academy.format }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-calendar" class="size-3.5 shrink-0" />
                    INTAKE: {{ formatDate(enrollment.cohort.start_date) }}
                  </span>
                  <span v-if="enrollment.cohort.academy.certificate" class="flex items-center gap-1">
                    <UIcon name="i-lucide-award" class="size-3.5 shrink-0" />
                    Sertifikat
                  </span>
                </div>
                <p v-if="enrollment.cohort.academy.description" class="text-sm text-muted line-clamp-2 leading-relaxed">
                  {{ enrollment.cohort.academy.description }}
                </p>
              </div>
              <div class="flex justify-end mt-3">
                <span class="text-sm text-muted group-hover:text-gray-700 transition-colors">More Detail</span>
              </div>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UCard>
</template>
