<script setup>
// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Rise - Provider for Your Green Careers',
  meta: [{ name: 'description', content: 'Explore 40,000+ Green Job Opportunities Today!' }],
});

// Import UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Testimonials data and functionality
const allTestimonials = [
  {
    text: "I am very grateful to Rise Social for this trip. Here's to future reunions and the continued success and expansion of the Rise ASEAN Leaders Summit.",
    name: 'Annisa Faradila',
    country: 'Indonesia',
    rating: 5,
  },
  {
    text: 'Thank you Rise Social for bring up my childhood memories in a very prestigious way. I learned a lot about disaster and also the meaning of life',
    name: 'Muhammad Zuhry',
    country: 'Indonesia',
    rating: 5,
  },
  {
    text: "Rise Social makes me want visit Japan again and again and give motivation and support, it's totally new journey and life learning experience",
    name: 'Oualid Abbane',
    country: 'Algeria',
    rating: 5,
  },
  {
    text: "THANK YOU VERY MUCH FOR THE BEST STUDY TRIP I'VE EVER EXPERIENCED IN MY LIFE ! WHAT A REMARKABLE EXPERIENCE! ^^",
    name: 'Aaron Alexander',
    country: 'Indonesia',
    rating: 5,
  },
  {
    text: 'Very good topic and insights from the lecturer. great job, Rise Social. Looking forward for another journey with you!',
    name: 'Nisrina Amalia C.',
    country: 'Indonesia',
    rating: 5,
  },
  {
    text: "You're all great people doing great things. Keep doing what you do best and don't forget your friend here! Hope can jump in another session.",
    name: 'Alvin Rajendra Rabani',
    country: 'Indonesia',
    rating: 5,
  },
];

// Testimonials carousel functionality
const testimonialsApi = ref(null);
const currentTestimonialSlide = ref(0);
const totalTestimonialSlides = ref(0);

const setTestimonialsApi = (api) => {
  testimonialsApi.value = api;
  if (!api) return;

  totalTestimonialSlides.value = api.scrollSnapList().length;
  currentTestimonialSlide.value = api.selectedScrollSnap();

  api.on('select', () => {
    currentTestimonialSlide.value = api.selectedScrollSnap();
  });
};

const goToTestimonialSlide = (index) => {
  if (testimonialsApi.value) {
    testimonialsApi.value.scrollTo(index);
  }
};

// How It Works Steps data
const currentStep = ref(4); // Set ke step terakhir agar semua steps accessible

const howItWorksSteps = [
  {
    step: 1,
    stepNumber: '1',
    title: 'Set Your Goals',
    description: 'Tell us about your career goals and we will find you the right path.',
    image: 'rise_step_1.png',
  },
  {
    step: 2,
    stepNumber: '2',
    title: 'Finish Courses',
    description: 'AI career buddy will find the right courses to achieve your dream.',
    image: 'rise_step_2.png',
  },
  {
    step: 3,
    stepNumber: '3',
    title: 'Build Resume',
    description: 'Complete your application with CV builder to optimize your chances.',
    image: 'rise_step_3.png',
  },
  {
    step: 4,
    stepNumber: '4',
    title: 'Track Your Application',
    description: 'Track your application while finish more course and application.',
    image: 'rise_step_4.png',
  },
];

// Features data
const featuresData = [
  {
    id: 1,
    title: 'AI Career Buddy',
    description: 'Personalized courses and jobs recommendation based on your search history, applications, CV, and employment background.',
    icon: 'hugeicons:artificial-intelligence-04',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-gray-100',
  },
  {
    id: 2,
    title: 'Proposal & CV Builder',
    description: "Need help to write your own resume and grants proposal? We've got your back!",
    icon: 'lucide:file-text',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-gray-100',
  },
  {
    id: 3,
    title: 'Job Alert Emails',
    description: 'Ensure you never miss out on valuable green opportunities—stay informed and ahead.',
    icon: 'lucide:mail',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-gray-100',
  },
];

