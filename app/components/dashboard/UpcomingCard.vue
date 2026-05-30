<script setup lang="ts">
import { useNow } from '@vueuse/core'
import type { UpcomingSession } from '@/types'

const props = defineProps<{ session: UpcomingSession }>()

const now = useNow({ interval: 60_000 })

const relevantIso = computed(() =>
  props.session.type === 'session'
    ? props.session.session_start_time
    : props.session.assignment_deadline
)

const isLiveNow = computed(() => {
  if (props.session.type !== 'session' || !props.session.session_start_time) return false

  const start = new Date(props.session.session_start_time)
  const end = props.session.session_end_time
    ? new Date(props.session.session_end_time)
    : new Date(start.getTime() + 120 * 60 * 1000)

  return now.value >= start && now.value <= end
})

const isToday = computed(() => {
  if (!relevantIso.value) return false

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return formatter.format(new Date(relevantIso.value)) === formatter.format(now.value)
})

const isAssignmentDeadlineToday = computed(
  () => props.session.type === 'assignment' && isToday.value
)

const displayMonth = computed(() => {
  if (!relevantIso.value) return '???'
  return new Date(relevantIso.value)
    .toLocaleDateString('en-US', { month: 'short', timeZone: 'Asia/Jakarta' })
    .toUpperCase()
})

const displayDate = computed(() => {
  if (!relevantIso.value) return '?'
  return new Date(relevantIso.value).toLocaleDateString('en-US', {
    day: '2-digit',
    timeZone: 'Asia/Jakarta'
  })
})
</script>

<template>
  <NuxtLink
    :to="session.link"
    class="flex gap-4 group items-start p-2 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer"
  >
    <div
      class="flex flex-col items-center justify-center mt-2 size-18 rounded-xl"
      :class="isToday ? 'border-deep-teal-850 bg-deep-teal-700' : 'border border-default bg-white'"
    >
      <span
        class="text-[10px] uppercase tracking-widest leading-none mb-1"
        :class="isToday ? 'text-white/70 font-black' : 'text-slate-500 font-bold'"
      >
        {{ displayMonth }}
      </span>
      <span
        class="text-xl leading-none"
        :class="isToday ? 'text-white font-black' : 'text-slate-800 font-extrabold'"
      >
        {{ displayDate }}
      </span>
    </div>

    <div class="flex-1 pt-0.5">
      <div class="flex items-center gap-1.5 mb-1">
        <span
          v-if="isLiveNow"
          class="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-red-500"
        >
          <span class="relative flex size-2">
            <span
              class="absolute inline-flex size-full rounded-full bg-red-400 opacity-75 motion-safe:animate-ping motion-safe:[animation-duration:1.5s] motion-reduce:animate-none"
            />
            <span class="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          Live Now
        </span>
        <span
          v-else-if="isAssignmentDeadlineToday"
          class="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-red-500"
        >
          Deadline Today
        </span>
        <span v-else-if="session.type === 'session'" class="text-[10px] uppercase text-dimmed">
          Live Session
        </span>
        <span v-else class="text-[10px] uppercase text-dimmed"> Assignment </span>
      </div>
      <h4
        class="font-bold text-base text-slate-800 leading-snug mb-1.5 line-clamp-2"
        :title="session.title"
      >
        {{ session.title }}
      </h4>
      <div class="flex items-center justify-between mt-2">
        <div
          v-if="session.type === 'session'"
          class="flex items-center gap-1 text-xs font-medium text-dimmed"
        >
          <UIcon name="i-ph-clock-bold" class="size-3.5" />
          {{ formatTime(session.session_start_time!) }} —
          {{ formatTime(session.session_end_time!) }} WIB
        </div>
        <div v-else class="flex items-center gap-1 text-xs font-medium text-dimmed">
          <UIcon name="i-ph-clock-bold" class="size-3.5" />
          {{ formatTime(session.assignment_deadline!) }} WIB
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
