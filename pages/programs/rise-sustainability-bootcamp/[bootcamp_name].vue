<script setup>
import { Home, ChevronRight, Star, BookOpen, Clock, Award, User, ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-vue-next';

definePageMeta({
  layout: 'default',
});

// Use composable for bootcamp data
const { findBootcampBySlug, formatPrice } = useBootcamps();

// Get route parameters
const route = useRoute();
const bootcampSlug = route.params.bootcamp_name;

// Find bootcamp
const bootcamp = findBootcampBySlug(bootcampSlug);

// Redirect to 404 if not found
if (!bootcamp) {
  throw createError({ statusCode: 404, statusMessage: 'Bootcamp not found' });
}

// Meta tags
useHead({
  title: `${bootcamp.title} - Rise Sustainability Bootcamp - Rise Social`,
  meta: [{ name: 'description', content: bootcamp.description }],
});

// Reactive state for testimonial carousel
const currentAlumniSlide = ref(0);
const carouselApi = ref();

// Function to navigate to specific testimonial slide
const goToTestimonialSlide = (index) => {
  currentAlumniSlide.value = index;
  if (carouselApi.value) {
    carouselApi.value.scrollTo(index);
  }
};

// Functions for carousel navigation with dot updates
const scrollPrevTestimonial = () => {
  if (carouselApi.value) {
    carouselApi.value.scrollPrev();
  }
};

const scrollNextTestimonial = () => {
  if (carouselApi.value) {
    carouselApi.value.scrollNext();
  }
};

// Watch for API changes and set up listeners
watchEffect(() => {
  if (!carouselApi.value) return;

  carouselApi.value.on('select', () => {
    currentAlumniSlide.value = carouselApi.value.selectedScrollSnap();
  });
});
</script>

<template>
  <div class="bg-gray-50 mt-16">
    <!-- Hero Section with Bootcamp Info -->
    <section class="container-wrapper section-py-sm flex flex-col gap-8">
      <div class="bg-[#0E5C59] rounded-3xl p-8 md:p-12">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/programs" class="text-white/80 hover:text-white flex items-center gap-2">
                  <Home class="w-4 h-4" />
                  Programs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="text-white/60">
                <ChevronRight class="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/programs/rise-sustainability-bootcamp" class="text-white/80 hover:text-white"
                  >Rise Sustainability Bootcamp</BreadcrumbLink
                >
              </BreadcrumbItem>
              <BreadcrumbSeparator class="text-white/60">
                <ChevronRight class="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage class="text-white">{{ bootcamp.title }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <!-- Bootcamp Hero Content -->
        <div class="text-white">
          <h1 class="heading-section-hero mb-4">{{ bootcamp.title }}</h1>
          <p class="text-white/90 text-lg mb-6">{{ bootcamp.name }}</p>

          <!-- Meta info -->
          <div class="flex flex-wrap items-center gap-6 text-white/90 text-sm">
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4" />
              <span>Text meta</span>
            </div>
            <div class="flex items-center gap-2">
              <BookOpen class="w-4 h-4" />
              <span>Text meta</span>
            </div>
            <div class="flex items-center gap-2">
              <User class="w-4 h-4" />
              <span>Text meta</span>
            </div>
            <div class="flex items-center gap-2" v-if="bootcamp.certificate">
              <Award class="w-4 h-4" />
              <span>Text meta</span>
            </div>
            <div class="flex items-center gap-2">
              <Star class="w-4 h-4" />
              <span>Text meta</span>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <!-- Main Grid Content -->
        <div class="gap-8">
          <!-- Main Content -->
          <div class="space-y-8">
            <!-- Deskripsi -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">Tentang Program</h2>
                <p class="text-gray-700 leading-relaxed">{{ bootcamp.description }}</p>
              </CardContent>
            </Card>

            <!-- Silabus -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">Silabus Bootcamp</h2>
                <div class="space-y-4">
                  <Card
                    v-for="item in bootcamp.syllabus"
                    :key="item.id"
                    class="group hover:shadow-md! hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  >
                    <CardContent class="px-8">
                      <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
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
              <CardContent class="px-8 gap-4">
                <h2 class="heading-section mb-6">Profil Instruktur</h2>
                <div class="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start lg:items-center">
                  <Avatar class="size-28">
                    <AvatarImage :src="bootcamp.instructor.avatar" :alt="bootcamp.instructor.name" />
                    <AvatarFallback class="bg-primary text-white text-4xl">
                      {{ bootcamp.instructor.name.charAt(0) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-1">{{ bootcamp.instructor.name }}</h3>
                    <p class="text-gray-600 font-medium mb-3">{{ bootcamp.instructor.expertise }}</p>
                    <p class="text-gray-600 leading-relaxed">{{ bootcamp.instructor.description }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Testimoni -->
            <Card class="py-8">
              <CardContent class="px-8">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="heading-section">Testimoni Alumni</h2>
                  <div class="hidden lg:flex gap-2">
                    <button @click="scrollPrevTestimonial" class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button @click="scrollNextTestimonial" class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <ChevronRightIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Carousel
                  :opts="{
                    align: 'start',
                    loop: true,
                    slidesToScroll: 1,
                  }"
                  class="w-full"
                  @init-api="(api) => (carouselApi = api)"
                >
                  <CarouselContent>
                    <CarouselItem
                      v-for="testimonial in bootcamp.testimonials"
                      :key="testimonial.id"
                      class="md:basis-1/2 lg:basis-1/2 pl-4 cursor-pointer"
                    >
                      <Card class="bg-gray-50 h-full">
                        <CardContent class="p-6 h-full flex flex-col">
                          <div class="flex gap-4 mb-4">
                            <Avatar class="size-10">
                              <AvatarImage :src="testimonial.avatar" :alt="testimonial.name" />
                              <AvatarFallback class="bg-primary text-white text-2xl">
                                {{ testimonial.name.charAt(0) }}
                              </AvatarFallback>
                            </Avatar>
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
                <!-- Navigation Dots -->
                <div class="flex lg:hidden justify-center mt-6 space-x-3">
                  <button
                    v-for="(dot, index) in bootcamp.testimonials"
                    :key="index"
                    @click="goToTestimonialSlide(index)"
                    :class="[
                      'size-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer border-2',
                      currentAlumniSlide === index
                        ? 'bg-primary border-primary'
                        : 'bg-gray-300 border-gray-300 hover:bg-gray-400 hover:border-gray-400',
                    ]"
                  ></button>
                </div>
              </CardContent>
            </Card>

            <!-- FAQ -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible class="space-y-4">
                  <AccordionItem v-for="faq in bootcamp.faq" :key="faq.id" :value="`item-${faq.id}`" class="bg-gray-50 rounded-lg px-4">
                    <AccordionTrigger class="text-left font-medium text-gray-600 hover:text-gray-900 cursor-pointer">{{
                      faq.question
                    }}</AccordionTrigger>
                    <AccordionContent class="text-gray-600">{{ faq.answer }}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <!-- Sidebar -->
          <!-- <div class="lg:col-span-1 relative">
            <div :class="['w-full transition-all duration-300 sticky top-24 -mt-[19.5rem]']">
              <Card class="shadow-lg">
                <CardContent>
                  <img :src="bootcamp.image" :alt="bootcamp.title" class="w-full h-48 object-cover rounded-lg mb-4" />

                  <div class="space-y-3 mb-6">
                    <div class="flex items-center gap-2 text-gray-600">
                      <Clock class="w-4 h-4" />
                      <span class="text-sm">{{ bootcamp.duration }} program</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <BookOpen class="w-4 h-4" />
                      <span class="text-sm">{{ bootcamp.materialCount }} materi</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <User class="w-4 h-4" />
                      <span class="text-sm">{{ bootcamp.level }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600" v-if="bootcamp.certificate">
                      <Award class="w-4 h-4" />
                      <span class="text-sm">Sertifikat</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Star class="w-4 h-4" />
                      <span class="text-sm">{{ bootcamp.rating }} / 5 ({{ bootcamp.ratingCount }})</span>
                    </div>
                  </div>

                  <div class="">
                    <div class="text-2xl font-bold text-gray-900 mb-4">Rp{{ formatPrice(bootcamp.price) }}</div>
                    <Button class="w-full cursor-pointer"> Daftar Bootcamp </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div> -->
        </div>
      </div>
    </section>
  </div>
</template>
