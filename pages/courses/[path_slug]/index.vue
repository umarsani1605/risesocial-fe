<script setup>
import { Home, ChevronRight, Star, BookOpen, Clock } from 'lucide-vue-next';

definePageMeta({
  layout: 'default',
});

// Use composable for course data
const { findCourseBySlug } = useCourses();

// Get route parameter
const route = useRoute();
const currentpath_slug = route.params.path_slug;

// Find course by path_slug
const course = findCourseBySlug(currentpath_slug);

// Redirect to 404 if course not found
if (!course) {
  throw createError({ statusCode: 404, statusMessage: 'Course not found' });
}

// Meta tags
useHead({
  title: `${course.title} - Learning Path - Rise Social`,
  meta: [{ name: 'description', content: course.description }],
});
</script>

<template>
  <div class="bg-gray-50 mt-16">
    <!-- Hero Section -->
    <section class="container-wrapper section-py-sm space-y-8">
      <div class="bg-[#0E5C59] rounded-3xl p-8 md:p-12">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses" class="text-white/80 hover:text-white flex items-center gap-2">
                  <Home class="w-4 h-4" />
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="text-white/60">
                <ChevronRight class="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage class="text-white">{{ course.title }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <!-- Course Title -->
        <h1 class="heading-section-hero mb-4 text-white">
          {{ course.title }}
        </h1>

        <!-- Course Meta Info -->
        <div class="flex flex-wrap items-center gap-4 text-white/90">
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
      </div>
      <Card class="py-8">
        <CardContent class="px-8">
          <h2 class="heading-section">Deskripsi</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ course.description }}
          </p>
        </CardContent>
      </Card>

      <!-- Modules Card -->
      <Card class="py-8">
        <CardContent class="px-8">
          <h2 class="heading-section mb-6">Daftar Modul</h2>

          <div class="space-y-6">
            <NuxtLink
              v-for="(module, index) in course.modules"
              :key="module.id"
              :to="`/courses/${course.path_slug}/${module.module_slug}`"
              class="block"
            >
              <Card class="group hover:shadow-md! hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <CardContent class="px-8">
                  <div class="flex items-start gap-6">
                    <!-- Module Image -->
                    <div class="flex-shrink-0">
                      <img :src="module.image" :alt="module.title" class="size-36 object-cover rounded-lg" />
                    </div>

                    <!-- Module Content -->
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-gray-500 mb-1">Modul {{ index + 1 }}</div>
                      <h3 class="heading-card-sm mb-3">{{ module.title }}</h3>

                      <!-- Module Meta Info -->
                      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div class="flex items-center gap-1">
                          <Clock class="w-4 h-4" />
                          <span>{{ module.duration }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <BookOpen class="w-4 h-4" />
                          <span>{{ module.materialCount }} materi</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{{ module.rating }}/5 ({{ module.ratingCount }})</span>
                        </div>
                      </div>

                      <!-- Module Description -->
                      <p class="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {{ module.description }}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Content Container -->
    <div class="container-wrapper-no-padding section-py-lg space-y-8">
      <!-- Description Card -->
    </div>
  </div>
</template>
