<script setup lang="ts">
import type { CohortEnrollment } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'Dashboard - Rise Social',
  description: 'Dashboard pengguna Rise Social'
})

const { user } = useAuth()

// TODO: Replace with real API call — await useAsyncData('dashboard:enrollments', ...)
const enrollments = ref<CohortEnrollment[]>([
  {
    id: 1,
    user_id: 1,
    cohort_id: 5,
    academy_id: 1,
    status: 'active',
    created_at: '2026-02-25T00:00:00.000Z',
    cohort: {
      id: 5,
      name: 'Cohort 5',
      status: 'ONGOING',
      start_date: '2026-02-25',
      end_date: '2026-06-25',
      academy: {
        id: 1,
        title: 'Data Science & Machine Learning Professional',
        slug: 'data-science',
        image_url: '/images/academy/data-science.jpg',
        duration: '4 bulan',
        format: 'Live Class',
        certificate: true,
        description: null
      }
    }
  },
  {
    id: 2,
    user_id: 1,
    cohort_id: 3,
    academy_id: 2,
    status: 'active',
    created_at: '2026-02-25T00:00:00.000Z',
    cohort: {
      id: 3,
      name: 'Cohort 3',
      status: 'ONGOING',
      start_date: '2026-02-25',
      end_date: '2026-06-25',
      academy: {
        id: 2,
        title: 'Full Stack Web Development Bootcamp',
        slug: 'full-stack',
        image_url: '/images/academy/fullstack.jpg',
        duration: '3 bulan',
        format: 'Live Class',
        certificate: true,
        description: null
      }
    }
  },
  {
    id: 3,
    user_id: 1,
    cohort_id: 2,
    academy_id: 3,
    status: 'pending',
    created_at: '2025-12-01T00:00:00.000Z',
    cohort: {
      id: 2,
      name: 'Cohort 2',
      status: 'UPCOMING',
      start_date: '2025-12-27',
      end_date: '2026-05-27',
      academy: {
        id: 3,
        title: 'ESG Academy: Sustainability & Impact Leadership',
        slug: 'esg-academy',
        image_url: '/images/academy/esg.jpg',
        duration: '5 bulan',
        format: 'Live Class',
        certificate: true,
        description: null
      }
    }
  },
  {
    id: 4,
    user_id: 1,
    cohort_id: 1,
    academy_id: 3,
    status: 'completed',
    created_at: '2025-06-01T00:00:00.000Z',
    cohort: {
      id: 1,
      name: 'Cohort 1',
      status: 'COMPLETED',
      start_date: '2025-02-25',
      end_date: '2025-07-25',
      academy: {
        id: 3,
        title: 'ESG Academy: Sustainability & Impact Leadership',
        slug: 'esg-academy',
        image_url: '/images/academy/esg.jpg',
        duration: '5 bulan',
        format: 'Live Class',
        certificate: true,
        description: null
      }
    }
  }
])

const dynamicGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const activeEnrollment = computed(() =>
  enrollments.value.find(e => e.status === 'active') ?? null
)

const displayedEnrollments = computed(() =>
  enrollments.value.slice(0, 6)
)

const dynamicSubtitle = computed(() =>
  activeEnrollment.value
    ? 'Lanjutkan perjalanan belajarmu dari sesi sebelumnya.'
    : 'Mulai perjalanan belajarmu dan eksplorasi program akademi kami.'
)

function statusBadgeColor(status: string) {
  if (status === 'completed') return 'success' as const
  if (status === 'active') return 'primary' as const
  return 'warning' as const
}

