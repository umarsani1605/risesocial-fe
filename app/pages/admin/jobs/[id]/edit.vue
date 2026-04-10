<script setup lang="ts">
import type { Job, AdminJobForm } from '@/types'
import { jobEditSchema } from '@/schemas/job'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Edit Job',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const toast = useToast()
const { api } = useApi()

const jobId = Number(route.params.id)
const { data: jobData, error: jobError } = await useAsyncData(`admin:job:${jobId}`, () =>
  api<ApiResponse<Job>>(`/admin/jobs/${jobId}`)
)

if (jobError.value || !jobData.value?.data) {
  throw createError({ statusCode: 404, message: 'Job not found' })
}

const job = jobData.value.data

useSeoMeta({ title: `Edit Job – ${job.title} | Rise Social` })

// ── Form state ─────────────────────────────────────────────────────────────────

const form = reactive<AdminJobForm>({
  title: job.title,
  description: job.description ?? '',
  company: job.company.name,
  location: [job.location?.city, job.location?.country].filter(Boolean).join(', '),
  slug: job.slug,
  employment_type: job.employment_type,
  seniority_level: job.seniority_level ?? '',
  is_remote: job.location?.is_remote ?? false,
  valid_until: job.valid_until ? job.valid_until.split('T')[0]! : '',
  external_url: job.external_url ?? ''
})

const remoteOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
]

// ── Save ───────────────────────────────────────────────────────────────────────

const isSaving = ref(false)

async function onSave() {
  isSaving.value = true
  try {
    const body = {
      ...form,
      valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : undefined
    }
    await api(`/admin/jobs/${jobId}`, { method: 'PUT', body })
    toast.add({ title: 'Job saved', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AdminCard :ui="{ body: 'p-0' }">
    <!-- Page Header -->
    <UForm :schema="jobEditSchema" :state="form" @submit="onSave">
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex items-center gap-2">
          <UButton icon="i-ph-arrow-left-bold" color="neutral" variant="ghost" to="/admin/jobs" />
          <h2 class="text-xl font-semibold">Edit Job</h2>
        </div>
        <UButton
          type="submit"
          icon="i-ph-floppy-disk-bold"
          label="Save Job"
          color="primary"
          :loading="isSaving"
          :disabled="isSaving"
        />
      </div>

      <div class="p-4 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField name="title" label="Title" required>
            <UInput v-model="form.title" placeholder="Job title" class="w-full" />
          </UFormField>
          <UFormField name="company" label="Company" required>
            <UInput v-model="form.company" placeholder="Company name" class="w-full" />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField name="employment_type" label="Job Type" required>
            <USelectMenu
              v-model="form.employment_type"
              value-key="value"
              :items="jobTypeOptions"
              class="w-full"
            />
          </UFormField>
          <UFormField name="seniority_level" label="Experience Level">
            <USelectMenu
              v-model="form.seniority_level"
              value-key="value"
              :items="experienceLevelOptions"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField name="location" label="Location" required>
            <UInput v-model="form.location" placeholder="City, Country" class="w-full" />
          </UFormField>
          <UFormField name="is_remote" label="Remote Work">
            <USelectMenu
              v-model="form.is_remote"
              value-key="value"
              :items="remoteOptions"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField name="external_url" label="Application URL">
            <UInput v-model="form.external_url" placeholder="https://..." class="w-full" />
          </UFormField>
          <UFormField name="valid_until" label="Application Deadline">
            <UInput v-model="form.valid_until" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField name="description" label="Description" required>
          <UTextarea
            v-model="form.description"
            placeholder="Job description..."
            :rows="8"
            class="w-full"
          />
        </UFormField>
      </div>
    </UForm>
  </AdminCard>
</template>
