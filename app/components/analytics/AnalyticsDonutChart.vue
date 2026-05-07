<script setup lang="ts">
import { DEFAULT_CHART_COLOR_NAMES, resolveChartColor } from '~/utils/chartColor'

const props = defineProps<{
  data: CategoryBreakdown[]
  title?: string
  height?: number
  colors?: string[]
}>()

const resolvedColors = computed(() =>
  props.data.map((d, i) => {
    const fallbackName = DEFAULT_CHART_COLOR_NAMES[i % DEFAULT_CHART_COLOR_NAMES.length]!
    return (
      resolveChartColor(props.colors?.[i]) ??
      resolveChartColor(d.color) ??
      resolveChartColor(fallbackName)!
    )
  })
)

const donutData = computed(() => props.data.map((d) => d.value))

const donutCategories = computed(() =>
  Object.fromEntries(
    props.data.map((d, i) => [d.name, { name: d.name, color: resolvedColors.value[i] }])
  )
)

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const radius = computed(() => Math.floor((props.height ?? 280) / 2) - 20)
</script>

<template>
  <UCard class="ring-transparent shadow-none border border-default">
    <template v-if="title" #header>
      <p class="text-sm font-semibold">{{ title }}</p>
    </template>

    <div :style="{ height: `${height ?? 280}px` }" class="relative">
      <DonutChart
        :data="donutData"
        :categories="donutCategories"
        :radius="radius"
        :central-label="String(total)"
        :hide-legend="true"
        :pad-angle="0.1"
        :arc-width="25"
        class="w-full h-full"
      >
        <div class="text-center">
          <div class="text-2xl font-bold">
            {{ total }}
          </div>
          <div class="text-muted">Total</div>
        </div>
      </DonutChart>
    </div>

    <div v-if="data.length" class="mt-4 space-y-2">
      <div
        v-for="(item, i) in data"
        :key="item.name"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span
            class="size-2.5 rounded-full shrink-0"
            :style="{ backgroundColor: resolvedColors[i] }"
          />
          <span class="truncate text-muted">{{ item.name }}</span>
        </div>
        <span class="font-medium tabular-nums ml-4 shrink-0">{{
          item.value.toLocaleString()
        }}</span>
      </div>
    </div>
  </UCard>
</template>
