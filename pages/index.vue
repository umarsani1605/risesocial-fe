<script setup>
import LoginRegisterDialog from '@/components/auth/LoginRegisterDialog.vue';
import { useAuthStore } from '@/store/auth';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Rise - Provider for Your Green Careers',
  meta: [{ name: 'description', content: 'Explore 40,000+ Green Job Opportunities Today!' }],
});

// Handle login dialog from URL parameters
const route = useRoute();
const showLoginDialog = ref(false);

onMounted(() => {
  // Check if login parameter is present
  if (route.query.login === 'true') {
    showLoginDialog.value = true;
  }
});

// Watch for successful login and handle redirect using custom auth system
const authStore = useAuthStore();
watch(
  () => authStore.status,
  (newStatus) => {
    if (newStatus === 'authenticated' && route.query.redirect) {
      // User just logged in and there's a redirect parameter
      const redirectPath = decodeURIComponent(route.query.redirect);
      navigateTo(redirectPath);
    }
  }
);

// Handle login dialog close
const handleLoginDialogClose = () => {
  showLoginDialog.value = false;
  // Remove login parameter from URL without refreshing
  if (route.query.login) {
    const newQuery = { ...route.query };
    delete newQuery.login;
    navigateTo({ query: newQuery }, { replace: true });
  }
};

// Import UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Jobs data from backend (via composable)
const { jobsData, isLoading, initializeJobs } = useJobs();

// Ambil 6 job terbaru untuk homepage (tanpa filtered jobs)
const homeJobs = computed(() => (Array.isArray(jobsData.value) ? jobsData.value.slice(0, 12) : []));

// Initialize jobs saat mount
onMounted(async () => {
  // Check if login parameter is present
  if (route.query.login === 'true') {
    showLoginDialog.value = true;
  }
  await initializeJobs();
});

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
    image: '/images/rise_step_1.png',
  },
  {
    step: 2,
    stepNumber: '2',
    title: 'Finish Courses',
    description: 'AI career buddy will find the right courses to achieve your dream.',
    image: '/images/rise_step_2.png',
  },
  {
    step: 3,
    stepNumber: '3',
    title: 'Build Resume',
    description: 'Complete your application with CV builder to optimize your chances.',
    image: '/images/rise_step_3.png',
  },
  {
    step: 4,
    stepNumber: '4',
    title: 'Track Your Application',
    description: 'Track your application while finish more course and application.',
    image: '/images/rise_step_4.png',
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
    src: '/images/goto_impact.png',
    alt: 'GoTo Impact',
  },
  {
    name: 'Kyoto University',
    src: '/images/kyoto_univ.png',
    alt: 'Kyoto University',
  },
  {
    name: 'Inspire',
    src: '/images/inspire.png',
    alt: 'Inspire',
  },
  {
    name: 'Universitas Syiah Kuala',
    src: '/images/unsyiah.png',
    alt: 'Universitas Syiah Kuala',
  },
  {
    name: 'Universitas Airlangga',
    src: '/images/unair.png',
    alt: 'Universitas Airlangga',
  },
  {
    name: 'Universitas Pendidikan Indonesia',
    src: '/images/upi.png',
    alt: 'Universitas Pendidikan Indonesia',
  },
  {
    name: 'Youth Force ID',
    src: '/images/youth_force_id.png',
    alt: 'Youth Force ID',
  },
  {
    name: 'Changemaker Catalyst',
    src: '/images/changemaker_catalyst.jpeg',
    alt: 'Changemaker Catalyst',
  },
  {
    name: 'Biops Agrotechno',
    src: '/images/biops_agrotechno.png',
    alt: 'Biops Agrotechno',
  },
  {
    name: 'FAM Rural',
    src: '/images/fam_rural.jpeg',
    alt: 'FAM Rural',
  },
  {
    name: 'Komben',
    src: '/images/komben.png',
    alt: 'Komben',
  },
  {
    name: 'Desamind',
    src: '/images/desamind.png',
    alt: 'Desamind',
  },
  {
    name: 'Siaga Bencana',
    src: '/images/siaga_bencana.png',
    alt: 'Siaga Bencana',
  },
];

