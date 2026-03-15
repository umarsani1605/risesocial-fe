<script setup lang="ts">
import type { AcademyForm } from '@/types'
import {
  ACADEMY_DURATION_OPTIONS,
  ACADEMY_FORMAT_OPTIONS,
  ACADEMY_STATUS_OPTIONS,
  ACADEMY_YES_NO_OPTIONS
} from '@/utils/academyOptions'

const form = defineModel<AcademyForm>({ required: true })
const props = defineProps<{ initialImageUrl?: string | null }>()

const { file: imageFile, previewUrl, inputRef, onChange, remove } = useImageUpload(
  props.initialImageUrl ?? null
)

defineExpose({ imageFile })
</script>

<template>
  <div class="grid grid-cols-2 gap-x-16">
    <!-- Left column -->
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <span class="text-sm w-28 shrink-0">Title</span>
        <UInput v-model="form.title" placeholder="Academy title" class="flex-1" />
      </div>
      <div class="flex items-start gap-4">
        <span class="text-sm w-28 shrink-0 pt-2">Description</span>
        <UTextarea
          v-model="form.description"
          placeholder="Academy description"
          :rows="4"
          class="flex-1"
        />
      </div>
      <div class="flex items-start gap-4">
        <span class="text-sm w-28 shrink-0 pt-2">Cover Image</span>
        <div class="flex-1">
          <input
            ref="inputRef"
            type="file"
            accept="image/png,image/jpeg"
            class="hidden"
            @change="onChange"
          />
          <div
            v-if="!previewUrl"
            class="border-2 border-dashed border-default rounded-lg p-10 flex flex-col items-center gap-2 cursor-pointer hover:bg-elevated/30 transition-colors"
            @click="inputRef?.click()"
          >
            <UIcon name="i-lucide-image" class="size-8 text-muted" />
            <p class="text-sm">Click to upload cover image</p>
            <p class="text-xs text-muted">PNG or JPG (max. 2MB)</p>
          </div>
          <div v-else class="relative inline-block">
            <img :src="previewUrl" class="rounded-lg w-90 h-auto object-cover" />
            <button
              class="absolute -top-1.5 -right-1.5 size-5 bg-white border border-default rounded-full flex items-center justify-center shadow-sm"
              @click="remove"
            >
              <UIcon name="i-lucide-x" class="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <span class="text-sm w-28 shrink-0">Duration</span>
        <USelect
          v-model="form.duration"
          :items="ACADEMY_DURATION_OPTIONS"
          placeholder="Select duration"
          class="flex-1"
        />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm w-28 shrink-0">Format</span>
        <USelect
          v-model="form.format"
          :items="ACADEMY_FORMAT_OPTIONS"
          placeholder="Select format"
          class="flex-1"
        />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm w-28 shrink-0">Category</span>
        <UInput v-model="form.category" placeholder="Category" class="flex-1" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm w-28 shrink-0">Status</span>
        <USelect
          v-model="form.status"
          :items="ACADEMY_STATUS_OPTIONS"
          placeholder="Select status"
          class="flex-1"
        />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm w-28 shrink-0">Certificate</span>
        <USelect
          v-model="form.certificate"
          :items="ACADEMY_YES_NO_OPTIONS"
          placeholder="Select option"
          class="flex-1"
        />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm w-28 shrink-0">Portfolio</span>
        <USelect
          v-model="form.portfolio"
          :items="ACADEMY_YES_NO_OPTIONS"
          placeholder="Select option"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>
