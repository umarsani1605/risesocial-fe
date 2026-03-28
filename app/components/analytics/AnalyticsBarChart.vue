<script setup lang="ts">
const props = defineProps<{
  data: CategoryBreakdown[]
  title?: string
  height?: number
  color?: string
}>()

const chartData = computed(() =>
  props.data.map(d => ({ name: d.name, value: d.value }))
)

const categories = computed(() => ({
  value: { name: 'Value', color: resolveChartColor(props.color) }
}))

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
        :y-axis="['value']"
        x-axis="name"
        :y-formatter="yFormatter"
        class="w-full h-full"
      />
    </div>
  </UCard>
</template>
