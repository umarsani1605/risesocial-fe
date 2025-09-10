<script setup>
definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Rise & Thrive: Youth Empowerment Program',
  meta: [
    {
      name: 'description',
      content:
        "Rise Educator's Skills Accelerator is an online learning program started from 1 up to 5 months live class with experts and mentor to student get comprehensive understanding in various sustainability topic.",
    },
  ],
});

const featuresData = [
  {
    id: 1,
    title: '25% Increase in Youth Income',
    description: 'Strengthening financial independence and livelihood opportunities.',
    icon: 'lucide:trending-up',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-gray-100',
  },
  {
    id: 2,
    title: 'Improved Productivity of Young People',
    description: 'Enabling them to contribute actively to local economic and social development.',
    icon: 'lucide:zap',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-gray-100',
  },
  {
    id: 3,
    title: 'Creation of Sustainable Local Businesses',
    description: 'Built and managed by youth as “local heroes” who continue to drive change in their communities.',
    icon: 'lucide:store',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-gray-100',
  },
];

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
        <div class="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
          <!-- Left Content -->
          <div class="flex-1 space-y-6 lg:space-y-8 lg:px-0">
            <h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 leading-tight">Rise & Thrive: Youth Empowerment Program</h1>
            <div class="space-y-3 lg:space-y-4">
              <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our program in Malang, Indonesia is dedicated to empowering local youth by helping them transform their natural resources into
                meaningful economic opportunities. By equipping them with knowledge, mentorship, and practical tools, we encouraged young people to
                see the value of their surroundings not only as resources to be preserved, but also as assets that can drive long-term prosperity for
                their communities.
              </p>
            </div>

            <div class="pt-2 lg:pt-4">
              <Button size="lg" as="a" href="https://wa.me/6285864042289" target="_blank" class="bg-[#0a5c5b] hover:bg-[#095351]">
                Collaborate with Us!
              </Button>
            </div>
          </div>

          <div class="relative flex-1 flex items-end justify-end">
            <NuxtImg
              src="/images/programs/rise-and-thrive/rise_and_thrive_1.jpeg"
              alt="Rise & Thrive: Youth Empowerment Program"
              class="w-full aspect-[3/2] object-cover rounded-2xl"
              format="webp"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="section-py-md bg-gray-50">
      <div class="container-wrapper">
        <div class="grid grid-cols-1`` md:grid-cols-3 gap-4 lg:gap-8">
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
    <section class="bg-white section-py-lg py-8 lg:py-12">
      <div class="container-wrapper">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div class="relative flex-1 flex items-start justify-start">
            <NuxtImg
              src="/images/programs/rise-and-thrive/rise_and_thrive_2.jpg"
              alt="Rise & Thrive: Youth Empowerment Program"
              class="max-h-[300px] aspect-[3/2] object-cover rounded-2xl"
              format="webp"
            />
          </div>
          <div class="flex-1 space-y-6 lg:space-y-8">
            <div class="space-y-3 lg:space-y-4">
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                At the heart of the program are these young leaders, who have transformed local knowledge and resources into sustainable enterprises.
                These community-driven businesses are designed to last, ensuring long-term benefits for both the youth and the broader community.
                Their success inspires peers and sets an example of how grassroots leadership can shape sustainable growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-white section-py-lg py-8 lg:py-12">
      <div class="container-wrapper">
        <div class="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
          <div class="flex-1 space-y-6 lg:space-y-8">
            <div class="space-y-3 lg:space-y-4">
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                Ultimately, this initiative is not just about economic gain, but about fostering a resilient ecosystem where youth, natural resources,
                and community development are interconnected. It serves as a model for how local empowerment can drive sustainable change, with young
                people at the forefront of building a better future for Malang and beyond.
              </p>
            </div>
          </div>
          <div class="relative flex-1 flex items-end justify-end">
            <NuxtImg
              src="/images/programs/rise-and-thrive/rise_and_thrive_3.jpg"
              alt="Rise & Thrive: Youth Empowerment Program"
              class="max-h-[300px] aspect-[3/2] object-cover rounded-2xl"
              format="webp"
            />
          </div>
        </div>
      </div>
    </section>
    <section class="bg-white section-py-lg py-8 lg:py-12">
      <div class="container-wrapper">
        <div class="mb-8 text-center bg-gradient-to-r from-[#0a5c5b]/10 to-[#095351]/10 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12">
          <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">Ready to Accelerate Your Sustainability Career?</h3>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 lg:mb-6 max-w-2xl mx-auto">
            Join our comprehensive bootcamp programs and get direct access to job opportunities with our hiring partners
          </p>
          <div class="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
            <Button
              as="a"
              href="/programs"
              size="lg"
              class="bg-[#0a5c5b] text-white hover:bg-[#095351] text-sm lg:text-base px-6 lg:px-8 py-2 lg:py-3"
            >
              View All Programs
            </Button>
            <Button
              as="a"
              href="/contact"
              size="lg"
              variant="outline"
              class="border-[#0a5c5b] text-[#0a5c5b] hover:bg-[#0a5c5b] hover:text-white text-sm lg:text-base px-6 lg:px-8 py-2 lg:py-3"
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
