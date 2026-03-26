<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  data: TimeSeriesPoint[]
  title?: string
  height?: number
  mini?: boolean
}>()

const chartData = computed(() =>
  props.data.map(p => ({
    date: props.mini ? p.date.slice(5) : format(new Date(p.date), 'MMM d'),
    value: p.value
  }))
)

const categories: Record<string, { name: string }> = {
  value: { name: 'Value' }
}

const yFormatter = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}
</script>

<template>
  <UCard
    v-if="!mini"
    class="ring-transparent shadow-none border border-default"
  >
    <template v-if="title" #header>
      <p class="text-sm font-semibold">{{ title }}</p>
    </template>
    <div :style="{ height: `${height ?? 280}px` }">
      <LineChart
        :data="chartData"
        :categories="categories"
        :height="height ?? 280"
        :y-formatter="yFormatter"
        class="w-full h-full"
      />
    </div>
  </UCard>

  <div v-else :style="{ height: `${height ?? 80}px` }">
    <LineChart
      :data="chartData"
      :categories="categories"
      :height="height ?? 80"
      :hide-legend="true"
      :hide-tooltip="true"
      :hide-x-axis="true"
      :hide-y-axis="true"
      :x-grid-line="false"
      :y-grid-line="false"
      class="w-full h-full"
    />
  </div>
</template>
