<script setup lang="ts">
export interface CohortAttachment {
  id: number
  label: string
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'url' | 'file'
  url?: string
}

export interface CohortModule {
  id: number
  order: number
  title: string
  description?: string
  date?: string | null
  meetingLink?: string | null
  attendanceLink?: string | null
  assignmentLink?: string | null
  attachments: CohortAttachment[]
}

const props = defineProps<{
  modules: CohortModule[]
}>()

const emit = defineEmits<{
  addModule: []
  editModule: [module: CohortModule]
  deleteModule: [moduleId: number]
}>()

// Same pattern as DashboardAcademyTabModules – open first 1 by default
const openModules = ref<Set<number>>(
  new Set(props.modules.slice(0, 1).map(m => m.id))
)

function toggleModule(id: number) {
  if (openModules.value.has(id)) openModules.value.delete(id)
  else openModules.value.add(id)
}

function isOpen(id: number) {
  return openModules.value.has(id)
}

const attachmentStyle: Record<CohortAttachment['type'], { bg: string; label: string; icon: string }> = {
  pdf:  { bg: '#ef4444', label: 'PDF',  icon: 'i-lucide-file-text' },
  docx: { bg: '#3b82f6', label: 'DOCX', icon: 'i-lucide-file-text' },
  pptx: { bg: '#f97316', label: 'PPTX', icon: 'i-lucide-presentation' },
  xlsx: { bg: '#22c55e', label: 'XLSX', icon: 'i-lucide-table-2' },
  url:  { bg: '#60a5fa', label: 'LINK', icon: 'i-lucide-link' },
  file: { bg: '#9ca3af', label: 'FILE', icon: 'i-lucide-paperclip' },
}
</script>

<template>
  <div class="space-y-3 pt-2 min-h-[400px]">
    <!-- Add Module button -->
    <div class="flex justify-end mb-4">
      <UButton
        label="Add Module"
        icon="i-lucide-plus"
        color="primary"
        size="sm"
        @click="emit('addModule')"
      />
    </div>

    <div
      v-if="modules.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted text-sm"
    >
      <UIcon name="i-lucide-book-open" class="size-10 mb-3 opacity-30" />
      Belum ada module. Klik "Add Module" untuk mulai.
    </div>

    <!-- Accordion list – pola identik dengan DashboardAcademyTabModules -->
    <div
      v-for="module in modules"
      :key="module.id"
      class="border border-default rounded-lg overflow-hidden"
    >
      <!-- Header row -->
      <button
        type="button"
        class="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-elevated/50 transition-colors"
        @click="toggleModule(module.id)"
      >
        <!-- Numbered circle – admin: outlined (border only), student: filled -->
        <span
          class="flex items-center justify-center size-7 rounded-full border border-primary text-primary text-sm font-bold shrink-0"
        >
          {{ module.order }}
        </span>

        <span class="flex-1 font-medium text-sm leading-snug truncate">
          {{ module.title }}
        </span>

        <div class="flex items-center gap-3 shrink-0">
          <span v-if="module.date" class="hidden sm:block text-xs text-muted">
            {{ module.date }}
          </span>
          <UIcon
            :name="isOpen(module.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
            class="size-4 text-muted"
          />
        </div>
      </button>

      <!-- Expanded body -->
      <template v-if="isOpen(module.id)">
        <div class="border-t border-default px-4 py-4 space-y-4">
          <!-- Description -->
          <p v-if="module.description" class="text-sm text-default leading-relaxed">
            {{ module.description }}
          </p>

          <!-- Links -->
          <div class="space-y-2">
            <div v-if="module.date" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-calendar" class="size-4 text-muted mt-0.5 shrink-0" />
              <span>{{ module.date }}</span>
            </div>
            <div v-if="module.meetingLink" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-video" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="w-28 shrink-0 text-muted font-medium">Meeting Link</span>
              <a :href="module.meetingLink" target="_blank" class="text-primary hover:underline break-all">
                {{ module.meetingLink }}
              </a>
            </div>
            <div v-if="module.attendanceLink" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-user-check" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="w-28 shrink-0 text-muted font-medium">Attendance Link</span>
              <a :href="module.attendanceLink" target="_blank" class="text-primary hover:underline break-all">
                {{ module.attendanceLink }}
              </a>
            </div>
            <div v-if="module.assignmentLink" class="flex items-start gap-3 text-sm">
              <UIcon name="i-lucide-file-text" class="size-4 text-muted mt-0.5 shrink-0" />
              <span class="w-28 shrink-0 text-muted font-medium">Assignment Link</span>
              <a :href="module.assignmentLink" target="_blank" class="text-primary hover:underline break-all">
                {{ module.assignmentLink }}
              </a>
            </div>
          </div>

          <!-- Attachments – pola identik dengan student dashboard -->
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
                  :style="{ backgroundColor: attachmentStyle[att.type]?.bg ?? '#9ca3af' }"
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

        <!-- Admin action footer – delete + edit -->
        <div class="flex justify-end gap-2 border-t border-default p-2.5">
          <UButton
            label="Delete"
            icon="i-lucide-trash-2"
            size="sm"
            color="neutral"
            variant="outline"
            @click.stop="emit('deleteModule', module.id)"
          />
          <UButton
            label="Edit Module"
            icon="i-lucide-pencil"
            size="sm"
            color="primary"
            variant="outline"
            @click.stop="emit('editModule', module)"
          />
        </div>
      </template>
    </div>
  </div>
</template>
