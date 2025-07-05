<template>
  <div class="bg-slate-50 mt-10">
    <div class="container-wrapper section-py-md">
      <!-- Programs Section -->
      <Card class="border border-gray-50">
        <CardHeader>
          <CardTitle class="heading-card">Programs</CardTitle>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Program Cards -->
          <div
            v-for="program in programs"
            :key="program.id"
            class="flex space-x-3 sm:space-x-4 p-2 border rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
          >
            <div class="size-12 sm:size-32 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img :src="program.image" :alt="program.title" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0 space-y-2 py-3">
              <h3 class="text-sm sm:text-xl font-semibold text-gray-900">{{ program.title }}</h3>
              <p class="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">{{ program.description }}</p>
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
