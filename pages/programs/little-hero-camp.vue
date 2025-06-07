<script setup>
// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Little Hero Camp - Rise Social',
  meta: [
    {
      name: 'description',
      content:
        'Little Hero Camp is an offline summer training for children aged 7-15 years old. Equipped with various topics in sustainability to enhance their skills and interests.',
    },
  ],
});

// Registration steps data with icons
const registrationSteps = [
  {
    id: 1,
    title: 'Click The "Enroll" Button',
    description: 'Locate and click the "Enroll Now!" button on our website. It will redirect you to our official registration page.',
    icon: '/images/rise-young-leaders/step-1.svg',
  },
  {
    id: 2,
    title: 'Fill Out The Registration Form',
    description: 'Complete the registration form with accurate information about your child. Ensure all required fields are filled in properly.',
    icon: '/images/rise-young-leaders/step-2.svg',
  },
  {
    id: 3,
    title: 'Submit Your Form',
    description: 'After completing the form, click the "Submit" button. You will receive a confirmation message with enrollment details.',
    icon: '/images/rise-young-leaders/step-3.svg',
  },
  {
    id: 4,
    title: 'Wait For Confirmation',
    description: 'Our team will review your application and contact you with further instructions and camp schedule information.',
    icon: '/images/rise-young-leaders/step-4.svg',
  },
];

// Alumni testimonials data
const alumniTestimonials = [
  {
    id: 1,
    name: 'Sarah Anderson',
    country: 'Indonesia',
    text: 'My daughter loved the Little Hero Camp! She learned so much about sustainability and made amazing friends. The activities were engaging and fun.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ahmad Rizki',
    country: 'Indonesia',
    text: 'The camp was incredible! My son came home excited every day, sharing what he learned about taking care of our environment.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Maria Santos',
    country: 'Indonesia',
    text: 'Thank you Rise Social for this wonderful program. The mentors were fantastic and my child gained so much confidence and knowledge.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Chen',
    country: 'Indonesia',
    text: 'Excellent program! My daughter is now more aware of environmental issues and actively participates in sustainable practices at home.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Lisa Wijaya',
    country: 'Indonesia',
    text: 'Little Hero Camp exceeded our expectations. The combination of learning and fun activities was perfect for kids this age.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Robert Johnson',
    country: 'Indonesia',
    text: 'Highly recommend this camp! My son learned valuable life skills and developed a passion for protecting our planet.',
    rating: 5,
  },
];

// Alumni testimonials carousel API functionality
const alumniApi = ref(null);
const currentAlumniSlide = ref(0);
const totalAlumniSlides = ref(0);

const setAlumniApi = (api) => {
  alumniApi.value = api;
  if (!api) return;

  totalAlumniSlides.value = api.scrollSnapList().length;
  currentAlumniSlide.value = api.selectedScrollSnap();

  api.on('select', () => {
    currentAlumniSlide.value = api.selectedScrollSnap();
  });
};

const goToAlumniSlide = (index) => {
  if (alumniApi.value) {
    alumniApi.value.scrollTo(index);
  }
};
</script>

<template>
  <div class="bg-gray-50 mt-20">
    <!-- Hero Section -->
    <section class="bg-white section-py-lg py-8 lg:py-12">
      <div class="container-wrapper">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-6 lg:space-y-8 px-4 lg:px-0">
            <h1 class="text-2xl sm:text-3xl lg:text-6xl font-bold text-primary leading-tight">Little Hero Camp</h1>

            <div class="space-y-3 lg:space-y-4">
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                Little Hero Camp is an offline summer training for children aged 7-15 years old.
              </p>
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                Equipped with various topics in sustainability, to enhance their skills and interests and become more empowered during their summer
                vacation.
              </p>
            </div>

            <div class="pt-2 lg:pt-4">
              <Button size="lg" class="bg-black text-white hover:bg-gray-800 px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-lg"> Enroll Now! </Button>
            </div>
          </div>

          <!-- Right Image -->
          <div class="relative">
            <NuxtImg
              src="/images/rise-young-leaders/gallery-8.png"
              alt="Little Hero Camp - Children learning with interactive floor projection"
              class="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-xl"
              loading="lazy"
              format="webp"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- How to Register Section -->
    <section class="section-py-lg bg-slate-100 text-gray-800 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full">
          <div class="w-full h-full bg-white/5 rounded-full blur-3xl transform rotate-45"></div>
        </div>
      </div>

      <div class="relative z-10 container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section">How to Register</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <!-- Registration Steps -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="step in registrationSteps"
            :key="step.id"
            class="group bg-white rounded-3xl p-6 lg:p-8 text-center space-y-4 lg:space-y-6 border border-gray-100 hover:bg-white transition-all duration-300 transform hover:-translate-y-2 shadow-sm"
          >
            <!-- Icon Circle -->
            <div
              class="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-full flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-105 transition-transform duration-300"
            >
              <NuxtImg :src="step.icon" :alt="`Step ${step.id} icon`" class="w-8 h-8 lg:w-10 lg:h-10 filter brightness-0 invert" />
            </div>

            <!-- Step Number & Title -->
            <h3 class="text-lg lg:text-xl font-bold leading-tight">{{ step.id }}. {{ step.title }}</h3>

            <!-- Description -->
            <p class="text-xs lg:text-sm leading-relaxed text-gray-600">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Hear from Our Parents Section -->
    <section class="section-py-lg bg-white">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section">Hear from Our Parents</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <!-- Parent Testimonials Carousel -->
        <Carousel
          :opts="{
            align: 'start',
            loop: true,
          }"
          class="w-full"
          @init-api="setAlumniApi"
        >
          <CarouselContent class="-ml-2 md:-ml-4 py-4 cursor-pointer">
            <CarouselItem
              v-for="testimonial in alumniTestimonials"
              :key="testimonial.id"
              class="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3"
            >
              <Card class="p-4 sm:p-6 lg:p-8 text-center h-full">
                <CardContent class="flex flex-col justify-between p-0 h-full">
                  <div class="space-y-3 lg:space-y-4">
                    <p class="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">"{{ testimonial.text }}"</p>
                  </div>

                  <!-- Parent Info -->
                  <div class="mt-4 lg:mt-6 space-y-2">
                    <!-- Rating Stars -->
                    <div class="flex justify-center space-x-1">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="heroicons:star-solid"
                        class="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400"
                        style="fill: currentColor"
                      />
                    </div>

                    <!-- Name -->
                    <h4 class="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">
                      {{ testimonial.name }}
                    </h4>

                    <!-- Country -->
                    <p class="text-xs lg:text-sm text-primary font-medium">Parent from {{ testimonial.country }}</p>
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
            v-for="(dot, index) in totalAlumniSlides"
            :key="index"
            @click="goToAlumniSlide(index)"
            :class="[
              'size-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer',
              currentAlumniSlide === index ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400',
            ]"
          ></button>
        </div>
      </div>
    </section>
  </div>
</template>
