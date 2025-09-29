<script setup>
import { useAPI } from '@/composables/useAPI';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const academySlug = route.params.academy_name;

if (!academySlug || academySlug === 'undefined') {
  throw createError({ statusCode: 404, statusMessage: 'Academy slug is required' });
}

const {
  data: academy,
  pending: isLoading,
  error: academyError,
} = await useAPI(`/academies/${academySlug}`, {
  key: `academy-${academySlug}`,
  transform: (response) => {
    return response.data || null;
  },
});

console.log('academy: ' + JSON.stringify(academy.value));

if (academyError.value || !academy.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Academy not found',
  });
}

useHead({
  title: computed(() => `${academy.value?.title || 'Academy'} - Rise Sustainability Academy - Rise Social`),
  meta: [
    {
      name: 'description',
      content: computed(() => academy.value?.description || ''),
    },
  ],
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const currentAlumniSlide = ref(0);
const carouselApi = ref();

const goToTestimonialSlide = (index) => {
  currentAlumniSlide.value = index;
  if (carouselApi.value) {
    carouselApi.value.scrollTo(index);
  }
};

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

watchEffect(() => {
  if (!carouselApi.value) return;

  carouselApi.value.on('select', () => {
    currentAlumniSlide.value = carouselApi.value.selectedScrollSnap();
  });
});

onMounted(() => {
  console.log(academy);
});
</script>

<template>
  <div class="bg-gray-50 mt-20 md:mt-16">
    <section class="container-wrapper section-py-sm flex flex-col gap-8">
      <div class="bg-[#0E5C59] rounded-3xl p-8 md:p-12">
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
                <BreadcrumbPage class="text-white">{{ academy.title }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
        <div class="w-full md:w-3/4 text-white">
          <h1 class="heading-section-hero mb-4">{{ academy.title }}</h1>
          <p class="text-white/90 text-lg mb-6">{{ academy.name }}</p>
          <div class="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm">
            <div class="flex items-center gap-2">
              <Icon name="lucide:clock" class="w-4 h-4" />
              <span>{{ academy.duration }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:book-open" class="w-4 h-4" />
              <span>{{ academy.format }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:tag" class="w-4 h-4" />
              <span>{{ academy.category }}</span>
            </div>
            <div class="flex items-center gap-2" v-if="academy.certificate">
              <Icon name="lucide:award" class="w-4 h-4" />
              <span>Certificate</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:briefcase" class="w-4 h-4" />
              <span>Portfolio</span>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 md:pr-6">
          <div class="lg:col-span-3 space-y-8">
            <Card v-if="academy.description" class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">About Program</h2>
                <p class="text-gray-700 leading-relaxed">{{ academy.description }}</p>
              </CardContent>
            </Card>
            <Card v-if="academy.features" class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">What You'll Get</h2>
                <div class="grid md:grid-cols-2 gap-6">
                  <div
                    v-for="feature in academy.features"
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
            <Card v-if="academy.topics.length > 0">
              <CardContent class="p-8">
                <h2 class="heading-section mb-6">Curriculum</h2>
                <Accordion type="multiple" class="space-y-4">
                  <AccordionItem
                    v-for="(topic, index) in academy.topics"
                    :key="topic.id"
                    :value="`topic-${topic.id}`"
                    class="border-none rounded-lg px-0"
                  >
                    <AccordionTrigger class="px-6 py-4 hover:no-underline hover:bg-gray-50 rounded-t-lg data-[state=open]:rounded-b-none">
                      <div class="flex flex-col md:flex-row items-start gap-4 text-left w-full">
                        <div
                          class="hidden md:flex w-8 h-8 bg-primary text-white rounded-full items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                        >
                          {{ index + 1 }}
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
                          v-for="(session, index) in topic.sessions"
                          :key="session.id"
                          class="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div
                            class="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          >
                            {{ index + 1 }}
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
            <Card v-if="academy.instructors" class="py-8">
              <CardContent class="px-8 gap-4">
                <h2 class="heading-section mb-6">Instructors</h2>
                <div class="space-y-8">
                  <div
                    v-for="instructor in academy.instructors"
                    :key="instructor.id"
                    class="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start lg:items-center"
                  >
                    <Avatar class="size-20 lg:size-32">
                      <AvatarImage
                        v-if="instructor.avatar_url"
                        :src="instructor.avatar_url"
                        :alt="instructor.name"
                        @error="$event.target.style.display = 'none'"
                      />
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
            <Card v-if="academy.testimonials" class="py-8">
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
                      v-for="testimonial in academy.testimonials"
                      :key="testimonial.id"
                      class="md:basis-1/2 lg:basis-1/2 pl-4 cursor-pointer"
                    >
                      <Card class="bg-gray-50 h-full">
                        <CardContent class="p-6 h-full flex flex-col">
                          <div class="flex gap-4 mb-4">
                            <Avatar class="size-10">
                              <AvatarImage :src="testimonial.avatar" :alt="testimonial.name" @error="$event.target.style.display = 'none'" />
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
                <div class="flex lg:hidden justify-center mt-6 space-x-3">
                  <button
                    v-for="(dot, index) in academy.testimonials"
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
            <Card v-if="academy.faqs" class="py-8">
              <CardContent class="px-8">
                <h2 class="heading-section mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible class="space-y-4">
                  <AccordionItem v-for="faq in academy.faqs" :key="faq.id" :value="`item-${faq.id}`" class="rounded-lg px-4">
                    <AccordionTrigger class="text-left font-medium text-gray-600 hover:text-gray-900 cursor-pointer">{{
                      faq.question
                    }}</AccordionTrigger>
                    <AccordionContent class="text-gray-600">{{ faq.answer }}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          <div class="lg:col-span-1 relative">
            <div :class="['w-full transition-all duration-300 md:sticky md:top-24 md:-mt-[16.5rem]']">
              <Card class="p-4 py-8 md:py-4">
                <CardContent class="p-0 space-y-2!">
                  <h2 class="block md:hidden heading-section mb-6!">Apply Programs</h2>
                  <div class="w-full aspect-square rounded-lg mb-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      v-if="academy.image || academy.image_url"
                      :src="academy.image || academy.image_url"
                      :alt="academy.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="flex flex-col items-center justify-center text-gray-400">
                      <Icon name="lucide:image" class="w-12 h-12 mb-2" />
                      <span class="text-sm">No Image</span>
                    </div>
                  </div>

                  <template v-if="Array.isArray(academy.pricing) && academy.pricing.length > 1">
                    <Tabs :default-value="`pricing-${academy.pricing[0]?.id}`" class="w-full">
                      <TabsList class="grid w-full grid-cols-2 bg-transparent h-auto p-0 border-none">
                        <TabsTrigger
                          v-for="tier in academy.pricing"
                          :key="tier.id"
                          :value="`pricing-${tier.id}`"
                          class="relative cursor-pointer text-gray-400 bg-transparent hover:text-gray-500 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-none data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-1/10 data-[state=active]:after:w-4/5 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full data-[state=active]:font-semibold px-4 py-3 font-medium transition-colors"
                        >
                          {{ tier.name }}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent v-for="(tier, index) in academy.pricing" :key="tier.id" :value="`pricing-${tier.id}`" class="p-4 mt-0">
                        <div class="space-y-3 mb-6">
                          <div class="flex items-center gap-2 text-gray-600">
                            <Icon name="lucide:calendar" class="w-4 h-4" />
                            <span v-if="index == 0" class="text-sm">1 month</span>
                            <span v-if="index == 1" class="text-sm">3 months</span>
                            <span v-if="index == 2" class="text-sm">6 months</span>
                          </div>
                          <div class="flex items-center gap-2 text-gray-600">
                            <Icon name="lucide:book-open" class="w-4 h-4" />
                            <span v-if="index == 0" class="text-sm">1 topic</span>
                            <span v-if="index == 1" class="text-sm">3 topics</span>
                            <span v-if="index == 2" class="text-sm">6 topics</span>
                          </div>
                          <div class="flex items-center gap-2 text-gray-600">
                            <Icon name="lucide:video" class="w-4 h-4" />
                            <span v-if="index == 0" class="text-sm">4 sessions</span>
                            <span v-if="index == 1" class="text-sm">12 sessions</span>
                            <span v-if="index == 2" class="text-sm">24 sessions</span>
                          </div>
                          <div class="flex items-center gap-2 text-gray-600" v-if="academy.certificate">
                            <Icon name="lucide:award" class="w-4 h-4" />
                            <span class="text-sm">Certificate</span>
                          </div>
                          <div class="flex items-center gap-2 text-gray-600" v-if="academy.certificate">
                            <Icon name="lucide:briefcase" class="w-4 h-4" />
                            <span class="text-sm">Portfolio</span>
                          </div>
                        </div>
                        <div>
                          <div class="text-sm text-gray-500 line-through mb-1">
                            {{ tier.formatted_original_price || `${formatPrice(tier.original_price)}` }}
                          </div>
                          <div class="text-2xl font-bold text-gray-900 mb-4">
                            {{ tier.formatted_discount_price || `${formatPrice(tier.discount_price)}` }}
                          </div>
                          <Button class="w-full cursor-pointer"> Enroll Now </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </template>
                  <template v-else-if="Array.isArray(academy.pricing) && academy.pricing.length === 1">
                    <div class="p-4 mt-0">
                      <div class="space-y-3 mb-6">
                        <div class="flex items-center gap-2 text-gray-600">
                          <Icon name="lucide:calendar" class="w-4 h-4" />
                          <span class="text-sm">1 month</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Icon name="lucide:book-open" class="w-4 h-4" />
                          <span class="text-sm">1 topic</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                          <Icon name="lucide:video" class="w-4 h-4" />
                          <span class="text-sm">4 sessions</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600" v-if="academy.certificate">
                          <Icon name="lucide:award" class="w-4 h-4" />
                          <span class="text-sm">Certificate</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600" v-if="academy.certificate">
                          <Icon name="lucide:briefcase" class="w-4 h-4" />
                          <span class="text-sm">Portfolio</span>
                        </div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500 line-through mb-1">
                          {{ academy.pricing[0].formatted_original_price || `${formatPrice(academy.pricing[0].original_price)}` }}
                        </div>
                        <div class="text-2xl font-bold text-gray-900 mb-4">
                          {{ academy.pricing[0].formatted_discount_price || `${formatPrice(academy.pricing[0].discount_price)}` }}
                        </div>
                        <Button class="w-full cursor-pointer"> Enroll Now </Button>
                      </div>
                    </div>
                  </template>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
