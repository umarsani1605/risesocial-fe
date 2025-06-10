<script setup>
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Programs - Rise Social',
  meta: [{ name: 'description', content: 'Join Rise exclusive programs and gain hands-on learning experience in various countries' }],
});

// Programs data
const programsData = [
  {
    id: 1,
    title: 'Rise Young Leaders Summit',
    image: '/images/rise_young_leader.png',
    link: '/programs/rise-young-leaders-summit',
    description1: 'Rise Young Leaders Summit is an annual program to improve youth capacity for young people aged 16-25 in various topics.',
    description2: 'The program encourages youth through competitions for fully and partially funded Leadership Trip Programs in 6 lot of countries.',
  },
  {
    id: 2,
    title: 'Rise Sustainability Bootcamp',
    image: '/images/rise_educator.png',
    link: '/programs/rise-sustainability-bootcamp',
    description1:
      "Rise Educator's Skills Accelerator is an online learning program started from 1 up to 5 months live class with experts and mentor to student get comprehensive understanding in various sustainability topic.",
    description2:
      'This program is for young professional, career switchers, sustainability and green workers to improve their knowledge and skills in this topic, equipped with JOB ACCELERATOR program with our hiring partners.',
  },
  {
    id: 3,
    title: 'Little Hero Camp',
    image: '/images/rise_little_hero.png',
    link: '/programs/little-hero-camp',
    description1: 'Little Hero Camp is an offline summer training for children aged 7-15 years old.',
    description2:
      'Equipped with various topics in sustainability, to enhance their skills and interests and become more empowered during their summer vacation.',
  },
];

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

// Alumni carousel state
const currentAlumniSlide = ref(0);
const totalAlumniSlides = 2;

const nextAlumniSlide = () => {
  currentAlumniSlide.value = (currentAlumniSlide.value + 1) % totalAlumniSlides;
};

const previousAlumniSlide = () => {
  currentAlumniSlide.value = currentAlumniSlide.value === 0 ? totalAlumniSlides - 1 : currentAlumniSlide.value - 1;
};

// Auto-play alumni carousel
onMounted(() => {
  setInterval(() => {
    nextAlumniSlide();
  }, 6000); // Change slide every 6 seconds
});
</script>
<template>
  <div class="bg-gray-50 mt-16">
    <!-- Hero Section -->
    <section class="bg-white section-py-lg">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Logo Icon -->
        <div class="flex justify-center mb-6">
          <div class="h-16 sm:h-24 flex items-center justify-center">
            <NuxtImg src="/images/rise_icon.png" alt="Rise Icon" class="w-full h-full object-contain" loading="eager" format="webp" />
          </div>
        </div>

        <!-- Title -->
        <h1 class="heading-section-hero text-gray-900 mb-6">Rise Exclusive Programs</h1>

        <!-- Description -->
        <p class="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Gain hands-on learning experience in various countries while being exposed to a wide range of expertise in the field.
        </p>

        <!-- CTA Button -->
        <Button class="bg-emerald-600 hover:bg-emerald-700" size="lg"> Sign Up Now! </Button>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="bg-white section-py-md pt-8 lg:pt-12">
      <div class="container-wrapper">
        <div class="flex flex-col lg:flex-row w-full items-center gap-12 lg:gap-24 text-center justify-center">
          <!-- Statistic 1 -->
          <div class="space-y-2">
            <div class="text-5xl lg:text-6xl font-bold text-primary">2,700+</div>
            <div class="text-base text-gray-600">Online program participants</div>
          </div>

          <!-- Statistic 2 -->
          <div class="space-y-2">
            <div class="text-5xl lg:text-6xl font-bold text-primary">5+</div>
            <div class="text-base text-gray-600">Countries and still counting</div>
          </div>

          <!-- Statistic 3 -->
          <div class="space-y-2">
            <div class="text-5xl lg:text-6xl font-bold text-primary">61+</div>
            <div class="text-base text-gray-600">Trainees from 3 countries</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Programs Section -->
    <section class="section-py-lg">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section">Choose The Perfect Programs for You</h2>
        </div>

        <!-- Programs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card
            v-for="program in programsData"
            :key="program.id"
            class="hover:shadow-lg! hover:scale-102 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
          >
            <CardContent class="flex flex-col gap-4 flex-grow">
              <div class="aspect-w-16 aspect-h-10 rounded-lg overflow-hidden">
                <NuxtImg :src="program.image" :alt="program.title" class="w-full h-48 object-cover" format="webp" />
              </div>
              <CardTitle class="heading-card">{{ program.title }}</CardTitle>
              <p class="text-sm leading-relaxed">
                {{ program.description1 }}
              </p>
              <p class="text-sm leading-relaxed flex-grow">
                {{ program.description2 }}
              </p>
              <NuxtLink
                :to="program.link"
                class="flex items-center justify-center gap-2 text-white py-1.5 transition-all duration-300 rounded-lg bg-emerald-600 hover:bg-emerald-700"
              >
                <span>Start Now</span>
                <Icon name="lucide:arrow-right" class="ml-2 h-4 w-4" />
              </NuxtLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section-py-sm bg-white">
      <div class="container-wrapper-lg">
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

    <!-- Mobile App Section -->
    <section class="py-12 lg:pt-16 lg:pb-0 bg-green-50">
      <div class="container-wrapper">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center">
          <!-- Left Mobile Mockups -->
          <div class="w-64 sm:w-80 lg:w-[40rem]">
            <NuxtImg src="/images/rise_mobile_app.png" alt="Rise Mobile App" class="w-full object-contain" format="webp" />
          </div>
          <!-- Right Content -->
          <div class="space-y-6">
            <h2 class="heading-section">Seamless Access, Anytime, Anywhere</h2>
            <p class="text-lg text-gray-600 leading-relaxed">
              Discover opportunities to make an impact. From green jobs to skill-building programs, our platform is your gateway to a sustainable
              tomorrow.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Find Opportunities CTA Section -->
    <section class="section-py-sm bg-[#127355]">
      <div class="container-wrapper text-center">
        <h2 class="heading-section text-white mb-8">Find Others Opportunities</h2>
        <Button size="lg" class="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"> Search Job </Button>
      </div>
    </section>
  </div>
</template>
