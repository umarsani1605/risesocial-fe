<script setup lang="ts">
import type { Academy } from '@/types'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Rise Sustainability Academy - Rise Social',
  description:
    "Rise Educator's Skills Accelerator is an online learning program with live classes and mentors to get comprehensive understanding in sustainability topics."
})

const { api } = useApi()
const page = ref(1)
const { data: academiesData, status, error } = await useAsyncData(
  'academies',
  () => api<PaginatedResponse<Academy>>('/academies', { params: { status: 'ACTIVE', page: page.value } }),
  { watch: [page] }
)
if (error.value) throw createError({ statusCode: 500, message: 'Failed to load academies' })

const academies = computed(() => academiesData.value?.data ?? [])
const pagination = computed(() => academiesData.value?.pagination)
const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <div>
    <UPageSection>
      <div class="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
        <div class="flex-1 space-y-6 lg:space-y-8">
          <h1 class="text-2xl sm:text-3xl lg:text-6xl font-bold leading-tight">
            Rise Sustainability Academy
          </h1>
          <div class="space-y-3 lg:space-y-4">
            <p class="text-base lg:text-lg text-muted leading-relaxed">
              Rise Sustainability Academy is an online learning program started from 1 up to 5
              months live class with experts and mentor to student get comprehensive understanding
              in various sustainability topic.
            </p>
            <p class="text-base lg:text-lg text-muted leading-relaxed">
              This program is for young professional, career switchers, sustainability and green
              workers to improve their knowledge and skills in this topic, equipped with
              <span class="font-semibold">JOB ACCELERATOR program</span> with our hiring partners.
            </p>
          </div>
        </div>
        <div class="relative flex-1 flex items-end justify-end">
          <NuxtImg
            src="/images/rise-young-leaders/gallery-4.png"
            alt="Rise Sustainability Academy - Online learning with experts and mentors"
            class="w-full aspect-3/2 object-cover rounded-2xl shadow-xl"
            format="webp"
          />
        </div>
      </div>
    </UPageSection>

    <UPageSection>
      <div>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Available Academy Programs</h2>
        <p class="text-base lg:text-lg text-muted">
          Choose from our specialized academy programs designed to accelerate your sustainability
          career
        </p>
      </div>

      <div v-if="isLoading" class="space-y-4 lg:space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <UCard>
            <div class="flex flex-col-reverse lg:flex-row gap-8">
              <div class="flex-4 space-y-4">
                <div class="h-8 bg-slate-200 rounded w-3/4" />
                <div class="h-4 bg-slate-200 rounded w-1/2" />
                <div class="h-20 bg-slate-200 rounded" />
              </div>
              <div class="flex-1">
                <div class="h-48 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <div v-else class="space-y-4 lg:space-y-6">
        <NuxtLink
          v-for="academy in academies"

          :key="academy.id"
          :to="`/academy/${academy.slug}`"
          class="block group"
        >
          <UCard
            class="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl"
            :ui="{
              root: 'border-0 shadow-sm'
            }"
          >
            <div class="flex flex-col-reverse lg:flex-row gap-8 lg:gap-10 items-stretch">
              <div class="flex-4 space-y-4 lg:space-y-6">
                <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold">
                  {{ academy.title }}
                </h3>
                <div class="flex flex-wrap items-center gap-2 lg:gap-4 text-sm">
                  <UBadge color="neutral" variant="soft" class="rounded-lg">
                    <UIcon name="i-ph-tag-bold" class="size-3 lg:size-4 mr-1 text-muted" />
                    {{ academy.category }}
                  </UBadge>
                  <UBadge color="neutral" variant="soft" class="rounded-lg">
                    <UIcon name="i-ph-clock-bold" class="size-3 lg:size-4 mr-1 text-muted" />
                    {{ academy.duration }}
                  </UBadge>
                  <UBadge color="neutral" variant="soft" class="rounded-lg">
                    <UIcon name="i-ph-video-bold" class="size-3 lg:size-4 mr-1 text-muted" />
                    {{ academy.format }}
                  </UBadge>
                </div>
                <p class="text-base text-muted leading-relaxed line-clamp-3">
                  {{ academy.description }}
                </p>
              </div>
              <div class="flex-1 relative overflow-hidden items-end justify-end">
                <div
                  class="w-full relative rounded-2xl lg:h-50 aspect-square flex items-center justify-center"
                >
                  <NuxtImg
                    :src="academy.image_url"
                    :alt="academy.title"
                    class="w-full h-full object-cover rounded-lg"
                    format="webp"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center pt-4">
          <UPagination
            v-model:page="page"
            :total="pagination.total"
            :items-per-page="pagination.limit"
          />
        </div>
      </div>
    </UPageSection>
  </div>
</template>
