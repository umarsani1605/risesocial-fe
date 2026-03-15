<script setup lang="ts">
import { ACADEMY_TAB_ITEMS } from '@/utils/academyOptions'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Add Academy',
  navbarIcon: 'i-lucide-graduation-cap',
  middleware: 'admin'
})

useSeoMeta({ title: 'Add New Academy | Rise Social' })

const toast = useToast()
const { api } = useApi()

const activeTab = ref('0')

const form = reactive({
  title: '',
  description: '',
  duration: '',
  format: '',
  category: '',
  status: 'ARCHIVED',
  certificate: 'Yes',
  portfolio: 'Yes'
})

const formRef = useTemplateRef('formRef')
const loading = ref(false)

async function onSave() {
  if (!form.title) {
    toast.add({ title: 'Please enter a title', color: 'error' })
    return
  }

  loading.value = true
  const formData = new FormData()
  formData.append('title', form.title)
  if (form.description) formData.append('description', form.description)
  formData.append('status', form.status)
  formData.append('certificate', String(form.certificate === 'Yes'))
  formData.append('portfolio', String(form.portfolio === 'Yes'))
  if (form.duration) formData.append('duration', form.duration)
  if (form.format) formData.append('format', form.format)
  if (form.category) formData.append('category', form.category)
  if (formRef.value?.imageFile) formData.append('file', formRef.value.imageFile)

  try {
    const res = await api<ApiResponse<{ slug: string }>>('/admin/academies', {
      method: 'POST',
      body: formData
    })
    toast.add({ title: 'Academy created', color: 'success' })
    await navigateTo(`/admin/academies/${res.data.slug}/edit`)
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
    <div class="flex items-center gap-2 mb-4">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" to="/admin/academies" />
      <h2 class="text-xl font-semibold">Add New Academy</h2>
    </div>

    <UTabs
      v-model="activeTab"
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
              <AdminAcademyFormBasicInfo ref="formRef" v-model="form" />
            </div>

            <!-- Sub-resource placeholders -->
            <template
              v-for="section in [
                { label: 'Pricing', columns: ['Order', 'Name', 'Original Price', 'Discount Price'] },
                { label: 'Featured Benefits', columns: ['Order', 'Title', 'Description', 'Icon'] },
                { label: 'Instructors', columns: ['Order', 'Name', 'Job Title', 'Description'] },
                { label: 'Testimonials', columns: ['Order', 'Name', 'Comment'] },
                { label: 'FAQs', columns: ['Order', 'Question', 'Answer'] }
              ]"
              :key="section.label"
            >
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">{{ section.label }}</h3>
                <div class="border border-default rounded-lg overflow-hidden">
                  <div class="flex flex-col items-center justify-center gap-2 py-16">
                    <UIcon name="i-lucide-lock" class="size-5 text-dimmed mb-2" />
                    <p class="text-sm text-muted">
                      Save basic information first to manage {{ section.label.toLowerCase() }}.
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </UScrollArea>
      </template>

      <!-- Non-information tabs: prompt to save first -->
      <template v-for="slot in ['syllabus', 'cohorts', 'students', 'mentors']" #[slot] :key="slot">
        <UScrollArea class="h-[calc(100vh-12rem)]" :ui="{ viewport: 'p-6' }">
          <div class="py-16 flex flex-col items-center gap-3 text-center">
            <UIcon name="i-lucide-lock" class="size-8 text-muted" />
            <p class="font-medium">Save the basic information first</p>
            <p class="text-sm text-muted">
              Fill in and save the Information tab before managing this section.
            </p>
            <UButton
              label="Go to Information"
              color="primary"
              variant="outline"
              @click="activeTab = '0'"
            />
          </div>
        </UScrollArea>
      </template>
    </UTabs>
  </UCard>
</template>