// Call to Action features data
const ctaFeaturesData = [
  {
    id: 1,
    text: 'AI-powered job matching algorithm',
  },
  {
    id: 2,
    text: 'Professional CV and cover letter builder',
  },
  {
    id: 3,
    text: 'Real-time job alerts and notifications',
  },
  {
    id: 4,
    text: 'Direct connection with green employers',
  },
  {
    id: 5,
    text: 'Career development resources and guidance',
  },
];

// Partners data
const partnersData = [
  {
    name: 'GoTo Impact',
    src: 'goto_impact.png',
    alt: 'GoTo Impact',
  },
  {
    name: 'Kyoto University',
    src: 'kyoto_univ.png',
    alt: 'Kyoto University',
  },
  {
    name: 'Inspire',
    src: 'inspire.png',
    alt: 'Inspire',
  },
  {
    name: 'Universitas Syiah Kuala',
    src: 'unsyiah.png',
    alt: 'Universitas Syiah Kuala',
  },
  {
    name: 'Universitas Airlangga',
    src: 'unair.png',
    alt: 'Universitas Airlangga',
  },
  {
    name: 'Universitas Pendidikan Indonesia',
    src: 'upi.png',
    alt: 'Universitas Pendidikan Indonesia',
  },
  {
    name: 'Youth Force ID',
    src: 'youth_force_id.png',
    alt: 'Youth Force ID',
  },
  {
    name: 'Changemaker Catalyst',
    src: 'changemaker_catalyst.jpeg',
    alt: 'Changemaker Catalyst',
  },
  {
    name: 'Biops Agrotechno',
    src: 'biops_agrotechno.png',
    alt: 'Biops Agrotechno',
  },
  {
    name: 'FAM Rural',
    src: 'fam_rural.jpeg',
    alt: 'FAM Rural',
  },
  {
    name: 'Komben',
    src: 'komben.png',
    alt: 'Komben',
  },
  {
    name: 'Desamind',
    src: 'desamind.png',
    alt: 'Desamind',
  },
  {
    name: 'Siaga Bencana',
    src: 'siaga_bencana.png',
    alt: 'Siaga Bencana',
  },
];

// Featured Jobs data
const featuredJobsData = [
  {
    id: 1,
    title: 'Software Engineer',
    category: 'IT & Networking',
    categoryBg: 'bg-green-50',
    categoryText: 'text-green-600',
    categoryBorder: 'border-green-200',
    location: '32 Irving Pl, NY',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Temporary', variant: 'secondary' }],
    salary: '$400 - $450',
    salaryPeriod: '/ month',
    deadline: 'June 14, 2030',
    isVerified: true,
  },
  {
    id: 2,
    title: 'Sales Specialist',
    category: 'IT & Networking',
    categoryBg: 'bg-green-50',
    categoryText: 'text-green-600',
    categoryBorder: 'border-green-200',
    location: '433 Graham Ave',
    postedDate: 'June 20, 2023',
    badges: [
      { text: 'Full Time', variant: 'secondary' },
      { text: 'Urgent', variant: 'destructive' },
    ],
    salary: '$750 - $800',
    salaryPeriod: '/ month',
    deadline: 'June 5, 2031',
    isVerified: true,
  },
  {
    id: 3,
    title: 'Junior Graphic Designer',
    category: 'Accounting',
    categoryBg: 'bg-blue-50',
    categoryText: 'text-blue-600',
    categoryBorder: 'border-blue-200',
    location: '398 Manhattan Ave',
    postedDate: 'June 20, 2023',
    badges: [
      { text: 'On-site', variant: 'secondary' },
      { text: 'Urgent', variant: 'destructive' },
    ],
    salary: '$650 - $700',
    salaryPeriod: '/ month',
    deadline: 'June 4, 2031',
    isVerified: true,
  },
  {
    id: 4,
    title: 'Finance Manager',
    category: 'Data Science',
    categoryBg: 'bg-purple-50',
    categoryText: 'text-purple-600',
    categoryBorder: 'border-purple-200',
    location: '269 Norman Ave',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Remote', variant: 'secondary' }],
    salary: '$450 - $550',
    salaryPeriod: '/ month',
    deadline: 'June 22, 2029',
    isVerified: true,
  },
  {
    id: 5,
    title: 'Marketing Manager',
    category: 'Sales & Marketing',
    categoryBg: 'bg-orange-50',
    categoryText: 'text-orange-600',
    categoryBorder: 'border-orange-200',
    location: '178 7th Ave S, NY',
    postedDate: 'June 20, 2023',
    badges: [
      { text: 'Internship', variant: 'secondary' },
      { text: 'Temporary', variant: 'secondary' },
    ],
    salary: '$8 - $10',
    salaryPeriod: '/ hour',
    deadline: 'June 12, 2031',
    isVerified: true,
  },
  {
    id: 6,
    title: 'Full Stack Development',
    category: 'IT & Networking',
    categoryBg: 'bg-green-50',
    categoryText: 'text-green-600',
    categoryBorder: 'border-green-200',
    location: '77 Irving Pl, NY',
    postedDate: 'June 20, 2023',
    badges: [{ text: 'Freelance', variant: 'secondary' }],
    salary: '$850 - $900',
    salaryPeriod: '/ month',
    deadline: 'June 18, 2031',
    isVerified: true,
  },
];

