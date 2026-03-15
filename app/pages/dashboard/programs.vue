<script setup lang="ts">
definePageMeta({ layout: 'dashboard-user' })

useSeoMeta({
  title: 'Programs - Rise Social',
  description: 'Kelola program yang diikuti dan temukan program-program baru Rise Social'
})

const programs = [
  {
    id: 1,
    title: 'Rise Young Leaders Summit',
    image: '/images/rise_young_leader.png',
    link: '/programs/rise-young-leaders-summit',
    description: 'Rise Young Leaders Summit is an annual program to improve youth capacity for young people aged 16-25 in various topics.'
  },
  {
    id: 2,
    title: 'Rise Sustainability Academy',
    image: '/images/rise_educator.png',
    link: '/academy',
    description:
      'Rise Sustainability Academy is an online learning program started from 1 up to 5 months live class with experts and mentor to student get comprehensive understanding in various sustainability topic.'
  },
  {
    id: 3,
    title: 'Rise & Thrive: Youth Empowerment Program',
    image: '/images/programs/rise-and-thrive/rise_and_thrive_1.jpeg',
    link: '/programs/rise-and-thrive',
    description:
      'Our program is designed to empower youth by equipping them with the skills, mindset, and opportunities to transform local resources into sustainable economic ventures.'
  }
]
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="font-semibold text-lg">Programs</h1>
    </template>

    <div class="space-y-4">
      <div
        v-for="program in programs"
        :key="program.id"
        class="flex flex-col sm:flex-row items-start gap-4 p-4 border border-default rounded-lg hover:border-gray-300 transition-colors"
      >
        <!-- Image -->
        <div class="w-full sm:w-24 md:w-36 aspect-video sm:aspect-square rounded-md overflow-hidden bg-gray-100 shrink-0">
          <NuxtImg
            :src="program.image"
            :alt="program.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold mb-2">{{ program.title }}</h3>
          <p class="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
            {{ program.description }}
          </p>
          <div class="flex justify-end">
            <UButton variant="outline" size="sm" color="neutral" :to="program.link">
              More Detail
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