// (hapus data statis featuredJobsData)

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
    <div class="bg-gray-50">
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
                  <NuxtImg
                    src="/images/rise_hero.png"
                    alt="Rise Social Hero Illustration"
                    class="w-full h-full object-contain"
                    loading="eager"
                    format="webp"
                  />
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
            <StepperItem
              v-for="stepData in howItWorksSteps"
              :key="stepData.step"
              :step="stepData.step"
              class="group relative flex-1"
              :disabled="false"
            >
              <StepperTrigger
                class="flex flex-row-reverse p-0! pl-4! lg:flex-col items-center justify-center text-center gap-2 md:p-6 rounded-2xl pointer-events-none cursor-default"
              >
                <!-- Step Image -->
                <div
                  class="flex-2 h-40 lg:h-48 mx-auto bg-transparent rounded-lg flex items-center justify-center lg:group-hover:scale-105 transition-transform duration-300"
                >
                  <NuxtImg :src="stepData.image" :alt="stepData.title" class="h-50! object-contain" loading="lazy" format="webp" />
                </div>

                <div class="flex-3 flex flex-col lg:items-center lg:justify-center lg:pb-8 text-wrap">
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

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <Icon name="lucide:loader-2" class="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p class="text-gray-600">Loading job opportunities...</p>
          </div>

          <!-- Jobs Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12">
            <Card
              v-for="job in homeJobs"
              :key="job.id"
              class="py-0 hover:shadow! hover:-translate-y-1 cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col"
              @click="
                $router.push(
                  `/opportunities/${job.company?.slug || job.company?.name?.toLowerCase().replace(/\s+/g, '-')}/${
                    job.slug || job.title?.toLowerCase().replace(/\s+/g, '-')
                  }`
                )
              "
            >
              <CardContent class="px-3 flex-1 flex">
                <div class="flex w-full relative">
                  <!-- Company Logo -->
                  <div class="h-full px-4 flex items-center justify-center flex-shrink-0 rounded-l-lg">
                    <div class="h-28 rounded-2xl overflow-hidden">
                      <img
                        v-if="job.company?.logo_url"
                        :src="job.company.logo_url"
                        :alt="`${job.company?.name || 'Company'} logo`"
                        class="w-full h-full object-contain"
                        loading="lazy"
                        @error="$event.target.style.display = 'none'"
                      />
                      <div v-else class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon name="lucide:building-2" class="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 p-4 pl-2 flex flex-col justify-between min-h-[120px] min-w-0 overflow-hidden">
                    <!-- Top Section -->
                    <div class="space-y-2 min-w-0">
                      <!-- Job Title -->
                      <h3 class="font-bold text-gray-900 line-clamp-2">
                        {{ job.title }}
                      </h3>

                      <!-- Company Name -->
                      <p class="text-gray-600 text-sm line-clamp-1">
                        {{ job.company?.name }}
                      </p>

                      <Badge v-if="job.company?.industry" class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 w-fit mb-2">
                        {{ job.company.industry }}
                      </Badge>
                    </div>

                    <!-- Bottom Section - Meta Information -->
                    <div class="flex gap-2 text-gray-500 text-sm mt-auto">
                      <div class="flex items-center min-w-0 flex-shrink-0">
                        <Icon name="lucide:calendar" class="size-4 mr-2 flex-shrink-0" />
                        <span class="text-xs whitespace-nowrap">{{ job.relativePostedDate || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center min-w-0 flex-1">
                        <Icon name="lucide:map-pin" class="size-4 mr-2 flex-shrink-0" />
                        <span class="line-clamp-1 text-xs">
                          {{
                            [job.location?.city, job.location?.region, job.location?.country].filter(Boolean).join(', ') || 'Location not specified'
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- See More Jobs Button -->
          <div class="text-center">
            <Button variant="outline" class="hover:bg-[#0a5c5b] hover:text-white text-md" @click="$router.push('/opportunities')">
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
                <NuxtImg src="/images/rise_cta.png" alt="Get the Perfect Job for You" class="w-full object-contain" loading="lazy" format="webp" />
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
                  class="bg-[#0a5c5b] hover:bg-[#095351] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
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
                currentTestimonialSlide === index ? 'bg-[#0a5c5b]' : 'bg-gray-300 hover:bg-gray-400',
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
                currentPartnerSlideApi === index ? 'bg-[#0a5c5b]' : 'bg-gray-300 hover:bg-gray-400',
              ]"
            ></button>
          </div>
        </div>
      </section>
    </div>

    <!-- Login/Register Dialog -->
    <LoginRegisterDialog :open="showLoginDialog" @update:open="handleLoginDialogClose" />
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.4;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.4;
  max-height: 2.8em;
}
</style>
