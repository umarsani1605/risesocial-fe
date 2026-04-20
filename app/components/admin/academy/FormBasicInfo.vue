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
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
    <!-- Left column -->
    <div class="space-y-5">
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">
          Title <span class="text-error">*</span>
        </span>
        <UFormField name="title" class="flex-1">
          <UInput v-model="form.title" placeholder="Academy title" class="w-full" />
        </UFormField>
      </div>
      <div class="flex flex-col md:flex-row items-start gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2 md:pt-2">
          Description <span class="text-error">*</span></span
        >
        <UFormField name="description" class="flex-1 w-full">
          <UTextarea
            v-model="form.description"
            placeholder="Academy description"
            :rows="4"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="flex flex-col md:flex-row items-start gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2 md:pt-2">
          Cover Image <span class="text-error">*</span>
        </span>
        <UFileUpload
          v-model="imageFile"
          accept="image/png,image/jpeg"
          icon="i-ph-image-bold"
          label="Click to upload or drag & drop"
          description="PNG or JPG (max. 2MB)"
          layout="list"
          :ui="{ fileLeadingAvatar: 'size-16 rounded-md' }"
          class="flex-1 w-full"
          @update:model-value="isNewFile = true"
        />
      </div>
    </div>

    <!-- Right column -->
    <div class="space-y-5 mt-5 md:mt-0">
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">
          Duration <span class="text-error">*</span>
        </span>
        <UFormField name="duration" class="flex-1">
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
        <UFormField name="format" class="flex-1">
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
        <UFormField name="category" class="flex-1">
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
          class="flex-1"
        />
      </div>
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Portfolio</span>
        <USelect
          v-model="form.portfolio"
          :items="ACADEMY_YES_NO_OPTIONS"
          placeholder="Select option"
          class="flex-1"
        />
      </div>
      <div class="flex flex-col md:flex-row gap-1 md:gap-4">
        <span class="text-sm md:w-28 md:shrink-0 md:p-2">Meta Pixel ID</span>
        <UInput v-model="form.pixel_id" placeholder="Meta Pixel ID" class="flex-1" />
      </div>
    </div>
  </div>
</template>
