<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

definePageMeta({
  layout: 'default'
})

useHead({
  bodyAttrs: {
    class: 'ryls-blue-theme'
  }
})

useSeoMeta({
  title: 'Rise Young Leaders Summit - Rise Social',
  description: 'Join Rise Young Leaders Summit - an annual program to improve youth capacity for young people aged 19-35 in various topics'
})

let metaPixelProxy: ReturnType<typeof useScriptMetaPixel>['proxy'] | undefined
try {
  const { proxy } = useScriptMetaPixel()
  metaPixelProxy = proxy
}
catch {
  // @nuxtjs/scripts meta pixel not available
}

const scrollToSection = (id: string) => {
  if (import.meta.client) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const galleryImages = [
  'DSCF0345 1.jpg',
  'IMG_2075 1.jpg',
  'IMG_5041 1.jpg',
  'IMG_6068 (1) 1.jpg',
  'IMG_7587 1.jpg',
  'IMG_9580 1.jpg',
  'IMG_9592 1.jpg',
  'IMG_9620 1.jpg',
  'IMG_9871 1.jpg',
  'IMG_9920 1.jpg',
  'WhatsApp Image 2025-11-21 at 20.51.19 1.jpg',
  'e483b054-2f19-48f8-a24a-34a7734819b4 1.jpg'
]

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const currentLightboxSrc = computed(() => `/images/rise-young-leaders/2026/gallery/${galleryImages[lightboxIndex.value]}`)

function showLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function lightboxPrev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + galleryImages.length) % galleryImages.length
}

function lightboxNext() {
  lightboxIndex.value = (lightboxIndex.value + 1) % galleryImages.length
}

const alumniTestimonials: RylsTestimonial[] = [
  {
    id: 1,
    name: 'Arief M.',
    country: 'Indonesia',
    text: 'Friends, exclusive experiences, updated life goals, 100k+ steps, and 1000% fun! Thanks a lot to Rise Social for inviting me to this program! I am so happy to know the organizers, other participants, PPI Kyoto, and Prof. Fujiwara. I hope we can see each other next time!',
    rating: 5
  },
  {
    id: 2,
    name: 'Arkansyah',
    country: 'Indonesia',
    text: 'I gain a lot of experiences about how culture inherent the public space, especially in waste management, how japanese sorting ita waste from the sources, how industry and recycling facility help reduce trash and processing it wisely, and also lesson learn for indonesia about japanese waste culture adoption',
    rating: 5
  },
  {
    id: 3,
    name: 'Firdaus A.',
    country: 'Indonesia',
    text: 'Participating in the Rise Young Leaders Summit Japan 2025 was an eye-opening experience for me, especially in the field and industry of waste management. I gained valuable insights into how policies, cultural values, and community behavior shape effective waste management systems.',
    rating: 5
  },
  {
    id: 4,
    name: 'Vonley Smith',
    country: 'Barbados',
    text: 'To be here is a wonderful journey, thank you to all the organizers and the friends who came from all across the world.',
    rating: 5
  },
  {
    id: 5,
    name: 'Nataliia',
    country: 'Ukraine',
    text: 'I have a lot of new insight and perspective about climate change and environment alongside the new friends throughout the journey in Japan. I hope our friendship will continue. Best Wishes',
    rating: 5
  }
]

const faqItems = computed<AccordionItem[]>(() => [
  {
    label: 'What will the fully-funded winner get?',
    content: 'You will get round-trip airfare tickets, meals, transport in Japan and shared accommodation while in Japan.'
  },
  {
    label: 'Are we required to create an essay?',
    content: 'If you apply for fully funded and partial funded selection, you are required to create an essay and choose the topic for your essay.'
  },
  {
    label: 'Is this program only for students?',
    content: 'This program is open to everyone who meets the registration requirements from all economic, social and educational backgrounds.'
  },
  {
    label: 'What is the registration fee used for?',
    content: 'The registration fee is for the selection process and all participants will also receive a certificate and Humanitarian E-book.'
  },
  {
    label: 'What if I need a letter of permission for my work institutions?',
    content: 'Rise will provide all the required letters including invitation letters for visas if needed.'
  }
])

