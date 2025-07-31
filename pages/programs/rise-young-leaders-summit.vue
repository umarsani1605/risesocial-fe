<script setup>
import { ref, computed } from 'vue';

// Use default layout
definePageMeta({
  layout: 'white-navbar',
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

// Gallery images
const galleryImages = [
  'DSCF0340.jpg',
  'DSCF0345.jpg',
  'DSCF9137.jpg',
  'IMG_1042.jpg',
  'IMG_1747.jpg',
  'IMG_1971.jpg',
  'IMG_1986.jpg',
  'IMG_2007.jpg',
  'IMG_2075.jpg',
  'IMG_5041.jpg',
  'IMG_5325.jpg',
  'IMG_5652.jpg',
];

// Lightbox state
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);
const lightboxImages = computed(() =>
  galleryImages.map((img) => ({
    src: `/images/rise-young-leaders/2025/gallery/${img}`,
    title: 'Rise Young Leaders Summit',
  }))
);

// Carousel refs - these are used by the carousel component
const previousEventsApi = ref(null);
const currentPreviousSlide = ref(0);
const totalPreviousSlides = ref(3); // Adjust based on your actual number of slides

// Set carousel API reference
const setPreviousEventsApi = (api) => {
  previousEventsApi.value = api;
  if (!api) return;

  totalPreviousSlides.value = 3; // Update with actual slide count if available
  currentPreviousSlide.value = 0; // Reset to first slide
};

// Navigate to specific slide
const goToPreviousSlide = (index) => {
  currentPreviousSlide.value = index;
  if (previousEventsApi.value) {
    previousEventsApi.value.scrollTo(index);
  }
};

// Show lightbox with selected image
const showLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxVisible.value = true;
};

