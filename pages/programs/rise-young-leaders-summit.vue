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

// Function untuk mengubah gambar saat hover
const changeImage = (image) => {
  activeBenefitImage.value = image;
};

// Function untuk reset ke gambar pertama saat leave
const resetImage = () => {
  activeBenefitImage.value = benefitsData[0].image;
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
    testimonial:
      "I am very grateful to Rise Social for this trip. Here's to future reunions and the continued success and expansion of the Rise ASEAN Leaders Summit.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Muhammad Zuhry',
    country: 'Indonesia',
    testimonial:
      'Thank you Rise Social for bring up my childhood memories in a very prestigious way. I learned a lot about disaster and also the meaning of life',
    rating: 5,
  },
  {
    id: 3,
    name: 'Oualid Abbane',
    country: 'Algeria',
    testimonial:
      "Rise Social makes me want visit Japan again and again and give motivation and support, it's totally new journey and life learning experience",
    rating: 5,
  },
  {
    id: 4,
    name: 'Aaron Alexander',
    country: 'Indonesia',
    testimonial: "THANK YOU VERY MUCH FOR THE BEST STUDY TRIP I'VE EVER EXPERIENCED IN MY LIFE ! WHAT A REMARKABLE EXPERIENCE! ^^",
    rating: 5,
  },
  {
    id: 5,
    name: 'Nisrina Amalia C.',
    country: 'Indonesia',
    testimonial: 'Very good topic and insights from the lecturer. great job, Rise Social. Looking forward for another journey with you!',
    rating: 5,
  },
  {
    id: 6,
    name: 'Alvin Rajendra Rabani',
    country: 'Indonesia',
    testimonial:
      "You're all great people doing great things. Keep doing what you do best and don't forget your friend here! Hope can jump in another session.",
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
    <section class="bg-white section-py-lg py-12">
      <div class="container-wrapper flex flex-col gap-16">
        <NuxtImg
          src="/images/rise-young-leaders/banner.png"
          alt="Rise Young Leaders Summit Japan 2025"
          class="w-full h-[600px] object-bottom rounded-2xl object-cover"
          loading="lazy"
          format="webp"
        />
        <div class="flex flex-col gap-6 items-center">
          <h1 class="text-4xl lg:text-5xl font-bold text-primary leading-tight">Rise Young Leaders Summit</h1>
          <div class="space-y-4 text-gray-600 leading-relaxed">
            <p class="text-lg">
              Rise Young Leaders Summit is an annual program to improve youth capacity for young people aged 19-35 in various topic.
            </p>
            <p class="text-lg">
              The program encourages youth through competitions for fully and partially funded Leadership Trip Programs in a lot of countries.
            </p>
          </div>

          <div class="pt-4">
            <Button size="lg"> Register Here! </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- How to Register Section -->
    <section class="section-py-lg bg-green-50 text-gray-800 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full">
          <div class="w-full h-full bg-white/5 rounded-full blur-3xl transform rotate-45"></div>
        </div>
      </div>

      <div class="relative z-10 container-wrapper">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-5xl font-bold mb-4 text-secondary">How to Register</h2>
          <div class="w-24 h-1 mx-auto rounded-full"></div>
        </div>

        <!-- Registration Steps -->
        <div class="flex gap-6">
          <div
            v-for="step in registrationSteps"
            :key="step.id"
            class="group flex-1 bg-white rounded-3xl p-8 text-center space-y-6 border border-gray-100 hover:bg-white transition-all duration-300 transform hover:-translate-y-2"
          >
            <!-- Icon Circle -->
            <div
              class="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <NuxtImg :src="step.icon" :alt="`Step ${step.id} icon`" class="w-10 h-10 filter brightness-0 invert" />
            </div>

            <!-- Step Number & Title -->
            <h3 class="text-xl font-bold">{{ step.id }}. {{ step.title }}</h3>

            <!-- Description -->
            <p class="text-sm leading-relaxed">
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
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">What Will You Get?</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Benefits List -->
          <div class="space-y-2">
            <div v-for="benefit in benefitsData" :key="benefit.id" class="group">
              <div
                class="flex items-start space-x-4 p-6 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 cursor-pointer"
                @mouseenter="changeImage(benefit.image)"
                @mouseleave="resetImage"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                >
                  <span class="text-white font-bold text-lg">{{ benefit.id }}</span>
                </div>
                <div class="space-y-2">
                  <h3 class="text-xl font-bold text-gray-900">{{ benefit.title }}</h3>
                  <p class="text-gray-600 leading-relaxed">{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Image -->
          <div class="relative h-full flex items-center">
            <div class="relative w-full">
              <Transition name="fade" mode="out-in">
                <NuxtImg
                  :key="activeBenefitImage"
                  :src="activeBenefitImage"
                  alt="What you will get from Rise Young Leaders Summit"
                  class="w-full h-[480px] object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  format="webp"
                />
              </Transition>
              <!-- Decorative elements -->
              <div class="absolute -top-6 -left-6 w-24 h-24 bg-emerald-200 rounded-full opacity-50 blur-xl"></div>
              <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-200 rounded-full opacity-50 blur-xl"></div>
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
          <h2 class="heading-section mb-16">Previous Rise Young Leaders</h2>
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
          <CarouselContent class="-ml-2 md:-ml-4 py-4">
            <CarouselItem v-for="event in previousEvents" :key="event.id" class="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <div class="p-2">
                <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <NuxtImg :src="event.image" :alt="event.alt" class="w-full h-64 object-cover" loading="lazy" format="webp" />
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
              currentPreviousSlide === index ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400',
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
          <h2 class="heading-section mb-16">Hear from Our Alumni</h2>
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
          <CarouselContent class="-ml-2 md:-ml-4 py-4">
            <CarouselItem v-for="alumni in alumniTestimonials" :key="alumni.id" class="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <div class="p-4">
                <div class="bg-gray-50 rounded-2xl p-8 h-full flex flex-col space-y-4">
                  <!-- Testimonial Text -->
                  <p class="text-gray-700 leading-relaxed flex-grow italic">"{{ alumni.testimonial }}"</p>

                  <!-- Alumni Info -->
                  <div class="space-y-2">
                    <h4 class="font-bold text-gray-900">{{ alumni.name }}</h4>
                    <p class="text-green-600 font-medium">{{ alumni.country }}</p>

                    <!-- Star Rating -->
                    <div class="flex space-x-1">
                      <span v-for="star in alumni.rating" :key="star" class="text-yellow-400 text-lg">★</span>
                    </div>
                  </div>
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
            v-for="(dot, index) in totalAlumniSlides"
            :key="index"
            @click="goToAlumniSlide(index)"
            :class="[
              'size-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer',
              currentAlumniSlide === index ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400',
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
