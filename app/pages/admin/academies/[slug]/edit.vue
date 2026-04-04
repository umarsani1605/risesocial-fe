<script setup lang="ts">
import type { Academy } from '@/types'
import { ACADEMY_TAB_ITEMS } from '@/constants/academy'
import { academyFormSchema } from '@/schemas/academy'
import type { DropdownMenuItem } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Edit Academy',
  middleware: 'admin'
})

const route = useRoute()
const toast = useToast()
const { api } = useApi()

const academySlug = route.params.slug as string
const { data: sourceData, error: sourceError } = await useAsyncData(
  `admin:academy:${academySlug}`,
  () => api<ApiResponse<Academy>>(`/admin/academies/${academySlug}`)
)

if (sourceError.value || !sourceData.value?.data) {
  throw createError({ statusCode: 404, message: 'Academy not found' })
}

const source = sourceData.value.data

const pageTitle = ref(source.title)

const headerMenuItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Archive Academy',
      icon: 'i-ph-box-arrow-down-bold'
    },
    {
      label: 'Delete Academy',
      icon: 'i-ph-trash-bold'
    }
  ]
]

const academyTabItems = ACADEMY_TAB_ITEMS.map((item) => ({
  ...item,
  icon:
    item.slot === 'information'
      ? 'i-ph-info-duotone'
      : item.slot === 'syllabus'
        ? 'i-ph-notebook-duotone'
        : 'i-ph-users-three-duotone'
}))

useSeoMeta({ title: `Edit Academy – ${source.title} | Rise Social` })

const sectionIds = [
  'section-basic',
  'section-pricing',
  'section-features',
  'section-instructors',
  'section-testimonials',
  'section-faqs'
]

const activeSection = ref('section-basic')
const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef')
let isScrollingProgrammatically = false

function scrollToSection(id: string) {
  isScrollingProgrammatically = true
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => {
    isScrollingProgrammatically = false
  }, 800)
}

onMounted(() => {
  const container = scrollContainerRef.value
  if (!container) return

  function updateActive() {
    if (isScrollingProgrammatically) return
    const triggerY = container!.getBoundingClientRect().top + container!.clientHeight * 0.3
    let current = sectionIds[0]
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= triggerY) current = id
    }
    activeSection.value = current
  }

  container.addEventListener('scroll', updateActive, { passive: true })
  onUnmounted(() => container.removeEventListener('scroll', updateActive))
})

const tocItems = computed(() =>
  [
    { id: 'section-basic', label: 'Basic Information' },
    { id: 'section-pricing', label: 'Pricing' },
    { id: 'section-features', label: 'Features' },
    { id: 'section-instructors', label: 'Instructors' },
    { id: 'section-testimonials', label: 'Testimonials' },
    { id: 'section-faqs', label: 'FAQs' }
  ].map((item) => ({
    label: item.label,
    active: activeSection.value === item.id,
    onSelect: () => scrollToSection(item.id)
  }))
)

const form = reactive({
  title: source.title,
  description: source.description ?? '',
  duration: source.duration ?? '',
  format: source.format ?? '',
  category: source.category ?? '',
  status: source.status as 'ACTIVE' | 'ARCHIVED',
  certificate: source.certificate ? 'Yes' : 'No',
  portfolio: source.portfolio ? 'Yes' : 'No',
  meta_pixel_id: source.meta_pixel_id ?? ''
})

const formRef = useTemplateRef('formRef')
const loading = ref(false)

