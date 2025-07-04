<template>
  <div class="bg-gray-50 mt-10">
    <div class="container-wrapper section-py-md">
      <!-- Welcome Section -->
      <div class="bg-secondary rounded-xl p-4 sm:p-10 text-white mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl opacity-80 md:text-3xl font-bold mb-2">{{ dynamicGreeting }}, {{ user?.firstName || 'User' }}!</h1>
        <p class="text-base opacity-80 mb-6">{{ welcomeMessage }}</p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row mt-8 gap-3 sm:gap-4">
          <Button @click="navigateTo('/dashboard/course')"> Lanjut Belajar </Button>
          <Button variant="outline" @click="navigateTo('/courses')"> Eksplor Kursus Baru </Button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Kursus Saya -->
        <Card class="p-4 sm:p-6">
          <CardHeader class="p-0 mb-4 sm:mb-6">
            <div class="flex items-center justify-between">
              <CardTitle class="heading-card">Kursus Saya</CardTitle>
              <Button variant="link" size="sm" class="text-primary hover:text-primary/90" @click="navigateTo('/dashboard/course')">
                Lihat Semua
              </Button>
            </div>
          </CardHeader>

          <CardContent class="p-0 space-y-4">
            <!-- Course Card 1 -->
            <div
              @click="navigateTo('/courses/climate-science-fundamentals/introduction-to-climate-science')"
              class="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="lucide:book-open" class="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs sm:text-sm font-medium text-gray-500">Climate Science Fundamentals</p>
                  <Badge class="bg-green-100 text-green-800 text-xs">Selesai</Badge>
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">Introduction to Climate Science</h3>
                <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2">
                  <div class="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500" style="width: 100%"></div>
                </div>
              </div>
            </div>

            <!-- Course Card 2 -->
            <div
              @click="navigateTo('/courses/climate-science-fundamentals/climate-change-impacts')"
              class="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="lucide:play-circle" class="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs sm:text-sm font-medium text-gray-500">Climate Science Fundamentals</p>
                  <Badge variant="secondary" class="bg-yellow-100 text-yellow-800 text-xs">Progress</Badge>
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">Climate Change Impacts</h3>
                <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2">
                  <div class="bg-yellow-400 h-1.5 sm:h-2 rounded-full transition-all duration-500" style="width: 75%"></div>
                </div>
              </div>
            </div>

            <!-- Course Card 3 -->
            <div
              @click="navigateTo('/courses/sustainable-software-development/programming-fundamentals')"
              class="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="lucide:code" class="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs sm:text-sm font-medium text-gray-500">Sustainable Software Development</p>
                  <Badge class="bg-green-100 text-green-800 text-xs">Selesai</Badge>
                </div>
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">Programming Fundamentals</h3>
                <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2">
                  <div class="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500" style="width: 100%"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Pekerjaan Tersimpan -->
        <Card class="p-4 sm:p-6">
          <CardHeader class="p-0 mb-4 sm:mb-6">
            <div class="flex items-center justify-between">
              <CardTitle class="heading-card">Pekerjaan Tersimpan</CardTitle>
              <Button variant="link" size="sm" class="text-primary hover:text-primary/90" @click="navigateTo('/dashboard/jobs')">
                Lihat Semua
              </Button>
            </div>
          </CardHeader>

          <CardContent class="p-0 space-y-4">
            <!-- Job Card 1 -->
            <div
              @click="navigateTo('/opportunities/pt-ajisaka-nusa-ilmu/social-media-officer')"
              class="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex-shrink-0 flex items-center justify-center">
                <Icon name="lucide:briefcase" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0 space-y-1">
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">Social Media Officer</h3>
                <p class="text-xs sm:text-sm text-gray-600 truncate">PT Ajisaka Nusa Ilmu</p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <Icon name="lucide:map-pin" class="h-3 w-3" />
                  <span>Sleman, Yogyakarta</span>
                  <span>•</span>
                  <span>Part-time</span>
                </div>
              </div>
              <Icon name="lucide:bookmark" class="h-4 w-4 text-primary flex-shrink-0" />
            </div>

            <!-- Job Card 2 -->
            <div
              @click="navigateTo('/opportunities/viva-health/asisten-apoteker')"
              class="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex-shrink-0 flex items-center justify-center">
                <Icon name="lucide:stethoscope" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0 space-y-1">
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">Asisten Apoteker</h3>
                <p class="text-xs sm:text-sm text-gray-600 truncate">Viva Health</p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <Icon name="lucide:map-pin" class="h-3 w-3" />
                  <span>Semarang, Jawa Tengah</span>
                  <span>•</span>
                  <span>Full-time</span>
                </div>
              </div>
              <Icon name="lucide:bookmark" class="h-4 w-4 text-primary flex-shrink-0" />
            </div>

            <!-- Job Card 3 -->
            <div
              class="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex-shrink-0 flex items-center justify-center">
                <Icon name="lucide:laptop" class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0 space-y-1">
                <h3 class="text-sm sm:text-base font-medium text-gray-900 truncate">Sustainability Analyst</h3>
                <p class="text-xs sm:text-sm text-gray-600 truncate">Green Future Corporation</p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <Icon name="lucide:map-pin" class="h-3 w-3" />
                  <span>Jakarta, Indonesia</span>
                  <span>•</span>
                  <span>Full-time</span>
                </div>
              </div>
              <Icon name="lucide:bookmark" class="h-4 w-4 text-primary flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Program Rise Social -->
      <Card class="p-4 sm:p-6">
        <CardHeader class="p-0 mb-4 sm:mb-6">
          <CardTitle class="heading-card">Program Rise Social</CardTitle>
        </CardHeader>

        <CardContent class="p-0 space-y-4 sm:space-y-6">
          <!-- Program Card 1 -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 border rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div class="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center">
              <Icon name="lucide:users" class="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <div class="flex-1 min-w-0 w-full">
              <h3 class="heading-card-sm mb-2">Rise Young Leaders Summit</h3>
              <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Program pengembangan kepemimpinan berkelanjutan untuk generasi muda yang ingin menciptakan dampak positif bagi lingkungan dan
                masyarakat.
              </p>
              <div class="flex items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                <Icon name="lucide:calendar" class="h-4 w-4 mr-2 flex-shrink-0" />
                <span>8 - 15 Juni 2025</span>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  class="border-gray-300 text-gray-700 hover:bg-gray-50"
                  @click="navigateTo('/programs/rise-young-leaders-summit')"
                >
                  Lebih Detail
                </Button>
                <Button class="bg-primary hover:bg-primary/90 text-white" size="sm" @click="navigateTo('/programs/rise-young-leaders-summit')">
                  Daftar Sekarang
                </Button>
              </div>
            </div>
          </div>

          <!-- Program Card 2 -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 border rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div class="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center">
              <Icon name="lucide:graduation-cap" class="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <div class="flex-1 min-w-0 w-full">
              <h3 class="heading-card-sm mb-2">Rise Educator's Skills Accelerator</h3>
              <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Program pelatihan untuk pendidik yang ingin mengintegrasikan pendidikan berkelanjutan dalam kurikulum pembelajaran mereka.
              </p>
              <div class="flex justify-start sm:justify-end">
                <Button variant="outline" size="sm" class="border-gray-300 text-gray-700 hover:bg-gray-50"> Lihat Detail </Button>
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

// Dynamic greeting based on time
const dynamicGreeting = computed(() => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Selamat pagi';
  } else if (hour >= 12 && hour < 18) {
    return 'Selamat siang';
  } else {
    return 'Selamat malam';
  }
});

// Welcome message
const welcomeMessage = computed(() => {
  return 'Lanjutkan proses belajarmu atau eksplorasi kursus baru';
});

// Meta tags
useSeoMeta({
  title: 'Dashboard - Rise Social',
  description: 'Dashboard pengguna Rise Social untuk mengelola kursus, pekerjaan, dan program',
});
</script>
