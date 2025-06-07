<script setup>
// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Rise Young Leaders Summit - Rise Social',
  meta: [
    {
      name: 'description',
      content: 'Join Rise Young Leaders Summit - an annual program to improve youth capacity for young people aged 19-35 in various topics',
    },
  ],
});

// Registration steps data with icons
const registrationSteps = [
  {
    id: 1,
    title: 'Click The "Register" Button',
    description: 'Locate and click the "Register" button on our website. It will redirect you to our official Google Form registration page.',
    icon: '/images/rise-young-leaders/step-1.svg',
  },
  {
    id: 2,
    title: 'Fill Out The Registration Form',
    description:
      'Complete the Google Form with accurate and detailed information. Ensure all required fields are filled in to avoid submission issues.',
    icon: '/images/rise-young-leaders/step-2.svg',
  },
  {
    id: 3,
    title: 'Submit Your Form',
    description:
      'After completing the form, click the "Submit" button at the bottom of the page. You will receive a confirmation message on the form page.',
    icon: '/images/rise-young-leaders/step-3.svg',
  },
  {
    id: 4,
    title: 'Wait For Confirmation',
    description: 'After submitting the form, our team will review your application. Once approved, we will send you email with further instructions.',
    icon: '/images/rise-young-leaders/step-4.svg',
  },
];

// Benefits data
const benefitsData = [
  {
    id: 1,
    title: 'Educational Journey',
    description: 'Exceptional journey with network to enhance your learning process.',
    image: '/images/rise-young-leaders/gallery-1.png',
  },
  {
    id: 2,
    title: 'Expert Mentorship',
    description: 'Learn from industry leaders who are shaping the future of sustainable careers.',
    image: '/images/rise-young-leaders/gallery-2.png',
  },
  {
    id: 3,
    title: 'Hands-On Learning',
    description: 'Engage in real-world projects and practical workshops tailored to your growth.',
    image: '/images/rise-young-leaders/gallery-3.png',
  },
  {
    id: 4,
    title: 'Exclusive Opportunities',
    description: 'Access a network of green job and skill-building programs to jumpstart your journey.',
    image: '/images/rise-young-leaders/gallery-4.png',
  },
];

// State untuk gambar aktif
const activeBenefitImage = ref(benefitsData[0].image);
// State untuk benefit aktif
const activeBenefitId = ref(benefitsData[0].id);

// Function untuk mengubah gambar dan benefit aktif saat hover
const changeImage = (image, benefitId) => {
  activeBenefitImage.value = image;
  activeBenefitId.value = benefitId;
};

// Previous events data - using actual gallery images
const previousEvents = [
  {
    id: 1,
    image: '/images/rise-young-leaders/gallery-1.png',
    alt: 'Rise Young Leaders Summit Previous Event 1',
  },
  {
    id: 2,
    image: '/images/rise-young-leaders/gallery-2.png',
    alt: 'Rise Young Leaders Summit Previous Event 2',
  },
  {
    id: 3,
    image: '/images/rise-young-leaders/gallery-3.png',
    alt: 'Rise Young Leaders Summit Previous Event 3',
  },
  {
    id: 4,
    image: '/images/rise-young-leaders/gallery-4.png',
    alt: 'Rise Young Leaders Summit Previous Event 4',
  },
  {
    id: 5,
    image: '/images/rise-young-leaders/gallery-5.png',
    alt: 'Rise Young Leaders Summit Previous Event 5',
  },
  {
    id: 6,
    image: '/images/rise-young-leaders/gallery-6.png',
    alt: 'Rise Young Leaders Summit Previous Event 6',
  },
  {
    id: 7,
    image: '/images/rise-young-leaders/gallery-7.png',
    alt: 'Rise Young Leaders Summit Previous Event 7',
  },
  {
    id: 8,
    image: '/images/rise-young-leaders/gallery-8.png',
    alt: 'Rise Young Leaders Summit Previous Event 8',
  },
  {
    id: 9,
    image: '/images/rise-young-leaders/gallery-9.png',
    alt: 'Rise Young Leaders Summit Previous Event 9',
  },
  {
    id: 10,
    image: '/images/rise-young-leaders/gallery-10.png',
    alt: 'Rise Young Leaders Summit Previous Event 10',
  },
  {
    id: 11,
    image: '/images/rise-young-leaders/gallery-11.png',
    alt: 'Rise Young Leaders Summit Previous Event 11',
  },
  {
    id: 12,
    image: '/images/rise-young-leaders/gallery-12.png',
    alt: 'Rise Young Leaders Summit Previous Event 12',
  },
];

// Alumni testimonials data
const alumniTestimonials = [
  {
    id: 1,
    name: 'Annisa Faradila',
    country: 'Indonesia',
    text: "I am very grateful to Rise Social for this trip. Here's to future reunions and the continued success and expansion of the Rise ASEAN Leaders Summit.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Muhammad Zuhry',
    country: 'Indonesia',
    text: 'Thank you Rise Social for bring up my childhood memories in a very prestigious way. I learned a lot about disaster and also the meaning of life',
    rating: 5,
  },
  {
    id: 3,
    name: 'Oualid Abbane',
    country: 'Algeria',
    text: "Rise Social makes me want visit Japan again and again and give motivation and support, it's totally new journey and life learning experience",
    rating: 5,
  },
  {
    id: 4,
    name: 'Aaron Alexander',
    country: 'Indonesia',
    text: "THANK YOU VERY MUCH FOR THE BEST STUDY TRIP I'VE EVER EXPERIENCED IN MY LIFE ! WHAT A REMARKABLE EXPERIENCE! ^^",
    rating: 5,
  },
  {
    id: 5,
    name: 'Nisrina Amalia C.',
    country: 'Indonesia',
    text: 'Very good topic and insights from the lecturer. great job, Rise Social. Looking forward for another journey with you!',
    rating: 5,
  },
  {
    id: 6,
    name: 'Alvin Rajendra Rabani',
    country: 'Indonesia',
    text: "You're all great people doing great things. Keep doing what you do best and don't forget your friend here! Hope can jump in another session.",
    rating: 5,
  },
];

