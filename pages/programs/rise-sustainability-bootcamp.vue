<script setup>
// Use default layout
definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Rise Sustainability Bootcamp - Rise Social',
  meta: [
    {
      name: 'description',
      content:
        "Rise Educator's Skills Accelerator is an online learning program with live classes and mentors to get comprehensive understanding in sustainability topics.",
    },
  ],
});

// Bootcamp programs data
const bootcampPrograms = [
  {
    id: 1,
    title: 'Bootcamp ESG',
    description:
      'Comprehensive ESG (Environmental, Social, and Governance) program covering sustainability reporting, compliance, and strategic implementation for organizations.',
    duration: '3 months',
    level: 'Intermediate',
    format: 'Online Live Classes',
    features: ['ESG Framework', 'Sustainability Reporting', 'Stakeholder Engagement', 'Risk Assessment'],
    image: '/images/bootcamp/esg-bootcamp.jpg',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: 'Bootcamp Carbon Footprint',
    description:
      'Learn carbon accounting, measurement, and reduction strategies. Master tools and methodologies for calculating and managing organizational carbon footprints.',
    duration: '2 months',
    level: 'Beginner',
    format: 'Online Live Classes',
    features: ['Carbon Accounting', 'LCA Methodology', 'Reduction Strategies', 'Verification Process'],
    image: '/images/bootcamp/carbon-bootcamp.jpg',
    color: 'from-green-500 to-green-700',
  },
  {
    id: 3,
    title: 'Bootcamp Sustainable Finance',
    description:
      'Master sustainable finance principles, green bonds, impact investing, and financial risk assessment related to climate and environmental factors.',
    duration: '4 months',
    level: 'Advanced',
    format: 'Online Live Classes',
    features: ['Green Finance', 'Impact Investing', 'Climate Risk', 'Sustainable Banking'],
    image: '/images/bootcamp/finance-bootcamp.jpg',
    color: 'from-emerald-500 to-teal-700',
  },
];
</script>

<template>
  <div class="bg-gray-50 mt-20">
    <!-- Hero Section -->
    <section class="bg-white section-py-lg py-8 lg:py-12">
      <div class="container-wrapper">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-6 lg:space-y-8 px-4 lg:px-0">
            <h1 class="text-2xl sm:text-3xl lg:text-6xl font-bold text-primary leading-tight">Rise Sustainability Bootcamp</h1>

            <div class="space-y-3 lg:space-y-4">
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                Rise Educator's Skills Accelerator is an online learning program started from 1 up to 5 months live class with experts and mentor to
                student get comprehensive understanding in various sustainability topic.
              </p>
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                This program is for young professional, career switchers, sustainability and green workers to improve their knowledge and skills in
                this topic, equipped with <span class="text-primary font-semibold">JOB ACCELERATOR program</span> with our hiring partners.
              </p>
            </div>

            <div class="pt-2 lg:pt-4">
              <Button size="lg" class="bg-primary text-white hover:bg-primary/80 px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-lg">
                Explore Bootcamps
              </Button>
            </div>
          </div>

          <!-- Right Image -->
          <div class="relative">
            <NuxtImg
              src="/images/bootcamp/sustainability-bootcamp-hero.jpg"
              alt="Rise Sustainability Bootcamp - Online learning with experts and mentors"
              class="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-xl"
              loading="lazy"
              format="webp"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Bootcamp Programs Section -->
    <section class="section-py-lg">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="text-center mb-8 lg:mb-16 px-4">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">Available Bootcamp Programs</h2>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our specialized bootcamp programs designed to accelerate your sustainability career
          </p>
        </div>

        <!-- Bootcamp Cards -->
        <div class="space-y-4 lg:space-y-6">
          <div v-for="bootcamp in bootcampPrograms" :key="bootcamp.id" class="group">
            <Card class="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-0">
              <CardContent class="p-0">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch">
                  <!-- Left Content Section -->
                  <div class="lg:col-span-2 p-6 sm:p-8 lg:p-12 space-y-4 lg:space-y-6">
                    <!-- Bootcamp Title -->
                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {{ bootcamp.title }}
                    </h3>

                    <!-- Bootcamp Meta Info -->
                    <div class="flex flex-wrap items-center gap-2 lg:gap-4 text-xs sm:text-sm text-gray-600">
                      <div class="flex items-center gap-1 lg:gap-2 bg-gray-100 px-2 lg:px-3 py-1 rounded-full">
                        <Icon name="heroicons:clock" class="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>{{ bootcamp.duration }}</span>
                      </div>
                      <div class="flex items-center gap-1 lg:gap-2 bg-gray-100 px-2 lg:px-3 py-1 rounded-full">
                        <Icon name="heroicons:academic-cap" class="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>{{ bootcamp.level }}</span>
                      </div>
                      <div class="flex items-center gap-1 lg:gap-2 bg-gray-100 px-2 lg:px-3 py-1 rounded-full">
                        <Icon name="heroicons:video-camera" class="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>{{ bootcamp.format }}</span>
                      </div>
                    </div>

                    <!-- Bootcamp Description -->
                    <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {{ bootcamp.description }}
                    </p>

                    <!-- Features -->
                    <div class="space-y-2 lg:space-y-3">
                      <h4 class="text-sm sm:text-base font-semibold text-gray-900">What you'll learn:</h4>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 lg:gap-2">
                        <div v-for="feature in bootcamp.features" :key="feature" class="flex items-center gap-2">
                          <Icon name="heroicons:check-circle" class="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0" />
                          <span class="text-xs sm:text-sm text-gray-600">{{ feature }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- CTA Button -->
                    <div class="pt-2 lg:pt-4">
                      <Button class="bg-primary text-white hover:bg-primary/80 text-sm lg:text-base px-4 lg:px-6 py-2"> Learn More </Button>
                    </div>
                  </div>

                  <!-- Right Visual Section -->
                  <div class="relative overflow-hidden">
                    <!-- Gradient Background -->
                    <div :class="['absolute inset-0 bg-gradient-to-br opacity-90', bootcamp.color]"></div>

                    <!-- Pattern Overlay -->
                    <div class="absolute inset-0 opacity-20">
                      <div class="w-full h-full bg-white/10 transform rotate-12 scale-150"></div>
                    </div>

                    <!-- Content -->
                    <div class="relative h-full min-h-[200px] sm:min-h-[250px] lg:min-h-[400px] flex items-center justify-center p-6 lg:p-8">
                      <div class="text-center text-white space-y-2 lg:space-y-4">
                        <Icon name="heroicons:academic-cap" class="w-12 h-12 lg:w-16 lg:h-16 mx-auto opacity-80" />
                        <h4 class="text-lg lg:text-xl font-bold">{{ bootcamp.level }} Level</h4>
                        <p class="text-xs lg:text-sm opacity-90">{{ bootcamp.duration }} Program</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Bottom CTA Section -->
        <div class="mt-8 lg:mt-16 text-center bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12">
          <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">Ready to Accelerate Your Sustainability Career?</h3>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 lg:mb-6 max-w-2xl mx-auto">
            Join our comprehensive bootcamp programs and get direct access to job opportunities with our hiring partners
          </p>
          <div class="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
            <Button size="lg" class="bg-primary text-white hover:bg-primary/80 text-sm lg:text-base px-6 lg:px-8 py-2 lg:py-3">
              View All Programs
            </Button>
            <Button
              size="lg"
              variant="outline"
              class="border-primary text-primary hover:bg-primary hover:text-white text-sm lg:text-base px-6 lg:px-8 py-2 lg:py-3"
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
