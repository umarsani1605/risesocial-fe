<template>
  <div class="bg-slate-50 mt-16 md:mt-10">
    <div class="container-wrapper section-py-md">
      <!-- Programs Section -->
      <Card class="border border-gray-50 min-h-[50rem]">
        <CardHeader>
          <div class="flex flex-row items-center justify-between gap-3">
            <CardTitle class="heading-card">Programs</CardTitle>
          </div>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Grid Container for Program Cards -->
          <div class="grid gap-4 lg:gap-6">
            <!-- Program Cards -->
            <div
              v-for="program in programs"
              :key="program.id"
              @click="navigateTo(program.detailUrl)"
              class="group border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300 hover:shadow-md bg-white overflow-hidden"
            >
              <!-- Mobile Layout: Stacked -->
              <div class="block sm:hidden">
                <div class="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <img
                    :src="program.image"
                    :alt="program.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div class="p-4">
                  <h3 class="text-base font-semibold text-gray-900 mb-3 leading-tight">{{ program.title }}</h3>

                  <!-- Description - Mobile -->
                  <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {{ program.description }}
                  </p>
                </div>
              </div>

              <!-- Tablet & Desktop Layout: Horizontal -->
              <div class="hidden sm:flex items-start p-4">
                <div class="size-24 md:size-32 lg:size-36 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden mr-4 lg:mr-6">
                  <img
                    :src="program.image"
                    :alt="program.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 leading-tight">{{ program.title }}</h3>

                  <!-- Description - Tablet/Desktop -->
                  <p class="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3">
                    {{ program.description }}
                  </p>
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Set layout untuk halaman ini
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
});

// Additional programs data
const programs = [
  {
    id: 'ryls-2025',
    title: 'Rise Young Leaders Summit',
    description:
      'Rise Young Leaders Summit is an annual program to improve youth capacity for young people aged 16-25 in various topics. The program encourages youth through competitions for fully and partially funded Leadership Trip Programs in 6 lot of countries.',
    date: '8 - 15 Juni 2025',
    image: '/images/rise-young-leaders/banner.png',
    detailUrl: '/programs/rise-young-leaders-summit',
    registrationUrl: '/programs/rise-young-leaders-summit#registration',
    registrationLabel: 'Daftar Sekarang',
  },
  {
    id: 'educators-accelerator',
    title: "Rise Educator's Skills Accelerator",
    description:
      "Rise Educator's Skills Accelerator is an online learning program started from 1 up to 5 months live class with experts and mentor to student get comprehensive understanding in various sustainability topic. This program is for young professional, career switchers, sustainability and green workers to improve their knowledge and skills in this topic, equipped with JOB ACCELERATOR program with our hiring partners.",
    duration: '6 minggu',
    level: 'Intermediate',
    image: '/images/rise_educator.png',
    detailUrl: '/programs/educators-skills-accelerator',
  },
  {
    id: 'little-hero-camp',
    title: 'Little Hero Camp',
    description:
      'Little Hero Camp is an offline summer training for children aged 7-15 years old. Equipped with various topics in sustainability, to enhance their skills and interests and become more empowered during their summer vacation.',
    duration: '3 hari',
    level: 'Pemula',
    image: '/images/rise_little_hero.png',
    detailUrl: '/programs/little-hero-camp',
  },
];

// Meta tags
useSeoMeta({
  title: 'Programs Management - Rise Social',
  description: 'Kelola program yang diikuti dan temukan program-program baru Rise Social',
});
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
