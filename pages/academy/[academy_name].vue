<script setup>
definePageMeta({
  layout: 'default',
});

// Use composable for bootcamp data
const { findBootcampBySlug, formatPrice, getBootcampFeatures, getBootcampTopics, getCheapestTier, getTotalSessionCount } = useBootcamps();

// Get route parameters
const route = useRoute();
const bootcampSlug = route.params.academy_name;

// Validate slug parameter
if (!bootcampSlug || bootcampSlug === 'undefined') {
  throw createError({ statusCode: 404, statusMessage: 'Academy slug is required' });
}

// Find bootcamp (await the async function)
const bootcamp = await findBootcampBySlug(bootcampSlug);

console.log(bootcamp);

// Redirect to 404 if not found
if (!bootcamp) {
  throw createError({ statusCode: 404, statusMessage: 'Academy not found' });
}

// Meta tags
useHead({
  title: `${bootcamp.title} - Rise Sustainability Academy - Rise Social`,
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

onMounted(() => {
  console.log(bootcamp);
});
</script>

<template>
  <div class="bg-gray-50 mt-20 md:mt-16">
    <!-- Hero Section with Bootcamp Info -->
    <section class="container-wrapper section-py-sm flex flex-col gap-8">
      <div class="bg-[#0E5C59] rounded-3xl p-8 md:p-12">
        <!-- Breadcrumb -->
        <nav class="hidden md:block mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" class="text-white/80 hover:text-white flex items-center gap-2">
                  <Icon name="lucide:home" class="w-4 h-4" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="text-white/60">
                <Icon name="lucide:chevron-right" class="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/academy" class="text-white/80 hover:text-white">Rise Sustainability Academy</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="text-white/60">
                <Icon name="lucide:chevron-right" class="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage class="text-white">{{ bootcamp.title }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <!-- Academy Hero Content -->
        <div class="w-full md:w-3/4 text-white">
          <h1 class="heading-section-hero mb-4">{{ bootcamp.title }}</h1>
          <p class="text-white/90 text-lg mb-6">{{ bootcamp.name }}</p>

          <!-- Meta info -->
          <div class="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm">
            <div class="flex items-center gap-2">
              <Icon name="lucide:clock" class="w-4 h-4" />
              <span>{{ bootcamp.duration }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:book-open" class="w-4 h-4" />
              <span>{{ bootcamp.format }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:tag" class="w-4 h-4" />
              <span>{{ bootcamp.category }}</span>
            </div>
            <div class="flex items-center gap-2" v-if="bootcamp.certificate">
              <Icon name="lucide:award" class="w-4 h-4" />
              <span>Sertifikat</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:briefcase" class="w-4 h-4" />
              <span>Job Accelerator</span>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <!-- Main Grid Content -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 md:pr-6">
          <!-- Main Content -->
          <div class="lg:col-span-3 space-y-8">
            <!-- Description -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">About Program</h2>
                <p class="text-gray-700 leading-relaxed">{{ bootcamp.description }}</p>
              </CardContent>
            </Card>

            <!-- Features -->
            <Card class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">What You'll Get</h2>
                <div class="grid md:grid-cols-2 gap-6">
                  <div
                    v-for="feature in getBootcampFeatures(bootcamp)"
                    :key="feature.id"
                    class="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="flex-shrink-0">
                      <Icon :name="feature.icon" class="size-12! md:size-6! text-primary" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-1">{{ feature.title }}</h3>
                      <p class="text-gray-600 text-sm">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Curriculum -->
            <Card v-if="getBootcampTopics(bootcamp).length > 0">
              <CardContent class="p-8">
                <h2 class="heading-section mb-6">Curriculum</h2>
                <Accordion type="multiple" class="space-y-4">
                  <AccordionItem
                    v-for="topic in getBootcampTopics(bootcamp)"
                    :key="topic.id"
                    :value="`topic-${topic.id}`"
                    class="border-none rounded-lg px-0"
                  >
                    <AccordionTrigger class="px-6 py-4 hover:no-underline hover:bg-gray-50 rounded-t-lg data-[state=open]:rounded-b-none">
                      <div class="flex flex-col md:flex-row items-start gap-4 text-left w-full">
                        <div
                          class="hidden md:flex w-8 h-8 bg-primary text-white rounded-full items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                        >
                          {{ topic.id }}
                        </div>
                        <div class="flex-1">
                          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ topic.title }}</h3>
                          <p class="text-gray-600 text-sm">{{ topic.description }}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent class="px-6 pb-4">
                      <!-- Topic Sessions -->
                      <div class="md:ml-12 space-y-3 pt-2">
                        <div
                          v-for="session in topic.sessions"
                          :key="session.id"
                          class="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div
                            class="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          >
                            {{ session.id }}
                          </div>
                          <div class="flex-1">
                            <h4 class="font-medium text-gray-900">{{ session.title }}</h4>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <!-- Instructors -->
            <Card class="py-8">
              <CardContent class="px-8 gap-4">
                <h2 class="heading-section mb-6">Instructors</h2>
                <div class="space-y-8">
                  <div
                    v-for="instructor in bootcamp.instructors"
                    :key="instructor.id"
                    class="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start lg:items-center"
                  >
                    <Avatar class="size-20 lg:size-32">
                      <AvatarImage v-if="instructor.avatar_url" :src="instructor.avatar_url" :alt="instructor.name" />
                      <AvatarFallback class="bg-primary/15 text-primary text-2xl lg:text-4xl">
                        {{ instructor.name.charAt(0) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-1">{{ instructor.name }}</h3>
                      <p class="text-gray-600 font-medium mb-3">{{ instructor.job_title }}</p>
                      <p v-if="instructor.description" class="text-gray-600 leading-relaxed">{{ instructor.description }}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Testimonials -->
            <Card class="py-8">
              <CardContent class="px-8">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="heading-section mb-0">Alumni Testimonials</h2>
                  <div class="hidden lg:flex gap-2">
                    <button
                      @click="scrollPrevTestimonial"
                      class="size-8 flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Icon name="lucide:chevron-left" class="size-4" />
                    </button>
                    <button @click="scrollNextTestimonial" class="size-8 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <Icon name="lucide:chevron-right" class="size-4" />
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
                              <AvatarFallback class="bg-primary/15 text-primary text-2xl">
                                {{ testimonial.name.charAt(0) }}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                              <div class="flex items-center gap-1">
                                <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
                  <AccordionItem v-for="faq in bootcamp.faqs" :key="faq.id" :value="`item-${faq.id}`" class="rounded-lg px-4">
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
          <div class="lg:col-span-1 relative">
            <div :class="['w-full transition-all duration-300 md:sticky md:top-24 md:-mt-[16.5rem]']">
              <Card class="p-4 py-8 md:py-4">
                <CardContent class="p-0 space-y-2!">
                  <h2 class="block md:hidden heading-section mb-6!">Apply Programs</h2>
                  <img :src="bootcamp.image || bootcamp.image_url" :alt="bootcamp.title" class="w-full aspect-square object-cover rounded-lg mb-0" />

                  <!-- Pricing Content -->
                  <div v-if="bootcamp.pricing && bootcamp.pricing.length === 1" class="p-4">
                    <!-- Single Pricing Layout -->
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center gap-2 text-gray-600">
                        <Icon name="lucide:calendar" class="w-4 h-4" />
                        <span class="text-sm">{{ bootcamp.pricing[0].name === '1 Tema' ? '1 month' : '3 months' }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <Icon name="lucide:video" class="w-4 h-4" />
                        <span class="text-sm">{{ bootcamp.pricing[0].name === '1 Tema' ? '5 sessions' : '15 sessions' }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600" v-if="bootcamp.certificate">
                        <Icon name="lucide:award" class="w-4 h-4" />
                        <span class="text-sm">Certificate</span>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <Icon name="lucide:briefcase" class="w-4 h-4" />
                        <span class="text-sm">Portfolio</span>
                      </div>
                    </div>

                    <!-- Price and Button -->
                    <div class="">
                      <!-- Original Price (Crossed Out) -->
                      <div class="text-sm text-gray-500 line-through mb-1">
                        {{ bootcamp.pricing[0].formatted_original_price || `${formatPrice(bootcamp.pricing[0].original_price)}` }}
                      </div>
                      <!-- Discounted Price -->
                      <div class="text-2xl font-bold text-gray-900 mb-4">
                        {{ bootcamp.pricing[0].formatted_discount_price || `${formatPrice(bootcamp.pricing[0].discount_price)}` }}
                      </div>
                      <Button
                        as="a"
                        :href="`https://api.whatsapp.com/send?phone=6285162571299&text=${encodeURIComponent(
                          `Halo Kak, saya tertarik mengikuti Rise Academy yang bertema ${bootcamp.title}`
                        )}`"
                        target="_blank"
                        class="w-full cursor-pointer"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </div>

                  <!-- Multiple Pricing Tabs -->
                  <Tabs v-else-if="bootcamp.pricing && bootcamp.pricing.length > 1" default-value="pricing-1" class="w-full">
                    <TabsList class="grid w-full grid-cols-2 bg-transparent h-auto p-0 border-none">
                      <TabsTrigger
                        v-for="tier in bootcamp.pricing"
                        :key="tier.id"
                        :value="`pricing-${tier.id}`"
                        class="relative cursor-pointer text-gray-400 bg-transparent hover:text-gray-500 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-none data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-1/10 data-[state=active]:after:w-4/5 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full data-[state=active]:font-semibold px-4 py-3 font-medium transition-colors"
                      >
                        {{ tier.name === '1 Tema' ? '1 Topic' : '3 Topics' }}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent v-for="tier in bootcamp.pricing" :key="tier.id" :value="`pricing-${tier.id}`" class="p-4 mt-0">
                      <!-- Meta Info -->
                      <div class="space-y-3 mb-6">
                        <div class="flex items-center gap-2 text-gray-600">
                          <Icon name="lucide:calendar" class="w-4 h-4" />
                          <span class="text-sm">{{ tier.name === '1 Tema' ? '1 month' : '3 months' }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Icon name="lucide:book-open" class="w-4 h-4" />
                          <span class="text-sm">{{ tier.name === '1 Tema' ? '1 topic' : '3 topics' }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Icon name="lucide:video" class="w-4 h-4" />
                          <span class="text-sm">{{ tier.name === '1 Tema' ? '5 sessions' : '15 sessions' }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600" v-if="bootcamp.certificate">
                          <Icon name="lucide:award" class="w-4 h-4" />
                          <span class="text-sm">Certificate</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Icon name="lucide:briefcase" class="w-4 h-4" />
                          <span class="text-sm">Job Accelerator</span>
                        </div>
                      </div>

                      <!-- Price and Button -->
                      <div class="">
                        <!-- Original Price (Crossed Out) -->
                        <div class="text-sm text-gray-500 line-through mb-1">
                          {{ tier.formatted_original_price || `${formatPrice(tier.original_price)}` }}
                        </div>
                        <!-- Discounted Price -->
                        <div class="text-2xl font-bold text-gray-900 mb-4">
                          {{ tier.formatted_discount_price || `${formatPrice(tier.discount_price)}` }}
                        </div>
                        <Button
                          as="a"
                          :href="`https://api.whatsapp.com/send?phone=6285162571299&text=${encodeURIComponent(
                            `Halo Kak, saya tertarik mengikuti Rise Academy yang bertema ${bootcamp.title}`
                          )}`"
                          target="_blank"
                          class="w-full cursor-pointer"
                        >
                          Enroll Now
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
