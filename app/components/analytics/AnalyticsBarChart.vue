<script setup lang="ts">
import { DEFAULT_CHART_COLOR_NAMES, resolveChartColor } from '~/utils/chartColor'

const props = defineProps<{
  data: CategoryBreakdown[]
  title?: string
  height?: number
  color?: string
}>()

const chartData = computed(() => props.data.map((d) => ({ name: d.name, value: d.value })))

const categories = computed(() => {
  const seriesColor =
    resolveChartColor(props.color) ??
    resolveChartColor(props.data[0]?.color) ??
    resolveChartColor(DEFAULT_CHART_COLOR_NAMES[0])!
  return {
    value: { name: 'Value', color: seriesColor },
  }
})

const xFormatter = (tick: number): string => {
  if (!Number.isInteger(tick)) return ''
  return chartData.value[tick]?.name ?? ''
}

const yFormatter = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}
</script>

<template>
  <UCard class="ring-transparent shadow-none border border-default">
    <template v-if="title" #header>
      <p class="text-sm font-semibold">{{ title }}</p>
    </template>
    <div :style="{ height: `${height ?? 280}px` }">
      <BarChart
        :data="chartData"
        :categories="categories"
        :height="height ?? 280"
        :radius="8"
        :y-axis="['value']"
        :group-padding="0"
        :bar-padding="0.2"
        :x-formatter="xFormatter"
        :tooltip-title-formatter="(d: Record<string, unknown>) => String(d.name ?? '')"
        :y-formatter="yFormatter"
        :hide-legend="true"
        class="w-full h-full"
      />
    </div>
  </UCard>
</template>
