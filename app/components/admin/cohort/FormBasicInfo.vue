<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const form = defineModel<{
  name: string
  description: string
  status: AdminCohortDetail['status']
  start_date: string
  end_date: string
}>({ required: true })

const startDateInput = useTemplateRef('startDateInput')
const endDateInput = useTemplateRef('endDateInput')

function stringToCalendarDate(s: string): CalendarDate | null {
  if (!s) return null
  const parts = s.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null
  return new CalendarDate(parts[0]!, parts[1]!, parts[2]!)
}

const startDate = computed({
  get: () => stringToCalendarDate(form.value.start_date),
  set: (val: CalendarDate | null) => {
    form.value.start_date = val ? val.toString() : ''
  }
})

const endDate = computed({
  get: () => stringToCalendarDate(form.value.end_date),
  set: (val: CalendarDate | null) => {
    form.value.end_date = val ? val.toString() : ''
  }
})
</script>

<template>
  <div class="max-w-5xl gap-x-8">
    <div class="space-y-5">
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2"
          >Name <span class="text-error">*</span></span
        >
        <UFormField name="name" class="flex-1">
          <UInput v-model="form.name" placeholder="Cohort name" class="w-full" />
        </UFormField>
      </div>

      <div class="flex flex-col md:flex-row items-start gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2 md:pt-2">Description</span>
        <UFormField name="description" class="flex-1 w-full">
          <UTextarea
            v-model="form.description"
            placeholder="Cohort description"
            :rows="8"
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2"
          >Duration <span class="text-error">*</span></span
        >
        <div class="flex-1 flex items-start gap-2">
          <UFormField name="start_date" class="flex-1">
            <UInputDate
              ref="startDateInput"
              v-model="startDate"
              locale="en-GB"
              class="w-full"
            >
              <template #leading>
                <UPopover :reference="(startDateInput as any)?.inputsRef?.[3]?.$el">
                  <UButton
                    color="neutral"
                    variant="link"
                    size="md"
                    icon="i-ph-calendar-blank-bold"
                    aria-label="Select start date"
                    class="px-0 text-dimmed"
                  />
                  <template #content>
                    <UCalendar v-model="startDate" class="p-2" />
                  </template>
                </UPopover>
              </template>
            </UInputDate>
          </UFormField>

          <UIcon name="i-ph-arrow-right-bold" class="shrink-0 mt-2.5 text-muted" />

          <UFormField name="end_date" class="flex-1">
            <UInputDate ref="endDateInput" v-model="endDate" locale="en-GB" class="w-full">
              <template #leading>
                <UPopover :reference="(endDateInput as any)?.inputsRef?.[3]?.$el">
                  <UButton
                    color="neutral"
                    variant="link"
                    size="md"
                    icon="i-ph-calendar-blank-bold"
                    aria-label="Select end date"
                    class="px-0 text-dimmed"
                  />
                  <template #content>
                    <UCalendar v-model="endDate" class="p-2" />
                  </template>
                </UPopover>
              </template>
            </UInputDate>
          </UFormField>
        </div>
      </div>
    </div>
  </div>
</template>
