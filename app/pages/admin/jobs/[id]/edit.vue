<script setup lang="ts">
import type { Job, AdminJobForm, JobType, ExperienceLevel } from '@/types'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Edit Job',
  navbarIcon: 'i-lucide-pencil',
  middleware: 'admin'
})

const route = useRoute()
const toast = useToast()
const { api } = useApi()

const jobId = Number(route.params.id)
const { data: jobData, error: jobError } = await useAsyncData(
  `admin:job:${jobId}`,
  () => api<ApiResponse<Job>>(`/admin/jobs/${jobId}`)
)

if (jobError.value || !jobData.value?.data) {
  throw createError({ statusCode: 404, message: 'Job not found' })
}

const job = jobData.value.data

useSeoMeta({ title: `Edit Job – ${job.title} | Rise Social` })

// ── Options ────────────────────────────────────────────────────────────────────

const jobTypeOptions = [
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Remote', value: 'REMOTE' }
]

const experienceLevelOptions = [
  { label: 'Entry Level', value: 'ENTRY_LEVEL' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Mid Level', value: 'MID_LEVEL' },
  { label: 'Senior', value: 'SENIOR' },
  { label: 'Lead', value: 'LEAD' },
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Director', value: 'DIRECTOR' }
]

// ── Form state ─────────────────────────────────────────────────────────────────

const form = reactive<AdminJobForm>({
  title: job.title,
  description: job.description ?? '',
  company: job.company.name,
  location: [job.location.city, job.location.country].filter(Boolean).join(', '),
  slug: job.slug,
  jobType: job.jobType as JobType,
  experienceLevel: job.experienceLevel as ExperienceLevel,
  salary_min: job.minSalary ?? null,
  salary_max: job.maxSalary ?? null,
  skills: job.skills ?? [],
  requirements: job.requirements ?? [],
  benefits: job.benefits ?? [],
  isRemote: job.isRemote ?? false,
  application_deadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
  applicationUrl: job.applicationUrl ?? '',
  contactEmail: ''
})

// ── Save ───────────────────────────────────────────────────────────────────────

const isSaving = ref(false)

async function onSave() {
  isSaving.value = true
  try {
    await api(`/admin/jobs/${jobId}`, { method: 'PUT', body: form })
    toast.add({ title: 'Job saved successfully', color: 'success' })
  }
  catch {
    toast.add({ title: 'Failed to save job', color: 'error' })
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-arrow-left"
          label="Back"
          color="neutral"
          variant="ghost"
          size="sm"
          to="/admin/jobs"
        />
        <h1 class="text-lg font-semibold">Edit Job</h1>
      </div>
      <UButton
        icon="i-lucide-save"
        label="Save Job"
        color="primary"
        :loading="isSaving"
        @click="onSave"
      />
    </div>

    <!-- Basic Information -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2.5">
          <div class="size-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-info" class="size-4 text-white" />
          </div>
          <h2 class="font-semibold">Basic Information</h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <UFormField label="Title" required class="col-span-1 sm:col-span-2 xl:col-span-2">
            <UInput v-model="form.title" placeholder="Job title" class="w-full" />
          </UFormField>
          <UFormField label="Slug" required class="col-span-1 sm:col-span-2">
            <UInput v-model="form.slug" placeholder="job-title-slug" class="w-full" />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <UFormField label="Job Type" required>
            <USelectMenu
              v-model="form.jobType"
              value-key="value"
              :items="jobTypeOptions"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Experience Level" required>
            <USelectMenu
              v-model="form.experienceLevel"
              value-key="value"
              :items="experienceLevelOptions"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Remote Work">
            <div class="flex items-center gap-2 h-9">
              <UToggle v-model="form.isRemote" />
              <span class="text-sm text-muted">Remote position</span>
            </div>
          </UFormField>
        </div>

        <UFormField label="Description" required>
          <UTextarea v-model="form.description" placeholder="Job description..." :rows="8" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <UFormField label="Company" required>
            <UInput v-model="form.company" placeholder="Company name" class="w-full" />
          </UFormField>
          <UFormField label="Location" required>
            <UInput v-model="form.location" placeholder="City, Country" class="w-full" />
          </UFormField>
          <UFormField label="Application URL" class="xl:col-span-2">
            <UInput v-model="form.applicationUrl" placeholder="https://..." class="w-full" />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <UFormField label="Min Salary">
            <UInput v-model.number="form.salary_min" type="number" placeholder="e.g. 15000000" class="w-full" />
          </UFormField>
          <UFormField label="Max Salary">
            <UInput v-model.number="form.salary_max" type="number" placeholder="e.g. 25000000" class="w-full" />
          </UFormField>
          <UFormField label="Application Deadline">
            <UInput v-model="form.application_deadline" type="date" class="w-full" />
          </UFormField>
          <UFormField label="Contact Email">
            <UInput v-model="form.contactEmail" type="email" placeholder="hr@company.com" class="w-full" />
          </UFormField>
        </div>
      </div>
    </UCard>

    <!-- Skills & Requirements -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2.5">
          <div class="size-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-list-checks" class="size-4 text-white" />
          </div>
          <h2 class="font-semibold">Skills & Requirements</h2>
        </div>
      </template>

      <div class="space-y-4">
        <UFormField label="Skills" hint="Press Enter to add">
          <UInputTags v-model="form.skills" placeholder="e.g. JavaScript, React..." class="w-full" />
        </UFormField>

        <UFormField label="Requirements" hint="Press Enter to add each requirement">
          <UInputTags v-model="form.requirements" placeholder="e.g. 5+ years experience..." class="w-full" />
        </UFormField>

        <UFormField label="Benefits" hint="Press Enter to add each benefit">
          <UInputTags v-model="form.benefits" placeholder="e.g. Health insurance..." class="w-full" />
        </UFormField>
      </div>
    </UCard>
  </div>
</template>
