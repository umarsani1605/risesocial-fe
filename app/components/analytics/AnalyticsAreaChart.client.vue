<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  data: TimeSeriesPoint[]
  title?: string
  height?: number
}>()

const chartData = computed(() =>
  props.data.map(p => ({
    date: format(new Date(p.date), 'MMM d'),
    value: p.value
  }))
)

const categories: Record<string, { name: string }> = {
  value: { name: 'Value' }
}

const yFormatter = (value: number) => {
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
      <AreaChart
        :data="chartData"
        :categories="categories"
        :height="height ?? 280"
        :y-formatter="yFormatter"
        class="w-full h-full"
      />
    </div>
  </UCard>
</template>
