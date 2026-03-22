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

const openModules = ref<Set<number>>(
  new Set(props.modules.slice(0, 1).map(m => m.id))
)

// Keep openModules in sync when modules are refreshed from parent
watch(() => props.modules, (newModules) => {
  if (openModules.value.size === 0 && newModules.length > 0) {
    openModules.value = new Set(newModules.slice(0, 1).map(m => m.id))
  }
})

function toggleModule(id: number) {
  if (openModules.value.has(id)) openModules.value.delete(id)
  else openModules.value.add(id)
}

function isOpen(id: number) {
  return openModules.value.has(id)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(iso))
}

const attachmentStyle: Record<AdminCohortAttachment['type'], { bg: string; icon: string }> = {
  pdf:  { bg: 'bg-red-500',    icon: 'i-lucide-file-text' },
  docx: { bg: 'bg-blue-500',   icon: 'i-lucide-file-text' },
  pptx: { bg: 'bg-orange-500', icon: 'i-lucide-presentation' },
  xlsx: { bg: 'bg-green-500',  icon: 'i-lucide-table-2' },
  url:  { bg: 'bg-blue-400',   icon: 'i-lucide-link' },
  file: { bg: 'bg-gray-400',   icon: 'i-lucide-paperclip' },
}
</script>

<template>
  <div class="space-y-3 pt-2 min-h-[400px]">
    <div class="flex justify-end mb-4">
      <UButton
        label="Add Module"
        icon="i-lucide-plus"
        color="primary"
        size="sm"
        @click="emit('add-module')"
      />
    </div>

    <div
      v-if="modules.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted text-sm"
    >
      <UIcon name="i-lucide-book-open" class="size-10 mb-3 opacity-30" />
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

        <span class="flex-1 min-w-0 font-medium text-sm leading-snug truncate">
          {{ module.title }}
        </span>

        <div class="flex items-center gap-3 shrink-0">
          <span v-if="module.session_timestamp" class="hidden sm:block text-xs text-muted">
            {{ formatDate(module.session_timestamp) }}
          </span>
          <UIcon
            :name="isOpen(module.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
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
              <UIcon name="i-lucide-calendar" class="size-4 text-muted mt-0.5 shrink-0" />
              <span>{{ formatDate(module.session_timestamp) }}</span>
            </div>
            <div v-if="module.meeting_link" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-video" class="size-4 text-muted mt-0.5 shrink-0" />
              <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 min-w-0">
                <span class="text-muted font-medium sm:w-28 sm:shrink-0">Meeting Link</span>
                <a :href="module.meeting_link" target="_blank" class="text-primary hover:underline break-all">
                  {{ module.meeting_link }}
                </a>
              </div>
            </div>
            <div v-if="module.attendance_link" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-user-check" class="size-4 text-muted mt-0.5 shrink-0" />
              <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 min-w-0">
                <span class="text-muted font-medium sm:w-28 sm:shrink-0">Attendance Link</span>
                <a :href="module.attendance_link" target="_blank" class="text-primary hover:underline break-all">
                  {{ module.attendance_link }}
                </a>
              </div>
            </div>
            <div v-if="module.assignment_link" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-file-text" class="size-4 text-muted mt-0.5 shrink-0" />
              <div class="flex flex-col sm:flex-row items-start gap-1 sm:gap-3 min-w-0">
                <span class="text-muted font-medium sm:w-28 sm:shrink-0">Assignment Link</span>
                <a :href="module.assignment_link" target="_blank" class="text-primary hover:underline break-all">
                  {{ module.assignment_link }}
                </a>
              </div>
            </div>
          </div>

          <div v-if="module.attachments.length">
            <p class="text-xs text-muted mb-2 flex items-center gap-1.5">
              <UIcon name="i-lucide-paperclip" class="size-3.5" />
              Attachments
            </p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="att in module.attachments"
                :key="att.id"
                :href="att.url ?? '#'"
                target="_blank"
                class="flex items-center border border-default rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div
                  class="flex items-center justify-center size-12 text-white shrink-0"
                  :class="attachmentStyle[att.type]?.bg ?? 'bg-gray-400'"
                >
                  <span v-if="att.type === 'pdf'" class="text-xs font-bold leading-none">PDF</span>
                  <span v-else-if="att.type === 'docx'" class="text-xs font-bold leading-none">DOCX</span>
                  <span v-else-if="att.type === 'pptx'" class="text-xs font-bold leading-none">PPTX</span>
                  <UIcon
                    v-else
                    :name="attachmentStyle[att.type]?.icon ?? 'i-lucide-paperclip'"
                    class="size-4"
                  />
                </div>
                <span class="text-sm pr-3 pl-2 max-w-32 truncate">{{ att.label }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-default p-2.5">
          <UButton
            label="Delete"
            icon="i-lucide-trash-2"
            size="sm"
            color="neutral"
            variant="outline"
            @click.stop="emit('delete-module', module.id)"
          />
          <UButton
            label="Edit Module"
            icon="i-lucide-pencil"
            size="sm"
            color="primary"
            variant="outline"
            @click.stop="emit('edit-module', module)"
          />
        </div>
      </template>
    </div>
  </div>
</template>