const speakers: RylsSpeaker[] = [
  {
    name: 'Taku Fujiwara',
    institution: 'Kyoto University',
    image: 'Taku_Fujiwara.webp'
  },
  {
    name: 'Dhimas Dwinandha',
    institution: 'Institute of Science Tokyo (Science Tokyo)',
    image: 'Dhimas_Dwinandha.webp'
  },
  {
    name: 'Miguel Esteban',
    institution: 'Waseda University',
    image: 'Miguel_Esteban.webp'
  },
  {
    name: 'Dr. Bageshree K.',
    institution: 'Founder-Director, REearth',
    image: 'Dr._Bageshree_K.webp'
  },
  {
    name: 'Genta Nakano',
    institution: 'Kyoto University',
    image: 'Genta_Nakano.webp'
  },
  {
    name: 'Aditya Wibawa Sakti',
    institution: 'Waseda University',
    image: 'Aditya_Wibawa_Sakti.webp'
  }
]

async function handleRegisterButton(packageType: string) {
  if (metaPixelProxy) {
    metaPixelProxy.fbq('track', 'ViewContent', {
      content_name: packageType,
      content_category: 'RYLS Registration'
    })
  }

  await navigateTo('https://risesocial.org/programs/rise-young-leaders-summit/registration', {
    open: {
      target: '_blank'
    }
  })
}

async function handleGuidebookButton() {
  if (metaPixelProxy) {
    metaPixelProxy.fbq('track', 'ViewContent', {
      content_name: 'Guidebook',
      content_category: 'RYLS Guidebook'
    })
  }

  await navigateTo('https://drive.google.com/drive/folders/1oWVXmlb5uHuJjh3WGe0tMpigNQAM519n?usp=drive_link', {
    open: {
      target: '_blank'
    }
  })
}

