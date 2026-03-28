<script setup lang="ts">
import type { AdminCohortModule, AdminCohortAttachment } from '~/types/cohort'

const props = defineProps<{
  modules: AdminCohortModule[]
}>()

const emit = defineEmits<{
  'add-module': []
  'edit-module': [module: AdminCohortModule]
  'delete-module': [moduleId: number]
}>()

const openModules = ref<Set<number>>(new Set(props.modules.slice(0, 1).map((m) => m.id)))

// Keep openModules in sync when modules are refreshed from parent
watch(
  () => props.modules,
  (newModules) => {
    if (openModules.value.size === 0 && newModules.length > 0) {
      openModules.value = new Set(newModules.slice(0, 1).map((m) => m.id))
    }
  }
)

function toggleModule(id: number) {
  if (openModules.value.has(id)) openModules.value.delete(id)
  else openModules.value.add(id)
}

function isOpen(id: number) {
  return openModules.value.has(id)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso))
}

function getAttachmentStyle(att: AdminCohortAttachment): { bg: string; icon: string } {
  if (att.type === 'external_link') return { bg: 'bg-blue-500', icon: 'i-ph-link-bold' }
  if (att.type === 'embed_video') return { bg: 'bg-red-500', icon: 'i-ph-video-bold' }

  const ext = (
    att.file_mime?.split('/').pop() ??
    att.file_path?.split('.').pop() ??
    ''
  ).toLowerCase()
  const byExt: Record<string, { bg: string; icon: string }> = {
    pdf: { bg: 'bg-red-500', icon: 'i-ph-file-text-bold' },
    msword: { bg: 'bg-blue-500', icon: 'i-ph-file-text-bold' },
    doc: { bg: 'bg-blue-500', icon: 'i-ph-file-text-bold' },
    docx: { bg: 'bg-blue-500', icon: 'i-ph-file-text-bold' },
    'vnd.openxmlformats-officedocument.wordprocessingml.document': {
      bg: 'bg-blue-500',
      icon: 'i-ph-file-text-bold'
    },
    ppt: { bg: 'bg-orange-500', icon: 'i-ph-file-bold' },
    pptx: { bg: 'bg-orange-500', icon: 'i-ph-file-bold' },
    'vnd.openxmlformats-officedocument.presentationml.presentation': {
      bg: 'bg-orange-500',
      icon: 'i-ph-file-bold'
    },
    xls: { bg: 'bg-green-600', icon: 'i-ph-table-bold' },
    xlsx: { bg: 'bg-green-600', icon: 'i-ph-table-bold' },
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      bg: 'bg-green-600',
      icon: 'i-ph-table-bold'
    },
    jpeg: { bg: 'bg-purple-500', icon: 'i-ph-image-bold' },
    jpg: { bg: 'bg-purple-500', icon: 'i-ph-image-bold' },
    png: { bg: 'bg-purple-500', icon: 'i-ph-image-bold' },
    webp: { bg: 'bg-purple-500', icon: 'i-ph-image-bold' }
  }
  return byExt[ext] ?? { bg: 'bg-gray-500', icon: 'i-ph-file-bold' }
}
</script>

<template>
  <div class="space-y-3 pt-2 min-h-[400px]">
    <div class="flex justify-end mb-4">
      <UButton
        label="Add Module"
        icon="i-ph-plus-bold"
        color="primary"
        @click="emit('add-module')"
      />
    </div>

    <div
      v-if="modules.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted text-sm"
    >
      <UIcon name="i-ph-book-open-bold" class="size-10 mb-3 opacity-30" />
      No modules yet. Click "Add Module" to get started.
    </div>

    <div
      v-for="module in modules"
      :key="module.id"
      class="border border-default rounded-lg overflow-hidden"
    >
      <button
        type="button"
        class="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-elevated/50 transition-colors"
        @click="toggleModule(module.id)"
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
          <span v-if="module.session_timestamp" class="hidden sm:block text-xs text-muted">
            {{ formatDate(module.session_timestamp) }}
          </span>
          <UIcon
            :name="isOpen(module.id) ? 'i-ph-caret-down-bold' : 'i-ph-caret-right-bold'"
            class="size-4 text-muted"
          />
        </div>
      </button>

      <template v-if="isOpen(module.id)">
        <div class="border-t border-default px-4 py-4 space-y-4">
          <p v-if="module.description" class="text-sm text-default leading-relaxed">
            {{ module.description }}
          </p>

          <div class="space-y-2">
            <div v-if="module.session_timestamp" class="flex items-start gap-3 text-sm">
              <UIcon name="i-ph-calendar-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <span>{{ formatDate(module.session_timestamp) }}</span>
            </div>
            <div v-if="module.meeting_link" class="flex items-start gap-3 text-sm">
              <UIcon name="i-ph-video-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 min-w-0">
                <span class="text-muted font-medium sm:w-28 sm:shrink-0">Meeting Link</span>
                <a
                  :href="module.meeting_link"
                  target="_blank"
                  class="text-primary hover:underline break-all"
                >
                  {{ module.meeting_link }}
                </a>
              </div>
            </div>
            <div v-if="module.attendance_link" class="flex items-start gap-3 text-sm">
              <UIcon name="i-ph-user-check-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 min-w-0">
                <span class="text-muted font-medium sm:w-28 sm:shrink-0">Attendance Link</span>
                <a
                  :href="module.attendance_link"
                  target="_blank"
                  class="text-primary hover:underline break-all"
                >
                  {{ module.attendance_link }}
                </a>
              </div>
            </div>
            <div v-if="module.assignment_link" class="flex items-start gap-3 text-sm">
              <UIcon name="i-ph-file-text-bold" class="size-4 text-muted mt-0.5 shrink-0" />
              <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 min-w-0">
                <span class="text-muted font-medium sm:w-28 sm:shrink-0">Assignment Link</span>
                <a
                  :href="module.assignment_link"
                  target="_blank"
                  class="text-primary hover:underline break-all"
                >
                  {{ module.assignment_link }}
                </a>
              </div>
            </div>
          </div>

          <div v-if="module.attachments.length">
            <p class="text-xs text-muted mb-2 flex items-center gap-1.5">
              <UIcon name="i-ph-paperclip-bold" class="size-3.5" />
              Attachments
            </p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="att in module.attachments"
                :key="att.id"
                :href="att.file_url ?? att.url ?? '#'"
                target="_blank"
                class="flex items-center border border-default rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div
                  class="flex items-center justify-center size-12 text-white shrink-0"
                  :class="getAttachmentStyle(att).bg"
                >
                  <UIcon :name="getAttachmentStyle(att).icon" class="size-4" />
                </div>
                <span class="text-sm pr-3 pl-2 max-w-32 truncate">{{
                  att.label || att.url || att.file_path
                }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-default p-2.5">
          <UButton
            label="Delete"
            icon="i-ph-trash-simple-bold"
            color="neutral"
            variant="outline"
            @click.stop="emit('delete-module', module.id)"
          />
          <UButton
            label="Edit Module"
            icon="i-ph-pencil-simple-bold"
            color="primary"
            variant="outline"
            @click.stop="emit('edit-module', module)"
          />
        </div>
      </template>
    </div>
  </div>
</template>
