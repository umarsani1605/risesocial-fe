<script setup lang="ts">
import type { AdminCohortModule } from '~/types/cohort'

defineProps<{
  module: AdminCohortModule
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
  edit: [module: AdminCohortModule]
  delete: [moduleId: number]
}>()
</script>

<template>
  <div class="border border-default rounded-lg overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-elevated/50 hover:cursor-pointer transition-colors"
      @click.stop="emit('toggle')"
    >
      <span
        class="flex items-center justify-center size-7 rounded-full border border-primary text-primary text-sm font-bold shrink-0"
      >
        {{ module.order }}
      </span>

      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="font-medium text-sm leading-snug truncate">{{ module.title }}</span>
        <UBadge
          v-if="!module.is_published"
          label="Draft"
          color="primary"
          variant="outline"
          class="shrink-0"
        />
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <UIcon
          :name="isOpen ? 'i-ph-caret-down-bold' : 'i-ph-caret-right-bold'"
          class="size-4 text-muted"
        />
      </div>
    </button>

    <template v-if="isOpen">
      <div class="border-t border-default px-4 py-4 space-y-6">
        <p v-if="module.description" class="text-sm-center text-default leading-relaxed">
          {{ module.description }}
        </p>

        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 text-sm min-w-0">
            <div class="flex items-center gap-2">
              <UIcon name="i-ph-calendar-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="text-muted font-medium sm:w-36 sm:shrink-0">Session Date</span>
            </div>
            <span v-if="module.session_timestamp">{{
              formatDatetimeLong(module.session_timestamp)
            }}</span>
            <span v-else class="text-muted">No session date</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 text-sm min-w-0">
            <div class="flex items-center gap-2">
              <UIcon name="i-ph-video-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="text-muted font-medium sm:w-36 sm:shrink-0">Meeting Link</span>
            </div>
            <a
              v-if="module.meeting_link"
              :href="module.meeting_link"
              target="_blank"
              class="text-primary hover:underline break-all"
            >
              {{ module.meeting_link }}
            </a>
            <span v-else class="text-muted">No meeting link</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 text-sm min-w-0">
            <div class="flex items-center gap-2">
              <UIcon name="i-ph-user-check-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="text-muted font-medium sm:w-36 sm:shrink-0">Attendance Link</span>
            </div>
            <a
              v-if="module.attendance_link"
              :href="module.attendance_link"
              target="_blank"
              class="text-primary hover:underline break-all"
            >
              {{ module.attendance_link }}
            </a>
            <span v-else class="text-muted">No attendance link</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 text-sm min-w-0">
            <div class="flex items-center gap-2">
              <UIcon name="i-ph-file-text-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="text-muted font-medium sm:w-36 sm:shrink-0">Assignment Link</span>
            </div>
            <a
              v-if="module.assignment_link"
              :href="module.assignment_link"
              target="_blank"
              class="text-primary hover:underline break-all"
            >
              {{ module.assignment_link }}
            </a>
            <span v-else class="text-muted">No assignment link</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 text-sm min-w-0">
            <div class="flex items-center gap-2">
              <UIcon name="i-ph-paperclip-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="text-muted font-medium sm:w-36 sm:shrink-0">Attachments</span>
            </div>
            <div class="flex flex-col gap-2">
              <AdminCohortAttachmentItem
                v-for="att in module.attachments"
                :key="att.id"
                :href="att.file_url ?? undefined"
                :name="att.label || att.url || att.file_path || ''"
                :color="getAttachmentStyle(att).color"
                :icon="getAttachmentStyle(att).icon"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-default p-2.5">
        <UButton
          label="Delete"
          icon="i-ph-trash-simple-bold"
          color="error"
          variant="ghost"
          size="sm"
          @click.stop="emit('delete', module.id)"
        />
        <UButton
          label="Edit Module"
          icon="i-ph-pencil-simple-bold"
          color="primary"
          variant="outline"
          size="sm"
          @click.stop="emit('edit', module)"
        />
      </div>
    </template>
  </div>
</template>
