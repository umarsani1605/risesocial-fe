<script setup>
import { Star, BookOpen, Clock } from 'lucide-vue-next';

definePageMeta({
  layout: 'default',
});

// Meta tags
useHead({
  title: 'Learning Path - Rise Social',
  meta: [{ name: 'description', content: 'Explore comprehensive learning paths for your green career development' }],
});

// Use composable for course data
const { coursesData } = useCourses();
</script>

<template>
  <div class="bg-gray-50 mt-16">
    <!-- Learning Path Section -->
    <section class="section-py-lg">
      <div class="container-wrapper">
        <!-- Section Title -->
        <div class="section-title-wrapper">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Learning Path</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">Jelajahi jalur pembelajaran komprehensif untuk mengembangkan karir hijau Anda</p>
        </div>

        <!-- Courses Grid -->
        <div class="space-y-6">
          <NuxtLink v-for="course in coursesData" :key="course.id" :to="`/courses/${course.path_slug}`" class="block">
            <Card class="group hover:shadow-md! hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden">
              <CardContent>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative">
                  <!-- Course Info Section -->
                  <div class="lg:col-span-2 space-y-4">
                    <!-- Title -->
                    <h2 class="heading-card transition-all duration-200">
                      {{ course.title }}
                    </h2>

                    <!-- Course Meta Info -->
                    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div class="flex items-center gap-1">
                        <Star class="w-4 h-4" />
                        <span>{{ course.category }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <BookOpen class="w-4 h-4" />
                        <span>{{ course.moduleCount }} modul</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <Clock class="w-4 h-4" />
                        <span>{{ course.duration }}</span>
                      </div>
                    </div>

                    <!-- Course Description -->
                    <div class="space-y-2">
                      <p class="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {{ course.shortDescription }}
                      </p>
                    </div>
                  </div>

                  <!-- Modules Section -->
                  <div class="">
                    <div class="grid grid-cols-3 gap-3 translate-x-1/10 progressive-opacity">
                      <div v-for="module in course.modules.slice(0, 3)" :key="module.id" class="text-center">
                        <!-- Module Image -->
                        <div class="aspect-square rounded-lg overflow-hidden mb-2">
                          <img :src="module.image" :alt="module.title" class="w-full h-full object-cover" />
                        </div>
                        <!-- Module Label -->
                        <p class="text-xs font-medium text-gray-500 truncate">
                          {{ module.name }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.progressive-opacity {
  mask-image: linear-gradient(to right, hsl(0, 0%, 100%), hsla(0, 0%, 100%, 0.1));
}
</style>
