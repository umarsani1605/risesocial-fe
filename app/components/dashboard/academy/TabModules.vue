<script setup lang="ts">
import { useNow } from '@vueuse/core'
import type { CohortModule } from '@/types'
import { getOpenModuleIdsForHash, isModuleHash } from '@/utils/cohort'

const props = defineProps<{
  modules: CohortModule[]
  targetModuleHash?: string
}>()

const now = useNow({ interval: 60_000 })

function getStatus(module: CohortModule) {
  return computeModuleStatus(module, now.value)
}

function canJoinClass(module: CohortModule) {
  return ['pre_live', 'live', 'closing_soon'].includes(getStatus(module))
}

function canOpenPostSessionLink(module: CohortModule) {
  return ['closing_soon', 'completed'].includes(getStatus(module))
}

function isLiveNow(module: CohortModule) {
  return ['live', 'closing_soon'].includes(getStatus(module))
}

const visibleModules = computed(() => props.modules.filter((m) => m.is_published))

const openModules = ref<Set<number>>(new Set())

watch(
  [() => props.targetModuleHash, visibleModules],
  async ([hash, modules]) => {
    if (!hash || !isModuleHash(hash)) return

    const targetOpenModules = getOpenModuleIdsForHash(hash, modules)
    if (targetOpenModules.size === 0) return

    openModules.value = targetOpenModules

    await nextTick()
    if (import.meta.client) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
    }
  },
  { immediate: true }
)

function toggleModule(id: number) {
  if (openModules.value.has(id)) {
    openModules.value.delete(id)
  } else {
    openModules.value.add(id)
  }
}

const isAnyOpen = computed(() => openModules.value.size > 0)
const isAllOpen = computed(
  () => visibleModules.value.length > 0 && openModules.value.size === visibleModules.value.length
)

function toggleAll() {
  if (isAllOpen.value) {
    openModules.value = new Set()
  } else {
    openModules.value = new Set(visibleModules.value.map((m) => m.id))
  }
}

defineExpose({
  isAnyOpen: () => isAnyOpen.value,
  isAllOpen: () => isAllOpen.value,
  toggleAll
})

function getAttachmentHref(attachment: {
  type: string
  file_url: string | null
  url: string | null
}) {
  if (attachment.type === 'file') return attachment.file_url ?? undefined
  const raw = attachment.url?.trim()
  if (!raw) return undefined
  if (/^https?:\/\//i.test(raw) || raw.startsWith('//') || raw.startsWith('mailto:')) return raw
  return `https://${raw}`
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
            ['live', 'closing_soon', 'completed'].includes(getStatus(module))
              ? 'bg-primary! text-white! border-transparent!'
              : ''
          "
        >
          {{ module.order }}
        </span>
        <div class="flex flex-1 items-center gap-2 min-w-0 flex-wrap">
          <span class="font-medium text-base leading-snug">{{ module.title }}</span>
          <span
            v-if="isLiveNow(module)"
            class="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] uppercase font-semibold text-red-500 shrink-0"
          >
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full rounded-full bg-red-400 opacity-75 motion-safe:animate-ping motion-safe:[animation-duration:1.25s] motion-reduce:animate-none"
              />
              <span class="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            Live Now
          </span>
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
              :href="getAttachmentHref(attachment)"
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
        <div class="flex flex-wrap gap-2">
          <UButton
            v-if="module.meeting_link"
            variant="dashboard"
            leading-icon="i-ph-video-conference"
            :to="canJoinClass(module) ? module.meeting_link : undefined"
            :disabled="!canJoinClass(module)"
            target="_blank"
            class="whitespace-nowrap"
          >
            Join Class
          </UButton>
          <UButton
            v-if="module.attendance_link"
            variant="light"
            leading-icon="i-ph-note-pencil"
            :to="module.attendance_link"
            :disabled="!canOpenPostSessionLink(module)"
            target="_blank"
            class="whitespace-nowrap"
          >
            Attendance
          </UButton>
          <UButton
            v-if="module.assignment_link"
            variant="light"
            leading-icon="i-ph-clipboard-text"
            :to="module.assignment_link"
            :disabled="!canOpenPostSessionLink(module)"
            target="_blank"
            class="whitespace-nowrap"
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
