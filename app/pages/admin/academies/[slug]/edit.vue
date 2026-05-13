<script setup lang="ts">
import type { Academy, AcademyStatus } from '@/types'
import { ACADEMY_TAB_ITEMS } from '@/constants/academy'
import { academyFormSchema } from '@/schemas/academy'
import type { DropdownMenuItem } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Edit Academy',
  middleware: ['auth', 'admin']
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
const currentStatus = ref<AcademyStatus>(source.status)

const isArchiveConfirmOpen = ref(false)
const isArchiving = ref(false)
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const { isValidating, validationErrors, isValidationModalOpen, validateForPublish } = useAcademyPublishValidation(academySlug)

const headerMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Archive Academy',
      icon: 'i-ph-box-arrow-down-bold',
      disabled: currentStatus.value === 'ARCHIVED',
      onSelect: () => {
        isArchiveConfirmOpen.value = true
      }
    },
    {
      label: 'Delete Academy',
      icon: 'i-ph-trash-bold',
      color: 'error' as const,
      onSelect: () => {
        isDeleteOpen.value = true
      }
    }
  ]
])

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

const saveButtonLabel = computed(() => {
  if (currentStatus.value === 'DRAFT') return 'Save Academy'
  if (currentStatus.value === 'ACTIVE') return 'Update Academy'
  return 'Open Archived'
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
  certificate: source.certificate ? 'Yes' : 'No',
  portfolio: source.portfolio ? 'Yes' : 'No',
  pixel_id: source.pixel_id ?? ''
})

const formRef = useTemplateRef('formRef')
const isHeaderSaving = ref(false)
const isSectionSaving = ref(false)

async function onSave(
  targetStatus: AcademyStatus,
  loadingRef: Ref<boolean>,
  successMessage: string
) {
  loadingRef.value = true
  const imageFile = formRef.value?.imageFile
  if (imageFile) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type)) {
      toast.add({ title: 'Image must be JPG, PNG, or WebP', color: 'error' })
      loadingRef.value = false
      return
    }
    if (imageFile.size > 2 * 1024 * 1024) {
      toast.add({ title: 'Image must be under 2MB', color: 'error' })
      loadingRef.value = false
      return
    }
  }
  const fd = new FormData()
  fd.append('title', form.title)
  if (form.description) fd.append('description', form.description)
  fd.append('status', targetStatus)
  fd.append('certificate', String(form.certificate === 'Yes'))
  fd.append('portfolio', String(form.portfolio === 'Yes'))
  if (form.duration) fd.append('duration', form.duration)
  if (form.format) fd.append('format', form.format)
  if (form.category) fd.append('category', form.category)
  if (formRef.value?.imageFile) fd.append('image', formRef.value.imageFile)
  if (form.pixel_id) fd.append('pixel_id', form.pixel_id)

  try {
    const res = await api<ApiResponse<{ slug: string }>>(`/admin/academies/${source.id}`, {
      method: 'PUT',
      body: fd
    })
    pageTitle.value = form.title
    currentStatus.value = targetStatus
    toast.add({ title: successMessage, color: 'success' })
    if (res.data.slug !== academySlug) {
      await navigateTo(`/admin/academies/${res.data.slug}/edit`, { replace: true })
    }
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    loadingRef.value = false
  }
}

const isSwitchingToDraft = ref(false)

async function onHeaderSave() {
  if (currentStatus.value !== 'DRAFT') {
    await onSave('ACTIVE', isHeaderSaving, saveButtonLabel.value)
    return
  }

  const isValid = await validateForPublish(form)
  if (isValid) {
    await onSave('ACTIVE', isHeaderSaving, saveButtonLabel.value)
  }
}

async function onSectionSave() {
  await onSave(currentStatus.value, isSectionSaving, 'Academy saved')
}

async function onSwitchToDraft() {
  await onSave('DRAFT', isSwitchingToDraft, 'Academy switched to draft')
}

async function onArchive() {
  await onSave('ARCHIVED', isArchiving, 'Academy archived')
  isArchiveConfirmOpen.value = false
  if (currentStatus.value === 'ARCHIVED') {
    await navigateTo('/admin/academies')
  }
}