async function onSave() {
  loading.value = true
  const imageFile = formRef.value?.imageFile
  if (imageFile) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type)) {
      toast.add({ title: 'Image must be JPG, PNG, or WebP', color: 'error' })
      loading.value = false
      return
    }
    if (imageFile.size > 2 * 1024 * 1024) {
      toast.add({ title: 'Image must be under 2MB', color: 'error' })
      loading.value = false
      return
    }
  }
  const fd = new FormData()
  fd.append('title', form.title)
  if (form.description) fd.append('description', form.description)
  fd.append('status', form.status)
  fd.append('certificate', String(form.certificate === 'Yes'))
  fd.append('portfolio', String(form.portfolio === 'Yes'))
  if (form.duration) fd.append('duration', form.duration)
  if (form.format) fd.append('format', form.format)
  if (form.category) fd.append('category', form.category)
  if (formRef.value?.imageFile) fd.append('image', formRef.value.imageFile)

  try {
    const res = await api<ApiResponse<{ slug: string }>>(`/admin/academies/${source.id}`, {
      method: 'PUT',
      body: fd
    })
    pageTitle.value = form.title

    toast.add({ title: 'Academy saved', color: 'success' })
    if (res.data.slug !== academySlug) {
      await navigateTo(`/admin/academies/${res.data.slug}/edit`, { replace: true })
    }
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4 px-1">
      <div class="flex items-center gap-4 min-w-0">
        <UButton
          icon="i-ph-arrow-left-bold"
          color="neutral"
          variant="ghost"
          to="/admin/academies"
        />
        <h2 class="text-xl font-semibold truncate">Edit {{ pageTitle }}</h2>
        <UBadge color="primary" variant="subtle" size="lg" label="Draft" />
      </div>
      <div class="flex items-center justify-center gap-4">
        <UButton
          label="View Public Page"
          icon="i-ph-arrow-square-out-bold"
          size="sm"
          color="neutral"
          variant="ghost"
        />
        <UButton label="Switch to Draft" color="neutral" variant="light" />
        <UButton
          type="submit"
          label="Update Academy"
          color="primary"
          :loading="loading"
          :disabled="loading"
        />
        <UDropdownMenu :items="headerMenuItems">
          <UButton icon="i-ph-dots-three-vertical-bold" size="lg" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </div>
    </div>
  </div>

  <UTabs
    :items="academyTabItems"
    variant="link"
    color="primary"
    :unmount-on-hide="false"
    :ui="{
      list: 'p-0!',
      trigger: 'px-3 sm:px-6 whitespace-nowrap'
    }"
  >
    <template #information>
      <div class="relative flex h-[calc(100dvh-14rem)] sm:h-[calc(100dvh-12rem)]">
        <div ref="scrollContainerRef" class="flex-1 overflow-y-auto py-6">
          <div class="pr-64 space-y-6">
            <div class="absolute w-56 top-0 right-4 shrink-0 overflow-y-auto">
              <div class="border border-default rounded-lg mt-6 p-4">
                <UNavigationMenu orientation="vertical" :items="tocItems" />
              </div>
            </div>
            <div id="section-basic" class="space-y-6 border border-default rounded-lg p-6">
              <UForm :schema="academyFormSchema" :state="form" @submit="onSave">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold">Basic Information</h3>
                  <UButton
                    type="submit"
                    label="Save"
                    color="primary"
                    :loading="loading"
                    :disabled="loading"
                  />
                </div>
                <AdminAcademyFormBasicInfo
                  ref="formRef"
                  v-model="form"
                  :initial-image-url="source.image_url"
                />
              </UForm>
            </div>

            <div id="section-pricing" class="space-y-6 border border-default rounded-lg p-6">
              <AdminAcademySectionPricing
                :academy-id="source.id"
                :initial-data="source.pricing ?? []"
              />
            </div>
            <div id="section-features" class="space-y-6 border border-default rounded-lg p-6">
              <AdminAcademySectionFeatures
                :academy-id="source.id"
                :initial-data="source.features ?? []"
              />
            </div>
            <div id="section-instructors" class="space-y-6 border border-default rounded-lg p-6">
              <AdminAcademySectionInstructors
                :academy-id="source.id"
                :initial-data="source.instructors ?? []"
              />
            </div>
            <div id="section-testimonials" class="space-y-6 border border-default rounded-lg p-6">
              <AdminAcademySectionTestimonials
                :academy-id="source.id"
                :initial-data="source.testimonials ?? []"
              />
            </div>
            <div id="section-faqs" class="space-y-6 border border-default rounded-lg p-6">
              <AdminAcademySectionFaqs :academy-id="source.id" :initial-data="source.faqs ?? []" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #syllabus>
      <div class="relative flex h-[calc(100dvh-14rem)] sm:h-[calc(100dvh-12rem)]">
        <div class="flex-1 overflow-y-auto py-6 pr-4">
          <AdminAcademySectionSyllabus
            :academy-id="source.id"
            :initial-data="source.themes ?? []"
          />
        </div>
      </div>
    </template>

    <template #cohorts>
      <div class="relative flex h-[calc(100dvh-14rem)] sm:h-[calc(100dvh-12rem)]">
        <div class="flex-1 overflow-y-auto py-6 pr-4">
          <AdminAcademySectionCohorts :academy-id="source.id" />
        </div>
      </div>
    </template>
  </UTabs>
</template>
