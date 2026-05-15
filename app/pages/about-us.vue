<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'About Us - Rise Social',
  description:
    'Learn about PT. Rise Edukasi Inspirasi and our mission to empower youth across Southeast Asia'
})

const pillarsData = [
  {
    id: 1,
    title: 'Education and Knowledge Sharing',
    image: '/images/rise_pillars_1.png',
    description:
      'Educating and enlightening young people with access to knowledge, skills and opportunities around the world.'
  },
  {
    id: 2,
    title: 'Inclusivity',
    image: '/images/rise_pillars_2.png',
    description:
      'Ensure inclusivity between organizations and youth for educational and job equity.'
  },
  {
    id: 3,
    title: 'Empowerment & Sustainability',
    image: '/images/rise_pillars_3.png',
    description:
      'Commit to sustainability work with the goal of creating solutions that support long-term well-being for individuals and communities.'
  }
]

const statsData = [
  { id: 1, value: '40k+', label: 'Jobs Available' },
  { id: 2, value: '3.5k+', label: 'New Jobs This Week' },
  { id: 3, value: '280+', label: 'Companies Hiring' },
  { id: 4, value: '20k+', label: 'Candidates' }
]

const teamMembersData = [
  {
    id: 1,
    name: 'Jahda Agniya Mahmudah',
    position: 'Chief Executive Officer',
    image: '/images/teams/jahda.png'
  },
  {
    id: 2,
    name: 'Zahrotul Fauziah',
    position: 'Chief Project Officer',
    image: '/images/teams/zahrotul.png'
  },
  {
    id: 3,
    name: 'Aswandatu Putra Inderajao',
    position: 'Partnership & Outreach',
    image: '/images/teams/aswandatu.png'
  },
  {
    id: 4,
    name: 'Dwi Putri Handayani',
    position: 'Product Officer',
    image: '/images/teams/dwi.png'
  },
  {
    id: 5,
    name: 'Alya Firda Rahmawati',
    position: 'Project Officer',
    image: '/images/teams/alya.png'
  }
]
</script>

<template>
  <div>
    <UPageSection>
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <div class="flex-2 flex justify-center">
          <div class="size-80 lg:size-128 flex items-center justify-center">
            <NuxtImg
              src="/images/rise_about_us.png"
              alt="About Rise Social"
              class="w-full h-full object-contain"
              loading="eager"
              format="webp"
            />
          </div>
        </div>
        <div class="flex-3 space-y-6">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-center lg:text-left">
            PT. Rise Edukasi Inspirasi
          </h1>
          <div class="space-y-4 leading-relaxed">
            <p class="text-lg text-muted">
              Is a provider for future careers in the social and environmental fields, dedicated to
              empowering youth across Southeast Asia. We specialize in offering an extensive hub of
              resources, including grants, job opportunities, internships, scholarships, and more,
              tailored specifically with an AI career buddy.
            </p>
            <p class="text-lg text-muted">
              We transformed from Gina Academy to Rise Social, we are committed to nurturing talent,
              fostering innovation, and driving positive change in the social and environmental
              sectors.
            </p>
          </div>
        </div>
      </div>
    </UPageSection>
    <UPageSection
      class="bg-slate-100"
      title="3 Organization Pillars"
      :ui="{ title: 'text-2xl lg:text-3xl' }"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div v-for="pillar in pillarsData" :key="pillar.id" class="text-center space-y-5">
          <div class="flex justify-center">
            <div class="h-56 flex items-center justify-center">
              <NuxtImg
                :src="pillar.image"
                :alt="pillar.title"
                class="h-full object-contain"
                loading="lazy"
                format="webp"
              />
            </div>
          </div>
          <h3 class="text-lg font-bold">{{ pillar.title }}</h3>
          <p class="text-base text-muted leading-relaxed">{{ pillar.description }}</p>
        </div>
      </div>
    </UPageSection>
    <UPageSection>
      <div class="absolute inset-0">
        <NuxtImg
          src="/images/rise_stats.png"
          alt="Team gathering"
          class="w-full h-full object-cover"
          loading="lazy"
          format="webp"
        />
        <div class="absolute inset-0 bg-slate-900/70" />
      </div>
      <div class="relative z-10">
        <UContainer>
          <div class="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div v-for="stat in statsData" :key="stat.id" class="space-y-2">
                <div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                  {{ stat.value }}
                </div>
                <div class="text-base text-muted">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </UContainer>
      </div>
    </UPageSection>
    <UPageSection
      title="Meet Our Team"
      description="Dedicated experts empowering communities and bridging green job opportunities through education and sustainability."
      :ui="{
        title: 'text-2xl lg:text-3xl'
      }"
    >
      <div class="flex flex-wrap justify-center items-center gap-10 lg:gap-24">
        <div v-for="member in teamMembersData" :key="member.id" class="text-center">
          <div class="h-52 aspect-square lg:h-64 mx-auto mb-4 rounded-3xl overflow-hidden">
            <NuxtImg
              :src="member.image"
              :alt="member.name"
              class="w-full h-full object-cover"
              loading="lazy"
              format="webp"
            />
          </div>
          <h3 class="text-base font-bold mb-1">{{ member.name }}</h3>
          <p class="text-base text-muted font-medium">{{ member.position }}</p>
        </div>
      </div>
    </UPageSection>
  </div>
</template>
