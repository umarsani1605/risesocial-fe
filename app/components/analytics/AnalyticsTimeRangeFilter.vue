<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, CalendarDate, today } from '@internationalized/date'

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

const selected = defineModel<AnalyticsDateRange>({ required: true })

const presets = [
  { label: '7 days', period: '7d' as AnalyticsPeriod, days: 7 },
  { label: '30 days', period: '30d' as AnalyticsPeriod, days: 30 },
  { label: '3 months', period: '3m' as AnalyticsPeriod, months: 3 },
  { label: '6 months', period: '6m' as AnalyticsPeriod, months: 6 },
  { label: '1 year', period: '1y' as AnalyticsPeriod, years: 1 }
]

const toCalendarDate = (date: Date) =>
  new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())

const calendarRange = computed({
  get: () => ({
    start: selected.value.start ? toCalendarDate(selected.value.start) : undefined,
    end: selected.value.end ? toCalendarDate(selected.value.end) : undefined
  }),
  set: (val: { start: CalendarDate | null; end: CalendarDate | null }) => {
    if (val.start && val.end) {
      selected.value = {
        period: 'custom',
        start: val.start.toDate(getLocalTimeZone()),
        end: val.end.toDate(getLocalTimeZone())
      }
    }
  }
})

const selectPreset = (preset: (typeof presets)[0]) => {
  const end = today(getLocalTimeZone())
  let start = end.copy()
  if ('days' in preset && preset.days) start = start.subtract({ days: preset.days })
  else if ('months' in preset && preset.months) start = start.subtract({ months: preset.months })
  else if ('years' in preset && preset.years) start = start.subtract({ years: preset.years })
  selected.value = {
    period: preset.period,
    start: start.toDate(getLocalTimeZone()),
    end: end.toDate(getLocalTimeZone())
  }
}

const isPresetActive = (preset: (typeof presets)[0]) => selected.value.period === preset.period

const dateLabel = computed(() => {
  if (selected.value.period !== 'custom') return ''
  if (!selected.value.start || !selected.value.end) return 'Custom'
  return `${df.format(selected.value.start)} – ${df.format(selected.value.end)}`
})
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <div class="flex items-center gap-1 bg-elevated rounded-lg p-1">
      <UButton
        v-for="preset in presets"
        :key="preset.period"
        :label="preset.label"
        size="xs"
        :color="isPresetActive(preset) ? 'primary' : 'neutral'"
        :variant="isPresetActive(preset) ? 'solid' : 'ghost'"
        class="px-3"
        @click="selectPreset(preset)"
      />
    </div>

    <UPopover :content="{ align: 'start' }" :modal="true">
      <UButton
        color="neutral"
        variant="light"
        icon="i-lucide-calendar"
        :class="selected.period === 'custom' ? 'ring-1 ring-primary' : ''"
      >
        {{ dateLabel || 'Custom' }}
        <template #trailing>
          <UIcon name="i-lucide-chevron-down" class="size-3.5" />
        </template>
      </UButton>

      <template #content>
        <div class="flex items-stretch sm:divide-x divide-default">
          <div class="hidden sm:flex flex-col p-2 pt-6 gap-2">
            <UButton
              v-for="preset in presets"
              :key="preset.period"
              :label="preset.label"
              color="neutral"
              variant="ghost"
              size="sm"
              class="justify-start"
              :class="isPresetActive(preset) ? 'bg-elevated' : ''"
              @click="selectPreset(preset)"
            />
          </div>
          <UCalendar v-model="calendarRange" class="p-2" :number-of-months="2" range />
        </div>
      </template>
    </UPopover>
  </div>
</template>
