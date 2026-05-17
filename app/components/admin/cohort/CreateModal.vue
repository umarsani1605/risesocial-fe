<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import { cohortCreatePageSchema } from '@/schemas/cohort'

const open = defineModel<boolean>('open', { required: true })
const form = defineModel<{
  academy_id: number | undefined
  name: string
  description: string
  start_date: string
  end_date: string
  copy_from_academy: boolean
}>('form', { required: true })

defineProps<{
  loading?: boolean
  academyItems: { label: string; value: number }[]
}>()
const emit = defineEmits<{ submit: [] }>()
const formRef = useTemplateRef('formRef')
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
  <UModal v-model:open="open" title="Add New Cohort" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm
        :validate-on="['submit']"
        ref="formRef"
        :schema="cohortCreatePageSchema"
        :state="form"
        class="space-y-5"
        @submit="emit('submit')"
      >
        <div class="space-y-3">
          <UFormField name="academy_id" label="Academy" required>
            <USelectMenu
              v-model="form.academy_id"
              value-key="value"
              :items="academyItems"
              placeholder="Select Academy"
              class="w-full"
            />
          </UFormField>
          <UFormField name="copy_from_academy">
            <UCheckbox v-model="form.copy_from_academy" label="Copy syllabus and mentors" />
          </UFormField>
        </div>
        <UFormField name="name" label="Name" required>
          <UInput v-model="form.name" placeholder="Cohort Name" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Cohort Description"
            :rows="4"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Duration" required>
          <div class="flex items-start gap-2">
            <UFormField name="start_date" class="flex-1">
              <UInputDate ref="startDateInput" v-model="startDate" locale="en-GB" class="w-full">
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
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="loading"
        @click="open = false"
      />
      <UButton
        label="Add Cohort"
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
