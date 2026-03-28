<script setup lang="ts">
import type { Job, PaginatedResponse } from '@/types'

const { api } = useApi()
const { data: jobsData } = await useAsyncData('home:jobs', () =>
  api<PaginatedResponse<Job>>('/jobs', { params: { page: 1, limit: 6 } })
)
const jobs = computed(() => jobsData.value?.data ?? [])

const heroCategories = ['Designer', 'Developer', 'Social Media', 'Writing', 'Project Manager']

const featuresItems = [
  {
    title: 'AI Career Buddy',
    description:
      'Personalized courses and jobs recommendation based on your search history, applications, CV, and employment background.',
    icon: 'i-hugeicons-artificial-intelligence-04'
  },
  {
    title: 'Proposal & CV Builder',
    description: "Need help to write your own resume and grants proposal? We've got your back!",
    icon: 'i-ph-file-text-bold'
  },
  {
    title: 'Job Alert Emails',
    description:
      'Ensure you never miss out on valuable green opportunities—stay informed and ahead.',
    icon: 'i-ph-envelope-bold'
  }
]

const howItWorksSteps = [
  {
    step: 1,
    title: 'Set Your Goals',
    description: 'Tell us about your career goals and we will find you the right path.',
    image: '/images/rise_step_1.png'
  },
  {
    step: 2,
    title: 'Finish Courses',
    description: 'AI career buddy will find the right courses to achieve your dream.',
    image: '/images/rise_step_2.png'
  },
  {
    step: 3,
    title: 'Build Resume',
    description: 'Complete your application with CV builder to optimize your chances.',
    image: '/images/rise_step_3.png'
  },
  {
    step: 4,
    title: 'Track Your Application',
    description: 'Track your application while finish more course and application.',
    image: '/images/rise_step_4.png'
  }
]

const ctaFeatures = [
  'AI-powered job matching algorithm',
  'Professional CV and cover letter builder',
  'Real-time job alerts and notifications',
  'Direct connection with green employers',
  'Career development resources and guidance'
]

const testimonialsItems = [
  {
    quote:
      "I am very grateful to Rise Social for this trip. Here's to future reunions and the continued success and expansion of the Rise ASEAN Leaders Summit.",
    name: 'Annisa Faradila',
    country: 'Indonesia',
    rating: 5
  },
  {
    quote:
      'Thank you Rise Social for bring up my childhood memories in a very prestigious way. I learned a lot about disaster and also the meaning of life',
    name: 'Muhammad Zuhry',
    country: 'Indonesia',
    rating: 5
  },
  {
    quote:
      "Rise Social makes me want visit Japan again and again and give motivation and support, it's totally new journey and life learning experience",
    name: 'Oualid Abbane',
    country: 'Algeria',
    rating: 5
  },
  {
    quote:
      "THANK YOU VERY MUCH FOR THE BEST STUDY TRIP I'VE EVER EXPERIENCED IN MY LIFE ! WHAT A REMARKABLE EXPERIENCE! ^^",
    name: 'Aaron Alexander',
    country: 'Indonesia',
    rating: 5
  },
  {
    quote:
      'Very good topic and insights from the lecturer. great job, Rise Social. Looking forward for another journey with you!',
    name: 'Nisrina Amalia C.',
    country: 'Indonesia',
    rating: 5
  },
  {
    quote:
      "You're all great people doing great things. Keep doing what you do best and don't forget your friend here! Hope can jump in another session.",
    name: 'Alvin Rajendra Rabani',
    country: 'Indonesia',
    rating: 5
  }
]

const partnersLogos = [
  { name: 'GoTo Impact', src: '/images/goto_impact.png' },
  { name: 'Pandawara', src: '/images/pandawara.png' },
  { name: 'Kyoto University', src: '/images/kyoto_univ.png' },
  { name: 'Inspire', src: '/images/inspire.png' },
  { name: 'Universitas Syiah Kuala', src: '/images/unsyiah.png' },
  { name: 'Universitas Airlangga', src: '/images/unair.png' },
  { name: 'Universitas Pendidikan Indonesia', src: '/images/upi.png' },
  { name: 'Youth Force ID', src: '/images/youth_force_id.png' },
  { name: 'Changemaker Catalyst', src: '/images/changemaker_catalyst.jpeg' },
  { name: 'Biops Agrotechno', src: '/images/biops_agrotechno.png' },
  { name: 'FAM Rural', src: '/images/fam_rural.jpeg' },
  { name: 'Komben', src: '/images/komben.png' },
  { name: 'Desamind', src: '/images/desamind.png' },
  { name: 'Siaga Bencana', src: '/images/siaga_bencana.png' }
]

useSeoMeta({
  titleTemplate: '',
  title: 'Rise - Provider for Your Green Careers',
  ogTitle: 'Rise - Provider for Your Green Careers',
  description: 'Explore 40,000+ Green Job Opportunities Today!',
  ogDescription: 'Explore 40,000+ Green Job Opportunities Today!'
})
</script>

