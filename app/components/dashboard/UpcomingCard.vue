<script setup lang="ts">
import type { UpcomingSession } from '@/types'

const props = defineProps<{ session: UpcomingSession }>()

const relevantIso = computed(() =>
  props.session.type === 'session'
    ? props.session.session_start_time
    : props.session.assignment_deadline
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
    class="flex gap-4 group items-center p-2 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer"
  >
    <div
      class="flex flex-col items-center justify-center size-16 rounded-xl bg-white border border-default"
    >
      <span
        class="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none mb-1"
      >
        {{ displayMonth }}
      </span>
      <span class="text-xl font-black text-slate-800 leading-none">{{ displayDate }}</span>
    </div>

    <div class="flex-1 pt-0.5">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[10px] uppercase text-dimmed">
          {{ session.type === 'session' ? 'Live Session' : 'Assignment' }}
        </span>
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
