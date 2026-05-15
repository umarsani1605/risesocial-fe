<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })
const employmentType = defineModel<string | undefined>('employmentType')
const seniorityLevel = defineModel<string | undefined>('seniorityLevel')
const isRemote = defineModel<string | undefined>('isRemote')
const country = defineModel<string | undefined>('country')
const status = defineModel<string | undefined>('status')

defineProps<{
  activeFilterCount: number
  uniqueCountries: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  apply: []
  clear: []
}>()

const remoteFilterOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
]

const statusFilterOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'All', value: 'all' }
]
</script>

<template>
  <UPopover v-model:open="open">
    <UButton
      label="Filters"
      leading-icon="i-ph-sliders-horizontal-bold"
      color="neutral"
      variant="outline"
    >
      <template v-if="activeFilterCount > 0" #trailing>
        <span
          class="size-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
        >
          {{ activeFilterCount }}
        </span>
      </template>
    </UButton>

    <template #content>
      <div class="p-4 w-72 space-y-4">
        <h4 class="font-medium text-sm">Filter Jobs</h4>

        <UFormField label="Job Type">
          <USelect
            v-model="employmentType"
            :items="jobTypeOptions"
            placeholder="All Types"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Experience Level">
          <USelect
            v-model="seniorityLevel"
            :items="experienceLevelOptions"
            placeholder="All Levels"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Remote Work">
          <USelect
            v-model="isRemote"
            :items="remoteFilterOptions"
            placeholder="All"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Country">
          <USelect
            v-model="country"
            :items="uniqueCountries"
            placeholder="All Countries"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Status">
          <USelect
            v-model="status"
            :items="statusFilterOptions"
            placeholder="Active"
            class="w-full"
          />
        </UFormField>

        <div class="flex gap-2 pt-1">
          <UButton label="Apply" color="primary" size="sm" class="flex-1" block @click="emit('apply')" />
          <UButton label="Clear" color="white" size="sm" class="flex-1" block @click="emit('clear')" />
        </div>
      </div>
    </template>
  </UPopover>
</template>
