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

// Use bootcamp composable
const { bootcampsData, initializeBootcamps, isLoading } = useBootcamps();

onMounted(() => {
  initializeBootcamps();
});
</script>

<template>
  <div class="bg-gray-50 mt-20">
    <!-- Hero Section -->
    <section class="section-py-sm md:section-py-lg">
      <div class="container-wrapper">
        <div class="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
          <!-- Left Content -->
          <div class="flex-1 space-y-6 lg:space-y-8">
            <h1 class="text-2xl sm:text-3xl lg:text-6xl font-bold text-gray-800 leading-tight">Rise Sustainability Bootcamp</h1>

            <div class="space-y-3 lg:space-y-4">
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                Rise Educator's Skills Accelerator is an online learning program started from 1 up to 5 months live class with experts and mentor to
                student get comprehensive understanding in various sustainability topic.
              </p>
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                This program is for young professional, career switchers, sustainability and green workers to improve their knowledge and skills in
                this topic, equipped with <span class="font-semibold">JOB ACCELERATOR program</span> with our hiring partners.
              </p>
            </div>
          </div>

          <!-- Right Image -->
          <div class="relative flex-1 flex items-end justify-end">
            <NuxtImg
              src="/images/rise-young-leaders/gallery-4.png"
              alt="Rise Sustainability Bootcamp - Online learning with experts and mentors"
              class="w-full aspect-[3/2] object-cover rounded-2xl shadow-xl"
              format="webp"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Bootcamp Programs Section -->
    <section class="section-py-sm md:section-py-md">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="mb-8 lg:mb-12">
          <h2 class="heading-section text-gray-800">Available Bootcamp Programs</h2>
          <p class="text-sm sm:text-base lg:text-lg">
            Choose from our specialized bootcamp programs designed to accelerate your sustainability career
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4 lg:space-y-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="flex flex-col-reverse lg:flex-row gap-8">
                <div class="flex-4 space-y-4">
                  <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-20 bg-gray-200 rounded"></div>
                </div>
                <div class="flex-1">
                  <div class="h-48 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bootcamp Cards -->
        <div v-else class="space-y-4 lg:space-y-6">
          <div v-for="bootcamp in bootcampsData" :key="bootcamp.id" class="group">
            <Card
              class="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-0"
              @click="bootcamp.path_slug && $router.push(`/bootcamp/${bootcamp.path_slug}`)"
            >
              <CardContent>
                <div class="flex flex-col-reverse lg:flex-row gap-8 lg:gap-10 items-stretch">
                  <!-- Left Content Section -->
                  <div class="flex-4 space-y-4 lg:space-y-6">
                    <!-- Bootcamp Title -->
                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                      {{ bootcamp.title }}
                    </h3>

                    <!-- Bootcamp Meta Info -->
                    <div class="flex flex-wrap items-center gap-2 lg:gap-4 text-xs sm:text-sm text-gray-600">
                      <div class="flex items-center gap-1 lg:gap-2 bg-gray-100 px-2 lg:px-3 py-1 rounded-md">
                        <Icon name="heroicons:tag" class="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>{{ bootcamp.category }}</span>
                      </div>
                      <div class="flex items-center gap-1 lg:gap-2 bg-gray-100 px-2 lg:px-3 py-1 rounded-md">
                        <Icon name="heroicons:clock" class="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>{{ bootcamp.duration }}</span>
                      </div>
                      <div class="flex items-center gap-1 lg:gap-2 bg-gray-100 px-2 lg:px-3 py-1 rounded-md">
                        <Icon name="heroicons:video-camera" class="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>{{ bootcamp.format }}</span>
                      </div>
                    </div>

                    <!-- Bootcamp Description -->
                    <p class="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                      {{ bootcamp.description }}
                    </p>
                  </div>

                  <!-- Right Visual Section -->
                  <div class="flex-1 relative overflow-hidden items-end justify-end">
                    <!-- Content -->
                    <div class="w-full relative rounded-2xl lg:h-50 aspect-square flex items-center justify-center">
                      <NuxtImg :src="bootcamp.image_url" :alt="bootcamp.title" class="w-full h-full object-cover rounded-lg" format="webp" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
</style>
