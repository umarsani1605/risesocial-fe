<script setup lang="ts">
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
    title="LinkedIn Job Sync Settings"
    description="Configure default parameters for LinkedIn job search. If a filter is empty, no filter will be applied."
    :ui="{ content: 'max-w-3xl', footer: 'justify-end' }"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
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
