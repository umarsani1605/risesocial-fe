<script setup lang="ts">
import { ICON_COLOR } from '@/constants/colorMap'

const props = defineProps<{
  stat: AnalyticsStat
}>()

const iconColor = computed(() => ICON_COLOR[props.stat.color ?? ''] ?? ICON_COLOR.gray!)

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

const trendPct = computed(() => {
  if (props.stat.trend === undefined) return undefined
  const sign = props.stat.trend >= 0 ? '+' : ''
  return `${sign}${props.stat.trend}%`
})

const trendColor = computed(() => ((props.stat.trend ?? 0) >= 0 ? 'success' : 'error'))
</script>

<template>
  <UCard class="shadow-none!">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="size-8 flex items-center justify-center rounded-lg" :class="iconColor.bg">
          <UIcon :name="stat.icon" class="size-5" :class="iconColor.text" />
        </div>
        <p class="text-sm text-gray-400">{{ stat.title }}</p>
      </div>
      <UButton :to="stat.to" variant="ghost" color="neutral" size="sm" class="p-2!">
        <UIcon name="i-ph-arrow-up-right-bold" class="size-3.5" />
      </UButton>
    </div>

    <!-- Value -->
    <p class="text-3xl font-bold mt-3 truncate">{{ formattedValue }}</p>

    <!-- Trend -->
    <div v-if="trendPct || stat.trendLabel" class="flex items-center gap-2 mt-3">
      <UBadge v-if="trendPct" :color="trendColor" variant="subtle" size="sm" class="rounded-full!">
        {{ trendPct }}
      </UBadge>
      <p v-if="stat.trendLabel" class="text-sm text-gray-400 truncate">{{ stat.trendLabel }}</p>
    </div>
  </UCard>
</template>
