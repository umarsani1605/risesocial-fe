<script setup lang="ts">
import type { Academy } from '@/types'
import { ACADEMY_TAB_ITEMS } from '@/constants/academy'
import { academyFormSchema } from '@/schemas/academy'

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
const academyTabItems = ACADEMY_TAB_ITEMS.map((item) => ({
  ...item,
  icon:
    item.slot === 'information'
      ? 'i-ph-info'
      : item.slot === 'syllabus'
        ? 'i-ph-book-open-text'
        : 'i-ph-users-three'
}))

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
  <AdminCard :ui="{ body: 'p-0' }">
    <template #header>
      <div class="flex items-center justify-between gap-3 px-1">
        <div class="flex items-center gap-3 min-w-0">
          <UButton
            icon="i-ph-arrow-left-bold"
            color="neutral"
            variant="ghost"
            to="/admin/academies"
          />
          <h2 class="text-xl font-semibold truncate">Edit {{ pageTitle }}</h2>
        </div>
        <UButton
          label="View Public Page"
          trailing-icon="i-ph-arrow-square-out-bold"
          color="neutral"
          variant="ghost"
        />
      </div>
    </template>

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
        <UScrollArea
          class="h-[calc(100dvh-14rem)] sm:h-[calc(100dvh-12rem)]"
          :ui="{ viewport: 'p-6' }"
        >
          <div class="space-y-10">
            <div class="space-y-6">
              <UForm :schema="academyFormSchema" :state="form" @submit="onSave">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold">Basic Information</h3>
                  <UButton
                    type="submit"
                    label="Save"
                    color="primary"
                    leading-icon="i-ph-floppy-disk-bold"
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

            <!-- Section components -->
            <AdminAcademySectionPricing
              :academy-id="source.id"
              :initial-data="source.pricing ?? []"
            />
            <AdminAcademySectionFeatures
              :academy-id="source.id"
              :initial-data="source.features ?? []"
            />
            <AdminAcademySectionInstructors
              :academy-id="source.id"
              :initial-data="source.instructors ?? []"
            />
            <AdminAcademySectionTestimonials
              :academy-id="source.id"
              :initial-data="source.testimonials ?? []"
            />
            <AdminAcademySectionFaqs :academy-id="source.id" :initial-data="source.faqs ?? []" />
          </div>
        </UScrollArea>
      </template>

      <template #syllabus>
        <UScrollArea
          class="h-[calc(100dvh-14rem)] sm:h-[calc(100dvh-12rem)]"
          :ui="{ viewport: 'p-6' }"
        >
          <AdminAcademySectionSyllabus
            :academy-id="source.id"
            :initial-data="source.themes ?? []"
          />
        </UScrollArea>
      </template>

      <template #cohorts>
        <UScrollArea
          class="h-[calc(100dvh-14rem)] sm:h-[calc(100dvh-12rem)]"
          :ui="{ viewport: 'p-6' }"
        >
          <AdminAcademySectionCohorts :academy-id="source.id" />
        </UScrollArea>
      </template>
    </UTabs>
  </AdminCard>
</template>