const programs = [
  {
    id: 1,
    title: 'Rise Young Leaders Summit',
    image: '/images/ryls_banner.jpg',
    link: '/programs/rise-young-leaders-summit',
    description:
      'Rise Young Leaders Summit adalah program tahunan untuk meningkatkan kapasitas kepemimpinan pemuda usia 16-25 tahun melalui berbagai topik dan kompetisi.'
  },
  {
    id: 2,
    title: 'Rise Sustainability Academy',
    image: '/images/rise_educator.png',
    link: '/academy',
    description:
      'Program pembelajaran online 1-5 bulan live class bersama pakar dan mentor untuk pemahaman komprehensif di berbagai topik keberlanjutan.'
  },
  {
    id: 3,
    title: 'Rise & Thrive: Youth Empowerment Program',
    image: '/images/programs/rise-and-thrive/rise_and_thrive_1.jpeg',
    link: '/programs/rise-and-thrive',
    description:
      'Program pemberdayaan pemuda dengan membekali keterampilan, mindset, dan peluang untuk mengubah sumber daya lokal menjadi usaha ekonomi berkelanjutan.'
  }
]
</script>

<template>
  <div class="space-y-8">
    <!-- ─── Hero Banner ─── -->
    <div class="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#073635] to-[#0E5C59] text-white">
      <!-- Radial glow -->
      <div class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <!-- Botanical graphic -->
      <img
        src="/images/dashboard/graphic.png"
        alt=""
        aria-hidden="true"
        class="absolute -right-10 -bottom-6 h-64 md:h-96 opacity-[0.08] pointer-events-none select-none"
      />

      <div class="relative px-8 sm:px-12 pt-10 sm:pt-14 pb-10 sm:pb-14 max-w-2xl">
        <!-- Pill label -->
        <div class="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-medium mb-5 backdrop-blur-sm">
          <UIcon name="i-ph-graduation-cap-bold" class="size-3.5" />
          Learning Hub
        </div>

        <!-- Greeting -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight tracking-tight">
          <ClientOnly fallback-tag="span" fallback="Welcome back">{{ dynamicGreeting }}</ClientOnly>,
          {{ user?.first_name }}!
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg mb-8 opacity-85 leading-relaxed">
          {{ dynamicSubtitle }}
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap gap-3">
          <UButton
            color="primary"
            size="lg"
            to="/dashboard/academy"
            icon="i-ph-play-circle-bold"
          >
            Continue Learning
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            size="lg"
            to="/academy"
            class="text-white! hover:bg-white/15!"
          >
            Explore Academy
          </UButton>
        </div>
      </div>
    </div>

    <!-- ─── Continue Learning (Featured) ─── -->
    <section v-if="activeEnrollment">
      <div class="flex items-center gap-2 mb-4">
        <UIcon name="i-ph-play-circle-fill" class="size-5 text-primary" />
        <h2 class="text-lg font-bold">Lanjutkan Belajar</h2>
      </div>

      <NuxtLink :to="`/dashboard/academy/${activeEnrollment.cohort.id}`" class="block group">
        <div
          class="flex flex-col sm:flex-row gap-0 rounded-2xl border border-default hover:border-primary/40 hover:shadow-lg transition-all duration-200 overflow-hidden bg-white"
        >
          <!-- Course image -->
          <div class="w-full sm:w-72 md:w-80 aspect-video sm:aspect-auto overflow-hidden bg-gray-100 shrink-0">
            <NuxtImg
              :src="activeEnrollment.cohort.academy.image_url ?? ''"
              :alt="activeEnrollment.cohort.academy.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- Course info -->
          <div class="flex-1 flex flex-col justify-between p-6">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <UBadge color="neutral" variant="subtle" size="sm">
                  {{ activeEnrollment.cohort.name }}
                </UBadge>
                <UBadge color="primary" variant="subtle" size="sm">
                  Active
                </UBadge>
                <UBadge
                  v-if="activeEnrollment.cohort.academy.certificate"
                  color="success"
                  variant="subtle"
                  size="sm"
                  icon="i-ph-certificate-bold"
                >
                  Certificate
                </UBadge>
              </div>
              <h3 class="text-xl font-bold leading-snug mb-2">
                {{ activeEnrollment.cohort.academy.title }}
              </h3>
              <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
                <span class="flex items-center gap-1.5">
                  <UIcon name="i-ph-calendar-bold" class="size-4 shrink-0" />
                  Mulai {{ formatDate(activeEnrollment.cohort.start_date) }}
                </span>
                <span v-if="activeEnrollment.cohort.academy.duration" class="flex items-center gap-1.5">
                  <UIcon name="i-ph-clock-bold" class="size-4 shrink-0" />
                  {{ activeEnrollment.cohort.academy.duration }}
                </span>
                <span v-if="activeEnrollment.cohort.academy.format" class="flex items-center gap-1.5">
                  <UIcon name="i-ph-video-camera-bold" class="size-4 shrink-0" />
                  {{ activeEnrollment.cohort.academy.format }}
                </span>
              </div>
            </div>

            <div class="mt-5">
              <UButton color="primary" size="md" trailing-icon="i-ph-arrow-right-bold">
                Lanjutkan
              </UButton>
            </div>
          </div>
        </div>
      </NuxtLink>
    </section>

    <!-- ─── My Courses ─── -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Kursus Saya</h2>
        <UButton variant="link" color="neutral" size="sm" to="/dashboard/academy" class="text-muted">
          Lihat Semua
        </UButton>
      </div>

      <!-- Empty state -->
      <div
        v-if="displayedEnrollments.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center gap-3 rounded-2xl border border-dashed border-default"
      >
        <UIcon name="i-ph-graduation-cap-bold" class="size-12 text-muted" />
        <div>
          <p class="font-medium text-sm">Belum ada kursus</p>
          <p class="text-sm text-muted mt-1">Daftar ke program akademi untuk mulai belajar</p>
        </div>
        <UButton to="/academy" color="primary" variant="outline" size="sm" class="mt-1">
          Explore Academy
        </UButton>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="enrollment in displayedEnrollments"
          :key="enrollment.id"
          :to="`/dashboard/academy/${enrollment.cohort.id}`"
          class="block group"
        >
          <div
            class="rounded-xl border border-default hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden bg-white h-full flex flex-col"
          >
            <!-- Thumbnail -->
            <div class="aspect-video bg-gray-100 overflow-hidden shrink-0">
              <NuxtImg
                :src="enrollment.cohort.academy.image_url ?? ''"
                :alt="enrollment.cohort.academy.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <!-- Info -->
            <div class="p-4 flex flex-col flex-1">
              <p class="font-semibold leading-snug line-clamp-2 mb-1">
                {{ enrollment.cohort.academy.title }}
              </p>
              <p class="text-sm text-muted mb-3">{{ enrollment.cohort.name }}</p>

              <div class="flex items-center justify-between mt-auto">
                <span class="flex items-center gap-1.5 text-xs text-muted">
                  <UIcon name="i-ph-calendar-bold" class="size-3.5 shrink-0" />
                  {{ formatDate(enrollment.cohort.start_date) }}
                </span>
                <UBadge
                  :color="statusBadgeColor(enrollment.status)"
                  variant="subtle"
                  size="xs"
                >
                  {{ enrollment.status }}
                </UBadge>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ─── Discover Programs ─── -->
    <section>
      <h2 class="text-lg font-bold mb-4">Program Rise Social</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          v-for="program in programs"
          :key="program.id"
          :to="program.link"
          class="block group"
        >
          <div
            class="rounded-xl border border-default hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden bg-white h-full flex flex-col"
          >
            <!-- Image -->
            <div class="aspect-video bg-gray-100 overflow-hidden shrink-0">
              <NuxtImg
                :src="program.image"
                :alt="program.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <!-- Info -->
            <div class="p-4 flex flex-col flex-1">
              <h3 class="font-semibold leading-snug line-clamp-2 mb-2">
                {{ program.title }}
              </h3>
              <p class="text-sm text-muted leading-relaxed line-clamp-3 flex-1">
                {{ program.description }}
              </p>
              <div class="mt-4">
                <UButton
                  variant="outline"
                  size="sm"
                  color="neutral"
                  block
                  trailing-icon="i-ph-arrow-right-bold"
                >
                  Lihat Detail
                </UButton>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