// Alumni testimonials data
const alumniTestimonials = [
  {
    id: 1,
    name: 'Oualid Abbane',
    country: 'Algeria',
    text: "Rise Social makes me want visit Japan again and again and give motivation and support, it's totally new journey and life learning experience",
    rating: 5,
  },
  {
    id: 2,
    name: 'Aaron Alexander',
    country: 'Indonesia',
    text: "THANK YOU VERY MUCH FOR THE BEST STUDY TRIP I'VE EVER EXPERIENCED IN MY LIFE ! WHAT A REMARKABLE EXPERIENCE! ^^",
    rating: 5,
  },
  {
    id: 3,
    name: 'Annisa Faradila',
    country: 'Indonesia',
    text: "I am very grateful to Rise Social for this trip. Here's to future reunions and the continued success and expansion of the Rise ASEAN Leaders Summit.",
    rating: 5,
  },
  {
    id: 4,
    name: 'Muhammad Zuhry',
    country: 'Indonesia',
    text: 'Thank you Rise Social for bring up my childhood memories in a very prestigious way. I learned a lot about disaster and also the meaning of life',
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
  {
    id: 7,
    name: 'Arief M.',
    country: 'Indonesia',
    text: 'Friends, exclusive experiences, updated life goals, 100k+ steps, and 1000% fun! Thanks a lot to Rise Social for inviting me to this program! So happy to know the organizers, other participants, PPI Kyoto, and Prof. Fujiwara. I hope we can see each other next time!',
    rating: 5,
  },
  {
    id: 8,
    name: 'Arkansyah',
    country: 'Indonesia',
    text: 'I gain a lot of experiences about how culture inherent the public space, especially in waste management, how japanese sorting its waste from the sources, how industry and recycling facility help reduce trash and processing it wisely, and also lesson learn for indonesia about japanese waste culture adoption',
    rating: 5,
  },
  {
    id: 9,
    name: 'Firdaus A.',
    country: 'Indonesia',
    text: 'Participating in the Rise Young Leaders Summit Japan 2025 was an eye-opening experience for me, especially in the field and industry of waste management. I gained valuable insights into how policies, cultural values, and community behavior shape effective waste management systems.',
    rating: 5,
  },
];

// FAQ data
const faqs = [
  {
    id: 1,
    question: 'What will the fully-funded winner get?',
    answer: 'You will get round-trip airfare tickets, meals, transport in Japan and shared accommodation while in Japan.',
  },
  {
    id: 2,
    question: 'Are we required to create an essay?',
    answer: 'If you apply for fully funded and partial funded selection, you are required to create an essay and choose the topic for your essay.',
  },
  {
    id: 3,
    question: 'Is this program only for students?',
    answer: 'This program is open to everyone who meets the registration requirements from all economic, social and educational backgrounds.',
  },
  {
    id: 4,
    question: 'What is the registration fee used for?',
    answer: 'The registration fee is for the selection process and all participants will also receive a certificate and Humanitarian E-book.',
  },
  {
    id: 5,
    question: 'What if I need a letter of permission for my work institutions?',
    answer: 'Rise will provide all the required letters including invitation letters for visas if needed.',
  },
];

// These are now defined at the top of the script section

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
  <div class="">
    <!-- Hero Section -->
    <section class="bg-white py-12 lg:pt-48 lg:pb-12 overflow-x-clip overflow-y-visible">
      <div class="container-wrapper relative">
        <div class="flex flex-col-reverse lg:flex-row gap-12 items-stretch">
          <!-- Left Column - Content -->
          <div class="flex-1 space-y-6 lg:space-y-8 px-4">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Rise Young Leaders Summit Japan 2025</h1>
            <div class="space-y-4 leading-relaxed">
              <p>
                Rise Young Leaders Summit Japan 2025 isn't just a summit—it's a launchpad for future climate leaders. Powered by Rise Social, this is
                a movement of changemakers who believe that a better, greener future starts with youth action today.
              </p>
            </div>
            <div class="pt-4">
              <Button size="lg" class="bg-primary text-white hover:bg-primary/90 px-8 py-3 text-base font-medium rounded-lg transition-colors">
                Register Now
              </Button>
            </div>
          </div>

          <!-- Right Column - Graphic -->
          <div class="h-[320px] md:h-[475px] lg:flex-1 relative"></div>
        </div>
        <div
          class="absolute w-[800px] top-[-13rem] left-[-16rem] md:w-[1200px] md:top-[-20rem] md:left-[-22rem] lg:top-[-26rem] lg:left-[24rem] pointer-events-none select-none"
        >
          <img
            src="/images/rise-young-leaders/2025/decoration.png"
            alt="Rise Young Leaders Summit 2025"
            class="h-auto object-contain pointer-events-none select-none"
          />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-transparent py-16 lg:py-24">
      <div class="container-wrapper space-y-8 lg:space-y-16">
        <!-- Top Section: Title and Description -->
        <div class="text-center max-w-4xl mx-auto mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Be the Force Behind World's Green Revolution</h2>
          <p class="text-base lg:text-lg">
            If you're passionate about sustainability, driven to lead, and ready to turn your climate ideas into real projects, this is your moment to
            rise.
          </p>
        </div>

        <!-- Middle Section: 3-Column Image Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col items-center gap-6">
            <img
              src="/images/rise-young-leaders/2025/gallery/IMG_6069.jpg"
              alt="Climate workshop"
              class="h-52 aspect-[4/3] object-cover rounded-xl"
            />
            <span class="text-center">Engage in climate dialogues with experts from top universities like Waseda, Kyoto, & Tokyo University.</span>
          </div>
          <div class="flex flex-col items-center gap-6">
            <img
              src="/images/rise-young-leaders/2025/gallery/IMG_2075.jpg"
              alt="Group discussion"
              class="h-52 aspect-[4/3] object-cover rounded-xl"
            />
            <span class="text-center">Gain hands-on knowledge from field visits, disaster resilience workshops, and leadership labs.</span>
          </div>
          <div class="flex flex-col items-center gap-6">
            <img src="/images/rise-young-leaders/gallery-8.png" alt="Field visit" class="h-52 aspect-[4/3] object-cover rounded-xl" />
            <span class="text-center">Amplify your mission through global collaborations and cultural exchange.</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="bg-white relative overflow-hidden">
      <div class="container-wrapper relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Quote icon -->
          <div class="mb-8">
            <svg class="size-8 mx-auto text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
              />
            </svg>
          </div>
          <!-- Quote text -->
          <blockquote class="mb-8">
            <p class="text-base md:text-lg lg:text-xl font-medium text-gray-800 leading-relaxed">
              This is where <span class="text-primary font-semibold">climate action</span> meets
              <span class="text-primary font-semibold">leadership</span>—and where your
              <span class="relative">journey begins.</span>
            </p>
          </blockquote>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
      </div>
    </section>

    <!-- Eligibility Section -->
    <section class="section-py-lg bg-gradient-to-t from-orange-50 to-white text-gray-800 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute -bottom-4 left-4 h-96 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_4.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="absolute -bottom-16 left-72 h-52 z-10">
          <NuxtImg src="/images/rise-young-leaders/2025/japan_tree.png" alt="Rise Young Leaders Summit 2025" class="w-full h-full object-contain" />
        </div>
        <div class="absolute bottom-0 right-16 h-96 z-20 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_3.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="absolute -bottom-16 right-48 h-52 z-10 hidden lg:block">
          <NuxtImg src="/images/rise-young-leaders/2025/japan_tree.png" alt="Rise Young Leaders Summit 2025" class="w-full h-full object-contain" />
        </div>
        <div class="absolute top-0 left-0 w-full h-full">
          <div class="w-full h-full bg-white/5 rounded-full blur-3xl transform rotate-45"></div>
        </div>
      </div>

      <div class="relative z-10 container-wrapper">
        <!-- Section Title -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Are You Eligible?</h2>
          <p class="text-lg">We're looking for passionate individuals ready to drive real change in their communities—and beyond.</p>
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto">
          <!-- Card 1 -->
          <div
            class="md:col-span-6 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-400 transition-all duration-300 shadow-subtle"
          >
            <div class="size-14 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="lucide:users" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-bold">Target Audience</h3>
            <p class="text-sm">Aspiring young leaders, volunteers, and professionals in the social and environmental sectors.</p>
          </div>

          <!-- Card 2 -->
          <div
            class="md:col-span-6 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-400 transition-all duration-300 shadow-subtle"
          >
            <div class="size-14 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="lucide:heart-handshake" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Advocacy Focus</h3>
            <p class="text-sm">Your passion lies in sustainability, youth empowerment, climate leadership, or community development.</p>
          </div>

          <!-- Card 3 -->
          <div
            class="md:col-span-4 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-400 transition-all duration-300 shadow-subtle"
          >
            <div class="size-14 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="lucide:graduation-cap" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Eligibility</h3>
            <p class="text-sm">Open to university students and early-career professionals.</p>
          </div>

          <!-- Card 4 -->
          <div
            class="md:col-span-4 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-400 transition-all duration-300 shadow-subtle"
          >
            <div class="size-14 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="lucide:calendar" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Age Requirement</h3>
            <p class="text-sm">Applicants must be 19 - 35 years old at the time of application.</p>
          </div>

          <!-- Card 5 -->
          <div
            class="md:col-span-4 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-400 transition-all duration-300 shadow-subtle"
          >
            <div class="size-14 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="lucide:globe" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Nationality</h3>
            <p class="text-sm">Open to all nationalities, across Southeast Asia and beyond.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Program Highlights Section -->
    <section class="section-py-lg bg-white text-gray-800 relative z-20">
      <div class="absolute top-0 left-0 right-0">
        <img src="/images/rise-young-leaders/2025/bg-vector-white.png" alt="Rise Young Leaders Summit 2025" class="w-full h-auto object-contain" />
      </div>
      <div class="relative z-10 container-wrapper">
        <!-- Section Title -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Program Highlights</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <!-- Program Highlights Bento Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4">
          <!-- Competition (Top Left) -->
          <div
            class="group flex flex-col lg:flex-row items-center justify-center bg-gradient-to-tr from-primary to-orange-300 text-white rounded-4xl overflow-hidden transition-all duration-300 shadow-subtle p-4"
          >
            <div class="w-full lg:flex-1 h-48 lg:h-full rounded-2xl lg:aspect-square overflow-hidden">
              <img
                src="/images/rise-young-leaders/2025/gallery/IMG_8593.jpg"
                alt="Competition"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="flex-1 flex flex-col items-center text-center p-4 lg:p-6 gap-3">
              <h3 class="text-xl font-bold">Competition</h3>
              <p class="text-sm">
                Stand a chance to be one of three fully funded delegates, selected through a compelling climate-themed essay. In addition, 25
                outstanding applicants will be granted partial and self-funded slots.
              </p>
            </div>
          </div>

          <!-- Mini Lecture Series (Bottom Left) -->
          <div
            class="group flex flex-col lg:flex-row items-center justify-center bg-gradient-to-tr from-primary to-orange-300 text-white rounded-4xl lg:rounded-bl-[10rem] overflow-hidden transition-all duration-300 shadow-subtle p-4"
          >
            <div class="w-full lg:flex-1 h-48 lg:h-full rounded-2xl lg:rounded-bl-[9rem] lg:aspect-square overflow-hidden">
              <img
                src="/images/rise-young-leaders/2025/gallery/DSCF0340.jpg"
                alt="Mini Lecture Series"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="flex-1 flex flex-col items-center text-center p-4 lg:p-6 gap-3">
              <h3 class="text-xl font-bold">Mini Lecture Series</h3>
              <p class="text-sm">
                All applicants will gain exclusive access to a virtual pre-summit lecture led by renowned professors and climate experts — providing a
                solid foundation on the climate crisis before diving into the main forum.
              </p>
            </div>
          </div>

          <!-- Summit & International Forum (Right Side - Full Height) -->
          <div
            class="group lg:col-start-2 lg:row-span-2 lg:row-start-1 flex flex-col bg-gradient-to-br from-primary to-orange-300 text-white rounded-4xl lg:rounded-br-[12rem] overflow-hidden transition-all duration-300 shadow-subtle p-4"
          >
            <div class="w-full rounded-2xl aspect-video overflow-hidden">
              <img
                src="/images/rise-young-leaders/benefit.jpg"
                alt="Summit & International Forum"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="p-4 lg:p-8 flex-1 flex flex-col items-center text-center gap-4">
              <h3 class="text-2xl font-bold">Summit & International Forum</h3>
              <p class="text-sm">
                Engage in a transformative youth summit experience in Japan, where selected participants will present their climate ideas, attend
                expert-led talks and workshops, and collaborate in rich cultural exchange activities — all designed to foster global leadership in
                sustainability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How to Apply Section -->
    <section class="py-16 lg:pt-[22rem] lg:pb-32 bg-gradient-to-r from-[#F77044] to-[#F9B163] relative overflow-hidden z-10">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-12 lg:top-80 -left-24 lg:left-24 h-32 z-20 opacity-50">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_1.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
        <div class="absolute top-64 -right-20 h-32 z-20 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_2.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
        <div class="absolute bottom-12 left-0 lg:left-2/5 h-10 lg:h-16 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_3.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
        <div class="absolute top-28 left-3/5 h-32 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_4.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
        <div class="absolute bottom-0 left-0 h-80 z-20 opacity-50 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_bamboo_2.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
        <div class="absolute bottom-0 right-0 h-80 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_bamboo_1.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
      </div>
      <div class="container-wrapper relative z-30">
        <div class="max-w-4xl mx-auto text-center">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">How to Apply</h2>
            <div class="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>

          <div class="bg-white text-center rounded-3xl shadow-lg p-8 md:p-10 mb-10 border border-gray-100">
            <h3 class="text-2xl font-bold mb-6">Ready to take the next step?</h3>
            <div class="flex flex-col gap-6 max-w-3xl mx-auto">
              <p>
                Write your essay and complete the online application form. Be sure to highlight your climate vision, community initiatives, and
                leadership journey — these elements are essential in our selection process.
              </p>
              <p class="flex items-center justify-center gap-2 w-full font-semibold">
                <span class="text-orange-500 flex items-center">
                  <Icon name="heroicons:calendar-days-20-solid" class="size-6!" />
                </span>
                Application Deadline: September 30, 2025
              </p>
              <div class="flex flex-col sm:flex-row justify-center gap-4 py-4 w-full sm:w-auto">
                <Button as="a" href="https://s.id/Uzwuz" target="_blank" variant="outline" size="lg" class="w-full sm:w-auto justify-center">
                  <Icon name="lucide:download" class="w-4 h-4" />
                  Guidebook
                </Button>
                <Button
                  as="a"
                  href="https://s.id/RegistrationRYLS25"
                  target="_blank"
                  variant="default"
                  size="lg"
                  class="w-full sm:w-auto justify-center"
                >
                  Apply Now
                  <Icon name="lucide:arrow-right" class="w-4 h-4" />
                </Button>
              </div>
              <p class="italic">Seats are limited, early submissions are highly encouraged to increase your chances!</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scholarship Opportunity Section -->
    <section class="py-16 lg:py-24 bg-white">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Scholarship Opportunity</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Fully Funded -->
          <Card class="border border-gray-100 py-10 hover:-translate-y-1 transition-transform duration-300">
            <CardContent class="flex flex-col gap-6 h-full px-10">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center bg-gradient-to-tr from-primary to-orange-400 text-white rounded-xl w-12 h-12">
                  <Icon name="lucide:rocket" class="size-6!" />
                </span>
                <h3 class="text-2xl font-bold text-gray-900">Fully Funded ($15)</h3>
              </div>
              <div>
                <p class="text-sm text-gray-600 mt-2">
                  Ideal for driven students and young professionals eager to seize this experience in Climate Change Leadership.
                </p>
              </div>
              <ul class="space-y-3 text-gray-600 ml-2">
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Round Trip Air Tickets</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Exclusive Invitation Letter</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Visa Support</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Shared Accommodation</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Speaking Engagement & Lecture with Experts</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Convention Access</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Meals During Sessions</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Graduation Certification</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Convention Toolkit & Merchandise</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Transport During Summit (5 Days)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Cultural Experience in Japan</span>
                </li>
              </ul>
              <Button
                as="a"
                href="https://s.id/RegistrationRYLS25"
                target="_blank"
                variant="default"
                size="lg"
                class="mt-auto w-full sm:w-auto justify-center"
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>

          <!-- Partial Funded -->
          <Card class="border border-gray-100 py-10 hover:-translate-y-1 transition-transform duration-300">
            <CardContent class="flex flex-col gap-6 h-full px-10">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center bg-gradient-to-tr from-primary to-orange-400 text-white rounded-xl w-12 h-12">
                  <Icon name="lucide:sparkles" class="size-6!" />
                </span>
                <h3 class="text-2xl font-bold text-gray-900">Partial Funded</h3>
              </div>
              <div>
                <p class="text-sm text-gray-600 mt-2">
                  Automatically selected from the non-selected Fully Funded Candidates. You can choose to upgrade and join the full activities.
                </p>
              </div>
              <ul class="space-y-3 text-gray-600 ml-2 mb-4">
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Exclusive Invitation Letter</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Visa Support</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Speaking Engagement & Lecture with Experts</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Convention Access</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Graduation Certification</span>
                </li>
                <div class="py-2">
                  <p class="text-base text-gray-800 font-semibold">With upgrade ($600):</p>
                </div>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Shared Accommodation</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Meals During Sessions</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Convention Toolkit & Merchandise</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Transport During Summit 5 Days</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Cultural Experience in Japan</span>
                </li>
              </ul>
              <Button
                as="a"
                href="https://s.id/RegistrationRYLS25"
                target="_blank"
                variant="default"
                size="lg"
                class="mt-auto w-full sm:w-auto justify-center"
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>

          <!-- Self Funded -->
          <Card class="border border-gray-100 py-10 hover:-translate-y-1 transition-transform duration-300">
            <CardContent class="flex flex-col gap-6 h-full px-10">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center bg-gradient-to-tr from-primary to-orange-400 text-white rounded-xl w-12 h-12">
                  <Icon name="lucide:trophy" class="size-6!" />
                </span>
                <h3 class="text-2xl font-bold text-gray-900">Self Funded ($750)</h3>
              </div>
              <div>
                <p class="text-sm text-gray-600 mt-2">
                  The premium option for professionals who want the complete experience, including all sessions and activities in Japan.
                </p>
              </div>
              <ul class="space-y-3 text-gray-600 ml-2">
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Exclusive Invitation Letter</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Visa Support</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Shared Accommodation</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Speaking Engagement & Lecture with Experts</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Convention Access</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Meals During Sessions</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Graduation Certification</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Convention Toolkit & Merchandise</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Transport During Summit 5 Days</span>
                </li>
                <li class="flex items-start">
                  <Icon name="lucide:check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">Cultural Experience in Japan</span>
                </li>
              </ul>
              <Button
                as="a"
                href="https://s.id/RegistrationRYLS25"
                target="_blank"
                variant="default"
                size="lg"
                class="mt-auto w-full sm:w-auto justify-center"
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="section-py-lg bg-gray-50">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gallery</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p class="mt-6 text-gray-600">Glimpses from our previous events and activities. Click on any image to view it in full size.</p>
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in galleryImages"
            :key="index"
            class="aspect-[5/3] overflow-hidden rounded-lg cursor-pointer"
            @click="showLightbox(index)"
          >
            <NuxtImg
              :src="`/images/rise-young-leaders/2025/gallery/${image}`"
              :alt="`Gallery image ${index + 1}`"
              class="w-full h-full object-cover"
              loading="lazy"
              format="webp"
              quality="80"
              :modifiers="{ rotate: null }"
            />
          </div>
        </div>
      </div>

      <!-- Lightbox Component -->
      <ClientOnly>
        <VueEasyLightbox :visible="lightboxVisible" :imgs="lightboxImages" :index="lightboxIndex" @hide="lightboxVisible = false" />
      </ClientOnly>
    </section>

    <!-- Hear from Our Alumni Section -->
    <section class="section-py-lg bg-white">
      <div class="container-wrapper">
        <div class="section-title-wrapper-sm">
          <h2 class="heading-section">Hear from Our Alumni</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        <Carousel
          :opts="{
            align: 'start',
            loop: true,
          }"
          class="w-full"
          @init-api="setAlumniApi"
        >
          <CarouselContent class="-ml-2 md:-ml-4 py-4 cursor-pointer">
            <CarouselItem v-for="testimonial in alumniTestimonials" :key="testimonial.id" class="pl-2 md:pl-4 lg:basis-1/3">
              <Card class="p-4 sm:p-6 lg:p-8 text-center h-full border border-gray-100">
                <CardContent class="flex flex-col justify-between p-0 h-full">
                  <div class="space-y-3 lg:space-y-4">
                    <p class="text-sm lg:text-base text-gray-600 leading-relaxed">"{{ testimonial.text }}"</p>
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
                    <h4 class="text-sm lg:text-base font-semibold text-gray-900">
                      {{ testimonial.name }}
                    </h4>

                    <!-- Country -->
                    <p class="text-sm lg:text-base text-primary font-medium">
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

    <!-- FAQ Section -->
    <section class="section-py-lg bg-white relative">
      <div class="container-wrapper relative z-30">
        <div class="section-title-wrapper-sm">
          <h2 class="heading-section">Frequently Asked Questions</h2>
          <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        <Accordion type="single" collapsible class="space-y-4">
          <AccordionItem v-for="faq in faqs" :key="faq.id" :value="`item-${faq.id}`" class="rounded-lg px-4 bg-white border border-gray-100">
            <AccordionTrigger class="text-left text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer py-4">
              {{ faq.question }}
            </AccordionTrigger>
            <AccordionContent class="text-gray-600 text-base pb-4">
              {{ faq.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div class="absolute inset-0 opacity-5 z-10">
        <div class="absolute -bottom-4 left-4 h-96 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_4_dark.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="absolute -bottom-16 left-72 h-52 z-10">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_tree_dark.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="absolute bottom-0 right-16 h-96 z-20 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_3_dark.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="absolute -bottom-16 right-48 h-52 z-10 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_tree_dark.png"
            alt="Rise Young Leaders Summit 2025"
            class="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Fade transition for image changes */
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
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>