// Partners carousel API functionality
const partnersApi = ref(null);
const currentPartnerSlideApi = ref(0);
const totalPartnerSlidesApi = ref(0);

const setPartnersApi = (api) => {
  partnersApi.value = api;
  if (!api) return;

  totalPartnerSlidesApi.value = api.scrollSnapList().length;
  currentPartnerSlideApi.value = api.selectedScrollSnap();

  api.on('select', () => {
    currentPartnerSlideApi.value = api.selectedScrollSnap();
  });
};

const goToPartnerSlide = (index) => {
  if (partnersApi.value) {
    partnersApi.value.scrollTo(index);
  }
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="section-py-hero bg-secondary text-white rounded-b-3xl md:rounded-b-[3.25rem]">
      <div class="container-wrapper">
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-12 items-center">
          <!-- Left Content -->
          <div class="lg:flex-3 space-y-10 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div class="space-y-4">
              <h1 class="heading-section-hero">
                One-stop Platform for Your
                <span class="text-orange-400">Green Careers</span>
              </h1>
              <p>Explore 40,000+ Green Job Opportunities Today!</p>
            </div>

            <!-- Search Bar -->
            <div class="bg-white rounded-xl md:rounded-[1.25rem] p-2 shadow-2xl">
              <div class="flex flex-col lg:flex-row gap-5 lg:gap-0">
                <!-- Location Select -->
                <div class="lg:flex-1 flex justify-center items-center relative">
                  <div class="flex items-center w-full h-full px-4">
                    <Select>
                      <SelectTrigger class="border-0 shadow-none p-0 h-auto w-full focus:ring-0 bg-transparent">
                        <Icon name="lucide:map-pin" class="h-5 w-5 text-gray-400 mr-3" />
                        <SelectValue placeholder="All Location" class="font-medium flex-grow-1! text-gray-700" />
                      </SelectTrigger>
                      <SelectContent class="w-full lg:w-40">
                        <SelectItem value="jakarta">Jakarta</SelectItem>
                        <SelectItem value="bandung">Bandung</SelectItem>
                        <SelectItem value="surabaya">Surabaya</SelectItem>
                        <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                        <SelectItem value="bali">Bali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <!-- Divider for desktop -->
                  <div class="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-200"></div>
                </div>

                <!-- Job Search Input -->
                <div class="lg:flex-2 flex justify-start items-center relative">
                  <div class="flex items-center w-full h-full px-4">
                    <Icon name="lucide:search" class="h-5 w-5 text-gray-400 mr-3" />
                    <Input
                      type="text"
                      placeholder="Job title, key words or company"
                      class="border-0 shadow-none p-0 h-full w-full rounded-none focus-visible:ring-0 bg-transparent text-gray-700 flex-1"
                    />
                  </div>
                </div>

                <!-- Search Button -->
                <div class="lg:flex-initial">
                  <Button
                    class="bg-primary hover:bg-primary/90 text-white font-semibold py-4 lg:py-6 px-8 lg:px-12 rounded-lg md:rounded-2xl w-full lg:w-auto"
                  >
                    <Icon name="lucide:search" class="size-5! mr-1 text-white" />
                    Find Jobs
                  </Button>
                </div>
              </div>
            </div>

            <!-- Job Categories -->
            <div class="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
              <Badge variant="outline" class="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm cursor-pointer">
                Designer
              </Badge>
              <Badge variant="outline" class="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm cursor-pointer">
                Developer
              </Badge>
              <Badge variant="outline" class="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm cursor-pointer">
                Social Media
              </Badge>
              <Badge variant="outline" class="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm cursor-pointer">
                Writing
              </Badge>
              <Badge variant="outline" class="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm cursor-pointer">
                Project Manager
              </Badge>
            </div>
          </div>

          <!-- Right Illustration -->
          <div class="lg:flex-2 flex justify-end order-1 lg:order-2">
            <div class="relative">
              <div class="w-full h-[14rem] pt-6 py-4 lg:h-[24rem] flex items-center justify-center">
                <NuxtImg src="rise_hero.png" alt="Rise Social Hero Illustration" class="w-full h-full object-contain" loading="eager" format="webp" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section-py-md bg-gray-50">
      <div class="container-wrapper">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
          <Card v-for="feature in featuresData" :key="feature.id" class="text-center p-6 duration-200">
            <CardHeader>
              <div class="flex justify-center mb-4">
                <div :class="['size-20 rounded-full flex items-center justify-center', feature.bgColor]">
                  <Icon :name="feature.icon" :class="['size-10!', feature.iconColor]" />
                </div>
              </div>
              <CardTitle class="heading-card">{{ feature.title }}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription class="text-gray-600 leading-relaxed">
                {{ feature.description }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section-py-md bg-[#e6edcc]">
      <div class="container-wrapper-lg">
        <!-- Section Title -->
        <div class="section-title-wrapper-xs">
          <h2 class="heading-section">How It Works?</h2>
        </div>

        <!-- Stepper -->
        <Stepper :linear="false" class="flex flex-col lg:flex-row w-full gap-2">
          <StepperItem v-for="stepData in howItWorksSteps" :key="stepData.step" :step="stepData.step" class="group relative flex-1" :disabled="false">
            <StepperTrigger
              class="flex flex-row-reverse p-0! pl-4! lg:flex-col items-center justify-center text-center gap-2 md:p-6 rounded-2xl pointer-events-none cursor-default"
            >
              <!-- Step Image -->
              <div
                class="flex-2 h-40 lg:h-48 mx-auto bg-transparent rounded-lg flex items-center justify-center lg:group-hover:scale-105 transition-transform duration-300"
              >
                <NuxtImg :src="stepData.image" :alt="stepData.title" class="h-50! object-contain" loading="lazy" format="webp" />
              </div>

              <div class="flex-3 flex flex-col lg:items-center lg:justify-center lg:pb-8">
                <!-- Step Indicator -->
                <div class="flex mb-4 flex-row lg:flex-col items-center lg:justify-center gap-4">
                  <StepperIndicator
                    :class="[
                      'relative size-7 lg:size-10 rounded-full flex items-center justify-center font-semibold border border-primary text-sm bg-primary text-white transition-all duration-300 lg:bg-white! lg:text-primary! lg:group-hover:bg-primary! lg:group-hover:text-white!',
                      stepData.step < 4
                        ? 'after:content-[\'\'] after:absolute after:top-1/2  after:left-[150%] after:w-56 after:h-0.5 after:rounded-full after:bg-orange-400 after:z-10 lg:after:block after:hidden'
                        : '',
                    ]"
                  >
                    {{ stepData.stepNumber }}
                  </StepperIndicator>

                  <StepperTitle class="text-xl text-left lg:text-center font-bold text-gray-900">
                    {{ stepData.title }}
                  </StepperTitle>
                </div>
                <StepperDescription class="text-gray-600 text-sm text-left lg:text-center leading-relaxed max-w-xs">
                  {{ stepData.description }}
                </StepperDescription>
              </div>
            </StepperTrigger>
          </StepperItem>
        </Stepper>
      </div>
    </section>

    <!-- Featured Jobs Section -->
    <section class="section-py-lg bg-white">
      <div class="container-wrapper-lg">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section">Featured Jobs</h2>
        </div>

        <!-- Jobs Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12">
          <Card v-for="job in featuredJobsData" :key="job.id" class="p-4 hover:shadow-md cursor-pointer transition-shadow duration-300 gap-0">
            <CardHeader class="py-3 sm:py-4 pl-4 pr-2!">
              <div class="flex items-start justify-between mb-2">
                <Badge variant="outline" :class="['text-xs', job.categoryBg, job.categoryText, job.categoryBorder]">
                  {{ job.category }}
                </Badge>
                <Icon name="lucide:bookmark" class="size-6! text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
              <CardTitle class="heading-card-sm mb-1">
                {{ job.title }}
                <Icon v-if="job.isVerified" name="lucide:verified" class="inline-block ml-1 h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </CardTitle>
              <div class="flex items-center gap-4">
                <div class="flex items-center text-xs sm:text-sm text-gray-500">
                  <Icon name="lucide:map-pin" class="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span>{{ job.location }}</span>
                </div>
                <div class="flex items-center text-xs sm:text-sm text-gray-500">
                  <Icon name="lucide:calendar" class="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span>{{ job.postedDate }}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent class="p-4">
              <div class="flex flex-col sm:justify-between gap-2">
                <div class="flex gap-2 flex-wrap mb-2">
                  <Badge v-for="badge in job.badges" :key="badge.text" :variant="badge.variant" class="text-xs">
                    {{ badge.text }}
                  </Badge>
                </div>
                <Separator class="my-2" />
                <div class="flex items-center space-x-2">
                  <div class="bg-gray-100 rounded-full size-6 flex items-center justify-center">
                    <span class="text-gray-500 text-sm sm:text-base font-bold">$</span>
                  </div>
                  <span class="font-semibold text-gray-900 text-base sm:text-lg">{{ job.salary }}</span>
                  <span class="text-xs sm:text-sm text-gray-500">{{ job.salaryPeriod }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- See More Jobs Button -->
        <div class="text-center">
          <Button variant="outline" class="hover:bg-emerald-600 hover:text-white text-md">
            See More Jobs
            <Icon name="lucide:arrow-right" class="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="section-py-sm bg-green-50">
      <div class="container-wrapper-lg">
        <div class="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-center">
          <!-- Left Illustration -->
          <div class="flex-1 relative">
            <div class="w-full h-auto mx-auto hidden lg:flex items-center justify-center">
              <NuxtImg src="rise_cta.png" alt="Get the Perfect Job for You" class="w-full object-contain" loading="lazy" format="webp" />
            </div>
          </div>
          <!-- Right Content -->
          <div class="space-y-6 flex-1 lg:space-y-8 text-center lg:text-left">
            <div class="space-y-4">
              <h2 class="heading-section-no-margin">Get the Perfect Job for You!</h2>
              <p class="text-base sm:text-lg text-gray-600">Unlock your potential with personalized job matches and comprehensive career tools.</p>
            </div>

            <!-- Features List -->
            <div class="space-y-3 pl-4 sm:space-y-4">
              <div v-for="feature in ctaFeaturesData" :key="feature.id" class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="lucide:check" class="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <span class="text-sm sm:text-base text-gray-700">{{ feature.text }}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="pt-4">
              <Button
                size="lg"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
              >
                Get Started Now
                <Icon name="lucide:arrow-right" class="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section-py-sm pt-0 bg-gradient-to-b from-green-50 to-transparent">
      <div class="container-wrapper-lg">
        <Separator class="mb-16 lg:hidden" />
        <!-- Section Title -->
        <div class="section-title-wrapper-sm">
          <h2 class="heading-section">What They Said About Us</h2>
        </div>

        <!-- Testimonials Carousel -->
        <Carousel
          :opts="{
            align: 'start',
            loop: true,
          }"
          class="w-full"
          @init-api="setTestimonialsApi"
        >
          <CarouselContent class="-ml-2 md:-ml-4 py-4">
            <CarouselItem v-for="(testimonial, index) in allTestimonials" :key="index" class="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <Card class="p-6 lg:p-8 text-center h-full">
                <CardContent class="flex flex-col justify-between p-0 h-full">
                  <div class="space-y-4">
                    <p class="text-sm lg:text-base text-gray-600 leading-relaxed">
                      {{ testimonial.text }}
                    </p>
                  </div>

                  <!-- Author Info -->
                  <div class="mt-6 space-y-2">
                    <!-- Rating Stars -->
                    <div class="flex justify-center space-x-1">
                      <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="h-4 w-4 text-yellow-400" style="fill: currentColor" />
                    </div>

                    <!-- Name -->
                    <h4 class="text-sm lg:text-base font-semibold text-gray-900">
                      {{ testimonial.name }}
                    </h4>

                    <!-- Country -->
                    <p class="text-xs lg:text-sm text-emerald-600 font-medium">
                      {{ testimonial.country }}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="hidden shadow-none sm:flex" />
          <CarouselNext class="hidden shadow-none sm:flex" />
        </Carousel>

        <!-- Navigation Dots -->
        <div class="flex justify-center mt-4 space-x-2">
          <button
            v-for="(dot, index) in totalTestimonialSlides"
            :key="index"
            @click="goToTestimonialSlide(index)"
            :class="[
              'size-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer',
              currentTestimonialSlide === index ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400',
            ]"
          ></button>
        </div>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="section-py-xl bg-white">
      <div class="container-wrapper-lg">
        <!-- Section Title -->
        <div class="section-title-wrapper-xs">
          <h2 class="heading-section-no-margin">Strategic and Media Partners</h2>
        </div>

        <!-- Partners Carousel -->
        <Carousel
          :opts="{
            align: 'start',
            loop: true,
            slidesToScroll: 2,
            skipSnaps: false,
          }"
          :plugins="[
            Autoplay({
              delay: 2000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]"
          class="w-full"
          @init-api="setPartnersApi"
        >
          <CarouselContent class="py-4">
            <CarouselItem v-for="(partner, index) in partnersData" :key="`partner-${index}`" class="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/6">
              <div class="flex items-center justify-center rounded-lg transition-colors duration-300 h-24">
                <NuxtImg :src="partner.src" :alt="partner.alt" class="h-full object-contain" loading="lazy" format="webp" />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="hidden shadow-none sm:flex" />
          <CarouselNext class="hidden shadow-none sm:flex" />
        </Carousel>

        <!-- Navigation Dots -->
        <div class="flex justify-center mt-4 space-x-2">
          <button
            v-for="(dot, index) in totalPartnerSlidesApi"
            :key="index"
            @click="goToPartnerSlide(index)"
            :class="[
              'size-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer',
              currentPartnerSlideApi === index ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400',
            ]"
          ></button>
        </div>
      </div>
    </section>
  </div>
</template>
