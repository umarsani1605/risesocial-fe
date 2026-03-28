<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  data: TimeSeriesPoint[]
  title?: string
  height?: number
  color?: string
  xLabel?: string
  yLabel?: string
}>()

const chartData = computed(() =>
  props.data.map((p) => ({
    date: format(new Date(p.date), 'd MMM'),
    value: p.value
  }))
)

const categories = computed(() => ({
  value: { name: props.yLabel ?? 'Value', color: resolveChartColor(props.color) }
}))

const xFormatter = (tick: number): string => {
  return chartData.value[tick]?.date ?? String(tick)
}

const yFormatter = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}

const tooltipTitleFormatter = (data: Record<string, unknown>) => {
  return String(data.date ?? '')
}
</script>

<template>
  <UCard class="shadow-none!">
    <template v-if="title" #header>
      <p class="text-sm font-semibold">{{ title }}</p>
    </template>
    <div :style="{ height: `${height ?? 280}px` }">
      <AreaChart
        :data="chartData"
        :categories="categories"
        :height="height ?? 280"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :tooltip-title-formatter="tooltipTitleFormatter"
        :hide-legend="true"
        :x-num-ticks="6"
        :x-label="xLabel"
        :y-label="yLabel"
        class="w-full h-full"
      />
    </div>
  </UCard>
</template>
