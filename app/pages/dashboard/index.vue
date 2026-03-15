<script setup lang="ts">
import type { Academy } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'Dashboard - Rise Social',
  description: 'Dashboard pengguna Rise Social'
})

const { user } = useAuth()
const { api } = useApi()

const { data: academiesData } = await useAsyncData('dashboard:academies', () =>
  api<PaginatedResponse<Academy>>('/academies', {
    params: { status: 'ACTIVE', page: 1, limit: 10 }
  })
)
const academies = computed(() => academiesData.value?.data ?? [])

const dynamicGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const programs = [
  {
    id: 1,
    title: 'Rise Young Leaders Summit',
    image: '/images/ryls_banner.jpg',
    link: '/programs/rise-young-leaders-summit',
    description:
      'Rise Young Leaders Summit is an annual program to improve youth capacity for young people aged 16-25 in various topics. The program encourages youth through competitions for fully and partially funded Leadership Trip Programs in 6 lot of countries.'
  },
  {
    id: 2,
    title: 'Rise Sustainability Academy',
    image: '/images/rise_educator.png',
    link: '/academy',
    description:
      'Rise Sustainability Academy is an online learning program started from 1 up to 5 months live class with experts and mentor to student get comprehensive understanding in various sustainability topic.'
  },
  {
    id: 3,
    title: 'Rise & Thrive: Youth Empowerment Program',
    image: '/images/programs/rise-and-thrive/rise_and_thrive_1.jpeg',
    link: '/programs/rise-and-thrive',
    description:
      'Rise & Thrive: Youth Empowerment Program is designed to empower youth by equipping them with the skills, mindset, and opportunities to transform local resources into sustainable economic ventures.'
  }
]
</script>

<template>
  <div class="space-y-6">
    <div
      class="relative rounded-xl bg-[#0E5C59] text-white px-6 pt-16 pb-12 sm:px-10 overflow-hidden"
    >
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
        {{ dynamicGreeting }}, {{ user.first_name }}!
      </h1>
      <p class="text-base mb-8 opacity-90">
        Continue your learning journey or explore new academy programs!
      </p>
      <div class="flex flex-wrap gap-3">
        <UButton color="primary" to="/dashboard/academy">Continue Learning</UButton>
        <UButton
          color="neutral"
          variant="ghost"
          to="/academy"
          class="text-white! hover:bg-white/15!"
        >
          Explore Academy
        </UButton>
      </div>
      <img
        src="/images/dashboard/graphic.png"
        alt=""
        aria-hidden="true"
        class="absolute -right-16 -bottom-8 h-56 md:h-80 opacity-5 pointer-events-none"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold">Academy</h2>
            <UButton variant="link" color="neutral" size="sm" to="/academy" class="text-muted">
              View All
            </UButton>
          </div>
        </template>
        <div class="space-y-3">
          <NuxtLink
            v-for="academy in academies"
            :key="academy.id"
            :to="`/academy/${academy.slug}`"
            class="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-default hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div class="size-16 sm:size-20 rounded-md overflow-hidden bg-gray-100 shrink-0">
              <NuxtImg
                :src="academy.image_url"
                :alt="academy.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-base font-medium mb-1 line-clamp-1">{{ academy.title }}</p>
              <p class="text-sm text-muted line-clamp-2 leading-relaxed">
                {{ academy.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold">Saved Jobs</h2>
            <UButton
              variant="link"
              color="neutral"
              size="sm"
              to="/dashboard/jobs"
              class="text-muted"
            >
              View All
            </UButton>
          </div>
        </template>
        <div class="flex flex-col items-center justify-center py-12 text-center gap-3">
          <UIcon name="i-lucide-bookmark" class="size-12 text-muted" />
          <p class="text-sm text-muted">No saved jobs</p>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-lg font-bold">Rise Social Programs</h2>
      </template>
      <div class="space-y-4">
        <div
          v-for="program in programs"
          :key="program.id"
          class="flex flex-col sm:flex-row items-start gap-6 p-4 rounded-lg border border-transparent hover:bg-gray-50 hover:border-default transition-colors"
        >
          <div class="size-20 sm:size-36 rounded-md overflow-hidden shrink-0">
            <NuxtImg
              :src="program.image"
              :alt="program.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-semibold mb-2">{{ program.title }}</h3>
            <p class="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
              {{ program.description }}
            </p>
            <div class="flex justify-end">
              <UButton variant="outline" size="sm" color="neutral" :to="program.link">
                More Detail
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
