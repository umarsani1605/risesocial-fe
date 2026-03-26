<script setup lang="ts">
const props = defineProps<{
  data: CategoryBreakdown[]
  title?: string
  height?: number
}>()

// DonutChart expects data as number[] and categories as Record<string, BulletLegendItemInterface>
const donutData = computed(() => props.data.map(d => d.value))

const donutCategories = computed(() =>
  Object.fromEntries(
    props.data.map(d => [d.name, { name: d.name, color: d.color }])
  )
)

const radius = computed(() => Math.floor((props.height ?? 280) / 2) - 20)
</script>

<template>
  <UCard class="ring-transparent shadow-none border border-default">
    <template v-if="title" #header>
      <p class="text-sm font-semibold">{{ title }}</p>
    </template>
    <div :style="{ height: `${height ?? 280}px` }">
      <DonutChart
        :data="donutData"
        :categories="donutCategories"
        :radius="radius"
        class="w-full h-full"
      />
    </div>
  </UCard>
</template>
