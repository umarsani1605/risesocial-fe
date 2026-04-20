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
  <UCard class="shadow-none!" :ui="{ body: 'p-4!' }">
    <div class="flex gap-6">
      <div
        class="size-12 flex items-center justify-center rounded-xl border"
        :class="iconColor.bg + ' ' + iconColor.border"
      >
        <UIcon :name="stat.icon" class="size-6" :class="iconColor.text" />
      </div>
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex flex-1 items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="text-sm text-gray-400">{{ stat.title }}</div>
          </div>
          <UButton :to="stat.to" variant="ghost" color="neutral" size="sm" class="p-2!">
            <UIcon name="i-ph-arrow-up-right-bold" class="size-3.5" />
          </UButton>
        </div>
        <p class="text-3xl font-bold truncate">{{ formattedValue }}</p>
        <div v-if="trendPct || stat.trendLabel" class="flex items-center gap-2">
          <UBadge
            v-if="trendPct"
            :color="trendColor"
            variant="subtle"
            size="sm"
            class="rounded-full!"
          >
            {{ trendPct }}
          </UBadge>
          <p v-if="stat.trendLabel" class="text-sm text-gray-400 truncate">{{ stat.trendLabel }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>
