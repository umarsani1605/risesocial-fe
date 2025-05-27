<script setup>
import { Card, CardContent, CardTitle } from '@/components/ui/card';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'About Us - Rise Social',
  meta: [{ name: 'description', content: 'Learn about PT. Rise Edukasi Inspirasi and our mission to empower youth across Southeast Asia' }],
});

// Organization Pillars data
const pillarsData = [
  {
    id: 1,
    title: 'Education and Knowledge Sharing',
    image: '/images/rise_pillars_1.png',
    description: 'Educating and enlightening young people with access to knowledge, skills and opportunities around the world.',
  },
  {
    id: 2,
    title: 'Inclusivity',
    image: '/images/rise_pillars_2.png',
    description: 'Ensure inclusivity between organizations and youth for educational and job equity.',
  },
  {
    id: 3,
    title: 'Empowerment & Sustainability',
    image: '/images/rise_pillars_3.png',
    description:
      'Commit to sustainability work with the goal of creating solutions that support long-term well-being for individuals and communities.',
  },
];

// Statistics data
const statsData = [
  {
    id: 1,
    value: '40k+',
    label: 'Jobs Available',
  },
  {
    id: 2,
    value: '3.5k+',
    label: 'New Jobs This Week',
  },
  {
    id: 3,
    value: '280+',
    label: 'Companies Hiring',
  },
  {
    id: 4,
    value: '20k+',
    label: 'Candidates',
  },
];

// Team members data
const teamMembersData = [
  {
    id: 1,
    name: 'Jahda Agniya Mahmudah',
    position: 'Chief Executive Officer',
    image: '/images/rise_jahda.png',
  },
  {
    id: 2,
    name: 'Zahrotul Fauziah',
    position: 'Chief Project Officer',
    image: '/images/rise_zahrotul.png',
  },
  {
    id: 3,
    name: 'Aswandatu Putra Inderajao​',
    position: 'Partnership & Outreach',
    image: '/images/rise_aswandatu.png',
  },
];
</script>

<template>
  <div class="bg-gray-50 mt-20">
    <!-- Hero Section -->
    <section class="bg-white section-py-lg">
      <div class="container-wrapper">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <!-- Left Illustration -->
          <div class="flex-2 flex justify-center">
            <div class="size-80 lg:size-128 flex items-center justify-center">
              <NuxtImg src="/images/rise_about_us.png" alt="About Rise Social" class="w-full h-full object-contain" loading="eager" format="webp" />
            </div>
          </div>
          <!-- Right Content -->
          <div class="flex-3 space-y-6">
            <h1 class="heading-section-hero text-center lg:text-left text-gray-900">PT. Rise Edukasi Inspirasi</h1>

            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p class="text-lg">
                Is a provider for future careers in the social and environmental fields, dedicated to empowering youth across Southeast Asia. We
                specialize in offering an extensive hub of resources, including grants, job opportunities, internships, scholarships, and more,
                tailored specifically with an AI career buddy.
              </p>

              <p class="text-lg">
                We transformed from Gina Academy to Rise Social, we are committed to nurturing talent, fostering innovation, and driving positive
                change in the social and environmental sectors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Organization Pillars Section -->
    <section class="section-py-lg bg-gray-100">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section">3 Organization Pillars</h2>
        </div>

        <!-- Pillars Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-12">
          <div v-for="pillar in pillarsData" :key="pillar.id" class="text-center space-y-6">
            <div class="flex justify-center">
              <div class="h-56 flex items-center justify-center">
                <NuxtImg :src="pillar.image" :alt="pillar.title" class="h-full object-contain" loading="lazy" format="webp" />
              </div>
            </div>
            <h3 class="heading-card">{{ pillar.title }}</h3>
            <p class="text-gray-600 leading-relaxed">
              {{ pillar.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="section-py-lg relative overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/60">
        <NuxtImg src="/images/rise_stats.png" alt="Team gathering" class="w-full h-full object-cover" loading="lazy" format="webp" />
      </div>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-gray-900/70"></div>

      <!-- Content -->
      <div class="relative z-10 container-wrapper">
        <div class="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div v-for="stat in statsData" :key="stat.id" class="space-y-2">
              <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">{{ stat.value }}</div>
              <div class="text-sm sm:text-base text-gray-600">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Meet Our Team Section -->
    <section class="section-py-lg bg-white">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section mb-4">Meet Our Team</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Dedicated experts empowering communities and bridging green job opportunities through education and sustainability.
          </p>
        </div>

        <!-- Team Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          <div v-for="member in teamMembersData" :key="member.id" class="text-center">
            <div class="h-52 aspect-square lg:h-64 mx-auto mb-4 rounded-3xl overflow-hidden bg-green-100">
              <NuxtImg :src="member.image" :alt="member.name" class="h-full object-cover" loading="lazy" format="webp" />
            </div>
            <h3 class="heading-card mb-2">{{ member.name }}</h3>
            <p class="text-gray-600 font-medium">{{ member.position }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