async function onDelete() {
  isDeleting.value = true
  try {
    await api(`/admin/academies/${source.id}`, { method: 'DELETE' })
    toast.add({ title: 'Academy deleted', color: 'success' })
    await navigateTo('/admin/academies')
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
  }
}
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0">
    <div class="flex items-center justify-between gap-4 px-1 shrink-0 mb-6">
      <div class="flex items-center gap-4 min-w-0">
        <UButton
          icon="i-ph-arrow-left-bold"
          color="neutral"
          variant="ghost"
          to="/admin/academies"
        />
        <h2 class="text-xl font-semibold truncate">Edit {{ pageTitle }}</h2>
        <UBadge
          :color="
            currentStatus === 'ACTIVE'
              ? 'success'
              : currentStatus === 'ARCHIVED'
                ? 'neutral'
                : 'primary'
          "
          variant="subtle"
          size="lg"
          :label="
            currentStatus === 'ACTIVE'
              ? 'Active'
              : currentStatus === 'ARCHIVED'
                ? 'Archived'
                : 'Draft'
          "
        />
      </div>
      <div class="flex items-center justify-center gap-4">
        <UButton
          v-if="currentStatus === 'ACTIVE'"
          label="View Public Page"
          icon="i-ph-arrow-square-out-bold"
          size="sm"
          color="neutral"
          variant="link"
          :to="`/academy/${academySlug}`"
          target="_blank"
        />
        <UButton
          v-if="currentStatus === 'ACTIVE'"
          label="Switch to Draft"
          color="neutral"
          variant="light"
          :loading="isSwitchingToDraft"
          :disabled="isSwitchingToDraft"
          @click="onSwitchToDraft"
        />
        <UButton
          :label="saveButtonLabel"
          color="primary"
          :loading="isHeaderSaving || isValidating"
          :disabled="isHeaderSaving || isValidating"
          @click="onHeaderSave"
        />
        <UDropdownMenu :items="headerMenuItems">
          <UButton icon="i-ph-dots-three-vertical-bold" color="neutral" variant="light" />
        </UDropdownMenu>
      </div>
    </div>

    <UTabs
      :items="academyTabItems"
      variant="link"
      color="primary"
      :unmount-on-hide="false"
      :ui="{
        root: 'flex-1 min-h-0',
        list: 'p-0! shrink-0',
        content: 'flex-1 min-h-0',
        trigger: 'px-3 sm:px-6 whitespace-nowrap'
      }"
    >
      <template #information>
        <div class="relative flex h-full">
          <div ref="scrollContainerRef" class="flex-1 overflow-y-auto py-6">
            <div class="pr-64 space-y-6">
              <UAlert
                v-if="currentStatus === 'ACTIVE' && !source.has_cohort"
                color="primary"
                variant="subtle"
                icon="i-ph-info-bold"
                title="No cohort available"
                description="This academy will appear on the public page but cannot accept payments until there is at least one available cohort."
              />
              <div class="absolute w-56 top-0 right-4 shrink-0 overflow-y-auto">
                <div class="border border-default rounded-lg mt-6 p-4">
                  <UNavigationMenu orientation="vertical" :items="tocItems" />
                </div>
              </div>
              <div id="section-basic" class="space-y-6 border border-default rounded-lg p-6">
                <UForm
                  :schema="academyFormSchema"
                  :state="form"
                  @submit="onSectionSave"
                  :validate-on="['submit']"
                >
                  <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-semibold">Basic Information</h3>
                    <UButton
                      type="submit"
                      label="Save"
                      color="primary"
                      :loading="isSectionSaving"
                      :disabled="isSectionSaving"
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
                <AdminAcademySectionFaqs
                  :academy-id="source.id"
                  :initial-data="source.faqs ?? []"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #syllabus>
        <div class="relative flex h-full">
          <div class="flex-1 overflow-y-auto py-6 pr-4">
            <AdminAcademySectionSyllabus
              :academy-id="source.id"
              :initial-data="source.themes ?? []"
            />
          </div>
        </div>
      </template>

      <template #cohorts>
        <div class="relative flex h-full">
          <div class="flex-1 overflow-y-auto py-6 pr-4">
            <AdminAcademySectionCohorts :academy-id="source.id" />
          </div>
        </div>
      </template>
    </UTabs>

    <UModal
      v-model:open="isArchiveConfirmOpen"
      title="Archive Academy"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p class="text-sm">
          Are you sure you want to archive
          <span class="font-semibold">{{ pageTitle }}</span
          >? It will no longer be visible to the public.
        </p>
      </template>
      <template #footer>
        <UButton
          label="Cancel"
          color="neutral"
          variant="outline"
          :disabled="isArchiving"
          @click="isArchiveConfirmOpen = false"
        />
        <UButton
          label="Archive"
          :loading="isArchiving"
          :disabled="isArchiving"
          @click="onArchive"
        />
      </template>
    </UModal>

    <AdminConfirmDeleteModal
      v-model:open="isDeleteOpen"
      :item-name="pageTitle"
      :loading="isDeleting"
      @confirm="onDelete"
    />

    <UModal
      v-model:open="isValidationModalOpen"
      title="Complete Required Information"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p class="text-sm text-muted mb-3">
          Please complete the following before publishing this academy:
        </p>
        <ul class="space-y-2">
          <li
            v-for="err in validationErrors"
            :key="err"
            class="flex items-center gap-2 text-muted text-sm"
          >
            <UIcon name="i-ph-warning-circle-bold" class="size-5 text-error mt-0.5 shrink-0" />
            {{ err }}
          </li>
        </ul>
      </template>
      <template #footer>
        <UButton
          label="Back"
          color="neutral"
          variant="outline"
          @click="isValidationModalOpen = false"
        />
      </template>
    </UModal>
  </div>
</template>
