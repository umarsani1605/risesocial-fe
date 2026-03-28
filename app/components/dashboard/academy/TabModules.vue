<script setup lang="ts">
import type { CohortModule, CohortModuleAttachment, ModuleSessionStatus } from '@/types'

const props = defineProps<{
  modules: CohortModule[]
}>()

const visibleModules = computed(() =>
  props.modules.filter((m) => m.session_status !== 'hidden' && m.is_published)
)

const openModules = ref<Set<number>>(new Set(visibleModules.value.slice(0, 3).map((m) => m.id)))

function toggleModule(id: number) {
  if (openModules.value.has(id)) {
    openModules.value.delete(id)
  } else {
    openModules.value.add(id)
  }
}

function isModuleOpen(id: number) {
  return openModules.value.has(id)
}

const sessionStatusConfig: Record<
  ModuleSessionStatus,
  {
    label: string
    color: 'success' | 'error' | 'warning'
    variant: 'soft' | 'solid'
    dot?: boolean
  }
> = {
  completed: { label: 'Completed', color: 'success', variant: 'soft' },
  live: { label: 'Live Now', color: 'error', variant: 'soft', dot: true },
  upcoming: { label: 'Up Coming', color: 'warning', variant: 'soft' },
  hidden: { label: 'Hidden', color: 'warning', variant: 'soft' }
}

function formatSessionTime(iso: string) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  })
  return `${date}, ${time}`
}

function getAttachmentStyle(att: CohortModuleAttachment): { bg: string; icon: string } {
  if (att.type === 'external_link') return { bg: 'bg-blue-500',   icon: 'i-ph-link-bold' }
  if (att.type === 'embed_video')   return { bg: 'bg-red-500',    icon: 'i-ph-video-bold' }

  const ext = (att.file_mime?.split('/').pop() ?? att.file_path?.split('.').pop() ?? '').toLowerCase()
  const byExt: Record<string, { bg: string; icon: string }> = {
    pdf:   { bg: 'bg-red-500',    icon: 'i-ph-file-text-bold' },
    msword: { bg: 'bg-blue-500',  icon: 'i-ph-file-text-bold' },
    doc:   { bg: 'bg-blue-500',   icon: 'i-ph-file-text-bold' },
    docx:  { bg: 'bg-blue-500',   icon: 'i-ph-file-text-bold' },
    'vnd.openxmlformats-officedocument.wordprocessingml.document': { bg: 'bg-blue-500', icon: 'i-ph-file-text-bold' },
    ppt:   { bg: 'bg-orange-500', icon: 'i-ph-file-bold' },
    pptx:  { bg: 'bg-orange-500', icon: 'i-ph-file-bold' },
    'vnd.openxmlformats-officedocument.presentationml.presentation': { bg: 'bg-orange-500', icon: 'i-ph-file-bold' },
    xls:   { bg: 'bg-green-600',  icon: 'i-ph-table-bold' },
    xlsx:  { bg: 'bg-green-600',  icon: 'i-ph-table-bold' },
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet': { bg: 'bg-green-600', icon: 'i-ph-table-bold' },
    jpeg:  { bg: 'bg-purple-500', icon: 'i-ph-image-bold' },
    jpg:   { bg: 'bg-purple-500', icon: 'i-ph-image-bold' },
    png:   { bg: 'bg-purple-500', icon: 'i-ph-image-bold' },
    webp:  { bg: 'bg-purple-500', icon: 'i-ph-image-bold' },
  }
  return byExt[ext] ?? { bg: 'bg-gray-500', icon: 'i-ph-file-bold' }
}
</script>

<template>
  <div class="space-y-3 pt-2 min-h-[600px]">
    <div
      v-for="module in visibleModules"
      :key="module.id"
      class="border border-default rounded-lg overflow-hidden"
    >
      <button
        type="button"
        class="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-elevated/50 transition-colors"
        @click="toggleModule(module.id)"
      >
        <span
          class="flex items-center justify-center size-7 rounded-full bg-primary text-white text-sm font-bold shrink-0"
        >
          {{ module.order }}
        </span>
        <div class="flex flex-1 items-center gap-2 min-w-0 flex-wrap">
          <span class="font-medium text-base leading-snug">{{ module.title }}</span>
          <UBadge
            v-if="module.session_status"
            :label="sessionStatusConfig[module.session_status].label"
            :color="sessionStatusConfig[module.session_status].color"
            :variant="sessionStatusConfig[module.session_status].variant"
          >
            <template v-if="sessionStatusConfig[module.session_status].dot" #leading>
              <span class="size-1.5 rounded-full bg-red-500 animate-pulse inline-block mr-1" />
            </template>
          </UBadge>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span v-if="module.session_timestamp" class="hidden sm:block text-sm text-muted">
            {{ formatSessionTime(module.session_timestamp) }}
          </span>
          <UIcon
            :name="isModuleOpen(module.id) ? 'i-ph-caret-up-bold' : 'i-ph-caret-down-bold'"
            class="size-4 text-muted"
          />
        </div>
      </button>

      <template v-if="isModuleOpen(module.id)">
        <div class="border-t border-default px-4 py-4 space-y-4">
          <p v-if="module.description" class="text-sm text-muted leading-relaxed max-w-4xl">
            {{ module.description }}
          </p>

          <div v-if="module.attachments?.length" class="flex flex-wrap gap-2">
            <a
              v-for="attachment in module.attachments"
              :key="attachment.id"
              :href="attachment.type === 'file' ? attachment.file_url : attachment.url"
              target="_blank"
              class="flex items-center gap-2 border border-default rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              <div
                class="flex items-center justify-center size-12 text-white shrink-0"
                :class="getAttachmentStyle(attachment).bg"
              >
                <UIcon :name="getAttachmentStyle(attachment).icon" class="size-4" />
              </div>
              <span class="text-sm pr-3">{{ attachment.label }}</span>
            </a>
          </div>
        </div>

        <div
          v-if="module.session_status === 'completed' || module.session_status === 'live'"
          class="flex justify-end gap-2 border-t border-default p-2.5"
        >
          <template v-if="module.session_status === 'completed'">
            <UButton
              v-if="module.assignment_link"
              size="md"
              variant="outline"
              color="primary"
              leading-icon="i-ph-clipboard-text-bold"
              :to="module.assignment_link"
              target="_blank"
            >
              Submit Assignment
            </UButton>
            <UButton
              v-if="module.attendance_link"
              size="md"
              variant="outline"
              color="primary"
              leading-icon="i-ph-user-check-bold"
              :to="module.attendance_link"
              target="_blank"
            >
              Submit Attendance
            </UButton>
          </template>

          <template v-else-if="module.session_status === 'live'">
            <UButton
              v-if="module.meeting_link"
              size="md"
              color="primary"
              leading-icon="i-ph-video-bold"
              :to="module.meeting_link"
              target="_blank"
            >
              Join Class
            </UButton>
          </template>
        </div>
      </template>
    </div>

    <div v-if="visibleModules.length === 0" class="text-center py-12 text-muted">
      <UIcon name="i-ph-book-open-bold" class="size-10 mx-auto mb-3" />
      <p class="text-sm">No modules available yet</p>
    </div>
  </div>
</template>
