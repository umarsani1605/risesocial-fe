<script setup lang="ts">

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Programs - Rise Social',
  description:
    'Join Rise exclusive programs and gain hands-on learning experience in various countries'
})

const programsData = [
  {
    id: 1,
    title: 'Rise Young Leaders Summit',
    image: '/images/rise_young_leader.png',
    link: '/programs/rise-young-leaders-summit',
    description1:
      'Rise Young Leaders Summit is an annual program to improve youth capacity for young people aged 16-25 in various topics.',
    description2:
      'The program encourages youth through competitions for fully and partially funded Leadership Trip Programs in 6 lot of countries.'
  },
  {
    id: 2,
    title: 'Rise Sustainability Academy',
    image: '/images/rise_educator.png',
    link: '/academy',
    description1:
      'Rise Sustainability Academy is an online learning program started from 1 up to 5 months live class with experts and mentor to student get comprehensive understanding in various sustainability topic.',
    description2:
      'This program is for young professional, career switchers, sustainability and green workers to improve their knowledge and skills in this topic, equipped with Portfolio program with our hiring partners.'
  },
  {
    id: 3,
    title: 'Rise & Thrive: Youth Empowerment Program',
    image: '/images/programs/rise-and-thrive/rise_and_thrive_1.jpeg',
    link: '/programs/rise-and-thrive',
    description1:
      'Our program is designed to empower youth by equipping them with the skills, mindset, and opportunities to transform local resources into sustainable economic ventures.',
    description2:
      'By fostering innovation, entrepreneurship, and community leadership, the initiative not only boosts income and productivity among young people but also cultivates a generation of changemakers who create lasting impact through locally driven businesses.'
  }
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
</script>

<template>
  <div>
    <UPageSection>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex justify-center mb-6">
          <div class="h-16 sm:h-24 flex items-center justify-center">
            <NuxtImg
              src="/images/rise_icon.png"
              alt="Rise Icon"
              class="w-full h-full object-contain"
              loading="eager"
              format="webp"
            />
          </div>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Rise Exclusive Programs</h1>

        <p class="text-lg sm:text-xl text-muted mb-8 max-w-2xl mx-auto">
          Gain hands-on learning experience in various countries while being exposed to a wide range
          of expertise in the field.
        </p>

        <UButton color="secondary" size="lg"> Sign Up Now! </UButton>
      </div>
    </UPageSection>
    <UPageSection class="border-t border-slate-100">
      <div
        class="flex flex-col lg:flex-row w-full items-center gap-12 lg:gap-24 text-center justify-center"
      >
        <div class="space-y-2">
          <div class="text-5xl lg:text-6xl font-bold text-primary">2,700+</div>
          <div class="text-base">Online program participants</div>
        </div>
        <div class="space-y-2">
          <div class="text-5xl lg:text-6xl font-bold text-primary">5+</div>
          <div class="text-base">Countries and still counting</div>
        </div>
        <div class="space-y-2">
          <div class="text-5xl lg:text-6xl font-bold text-primary">61+</div>
          <div class="text-base">Trainees from 3 countries</div>
        </div>
      </div>
    </UPageSection>
    <UPageSection
      title="Choose The Perfect Programs for You"
      class="bg-slate-100"
      :ui="{ title: 'text-2xl lg:text-3xl' }"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <UCard
          v-for="program in programsData"
          :key="program.id"
          class="hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
          :ui="{ root: 'flex flex-col h-full', body: 'flex flex-col flex-1' }"
        >
          <div class="rounded-lg overflow-hidden mb-4">
            <NuxtImg
              :src="program.image"
              :alt="program.title"
              class="w-full h-48 object-cover"
              loading="lazy"
              format="webp"
            />
          </div>
          <h3 class="text-lg font-bold mb-3">{{ program.title }}</h3>
          <p class="text-base text-muted leading-relaxed mb-3">{{ program.description1 }}</p>
          <p class="text-base text-muted leading-relaxed flex-1 mb-6">
            {{ program.description2 }}
          </p>
          <UButton :to="program.link" color="secondary" size="lg" block>
            Start Now
            <UIcon name="i-ph-arrow-right-bold" class="size-4" />
          </UButton>
        </UCard>
      </div>
    </UPageSection>
    <UPageSection
      title="What They Said About Us"
      class="bg-white"
      :ui="{ title: 'text-2xl lg:text-3xl' }"
    >
      <UCarousel
        :items="testimonialsItems"
        :ui="{
          item: 'basis-full md:basis-1/2 lg:basis-1/3',
          dot: 'size-2',
          viewport: 'pb-4',
          container: 'items-stretch'
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
    <UPageSection class="bg-slate-50" :ui="{ container: 'pb-0!', title: 'text-2xl lg:text-3xl' }">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center">
        <div class="w-64 sm:w-80 lg:w-[40rem]">
          <NuxtImg
            src="/images/rise_mobile_app.png"
            alt="Rise Mobile App"
            class="w-full object-contain"
            loading="lazy"
            format="webp"
          />
        </div>
        <div class="space-y-6">
          <h2 class="text-3xl lg:text-4xl font-bold">Seamless Access, Anytime, Anywhere</h2>
          <p class="text-lg text-muted leading-relaxed">
            Discover opportunities to make an impact. From green jobs to skill-building programs,
            our platform is your gateway to a sustainable tomorrow.
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Find Others Opportunities"
      class="bg-[#095351]"
      :ui="{ title: 'text-white text-2xl lg:text-3xl', container: 'gap-6!' }"
    >
      <div class="flex items-center justify-center">
        <UButton
          to="/opportunities"
          size="xl"
          color="neutral"
          class="bg-white text-[#095351] hover:bg-slate-200 font-bold"
        >
          Search Job
        </UButton>
      </div>
    </UPageSection>
  </div>
</template>
