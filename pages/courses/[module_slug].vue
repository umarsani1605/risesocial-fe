<script setup>
import { Home, ChevronRight, Star, BookOpen, Clock, Award, User, ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-vue-next';

definePageMeta({
  layout: 'default',
});

// Use composable for course data
const { findCourseBySlug, formatPrice } = useCourses();

// Get route parameters
const route = useRoute();
const currentModuleSlug = route.params.module_slug;

// Find module directly
const course = findCourseBySlug(currentModuleSlug);

// Redirect to 404 if not found
if (!course) {
  throw createError({ statusCode: 404, statusMessage: 'Course not found' });
}

// Meta tags
useHead({
  title: `${course.title} - Rise Social`,
  meta: [{ name: 'description', content: course.description }],
});
</script>

<template>
  <div class="bg-gray-50 mt-16">
    <!-- Hero Section with Module Info -->
    <section class="container-wrapper section-py-sm flex flex-col gap-8">
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
                <BreadcrumbPage class="text-white">{{ course.name }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <!-- Course Hero Content -->
        <div class="w-3/4 text-white">
          <h1 class="heading-section-hero mb-4">{{ course.title }}</h1>
          <p class="text-white/90 text-lg mb-6">{{ course.name }}</p>

          <!-- Meta info -->
          <div class="flex flex-wrap items-center gap-6 text-white/90 text-sm">
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4" />
              <span>{{ course.duration }} belajar</span>
            </div>
            <div class="flex items-center gap-2">
              <BookOpen class="w-4 h-4" />
              <span>{{ course.materialCount }} materi</span>
            </div>
            <div class="flex items-center gap-2" v-if="course.certificate">
              <Award class="w-4 h-4" />
              <span>Sertifikat</span>
            </div>
            <div class="flex items-center gap-2">
              <Star class="w-4 h-4" />
              <span>{{ course.rating }}/5 ({{ course.ratingCount }})</span>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <!-- Main Grid Content -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 pr-6">
          <!-- Main Content -->
          <div class="lg:col-span-3 space-y-8">
            <!-- Deskripsi -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">Deskripsi</h2>
                <p class="text-gray-700 leading-relaxed">{{ course.description }}</p>
              </CardContent>
            </Card>

            <!-- Silabus -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">Silabus</h2>
                <div class="space-y-4">
                  <Card
                    v-for="item in course.syllabus"
                    :key="item.id"
                    class="group hover:shadow-md! hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  >
                    <CardContent class="px-8">
                      <div class="flex gap-8">
                        <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {{ item.id }}
                        </div>
                        <div class="flex-1">
                          <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
                          <p class="text-gray-600 text-sm">{{ item.description }}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <!-- Profil Pengajar -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">Profil Pengajar</h2>
                <div class="flex gap-12 items-center">
                  <img :src="course.instructor.avatar" :alt="course.instructor.name" class="size-32 rounded-full object-cover flex-shrink-0" />
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-1">{{ course.instructor.name }}</h3>
                    <p class="text-gray-600 font-medium mb-3">{{ course.instructor.expertise }}</p>
                    <p class="text-gray-600 leading-relaxed">{{ course.instructor.description }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Testimoni -->
            <Card class="py-8">
              <CardContent class="px-8">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="heading-section">Testimoni</h2>
                  <div class="flex gap-2">
                    <button @click="$refs.testimonialCarousel?.scrollPrev()" class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button @click="$refs.testimonialCarousel?.scrollNext()" class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <ChevronRightIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Carousel
                  ref="testimonialCarousel"
                  :opts="{
                    align: 'start',
                    loop: true,
                    slidesToScroll: 1,
                  }"
                  class="w-full"
                >
                  <CarouselContent>
                    <CarouselItem v-for="testimonial in course.testimonials" :key="testimonial.id" class="md:basis-1/2 lg:basis-1/2 pl-4">
                      <Card class="bg-gray-50 h-full">
                        <CardContent class="p-6 h-full flex flex-col">
                          <div class="flex gap-4 mb-4">
                            <img :src="testimonial.avatar" :alt="testimonial.name" class="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                              <div class="flex items-center gap-1">
                                <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              </div>
                            </div>
                          </div>
                          <p class="text-gray-600 leading-relaxed flex-1">{{ testimonial.comment }}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
              </CardContent>
            </Card>

            <!-- FAQ -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">FAQ</h2>
                <Accordion type="single" collapsible class="space-y-4">
                  <AccordionItem v-for="faq in course.faq" :key="faq.id" :value="`item-${faq.id}`" class="bg-gray-50 rounded-lg px-4">
                    <AccordionTrigger class="text-left font-medium text-gray-600 hover:text-gray-900 cursor-pointer">{{
                      faq.question
                    }}</AccordionTrigger>
                    <AccordionContent class="text-gray-600">{{ faq.answer }}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <!-- Sidebar Spacer (only when not sticky) -->
          <div class="lg:col-span-1 relative">
            <div :class="['w-full transition-all duration-300 sticky top-24 -mt-[19.5rem]']">
              <Card class="shadow-lg">
                <CardContent>
                  <img :src="course.image" :alt="course.title" class="w-full h-48 object-cover rounded-lg mb-4" />

                  <!-- Meta Info -->
                  <div class="space-y-3 mb-6">
                    <div class="flex items-center gap-2 text-gray-600">
                      <Clock class="w-4 h-4" />
                      <span class="text-sm">{{ course.duration }} belajar</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <BookOpen class="w-4 h-4" />
                      <span class="text-sm">{{ course.materialCount }} materi</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600" v-if="course.certificate">
                      <Award class="w-4 h-4" />
                      <span class="text-sm">Sertifikat</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Star class="w-4 h-4" />
                      <span class="text-sm">{{ course.rating }} / 5 ({{ course.ratingCount }})</span>
                    </div>
                  </div>

                  <!-- Price and Button -->
                  <div class="">
                    <div class="text-2xl font-bold text-gray-900 mb-4">Rp{{ formatPrice(course.price) }}</div>
                    <Button class="w-full cursor-pointer"> Beli Sekarang </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