<template>
  <div>
    <UPageSection class="bg-deep-teal-950 text-white rounded-b-3xl md:rounded-b-[3.25rem]">
      <div class="flex flex-col md:flex-row gap-4 lg:gap-12 items-center">
        <div class="lg:flex-3 space-y-10 lg:space-y-8 text-center md:text-left order-2 md:order-1">
          <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              One-stop Platform for Your
              <span class="text-orange-400">Green Careers</span>
            </h1>
            <p class="text-base">Explore 40,000+ Green Job Opportunities Today!</p>
          </div>
          <HomeHeroSearchBar />
          <div class="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
            <UBadge
              v-for="category in heroCategories"
              :key="category"
              variant="soft"
              color="neutral"
              size="sm"
              class="bg-white/10 text-white ring ring-gray-50/30 hover:bg-white/20 text-xs sm:text-sm cursor-pointer rounded-lg"
            >
              {{ category }}
            </UBadge>
          </div>
        </div>

        <div class="lg:flex-2 flex justify-end order-1 md:order-2">
          <div class="relative">
            <div class="w-full h-56 pt-6 py-4 md:h-72 lg:h-96 flex items-center justify-center">
              <NuxtImg
                src="/images/rise_hero.png"
                alt="Green careers platform - Find sustainable jobs in renewable energy, environmental science, and climate action"
                class="w-full h-full object-contain"
                loading="eager"
                format="webp"
              />
            </div>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection class="bg-gray-50">
      <UPageGrid>
        <UCard v-for="feature in featuresItems" :key="feature.title" class="rounded-2xl shadow-sm">
          <div class="flex flex-col h-full gap-4">
            <div class="flex items-center justify-center">
              <div class="flex items-center justify-center rounded-full bg-slate-100 p-4">
                <UIcon :name="feature.icon" class="size-10 text-emerald-600" />
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <h3 class="text-lg text-center font-bold">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-center">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </UCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection title="How It Works?" class="bg-[#e6edcc]" :ui="{ container: 'lg:py-24' }">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <HomeHowItWorksStep
          v-for="stepData in howItWorksSteps"
          :key="stepData.step"
          v-bind="stepData"
          :is-last="stepData.step === 4"
        />
      </div>
    </UPageSection>

    <UPageSection title="Featured Jobs" class="bg-white">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <SharedJobCard v-for="job in jobs" :key="job.id" :job="job" />
      </div>

      <div class="text-center">
        <UButton
          to="/opportunities"
          variant="light"
          size="lg"
          trailing-icon="i-ph-arrow-right-bold"
          color="neutral"
        >
          See More Green Jobs
        </UButton>
      </div>
    </UPageSection>

    <UPageSection class="bg-green-50" :ui="{ container: 'lg:py-0' }">
      <div class="flex flex-col-reverse lg:flex-row gap-12 items-center">
        <div class="flex-1 hidden md:block">
          <NuxtImg
            src="/images/rise_cta.png"
            alt="Get the Perfect Job"
            class="w-full"
            loading="lazy"
          />
        </div>
        <div class="flex-1 space-y-6 text-center md:text-left">
          <div>
            <h2 class="text-4xl font-bold mb-4">Get the Perfect Job for You!</h2>
            <p class="text-lg text-gray-600">
              Unlock your potential with personalized job matches and comprehensive career tools.
            </p>
          </div>
          <div class="space-y-3">
            <div
              v-for="(feature, index) in ctaFeatures"
              :key="index"
              class="flex items-start gap-3"
            >
              <div
                class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              >
                <UIcon name="i-ph-check-bold" class="size-4 text-white" />
              </div>
              <span class="text-left">{{ feature }}</span>
            </div>
          </div>
          <div class="pt-4">
            <UButton
              to="/opportunities"
              color="secondary"
              size="xl"
              trailing-icon="i-ph-arrow-right-bold"
              class="w-full justify-center"
            >
              Get Started Now
            </UButton>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="What They Said About Us"
      class="bg-linear-to-b from-green-50 to-transparent"
    >
      <UCarousel
        :items="testimonialsItems"
        :ui="{
          item: 'basis-full md:basis-1/2 lg:basis-1/3',
          dot: 'size-2',
          viewport: 'pb-4',
          container: 'items-stretch',
          prev: 'hidden sm:flex absolute rounded-full sm:-start-12 top-1/2 -translate-y-1/2',
          next: 'hidden sm:flex absolute rounded-full sm:-end-12 top-1/2 -translate-y-1/2'
        }"
        :autoplay="{ delay: 3000 }"
        arrows
        loop
        dots
      >
        <template #default="{ item }">
          <SharedTestimonialCard :testimonial="item" />
        </template>
      </UCarousel>
    </UPageSection>

    <UPageSection title="Strategic and Media Partners" class="bg-white">
      <UCarousel
        :items="partnersLogos"
        :ui="{
          item: 'basis-1/2 md:basis-1/3 lg:basis-1/5',
          dot: 'size-2',
          viewport: 'pb-2',
          container: 'items-stretch',
          prev: 'hidden sm:flex absolute rounded-full sm:-start-12 top-1/2 -translate-y-1/2',
          next: 'hidden sm:flex absolute rounded-full sm:-end-12 top-1/2 -translate-y-1/2'
        }"
        arrows
        :autoplay="{ delay: 3000 }"
        loop
        dots
      >
        <template #default="{ item }">
          <div class="flex items-center justify-center h-24 p-4">
            <NuxtImg
              :src="item.src"
              :alt="item.name"
              class="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        </template>
      </UCarousel>
    </UPageSection>
  </div>
</template>
