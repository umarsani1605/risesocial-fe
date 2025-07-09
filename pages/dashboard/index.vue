<template>
  <div class="bg-slate-50 mt-16 md:mt-10">
    <div class="container-wrapper section-py-md relative">
      <!-- Welcome Section -->
      <div class="relative bg-[#0E5C59] shadow rounded-xl p-4 sm:px-10 sm:pt-14 sm:pb-10 text-white mb-6 sm:mb-8 overflow-hidden z-10">
        <h1 class="text-xl sm:text-2xl md:text-4xl font-bold mb-6">{{ dynamicGreeting }}, {{ user?.firstName || 'User' }}!</h1>
        <p class="text-base mb-8">{{ welcomeMessage }}</p>
        <div class="flex flex-col sm:flex-row mt-8 gap-3 sm:gap-4">
          <Button @click="navigateTo('/dashboard/bootcamp')"> Continue Learning</Button>
          <Button variant="outline" class="bg-white/10 hover:bg-white/15 border-none text-white!" @click="navigateTo('/bootcamp')">
            Explore Bootcamp
          </Button>
        </div>
        <img
          src="/images/dashboard/graphic.png"
          alt="Hero Image"
          class="h-[16rem] md:h-[32rem] absolute -right-24 md:-right-24 -bottom-12 md:-top-16 opacity-5 z-10"
        />
      </div>
      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 z-30">
        <!-- Bootcamp -->
        <Card class="border border-gray-50 gap-3">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="heading-card">Bootcamp</CardTitle>
              <Button variant="link" size="sm" class="text-slate-500 hover:text-slate-600" @click="navigateTo('/bootcamp')"> View All </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Dynamic Bootcamp Cards -->
            <div
              v-for="bootcamp in bootcampsData"
              :key="bootcamp.id"
              @click="navigateTo(`/bootcamp/${bootcamp.path_slug}`)"
              class="flex items-start space-x-3 sm:space-x-4 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
            >
              <div class="size-16 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img :src="bootcamp.image" :alt="bootcamp.title" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm sm:text-base font-medium text-gray-900 mb-2">{{ bootcamp.title }}</h3>
                <!-- Description -->
                <p
                  class="text-xs sm:text-sm text-gray-600 leading-relaxed"
                  style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden"
                >
                  {{ bootcamp.description }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Pekerjaan Tersimpan -->
        <Card class="border border-gray-50 gap-3 z-30">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="heading-card">Saved Jobs</CardTitle>
              <Button variant="link" size="sm" class="text-slate-500 hover:text-slate-600" @click="navigateTo('/dashboard/jobs')"> View All </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- No Favorite Jobs Message -->
            <div v-if="favoriteJobs.length === 0" class="text-center py-8">
              <Icon name="lucide:bookmark" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 text-sm">No saved jobs</p>
              <Button variant="link" size="sm" class="text-slate-500 hover:text-slate-600" @click="navigateTo('/dashboard/jobs')"> View All </Button>
            </div>

            <!-- Dynamic Job Cards -->
            <div
              v-for="job in favoriteJobs"
              :key="job.id"
              @click="navigateTo(getJobDetailUrl(job))"
              class="flex items-center h-[6.25rem] space-x-3 sm:space-x-8 p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
            >
              <div class="size-12 sm:size-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img :src="getJobImage(job)" :alt="job.organization" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0 space-y-1">
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">{{ job.title }}</h3>
                <p class="text-xs sm:text-sm text-gray-600 truncate">{{ job.organization }}</p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <Icon name="lucide:map-pin" class="h-3 w-3" />
                  <span>{{ job.cleanLocation }}</span>
                  <span>•</span>
                  <span>{{ formatEmploymentType(job.employment_type) }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Program Rise Social -->
      <Card class="border border-gray-50 gap-3">
        <CardHeader>
          <CardTitle class="heading-card">Program Rise Social</CardTitle>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Program Card 1 -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 border rounded-lg transition-all duration-200 hover:border-gray-300"
          >
            <div class="size-20 sm:size-36 rounded-md flex-shrink-0 flex items-center justify-center">
              <img src="/images/rise-young-leaders/banner.png" alt="Rise Young Leaders Summit" class="w-full h-full object-cover rounded-md" />
            </div>
            <div class="flex-1 min-w-0 w-full">
              <h3 class="heading-card-sm mb-2">Rise Young Leaders Summit</h3>
              <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Program pengembangan kepemimpinan berkelanjutan untuk generasi muda yang ingin menciptakan dampak positif bagi lingkungan dan
                masyarakat.
              </p>

              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                <div class="flex items-center text-xs sm:text-sm text-gray-500">
                  <Icon name="lucide:calendar" class="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>8 - 15 Juni 2025</span>
                </div>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" @click="navigateTo('/programs/rise-young-leaders-summit')"> More Detail </Button>
                  <Button size="sm" @click="navigateTo('/programs/rise-young-leaders-summit')"> Register Now </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Program Card 2 -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 border rounded-lg transition-all duration-200 hover:border-gray-300"
          >
            <div class="size-20 sm:size-36 rounded-md flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/rise-young-leaders/gallery-4.png"
                alt="Rise Educator's Skills Accelerator"
                class="w-full h-full object-cover rounded-md"
              />
            </div>
            <div class="flex-1 min-w-0 w-full">
              <h3 class="heading-card-sm mb-2">Rise Educator's Skills Accelerator</h3>
              <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Program pelatihan untuk pendidik yang ingin mengintegrasikan pendidikan berkelanjutan dalam kurikulum pembelajaran mereka.
              </p>
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:gap-3">
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" @click="navigateTo('/programs/rise-young-leaders-summit')"> More Detail </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Set layout untuk halaman ini
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

// Get user data
const { data: session } = useAuth();
const user = computed(() => session.value?.user || null);

// Get courses data
const { coursesData, getCourseProgress, getCourseModulesCount } = useCourses();

// Get bootcamp data
const { bootcampsData } = useBootcamps();

// Get jobs data
const { getLimitedFavoriteJobs, formatEmploymentType, getJobImage, getJobDetailUrl, toggleFavorite, isFavorite } = useJobs();

// Dynamic greeting based on time
const dynamicGreeting = computed(() => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
});

// Welcome message
const welcomeMessage = computed(() => {
  return 'Continue your learning journey or explore new bootcamp programs!';
});

// User's favorite jobs for dashboard
const favoriteJobs = computed(() => {
  return getLimitedFavoriteJobs(2);
});

// Meta tags
useSeoMeta({
  title: 'Dashboard - Rise Social',
  description: 'Dashboard pengguna Rise Social untuk mengelola kursus, pekerjaan, dan program',
});
</script>
