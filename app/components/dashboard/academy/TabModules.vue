<script setup lang="ts">
import { useNow } from '@vueuse/core'
import type { CohortModule } from '@/types'

const props = defineProps<{
  modules: CohortModule[]
}>()

const now = useNow({ interval: 60_000 })

function getStatus(module: CohortModule) {
  return computeModuleStatus(module, now.value)
}

const visibleModules = computed(() => props.modules.filter((m) => m.is_published))

const openModules = ref<Set<number>>(new Set())

function toggleModule(id: number) {
  if (openModules.value.has(id)) {
    openModules.value.delete(id)
  } else {
    openModules.value.add(id)
  }
}

const isAnyOpen = computed(() => openModules.value.size > 0)

function toggleAll() {
  if (isAnyOpen.value) {
    openModules.value = new Set()
  } else {
    openModules.value = new Set(visibleModules.value.map((m) => m.id))
  }
}

defineExpose({ isAnyOpen, toggleAll })

const sessionStatusConfig: Record<
  'upcoming' | 'live' | 'completed',
  {
    label: string
    color: 'success' | 'error' | 'warning'
    variant: 'soft' | 'solid'
    dot?: boolean
  }
> = {
  completed: { label: 'Completed', color: 'success', variant: 'soft' },
  live: { label: 'Live Now', color: 'error', variant: 'soft', dot: true },
  upcoming: { label: 'Up Coming', color: 'warning', variant: 'soft' }
}

function formatSessionTime(module: CohortModule) {
  if (!module.session_start_time) return null
  const date = formatDateLong(module.session_start_time)
  const start = formatTime(module.session_start_time)
  const end = module.session_end_time ? ` – ${formatTime(module.session_end_time)}` : ''
  return `${date}, ${start}${end} WIB`
}
</script>

<template>
  <div class="space-y-6 pt-2 min-h-[600px]">
    <SharedAccordionItem
      v-for="module in visibleModules"
      :id="`module-${module.order}`"
      :key="module.id"
      :is-open="openModules.has(module.id)"
      @toggle="toggleModule(module.id)"
    >
      <template #header>
        <span
          class="flex items-center justify-center size-7 rounded-full border border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-200 transition-colors text-sm font-bold shrink-0"
          :class="
            getStatus(module) === 'completed' ? 'bg-primary! text-white! border-transparent!' : ''
          "
        >
          {{ module.order }}
        </span>
        <div class="flex flex-1 items-center gap-2 min-w-0 flex-wrap">
          <span class="font-medium text-base leading-snug">{{ module.title }}</span>
        </div>
        <span v-if="module.session_start_time" class="hidden sm:block text-sm text-muted shrink-0">
          {{ formatSessionTime(module) }}
        </span>
      </template>

      <template #body>
        <div class="max-w-4xl space-y-4">
          <p v-if="module.description" class="text-sm text-muted leading-relaxed max-w-4xl">
            {{ module.description }}
          </p>
          <div v-if="module.attachments?.length" class="flex flex-wrap gap-2">
            <a
              v-for="attachment in module.attachments"
              :key="attachment.id"
              :href="attachment.type === 'file' ? attachment.file_url : attachment.url"
              target="_blank"
              class="max-w-72 flex items-center gap-2 border border-default rounded-lg overflow-hidden hover:border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div
                class="flex items-center justify-center size-12 min-w-12 rounded-l-lg bg-white border-r border-slate-100"
                :class="[getAttachmentStyle(attachment).foreground]"
              >
                <UIcon :name="getAttachmentStyle(attachment).icon" class="size-4" />
              </div>
              <span class="truncate text-sm pr-3">{{ attachment.label }}</span>
            </a>
          </div>
        </div>
      </template>

      <template
        v-if="module.meeting_link || module.assignment_link || module.attendance_link"
        #footer
      >
        <div
          v-if="getStatus(module) === 'completed'"
          class="flex items-center gap-1.5 text-sm text-muted px-1"
        >
          <UIcon name="i-ph-check-circle-fill" class="size-4 text-success" />
          Session Ended
        </div>
        <div v-else class="flex gap-2">
          <UButton
            v-if="module.meeting_link"
            variant="dashboard"
            leading-icon="i-ph-video-conference"
            :to="getStatus(module) === 'live' ? module.meeting_link : undefined"
            :disabled="getStatus(module) !== 'live'"
            target="_blank"
          >
            Join Class
          </UButton>
          <UButton
            v-if="module.attendance_link"
            variant="light"
            leading-icon="i-ph-note-pencil"
            :disabled="getStatus(module) !== 'completed'"
            target="_blank"
          >
            Attendance
          </UButton>
          <UButton
            v-if="module.assignment_link"
            variant="light"
            leading-icon="i-ph-clipboard-text"
            :disabled="getStatus(module) !== 'completed'"
            target="_blank"
          >
            Assignment
          </UButton>
        </div>
      </template>
    </SharedAccordionItem>

    <div v-if="visibleModules.length === 0" class="text-center py-12 text-muted">
      <UIcon name="i-ph-book-open-bold" class="size-10 mx-auto mb-3" />
      <p class="text-sm">No modules available yet</p>
    </div>
  </div>
</template>