const pricingBenefits = {
  fullyFunded: [
    'Round Trip Air Tickets',
    'Exclusive Invitation Letter',
    'Visa Support',
    'Shared Accommodation',
    'Speaking Engagement & Lecture with Experts',
    'Convention Access',
    'Meals During Sessions',
    'Graduation Certification',
    'Convention Toolkit & Merchandise',
    'Transport During Summit (5 Days)',
    'Cultural Experience in Japan'
  ],
  partialFunded: [
    'Exclusive Invitation Letter',
    'Visa Support',
    'Speaking Engagement & Lecture with Experts',
    'Convention Access',
    'Graduation Certification'
  ],
  partialFundedUpgrade: [
    'Shared Accommodation',
    'Meals During Sessions',
    'Convention Toolkit & Merchandise',
    'Transport During Summit 5 Days',
    'Cultural Experience in Japan'
  ],
  selfFunded: [
    'Exclusive Invitation Letter',
    'Visa Support',
    'Shared Accommodation',
    'Speaking Engagement & Lecture with Experts',
    'Convention Access',
    'Meals During Sessions',
    'Graduation Certification',
    'Convention Toolkit & Merchandise',
    'Transport During Summit 5 Days',
    'Cultural Experience in Japan'
  ]
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-white py-24 lg:py-12 lg:pt-36 overflow-x-clip overflow-y-visible">
      <div class="container mx-auto px-4 relative">
        <div class="flex flex-col-reverse lg:flex-row gap-12 items-stretch">
          <div class="flex-1 pt-24 space-y-6 lg:space-y-8 text-center lg:text-left">
            <h2 class="text-xl text-gray-700 font-semibold">International Climate Change Leadership Forum</h2>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Rise Young Leaders Summit Japan 2026</h1>
            <div class="space-y-4 leading-relaxed">
              <p>
                <span class="font-bold">Rise Young Leaders Summit Japan 2026</span> is an international forum by
                <span class="font-bold">Rise Social</span> to empower young changemakers to gain insight into global challenges, connect
                sustainability with economic growth, and turn bold ideas into real, impactful projects. Brings together future leaders, innovators,
                and sustainability advocates from across the globe to collaborate, learn, and lead.
              </p>
            </div>
            <div>
              <UButton
                size="lg"
                class="bg-sky-400 text-white hover:bg-sky-400/90 px-8 py-3 text-base font-medium rounded-lg transition-colors cursor-pointer"
                @click="scrollToSection('how-to-apply')"
              >
                Register Now
              </UButton>
            </div>
          </div>
          <div class="h-48 sm:h-64 md:h-80 lg:h-auto lg:flex-1 relative">
            <div
              class="absolute flex items-center justify-center inset-0 translate-y-1/5 lg:translate-0 pointer-events-none select-none"
              aria-hidden="true"
              role="presentation"
            >
              <div
                class="pointer-events-none select-none bg-no-repeat bg-contain bg-center"
                style="width: 392px; height: 368px; background-image: url('/images/rise-young-leaders/2025/decoration-main.svg')"
              />
            </div>
            <div class="absolute flex items-center justify-center w-[200%] h-[275%] -translate-x-1/4 -translate-y-1/4 lg:w-[300%] lg:h-[300%] lg:-translate-x-1/3 lg:-translate-y-1/3 pointer-events-none select-none">
              <img
                :src="'/images/rise-young-leaders/2025/decoration-bg.svg'"
                width="945"
                height="945"
                alt="Rise Young Leaders Summit 2025"
                aria-hidden="true"
                role="presentation"
                class="h-full object-contain pointer-events-none select-none"
                fetchpriority="high"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-transparent py-16 lg:py-24">
      <div class="container mx-auto px-4 space-y-8 lg:space-y-16">
        <div class="text-center max-w-4xl mx-auto mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Be the Force Behind World's Green Revolution</h2>
          <p class="text-base lg:text-lg">
            If you're passionate about sustainability, driven to lead, and ready to turn your climate ideas into real projects, this is your moment to
            rise.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col items-center gap-6">
            <NuxtImg
              src="/images/rise-young-leaders/2025/gallery/IMG_6069.jpg"
              alt="Climate workshop"
              class="w-[280px] h-[208px] object-cover rounded-xl"
              format="webp"
              loading="lazy"
              densities="1x"
            />
            <span class="text-center">Engage in climate dialogues with experts from top universities like Waseda, Kyoto, & Tokyo University.</span>
          </div>
          <div class="flex flex-col items-center gap-6">
            <NuxtImg
              src="/images/rise-young-leaders/2025/gallery/IMG_2075.jpg"
              alt="Group discussion"
              class="w-[280px] h-[208px] object-cover rounded-xl"
              format="webp"
              loading="lazy"
              densities="1x"
            />
            <span class="text-center">Gain hands-on knowledge from field visits, disaster resilience workshops, and leadership labs.</span>
          </div>
          <div class="flex flex-col items-center gap-6">
            <NuxtImg
              src="/images/rise-young-leaders/gallery-8.png"
              alt="Field visit"
              class="w-[280px] h-[208px] object-cover rounded-xl"
              format="webp"
              loading="lazy"
              densities="1x"
            />
            <span class="text-center">Expand your impact by collaborating with global peers, exchanging cultures, and co-creating solutions that matter beyond borders.</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="bg-white relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="mb-8">
            <svg class="size-8 mx-auto text-sky-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <blockquote class="mb-8">
            <p class="text-base md:text-lg lg:text-xl font-medium text-gray-800 leading-relaxed">
              This is where <span class="text-sky-400 font-semibold">climate action meets leadership</span>, and where your
              <span class="relative">journey begins.</span>
            </p>
          </blockquote>
          <div class="w-24 h-1 bg-sky-400 mx-auto rounded-full" />
        </div>
      </div>
    </section>

    <!-- Eligibility Section -->
    <section class="py-16 lg:py-24 bg-gradient-to-t from-sky-100 to-white text-gray-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute -bottom-4 left-4 h-96 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_4_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute -bottom-16 left-72 h-52 z-10">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_tree_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute bottom-0 right-16 h-96 z-20 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_3_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute -bottom-16 right-48 h-52 z-10 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_tree_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute top-0 left-0 w-full h-full">
          <div class="w-full h-full bg-white/5 rounded-full blur-3xl transform rotate-45" />
        </div>
      </div>

      <div class="relative z-10 container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Are You Eligible?</h2>
          <p class="text-lg">We're looking for passionate individuals ready to drive real change in their communities and beyond.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto">
          <div class="md:col-span-6 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-sky-400 transition-all duration-300 shadow-subtle">
            <div class="size-14 bg-sky-400 rounded-xl flex items-center justify-center">
              <UIcon name="i-lucide-users" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-bold">Target Audience</h3>
            <p class="text-sm">Aspiring young leaders, volunteers, and professionals in the social and environmental sectors.</p>
          </div>

          <div class="md:col-span-6 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-sky-400 transition-all duration-300 shadow-subtle">
            <div class="size-14 bg-sky-400 rounded-xl flex items-center justify-center">
              <UIcon name="i-lucide-heart-handshake" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Advocacy Focus</h3>
            <p class="text-sm">Your passion lies in sustainability, youth empowerment, climate leadership, or community development.</p>
          </div>

          <div class="md:col-span-4 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-sky-400 transition-all duration-300 shadow-subtle">
            <div class="size-14 bg-sky-400 rounded-xl flex items-center justify-center">
              <UIcon name="i-lucide-graduation-cap" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Eligibility</h3>
            <p class="text-sm">Open to university students and early-career professionals.</p>
          </div>

          <div class="md:col-span-4 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-sky-400 transition-all duration-300 shadow-subtle">
            <div class="size-14 bg-sky-400 rounded-xl flex items-center justify-center">
              <UIcon name="i-lucide-calendar" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Age Requirement</h3>
            <p class="text-sm">Applicants must be 19 - 35 years old at the time of application.</p>
          </div>

          <div class="md:col-span-4 flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:border-sky-400 transition-all duration-300 shadow-subtle">
            <div class="size-14 bg-sky-400 rounded-xl flex items-center justify-center">
              <UIcon name="i-lucide-globe" class="size-6! text-white" />
            </div>
            <h3 class="text-lg font-semibold">Nationality</h3>
            <p class="text-sm">Open to all nationalities, across Southeast Asia and beyond.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Program Highlights Section -->
    <section class="py-16 lg:py-24 bg-white text-gray-800 relative z-20">
      <div class="relative z-10 container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Program Highlights</h2>
          <div class="w-24 h-1 bg-sky-400 mx-auto rounded-full" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4">
          <!-- Competition (Top Left) -->
          <div class="group flex flex-col lg:flex-row items-center justify-center bg-gradient-to-tr from-sky-400 to-sky-300 text-white rounded-xl lg:rounded-4xl overflow-hidden transition-all duration-300 shadow-subtle p-4">
            <div class="w-full lg:flex-1 h-72 md:h-96 lg:h-full rounded-lg lg:rounded-2xl lg:aspect-square overflow-hidden">
              <NuxtImg
                src="/images/rise-young-leaders/2025/gallery/IMG_8583.jpg"
                alt="Competition"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                format="webp"
                quality="80"
                loading="lazy"
                densities="1x"
              />
            </div>
            <div class="flex-1 flex flex-col items-center p-4 lg:p-6 gap-3">
              <h3 class="text-xl font-bold">Competition</h3>
              <p class="text-sm">
                Stand a chance to be one of <span class="font-bold">two fully funded delegates</span>, selected through a compelling climate, economic
                & sustainable growth themed essay. In addition, <span class="font-bold">25 outstanding applicants</span> will be granted
                <span class="font-bold">partial and self-funded slots</span>, offering them the opportunity to join this prestigious international
                program in Japan.
              </p>
            </div>
          </div>

          <!-- Mini Lecture Series (Bottom Left) -->
          <div class="group flex flex-col lg:flex-row items-center justify-center bg-gradient-to-tr from-sky-400 to-sky-300 text-white rounded-xl lg:rounded-4xl overflow-hidden transition-all duration-300 shadow-subtle p-4">
            <div class="w-full lg:flex-1 h-72 md:h-96 lg:h-full rounded-lg lg:rounded-2xl lg:aspect-square overflow-hidden">
              <NuxtImg
                src="/images/rise-young-leaders/2025/gallery/DSCF0340.jpg"
                alt="Mini Lecture Series"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                format="webp"
                quality="80"
                loading="lazy"
                densities="1x"
              />
            </div>
            <div class="flex-1 flex flex-col items-center p-4 lg:p-6 gap-3">
              <h3 class="text-xl font-bold">Mini Lecture Series</h3>
              <p class="text-sm">
                All applicants will gain exclusive access to a <span class="font-bold">virtual pre-summit lecture</span> led by renowned professors
                and climate experts, providing a solid foundation on the climate crisis and sustainability before diving into the main forum.
              </p>
            </div>
          </div>

          <!-- Summit & International Forum (Right Side - Full Height) -->
          <div class="group lg:col-start-2 lg:row-span-2 lg:row-start-1 flex flex-col bg-gradient-to-br from-sky-400 to-sky-300 text-white rounded-xl lg:rounded-4xl overflow-hidden transition-all duration-300 shadow-subtle p-4">
            <div class="w-full h-72 md:h-96 lg:h-full rounded-lg lg:rounded-2xl aspect-video overflow-hidden">
              <NuxtImg
                src="/images/rise-young-leaders/benefit.jpg"
                alt="Summit & International Forum"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                format="webp"
                quality="80"
                loading="lazy"
                densities="1x"
              />
            </div>
            <div class="p-4 lg:p-8 flex-1 flex flex-col items-center gap-4">
              <h3 class="text-2xl font-bold">Summit & International Forum</h3>
              <p class="text-sm">
                Engage in a <span class="font-bold">transformative youth summit experience</span> in Japan, where selected participants will present
                their climate ideas, attend expert-led talks and workshops, and collaborate in rich cultural exchange activities, all designed to
                foster global leadership in sustainability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Speakers Section -->
    <section class="py-16 lg:py-24 mb-16 bg-white text-gray-800 relative z-20">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Previous Speakers</h2>
          <div class="w-24 h-1 bg-sky-400 mx-auto rounded-full" />
        </div>

        <ClientOnly>
          <UCarousel
            :items="speakers"
            loop
            dots
            arrows
            :ui="{
              item: 'basis-full sm:basis-1/2 lg:basis-1/3',
              dots: 'mt-6',
              dot: 'size-2'
            }"
          >
            <template #default="{ item: speaker }">
              <div class="px-2 py-4">
                <div class="group max-w-72 relative h-[400px] w-full mx-auto">
                  <div class="absolute left-0 bottom-0 top-12 bg-sky-300 rounded-tl-[3rem] rounded-tr-none rounded-b-none transition-all duration-300 w-1/2" />

                  <div class="absolute inset-0 flex items-end justify-center overflow-hidden rounded-b-none">
                    <NuxtImg
                      :src="`/images/rise-young-leaders/2026/${speaker.image}`"
                      :alt="speaker.name"
                      class="w-full h-auto object-cover object-center transition-transform duration-500 group-hover:scale-105 z-10"
                      format="webp"
                      loading="lazy"
                    />
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-sky-400/90 via-sky-400/20 to-transparent z-20 opacity-90 h-2/3" />
                  </div>

                  <div class="absolute bottom-0 left-0 w-full h-1/2 flex flex-col items-center justify-end text-center p-4 z-30 text-white">
                    <h3 class="text-base font-bold mb-1 leading-tight">{{ speaker.name }}</h3>
                    <p class="text-xs font-medium text-white/80">{{ speaker.institution }}</p>
                  </div>
                </div>
              </div>
            </template>
          </UCarousel>
        </ClientOnly>
      </div>
    </section>

    <!-- How to Apply Section -->
    <section id="how-to-apply" class="py-16 lg:py-24 bg-gradient-to-r from-sky-500 to-sky-300 relative overflow-hidden z-10">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-12 lg:top-80 -left-24 lg:left-24 h-32 z-20 opacity-50">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_1.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain pointer-events-none select-none"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute top-64 -right-20 h-32 z-20 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_2.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain pointer-events-none select-none"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute bottom-12 left-0 lg:left-2/5 h-10 lg:h-16 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_3.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain pointer-events-none select-none"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute top-28 left-3/5 h-32 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_cloud_4.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain pointer-events-none select-none"
            densities="1x"
          />
        </div>
        <div class="absolute bottom-0 left-0 h-80 z-20 opacity-50 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_bamboo_2.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain pointer-events-none select-none"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute bottom-0 right-0 h-80 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_bamboo_1.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            format="webp"
            class="w-full h-full object-contain pointer-events-none select-none"
            loading="lazy"
            densities="1x"
          />
        </div>
      </div>
      <div class="container mx-auto px-4 relative z-30">
        <div class="max-w-4xl mx-auto text-center">
          <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">How to Apply</h2>
            <div class="w-24 h-1 bg-white mx-auto rounded-full" />
          </div>
          <div class="bg-white text-center rounded-3xl shadow-lg p-8 md:p-10 mb-10 border border-gray-100">
            <h3 class="text-2xl font-bold mb-6">Ready to take the next step?</h3>
            <div class="flex flex-col gap-6 max-w-3xl mx-auto">
              <p>
                Write your essay and complete the online application form. Be sure to highlight your climate vision, community initiatives, and
                leadership journey. These elements are essential in our selection process.
              </p>
              <p class="flex flex-col lg:flex-row items-center justify-center gap-2 w-full">
                <span class="flex items-center gap-2">
                  <UIcon name="i-heroicons-calendar-days-20-solid" class="size-6! text-sky-500" />
                  <span class="font-semibold">Application Deadline:</span>
                </span>
                <span>May 31, 2026</span>
              </p>
              <div class="flex flex-col sm:flex-row justify-center gap-4 py-2 w-full sm:w-auto">
                <UButton variant="outline" size="lg" class="w-full sm:w-auto justify-center" @click="handleGuidebookButton()">
                  <UIcon name="i-lucide-download" class="w-4 h-4" />
                  Guidebook
                </UButton>
                <UButton size="lg" class="w-full sm:w-auto justify-center" @click="handleRegisterButton('How to Apply')">
                  Register Now
                </UButton>
              </div>
              <p class="italic">Seats are limited, early submissions are highly encouraged to increase your chances!</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scholarship Opportunity Section -->
    <section id="scholarship" class="py-16 lg:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Scholarship Opportunity</h2>
          <div class="w-24 h-1 bg-sky-400 mx-auto rounded-full" />
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Fully Funded -->
          <UCard class="border border-gray-100 py-10 hover:-translate-y-2 transition-transform duration-300" variant="outline">
            <div class="flex flex-col gap-6 h-full px-10">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center bg-gradient-to-tr from-sky-400 to-sky-400 text-white rounded-xl w-12 h-12">
                  <UIcon name="i-lucide-sparkles" class="size-6!" />
                </span>
                <h3 class="text-2xl font-bold text-gray-900">2 Fully Funded ($10)</h3>
              </div>
              <div>
                <p class="text-sm text-gray-600 mt-2">
                  Ideal for driven students and young professionals eager to seize this transformative experience in Climate Change, Economic &amp;
                  Sustainable Growth Leadership.
                </p>
              </div>
              <ul class="space-y-3 text-gray-600 ml-2">
                <li v-for="benefit in pricingBenefits.fullyFunded" :key="benefit" class="flex items-start">
                  <UIcon name="i-lucide-check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">{{ benefit }}</span>
                </li>
              </ul>
              <UButton size="lg" class="mt-auto w-full sm:w-auto justify-center" @click="handleRegisterButton('Fully Funded')">
                Register Now
              </UButton>
            </div>
          </UCard>

          <!-- Partial Funded -->
          <UCard class="border border-gray-100 py-10 hover:-translate-y-1 transition-transform duration-300" variant="outline">
            <div class="flex flex-col gap-6 h-full px-10">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center bg-gradient-to-tr from-sky-400 to-sky-400 text-white rounded-xl w-12 h-12">
                  <UIcon name="i-lucide-rocket" class="size-6!" />
                </span>
                <h3 class="text-2xl font-bold text-gray-900">15 Partial Funded</h3>
              </div>
              <div>
                <p class="text-sm text-gray-600 mt-2">
                  Automatically selected from the non-selected Fully Funded candidates, this option lets you increase your participation in the Summit
                  and gives you the chance to upgrade and join the full activities.
                </p>
              </div>
              <ul class="space-y-3 text-gray-600 ml-2 mb-4">
                <li v-for="benefit in pricingBenefits.partialFunded" :key="benefit" class="flex items-start">
                  <UIcon name="i-lucide-check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">{{ benefit }}</span>
                </li>
                <div class="py-2">
                  <p class="text-base text-gray-800 font-semibold">With upgrade ($650):</p>
                </div>
                <li v-for="benefit in pricingBenefits.partialFundedUpgrade" :key="benefit" class="flex items-start">
                  <UIcon name="i-lucide-check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">{{ benefit }}</span>
                </li>
              </ul>
              <UButton size="lg" class="mt-auto w-full sm:w-auto justify-center" @click="handleRegisterButton('Partial Funded')">
                Register Now
              </UButton>
            </div>
          </UCard>

          <!-- Self Funded -->
          <UCard class="border border-gray-100 py-10 hover:-translate-y-1 transition-transform duration-300" variant="outline">
            <div class="flex flex-col gap-6 h-full px-10">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center bg-gradient-to-tr from-sky-400 to-sky-400 text-white rounded-xl w-12 h-12">
                  <UIcon name="i-lucide-trophy" class="size-6!" />
                </span>
                <h3 class="text-2xl font-bold text-gray-900">10 Self Funded ($800)</h3>
              </div>
              <div>
                <p class="text-sm text-gray-600 mt-2">
                  Ideal for experienced professionals and executives, this Global Leadership Experience equips you with cutting-edge climate change,
                  economic and sustainable growth leadership skills, and culminates in a prestigious RYLS certification.
                </p>
              </div>
              <ul class="space-y-3 text-gray-600 ml-2">
                <li v-for="benefit in pricingBenefits.selfFunded" :key="benefit" class="flex items-start">
                  <UIcon name="i-lucide-check-circle" class="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span class="ml-4">{{ benefit }}</span>
                </li>
              </ul>
              <UButton size="lg" class="mt-auto w-full sm:w-auto justify-center" @click="handleRegisterButton('Self Funded')">
                Register Now
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-12 lg:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gallery</h2>
          <div class="w-24 h-1 bg-sky-400 mx-auto rounded-full" />
          <p class="mt-6 text-gray-600">Glimpses from our previous events and activities.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in galleryImages"
            :key="index"
            class="aspect-[5/3] overflow-hidden rounded-lg cursor-pointer"
            @click="showLightbox(index)"
          >
            <NuxtImg
              :src="`/images/rise-young-leaders/2026/gallery/${image}`"
              :alt="`Gallery image ${index + 1}`"
              class="w-full h-full object-cover"
              format="webp"
              quality="80"
              loading="lazy"
              densities="1x"
            />
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <UModal
        v-model:open="lightboxOpen"
        :close="true"
        :ui="{
          content: 'max-w-4xl bg-transparent shadow-none border-none',
          overlay: 'bg-black/80'
        }"
      >
        <template #content>
          <div class="relative flex items-center justify-center">
            <button
              type="button"
              class="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 cursor-pointer"
              aria-label="Previous image"
              @click="lightboxPrev"
            >
              <UIcon name="i-lucide-chevron-left" class="size-6" />
            </button>

            <NuxtImg
              :src="currentLightboxSrc"
              alt="Rise Young Leaders Summit"
              class="max-h-[80vh] w-auto object-contain rounded-lg"
              format="webp"
            />

            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 cursor-pointer"
              aria-label="Next image"
              @click="lightboxNext"
            >
              <UIcon name="i-lucide-chevron-right" class="size-6" />
            </button>

            <button
              type="button"
              class="absolute top-2 right-2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 cursor-pointer"
              aria-label="Close lightbox"
              @click="lightboxOpen = false"
            >
              <UIcon name="i-lucide-x" class="size-5" />
            </button>
          </div>
        </template>
      </UModal>
    </section>

    <!-- Hear from Our Alumni Section -->
    <section class="py-12 lg:py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Hear from Our Alumni</h2>
          <div class="w-24 h-1 bg-sky-400 mx-auto rounded-full mt-4" />
        </div>

        <ClientOnly>
          <UCarousel
            :items="alumniTestimonials"
            loop
            dots
            arrows
            :ui="{
              item: 'basis-full sm:basis-1/2 lg:basis-1/3',
              dots: 'mt-4',
              dot: 'size-2'
            }"
          >
            <template #default="{ item: testimonial }">
              <div class="px-2 py-4">
                <UCard class="p-4 sm:p-6 lg:p-8 text-center h-full border border-gray-100" variant="outline">
                  <div class="flex flex-col justify-between h-full">
                    <div class="space-y-3 lg:space-y-4">
                      <p class="text-sm lg:text-base text-gray-600 leading-relaxed">"{{ testimonial.text }}"</p>
                    </div>
                    <div class="mt-4 lg:mt-6 space-y-2">
                      <div class="flex justify-center space-x-1">
                        <UIcon
                          v-for="i in 5"
                          :key="i"
                          name="i-heroicons-star-solid"
                          class="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400"
                        />
                      </div>
                      <h4 class="text-sm lg:text-base font-semibold text-gray-900">
                        {{ testimonial.name }}
                      </h4>
                      <p class="text-sm lg:text-base text-sky-400 font-medium">
                        {{ testimonial.country }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </div>
            </template>
          </UCarousel>
        </ClientOnly>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-12 lg:py-16 bg-white relative">
      <div class="container mx-auto px-4 relative z-30">
        <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div class="w-24 h-1 bg-sky-400 mx-auto rounded-full mt-4" />
        </div>
        <div class="max-w-3xl mx-auto">
          <UAccordion
            :items="faqItems"
            :ui="{
              item: 'rounded-lg px-4 bg-white border border-gray-100 mb-4',
              trigger: 'text-left text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer py-4',
              content: 'text-gray-600 text-base pb-4'
            }"
          />
        </div>
      </div>
      <div class="absolute inset-0 opacity-5 z-10">
        <div class="absolute -bottom-4 left-4 h-96 z-20">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_4_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            class="w-full h-full object-contain"
            format="webp"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute -bottom-16 left-72 h-52 z-10">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_tree_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            class="w-full h-full object-contain"
            format="webp"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute bottom-0 right-16 h-96 z-20 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_landmark_3_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            class="w-full h-full object-contain"
            format="webp"
            loading="lazy"
            densities="1x"
          />
        </div>
        <div class="absolute -bottom-16 right-48 h-52 z-10 hidden lg:block">
          <NuxtImg
            src="/images/rise-young-leaders/2025/japan_tree_dark.png"
            alt="Rise Young Leaders Summit 2025"
            role="presentation"
            aria-hidden="true"
            class="w-full h-full object-contain"
            format="webp"
            loading="lazy"
            densities="1x"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.shadow-subtle {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
</style>

<style>
body.ryls-blue-theme {
  --primary: var(--color-sky-400);
  --ring: var(--color-sky-400);
}
</style>
