<script setup lang="ts">
import type { AccordionItem, BreadcrumbItem, TabsItem } from '@nuxt/ui'
import type { Academy } from '@/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const academySlug = route.params.slug as string

if (!academySlug || academySlug === 'undefined') {
  throw createError({ statusCode: 404, statusMessage: 'Academy slug is required' })
}

const { api } = useApi()
const { data: academyData, error: academyError } = await useAsyncData(
  `academy:${academySlug}`,
  () => api<ApiResponse<Academy>>(`/academies/${academySlug}`)
)

if (academyError.value || !academyData.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Academy not found' })
}

const academy = computed(() => academyData.value!.data)

useSeoMeta({
  title: computed(() => `${academy.value.title} - Rise Sustainability Academy - Rise Social`),
  description: computed(() => academy.value.description)
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Home', icon: 'i-lucide-home', to: '/' },
  { label: 'Rise Sustainability Academy', to: '/academy' },
  { label: academy.value.title }
])

const { isLoggedIn } = useAuth()
const { checkEnrollment } = useAcademyPayment()
const isEnrolled = ref(false)
const hasPendingPayment = ref(false)

if (isLoggedIn.value) {
  try {
    const result = await checkEnrollment(academy.value.id)
    isEnrolled.value = result.enrolled
    hasPendingPayment.value = result.hasPendingPayment ?? false
  } catch {
    // silently fail — enrollment check is not critical
  }
}

const curriculumItems = computed<AccordionItem[]>(() =>
  (academy.value.topics ?? []).map((topic) => ({ value: `topic-${topic.id}` }))
)

const faqItems = computed<AccordionItem[]>(() =>
  (academy.value.faqs ?? []).map((faq) => ({
    label: faq.question,
    content: faq.answer,
    value: `faq-${faq.id}`
  }))
)

const pricingTabs = computed<TabsItem[]>(() =>
  (academy.value.pricing ?? []).map((tier, index) => ({
    label: tier.name,
    value: `${index}`
  }))
)

const testimonialItems = computed(() => academy.value.testimonials ?? [])
const testimonialCarousel = useTemplateRef('testimonialCarousel')

function prevTestimonial() {
  testimonialCarousel.value?.emblaApi?.value?.scrollPrev()
}

function nextTestimonial() {
  testimonialCarousel.value?.emblaApi?.value?.scrollNext()
}
</script>

