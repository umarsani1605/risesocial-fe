<script setup lang="ts">
import type { AdminJobForm } from '@/types'
import { jobCreateSchema } from '@/schemas/job'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Create Job',
  middleware: 'admin'
})

useSeoMeta({ title: 'Create Job | Rise Social' })

const toast = useToast()
const { api } = useApi()

// ── Form state ─────────────────────────────────────────────────────────────────

const form = reactive<Omit<AdminJobForm, 'slug'>>({
  title: '',
  description: '',
  company: '',
  location: '',
  employment_type: 'FULL_TIME',
  seniority_level: 'ENTRY_LEVEL',
  is_remote: false,
  valid_until: '',
  external_url: ''
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
    await api('/admin/jobs', { method: 'POST', body })
    toast.add({ title: 'Job created', color: 'success' })
    await navigateTo('/admin/jobs')
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AdminCard :ui="{ body: 'p-0' }">
    <!-- Page Header -->
    <UForm :schema="jobCreateSchema" :state="form" @submit="onSave">
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex items-center gap-2">
          <UButton icon="i-ph-arrow-left-bold" color="neutral" variant="ghost" to="/admin/jobs" />
          <h2 class="text-xl font-semibold">Create Job</h2>
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
