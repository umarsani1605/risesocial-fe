<script setup lang="ts">
import type { LinkedinSyncSchedule } from '@/schemas/jobSync'
import {
  JOB_LIMIT_OPTIONS,
  SYNC_INTERVAL_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
  HOUR_OPTIONS,
  HIDE_AFTER_OPTIONS
} from '@/schemas/jobSync'

const open = defineModel<boolean>('open', { required: true })
const syncFilters = defineModel<{
  advanced_title_filter: string[]
  location_filter: string[]
  description_filter: string[]
  type_filter: string[]
  organization_description_filter: string[]
  organization_specialties_filter: string[]
  industry_filter: string[]
  seniority_filter: string[]
}>('syncFilters', { required: true })
const schedule = defineModel<LinkedinSyncSchedule>('schedule', { required: true })

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
}>()
</script>

<template>
  <UModal
    v-model:open="open"
    title="LinkedIn Job Update Settings"
    description="Configure default search filters and the automatic update schedule."
    :ui="{ content: 'max-w-4xl', footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-8 pt-2">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <UFormField label="Job title keywords">
            <UInputTags
              v-model="syncFilters!.advanced_title_filter"
              placeholder="Type and press enter"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Locations">
            <UInputTags
              v-model="syncFilters!.location_filter"
              placeholder="Type and press enter"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Description keywords">
            <UInputTags
              v-model="syncFilters!.description_filter"
              placeholder="Type and press enter"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Job types">
            <USelectMenu
              v-model="syncFilters!.type_filter"
              :items="jobTypeOptions"
              value-key="value"
              multiple
              placeholder="Select job types..."
              class="w-full"
            />
          </UFormField>
          <UFormField label="Company description keywords">
            <UInputTags
              v-model="syncFilters!.organization_description_filter"
              placeholder="Type and press enter"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Company specialties">
            <UInputTags
              v-model="syncFilters!.organization_specialties_filter"
              placeholder="Type and press enter"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Industries">
            <UInputTags
              v-model="syncFilters!.industry_filter"
              placeholder="Type and press enter"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Seniority levels">
            <UInputTags
              v-model="syncFilters!.seniority_filter"
              placeholder="Type and press enter"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="space-y-5 border-t border-default pt-6">
          <USwitch v-model="schedule!.enabled" label="Enable Automatic Update" />
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
            <UFormField label="Number of Jobs">
              <USelect
                v-model="schedule!.job_limit"
                :items="JOB_LIMIT_OPTIONS"
                value-key="value"
                class="w-full"
              />
            </UFormField>
            <div
              class="grid grid-cols-1 gap-5 transition-opacity md:grid-cols-2 lg:col-span-4 lg:grid-cols-4"
              :class="{ 'opacity-50 pointer-events-none': !schedule!.enabled }"
            >
              <UFormField label="Frequency">
                <USelect
                  v-model="schedule!.interval_weeks"
                  :items="SYNC_INTERVAL_OPTIONS"
                  value-key="value"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Day">
                <USelect
                  v-model="schedule!.day_of_week"
                  :items="DAY_OF_WEEK_OPTIONS"
                  value-key="value"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Time (WIB)">
                <USelect
                  v-model="schedule!.hour"
                  :items="HOUR_OPTIONS"
                  value-key="value"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Hide Jobs After">
                <USelect
                  v-model="schedule!.hide_after_weeks"
                  :items="HIDE_AFTER_OPTIONS"
                  value-key="value"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="white" :disabled="props.loading" @click="emit('cancel')" />
      <UButton
        label="Save Settings"
        color="primary"
        :loading="props.loading"
        :disabled="props.loading"
        @click="emit('save')"
      />
    </template>
  </UModal>
</template>
