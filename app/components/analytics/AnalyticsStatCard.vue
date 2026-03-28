<script setup lang="ts">
const props = defineProps<{
  stat: AnalyticsStat
}>()

const formattedValue = computed(() => {
  if (typeof props.stat.value === 'string') return props.stat.value
  if (props.stat.value >= 1_000_000) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 1,
      notation: 'compact'
    }).format(props.stat.value)
  }
  return new Intl.NumberFormat('id-ID').format(props.stat.value)
})

const trendText = computed(() => {
  if (props.stat.trend === undefined) return props.stat.trendLabel ?? ''
  const sign = props.stat.trend >= 0 ? '+' : ''
  const pct = `${sign}${props.stat.trend}%`
  return props.stat.trendLabel ? `${pct} ${props.stat.trendLabel}` : pct
})

// Derive a light bg class from the icon color class (e.g. "text-primary" → "bg-primary-50")
const iconBg = computed(() => {
  const color = props.stat.color
  if (!color) return 'bg-gray-100 dark:bg-gray-800'
  const match = color.match(/^text-([a-z-]+?)(?:-\d+)?$/)
  return match ? `bg-${match[1]}-50 dark:bg-${match[1]}-950/30` : 'bg-gray-100 dark:bg-gray-800'
})
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
    <!-- Inner white card -->
    <div
      class="bg-white dark:bg-gray-900 rounded-lg px-4 py-3 flex items-start justify-between gap-3"
    >
      <div class="min-w-0 flex-1">
        <p class="text-xs text-gray-400">{{ stat.title }}</p>
        <p class="text-2xl font-bold mt-1 truncate">{{ formattedValue }}</p>
      </div>
      <div
        class="size-10 shrink-0 flex items-center justify-center rounded-lg mt-0.5"
        :class="iconBg"
      >
        <UIcon :name="stat.icon" class="size-5" :class="stat.color ?? 'text-gray-500'" />
      </div>
    </div>
    <!-- Footer -->
    <div class="flex items-center justify-between px-2.5 pt-2.5 pb-1">
      <p class="text-xs text-gray-400 truncate">{{ trendText }}</p>
      <NuxtLink
        v-if="stat.to"
        :to="stat.to"
        class="text-xs font-semibold shrink-0 ml-2 hover:underline"
      >
        View more
      </NuxtLink>
    </div>
  </div>
</template>
