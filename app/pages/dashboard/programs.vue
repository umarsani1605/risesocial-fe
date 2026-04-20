<script setup lang="ts">
definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({
  title: 'Programs - Rise Social',
  description: 'Discover and explore Rise Social programs'
})

const programs = [
  {
    id: 1,
    title: 'Rise Young Leaders Summit',
    image: '/images/rise_young_leader.png',
    link: '/programs/rise-young-leaders-summit',
    description:
      'Rise Young Leaders Summit Japan 2026 is an international forum by Rise Social to empower young changemakers to gain insight into global challenges, connect sustainability with economic growth, and turn bold ideas into real, impactful projects. Brings together future leaders, innovators, and sustainability advocates from across the globe to collaborate, learn, and lead.'
  },
  {
    id: 2,
    title: 'Rise Sustainability Academy',
    image: '/images/rise_educator.png',
    link: '/academy',
    description:
      'Rise Sustainability Academy is an online learning program started from 1 up to 5 months live class with experts and mentor to student get comprehensive understanding in various sustainability topic. This program is for young professional, career switchers, sustainability and green workers to improve their knowledge and skills in this topic, equipped with Portfolio program with our hiring partners.'
  },
  {
    id: 3,
    title: 'Rise & Thrive: Youth Empowerment Program',
    image: '/images/programs/rise-and-thrive/rise_and_thrive_1.jpeg',
    link: '/programs/rise-and-thrive',
    description:
      'Our program is designed to empower youth by equipping them with the skills, mindset, and opportunities to transform local resources into sustainable economic ventures. By fostering innovation, entrepreneurship, and community leadership, the initiative not only boosts income and productivity among young people but also cultivates a generation of changemakers who create lasting impact through locally driven businesses.'
  }
]
</script>

<template>
  <UCard class="h-full border border-default/50" :ui="{ header: 'p-0!', body: 'p-6! pt-4!' }">
    <template #header>
      <div class="flex flex-col items-stretch">
        <div class="flex items-center justify-between gap-4 px-6 py-4 pb-0">
          <div class="flex items-center gap-4">
            <div
              class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <UIcon name="i-ph-rocket-launch-fill" class="size-4" />
            </div>
            <h2 class="font-bold text-xl text-slate-800">Programs</h2>
          </div>
        </div>
        <USeparator class="mt-4" :ui="{ border: 'border-slate-100' }" />
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <DashboardProgramCard
        v-for="program in programs"
        :key="program.id"
        :title="program.title"
        :image="program.image"
        :link="program.link"
        :description="program.description"
      />
    </div>
  </UCard>
</template>
