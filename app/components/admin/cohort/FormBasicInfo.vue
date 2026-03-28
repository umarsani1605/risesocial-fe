<script setup lang="ts">
import type { AdminCohortDetail } from '~/types/cohort'
import { COHORT_STATUS_ITEMS } from '@/constants/cohort'

const form = defineModel<{
  name: string
  description: string
  status: AdminCohortDetail['status']
  start_date: string
  end_date: string
}>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
    <div class="space-y-5">
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Name <span class="text-error">*</span></span>
        <UFormField name="name" class="flex-1">
          <UInput v-model="form.name" placeholder="Cohort name" class="w-full" />
        </UFormField>
      </div>

      <div class="flex flex-col md:flex-row items-start gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2 md:pt-2">Description</span>
        <UFormField name="description" class="flex-1 w-full">
          <UTextarea v-model="form.description" placeholder="Cohort description" :rows="4" class="w-full" />
        </UFormField>
      </div>
    </div>

    <div class="space-y-5 mt-5 md:mt-0">
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Status</span>
        <UFormField name="status" class="flex-1">
          <USelect v-model="form.status" :items="COHORT_STATUS_ITEMS" placeholder="Select status" class="w-full" />
        </UFormField>
      </div>

      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Start Date</span>
        <UFormField name="start_date" class="flex-1">
          <UInput v-model="form.start_date" type="date" class="w-full" />
        </UFormField>
      </div>

      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">End Date</span>
        <UFormField name="end_date" class="flex-1">
          <UInput v-model="form.end_date" type="date" class="w-full" />
        </UFormField>
      </div>
    </div>
  </div>
</template>
