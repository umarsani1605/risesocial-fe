<script setup lang="ts">
import type { Academy } from '@/types'
import { ACADEMY_TAB_ITEMS } from '@/utils/academyOptions'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Edit Academy',
  navbarIcon: 'i-lucide-graduation-cap',
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

useSeoMeta({ title: `Edit Academy – ${source.title} | Rise Social` })

const form = reactive({
  title: source.title,
  description: source.description ?? '',
  duration: source.duration ?? '',
  format: source.format ?? '',
  category: source.category ?? '',
  status: source.status as 'ACTIVE' | 'ARCHIVED',
  certificate: source.certificate ? 'Yes' : 'No',
  portfolio: source.portfolio ? 'Yes' : 'No'
})

const formRef = useTemplateRef('formRef')
const loading = ref(false)

async function onSave() {
  loading.value = true
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
    const res = await api<any>(`/admin/academies/${source.id}`, { method: 'PUT', body: fd })
    pageTitle.value = form.title

    if (res.data.slug !== academySlug) {
      await navigateTo(`/admin/academies/${res.data.slug}/edit`, { replace: true })
    } else {
      toast.add({ title: 'Academy saved', color: 'success' })
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
  <UCard :ui="{ body: 'p-0' }">
    <div class="flex items-center justify-between gap-2 mb-4">
      <div class="flex items-center gap-2">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" to="/admin/academies" />
        <h2 class="text-xl font-semibold">Edit {{ pageTitle }}</h2>
      </div>
      <UButton
        label="View Public Page"
        trailing-icon="i-lucide-external-link"
        color="neutral"
        variant="ghost"
      />
    </div>

    <UTabs
      :items="ACADEMY_TAB_ITEMS"
      variant="link"
      color="primary"
      :unmount-on-hide="false"
      :ui="{ list: 'p-0! border-b border-default', trigger: 'px-6', content: '' }"
    >
      <template #information>
        <UScrollArea class="h-[calc(100vh-12rem)]" :ui="{ viewport: 'p-6' }">
          <div class="space-y-10">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Basic Information</h3>
                <UButton label="Save" color="primary" :loading="loading" :disabled="loading" @click="onSave" />
              </div>
              <AdminAcademyFormBasicInfo
                ref="formRef"
                v-model="form"
                :initial-image-url="source.image_url"
              />
            </div>

            <!-- Section components -->
            <AdminAcademySectionPricing :academy-id="source.id" :initial-data="source.pricing ?? []" />
            <AdminAcademySectionFeatures :academy-id="source.id" :initial-data="source.features ?? []" />
            <AdminAcademySectionInstructors :academy-id="source.id" :initial-data="source.instructors ?? []" />
            <AdminAcademySectionTestimonials :academy-id="source.id" :initial-data="source.testimonials ?? []" />
            <AdminAcademySectionFaqs :academy-id="source.id" :initial-data="source.faqs ?? []" />
          </div>
        </UScrollArea>
      </template>

      <template #syllabus>
        <UScrollArea class="h-[calc(100vh-12rem)]" :ui="{ viewport: 'p-6' }">
          <AdminAcademySectionSyllabus :academy-id="source.id" :initial-data="source.themes ?? []" />
        </UScrollArea>
      </template>

      <template #cohorts>
        <UScrollArea class="h-[calc(100vh-12rem)]" :ui="{ viewport: 'p-6' }">
          <AdminAcademySectionCohorts :academy-id="source.id" />
        </UScrollArea>
      </template>

      <template #students>
        <UScrollArea class="h-[calc(100vh-12rem)]" :ui="{ viewport: 'p-6' }">
          <p class="py-8 text-center text-sm text-muted">No students enrolled yet.</p>
        </UScrollArea>
      </template>

      <template #mentors>
        <UScrollArea class="h-[calc(100vh-12rem)]" :ui="{ viewport: 'p-6' }">
          <p class="py-8 text-center text-sm text-muted">No mentors assigned yet.</p>
        </UScrollArea>
      </template>
    </UTabs>
  </UCard>
</template>