<template>
  <div>
    <UPageSection
      :ui="{
        container: 'gap-8!'
      }"
    >
      <div class="bg-[#0E5C59] rounded-3xl p-8 md:p-12">
        <UBreadcrumb
          :items="breadcrumbItems"
          class="hidden md:block mb-6"
          :ui="{
            link: 'text-white/80 hover:text-white',
            linkLabel: 'text-white/80',
            linkLeadingIcon: 'text-white/80',
            separatorIcon: 'text-white/60'
          }"
        />
        <div class="w-full md:w-3/4 text-white">
          <h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4">
            {{ academy.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-clock" class="size-4" />
              <span>{{ academy.duration }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-book-open" class="size-4" />
              <span>{{ academy.format }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-tag" class="size-4" />
              <span>{{ academy.category }}</span>
            </div>
            <div v-if="academy.certificate" class="flex items-center gap-2">
              <UIcon name="i-lucide-award" class="size-4" />
              <span>Certificate</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-briefcase" class="size-4" />
              <span>Portfolio</span>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 md:pr-6">
          <!-- Left Column - Content -->
          <div class="lg:col-span-3 space-y-8">
            <!-- About Program -->
            <UCard v-if="academy.description" class="py-8">
              <div class="px-8">
                <h2 class="text-2xl sm:text-3xl font-bold mb-6">About Program</h2>
                <p class="text-gray-700 leading-relaxed">{{ academy.description }}</p>
              </div>
            </UCard>

            <!-- What You'll Get -->
            <UCard v-if="(academy.features?.length ?? 0) > 0" class="py-8">
              <div class="px-4 sm:px-8">
                <h2 class="text-2xl sm:text-3xl font-bold mb-6">What You'll Get</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div
                    v-for="feature in academy.features"
                    :key="feature.id"
                    class="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="shrink-0">
                      <UIcon
                        :name="
                          feature.icon?.startsWith('i-') ? feature.icon : `i-lucide-${feature.icon}`
                        "
                        class="size-12 md:size-6 text-primary"
                      />
                    </div>
                    <div>
                      <h3 class="font-semibold mb-1">{{ feature.title }}</h3>
                      <p class="text-muted text-sm">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Curriculum -->
            <UCard v-if="(academy.topics?.length ?? 0) > 0">
              <div class="p-4 sm:p-8">
                <h2 class="text-2xl sm:text-3xl font-bold mb-6">Curriculum</h2>
                <UAccordion
                  type="multiple"
                  :items="curriculumItems"
                  :ui="{
                    item: 'border-none',
                    trigger:
                      'px-6 py-4 hover:no-underline hover:bg-gray-50 rounded-lg data-[state=open]:rounded-b-none group'
                  }"
                >
                  <template #default="{ index }">
                    <div class="flex items-start gap-4 text-left w-full">
                      <div
                        class="hidden md:flex size-8 bg-primary text-white rounded-full items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                      >
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1">
                        <h3 class="text-lg font-bold mb-1">
                          {{ academy.topics[index]?.title }}
                        </h3>
                        <p class="text-muted text-sm">
                          {{ academy.topics[index]?.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </UAccordion>
              </div>
            </UCard>
            <UCard v-if="(academy.instructors?.length ?? 0) > 0" class="py-8">
              <div class="px-8">
                <h2 class="text-2xl sm:text-3xl font-bold mb-6">Instructors</h2>
                <div class="space-y-8">
                  <div
                    v-for="instructor in academy.instructors"
                    :key="instructor.id"
                    class="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start lg:items-center"
                  >
                    <UAvatar
                      :src="instructor.avatar_url ?? undefined"
                      :alt="instructor.name"
                      :text="instructor.name.charAt(0)"
                      :ui="{
                        root: 'size-20 lg:size-32 rounded-full',
                        fallback: 'bg-primary/15 text-primary text-2xl lg:text-4xl'
                      }"
                    />
                    <div class="flex-1">
                      <h3 class="text-xl font-bold mb-1">
                        {{ instructor.name }}
                      </h3>
                      <p class="text-muted font-medium mb-3">{{ instructor.job_title }}</p>
                      <p v-if="instructor.description" class="text-muted leading-relaxed">
                        {{ instructor.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
            <UCard v-if="testimonialItems.length > 0" class="py-8">
              <div class="px-8">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl sm:text-3xl font-bold">Alumni Testimonials</h2>
                  <div class="flex gap-2">
                    <UButton
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-chevron-left"
                      size="sm"
                      class="rounded-full"
                      @click="prevTestimonial"
                    />
                    <UButton
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-chevron-right"
                      size="sm"
                      class="rounded-full"
                      @click="nextTestimonial"
                    />
                  </div>
                </div>
                <UCarousel
                  ref="testimonialCarousel"
                  v-slot="{ item }"
                  :items="testimonialItems"
                  align="start"
                  :ui="{
                    item: 'basis-full md:basis-1/2',
                    container: 'items-stretch',
                    viewport: 'pb-4'
                  }"
                >
                  <div class="flex flex-col h-full bg-gray-50 p-6 rounded-xl">
                    <div class="flex gap-4 mb-4">
                      <UAvatar
                        :alt="item.name"
                        :text="item.name.charAt(0)"
                        :ui="{
                          root: 'size-8 lg:size-12 rounded-full bg-primary',
                          fallback: 'text-white'
                        }"
                      />
                      <div class="space-y-1">
                        <h4 class="font-semibold">{{ item.name }}</h4>
                        <div class="flex items-center gap-0.5">
                          <UIcon
                            v-for="i in 5"
                            :key="i"
                            name="i-heroicons-star-solid"
                            class="size-4 fill-yellow-400 text-yellow-400"
                          />
                        </div>
                      </div>
                    </div>
                    <p class="text-muted leading-relaxed flex-1">{{ item.comment }}</p>
                  </div>
                </UCarousel>
              </div>
            </UCard>
            <UCard v-if="faqItems.length > 0" class="py-8">
              <div class="px-8">
                <h2 class="text-2xl sm:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                <UAccordion
                  :items="faqItems"
                  :ui="{
                    root: 'space-y-4',
                    item: 'bg-gray-50 rounded-xl px-6 border-none',
                    trigger:
                      'text-base font-medium text-muted hover:text-gray-800 transition-colors cursor-pointer py-3',
                    body: 'text-base text-muted pb-4'
                  }"
                />
              </div>
            </UCard>
          </div>
          <div class="lg:col-span-1 relative">
            <div class="w-full transition-all duration-300 md:sticky md:top-24 md:-mt-66">
              <UCard
                :ui="{
                  body: 'p-4!'
                }"
              >
                <div class="space-y-0">
                  <h2 class="block md:hidden text-2xl font-bold mb-4 px-6 pt-6">Apply Programs</h2>
                  <div
                    class="w-full aspect-square overflow-hidden bg-gray-100 flex items-center justify-center rounded-lg"
                  >
                    <img
                      v-if="academy.image_url"
                      :src="academy.image_url"
                      :alt="academy.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="flex flex-col items-center justify-center text-gray-400">
                      <UIcon name="i-lucide-image" class="size-12 mb-2" />
                      <span class="text-sm">No Image</span>
                    </div>
                  </div>
                  <template v-if="(academy.pricing?.length ?? 0) > 1">
                    <UTabs
                      :items="pricingTabs"
                      default-value="0"
                      class="w-full"
                      variant="link"
                      :ui="{
                        trigger: 'flex-1'
                      }"
                    >
                      <template #content="{ item }">
                        <AcademyPricingContent
                          :tier="academy.pricing[Number(item.value)]!"
                          :academy="academy"
                          :academy-slug="academySlug"
                          :is-enrolled="isEnrolled"
                          :has-pending-payment="hasPendingPayment"
                        />
                      </template>
                    </UTabs>
                  </template>
                  <template v-else-if="(academy.pricing?.length ?? 0) === 1">
                    <div class="px-6 pb-6 pt-4">
                      <AcademyPricingContent
                        :tier="academy.pricing[0]!"
                        :academy="academy"
                        :academy-slug="academySlug"
                        :is-enrolled="isEnrolled"
                        :has-pending-payment="hasPendingPayment"
                      />
                    </div>
                  </template>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>
  </div>
</template>
