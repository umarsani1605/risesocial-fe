<script setup lang="ts">
defineProps<{
  module: AdminCohortModule
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
  edit: [module: AdminCohortModule]
  delete: [moduleId: number]
}>()

const now = useNow({ interval: 60_000 })

function getStatus(module: AdminCohortModule) {
  return computeModuleStatus(module, now.value)
}
</script>

<template>
  <SharedAccordionItem :is-open="isOpen" @toggle="emit('toggle')">
    <template #header>
      <span
        class="flex items-center justify-center size-7 rounded-full border border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-200 transition-colors text-sm font-bold shrink-0"
        :class="getStatus(module) === 'completed' ? 'bg-primary! text-white! border-transparent!' : ''"
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
    </template>

    <template #body>
      <p v-if="module.description" class="text-sm text-default leading-relaxed mb-6">
        {{ module.description }}
      </p>
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 text-sm min-w-0">
          <div class="flex items-center gap-2">
            <UIcon name="i-ph-calendar-bold" class="size-4 text-muted mt-0.5 shrink-0" />
            <span class="text-muted font-medium sm:w-36 sm:shrink-0">Session Date</span>
          </div>
          <span v-if="module.session_start_time">
            {{ formatDatetimeLong(module.session_start_time) }}
            <template v-if="module.session_end_time">
              – {{ formatTime(module.session_end_time) }} WIB
            </template>
          </span>
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
              :background="getAttachmentStyle(att).background"
              :foreground="getAttachmentStyle(att).foreground"
              :border="getAttachmentStyle(att).border"
              :icon="getAttachmentStyle(att).icon"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Delete"
          icon="i-ph-trash-simple-bold"
          color="error"
          variant="light"
          @click.stop="emit('delete', module.id)"
        />
        <UButton
          label="Edit Module"
          icon="i-ph-pencil-simple-bold"
          variant="light"
          @click.stop="emit('edit', module)"
        />
      </div>
    </template>
  </SharedAccordionItem>
</template>
