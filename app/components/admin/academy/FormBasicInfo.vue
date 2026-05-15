<script setup lang="ts">
import type { AcademyForm } from '@/types'
import {
  ACADEMY_DURATION_OPTIONS,
  ACADEMY_FORMAT_OPTIONS,
  ACADEMY_YES_NO_OPTIONS
} from '@/constants/academy'

const form = defineModel<AcademyForm>({ required: true })
const props = defineProps<{ initialImageUrl?: string | null }>()

const imageFile = ref<File | null>(null)
const isNewFile = ref(false)

onMounted(async () => {
  if (!props.initialImageUrl) return
  try {
    const res = await fetch(props.initialImageUrl)
    const blob = await res.blob()
    const filename = props.initialImageUrl.split('/').pop()?.split('?')[0] ?? 'cover.jpg'
    imageFile.value = new File([blob], filename, { type: blob.type })
  } catch {
    // do nothing
  }
})

defineExpose({
  get imageFile() {
    return isNewFile.value ? imageFile.value : null
  }
})
</script>

<template>
  <div class="grid grid-cols-1 gap-x-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <!-- Left column -->
    <div class="min-w-0 space-y-5">
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">
          Title <span class="text-error">*</span>
        </span>
        <UFormField name="title" class="min-w-0 flex-1">
          <UInput v-model="form.title" placeholder="Academy title" class="w-full" />
        </UFormField>
      </div>
      <div class="flex flex-col md:flex-row items-start gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2 md:pt-2">
          Description <span class="text-error">*</span></span
        >
        <UFormField name="description" class="min-w-0 w-full flex-1">
          <UTextarea
            v-model="form.description"
            placeholder="Academy description"
            :rows="4"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2 md:pt-2">
          Cover Image <span class="text-error">*</span>
        </span>
        <div class="w-full min-w-0 md:flex-1">
          <UFileUpload
            v-model="imageFile"
            accept="image/png,image/jpeg"
            icon="i-ph-image-bold"
            label="Click to upload or drag & drop"
            description="PNG or JPG (max. 2MB)"
            layout="list"
            :ui="{
              base: 'min-w-0',
              files: 'mt-3',
              file: 'min-w-0',
              fileLeadingAvatar: 'size-16 rounded-md',
              fileWrapper: 'min-w-0',
              fileName: 'min-w-0',
              fileSize: 'min-w-0'
            }"
            class="block min-w-0 w-full"
            @update:model-value="isNewFile = true"
          />
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div class="mt-5 min-w-0 space-y-5 md:mt-0">
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">
          Duration <span class="text-error">*</span>
        </span>
        <UFormField name="duration" class="min-w-0 flex-1">
          <USelect
            v-model="form.duration"
            :items="ACADEMY_DURATION_OPTIONS"
            placeholder="Select duration"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">
          Format <span class="text-error">*</span>
        </span>
        <UFormField name="format" class="min-w-0 flex-1">
          <USelect
            v-model="form.format"
            :items="ACADEMY_FORMAT_OPTIONS"
            placeholder="Select format"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">
          Category <span class="text-error">*</span>
        </span>
        <UFormField name="category" class="min-w-0 flex-1">
          <UInput v-model="form.category" placeholder="Category" class="w-full" />
        </UFormField>
      </div>
      <!-- Status is managed via header action buttons, not this form -->
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Certificate</span>
        <USelect
          v-model="form.certificate"
          :items="ACADEMY_YES_NO_OPTIONS"
          placeholder="Select option"
          class="min-w-0 flex-1"
        />
      </div>
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Portfolio</span>
        <USelect
          v-model="form.portfolio"
          :items="ACADEMY_YES_NO_OPTIONS"
          placeholder="Select option"
          class="min-w-0 flex-1"
        />
      </div>
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Meta Pixel ID</span>
        <UInput v-model="form.pixel_id" placeholder="Meta Pixel ID" class="min-w-0 flex-1" />
      </div>
    </div>
  </div>
</template>