// Previous events carousel API functionality
const previousEventsApi = ref(null);
const currentPreviousSlide = ref(0);
const totalPreviousSlides = ref(0);

const setPreviousEventsApi = (api) => {
  previousEventsApi.value = api;
  if (!api) return;

  totalPreviousSlides.value = api.scrollSnapList().length;
  currentPreviousSlide.value = api.selectedScrollSnap();

  api.on('select', () => {
    currentPreviousSlide.value = api.selectedScrollSnap();
  });
};

const goToPreviousSlide = (index) => {
  if (previousEventsApi.value) {
    previousEventsApi.value.scrollTo(index);
  }
};

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
      <div class="container-wrapper flex flex-col gap-8 lg:gap-16">
        <NuxtImg
          src="/images/rise-young-leaders/banner.png"
          alt="Rise Young Leaders Summit Japan 2025"
          class="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-bottom rounded-2xl object-cover"
          loading="lazy"
          format="webp"
        />
        <div class="flex flex-col gap-4 lg:gap-6 items-center text-center px-4">
          <h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold text-primary leading-tight">Rise Young Leaders Summit</h1>
          <div class="space-y-3 lg:space-y-4 text-gray-600 leading-relaxed max-w-4xl">
            <p class="text-sm sm:text-base lg:text-lg">
              Rise Young Leaders Summit is an annual program to improve youth capacity for young people aged 19-35 in various topic. The program
              encourages youth through competitions for fully and partially funded Leadership Trip Programs in a lot of countries.
            </p>
          </div>

          <div class="pt-2 lg:pt-4">
            <Button size="lg" class="bg-primary text-white hover:bg-primary/80 px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base">
              Register Here!
            </Button>
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

    <!-- What Will You Get Section -->
    <section class="section-py-lg bg-gradient-to-br from-gray-50 to-white">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="text-center mb-8 lg:mb-16 px-4">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">What Will You Get?</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <!-- Left Benefits List -->
          <div class="w-full lg:flex-4 flex flex-col gap-2">
            <div v-for="benefit in benefitsData" :key="benefit.id" class="group flex-1">
              <div
                :class="[
                  'flex items-start space-x-3 lg:space-x-4 p-4 lg:p-6 rounded-2xl hover:bg-slate-100 transition-colors duration-300 cursor-pointer',
                  activeBenefitId === benefit.id ? 'bg-slate-100' : '',
                ]"
                @mouseenter="changeImage(benefit.image, benefit.id)"
              >
                <div class="size-8 lg:size-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm lg:text-lg">{{ benefit.id }}</span>
                </div>
                <div class="space-y-1 lg:space-y-2">
                  <h3 class="text-lg lg:text-xl font-bold text-gray-900">{{ benefit.title }}</h3>
                  <p class="text-sm lg:text-base text-gray-600 leading-relaxed">{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Image -->
          <div class="w-full lg:flex-5 relative h-full flex items-center">
            <div class="relative w-full">
              <Transition name="fade" mode="out-in">
                <NuxtImg
                  :key="activeBenefitImage"
                  :src="activeBenefitImage"
                  alt="What you will get from Rise Young Leaders Summit"
                  class="w-full h-[300px] lg:h-[440px] object-cover rounded-3xl shadow-2xl transform"
                  loading="lazy"
                  format="webp"
                />
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Previous Rise Young Leaders Section -->
    <section class="section-py-lg bg-gray-100">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section">Previous Rise Young Leaders</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <!-- Events Carousel -->
        <Carousel
          :opts="{
            align: 'start',
            loop: true,
          }"
          class="w-full"
          @init-api="setPreviousEventsApi"
        >
          <CarouselContent class="-ml-2 md:-ml-4 py-4 cursor-pointer">
            <CarouselItem v-for="event in previousEvents" :key="event.id" class="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3">
              <div class="p-2">
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <NuxtImg :src="event.image" :alt="event.alt" class="w-full h-48 sm:h-56 lg:h-64 object-cover" loading="lazy" format="webp" />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="hidden shadow-none sm:flex" />
          <CarouselNext class="hidden shadow-none sm:flex" />
        </Carousel>

        <!-- Navigation Dots -->
        <div class="flex justify-center mt-4 space-x-2">
          <button
            v-for="(dot, index) in totalPreviousSlides"
            :key="index"
            @click="goToPreviousSlide(index)"
            :class="[
              'size-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer',
              currentPreviousSlide === index ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400',
            ]"
          ></button>
        </div>
      </div>
    </section>

    <!-- Hear from Our Alumni Section -->
    <section class="section-py-lg bg-white">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h2 class="heading-section">Hear from Our Alumni</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <!-- Alumni Testimonials Carousel -->
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

                  <!-- Author Info -->
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
                    <p class="text-xs lg:text-sm text-primary font-medium">
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

<style scoped>
/* Fade transition untuk pergantian gambar */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
