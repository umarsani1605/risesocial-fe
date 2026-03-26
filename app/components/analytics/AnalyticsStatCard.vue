<script setup lang="ts">
const props = defineProps<{
  stat: AnalyticsStat
}>()

const formattedValue = computed(() => {
  if (typeof props.stat.value === 'string') return props.stat.value
  if (props.stat.value >= 1_000_000) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 1, notation: 'compact' }).format(props.stat.value)
  }
  return new Intl.NumberFormat('id-ID').format(props.stat.value)
})
</script>

<template>
  <UCard
    class="ring-transparent shadow-none! border border-default transition-shadow hover:shadow-sm"
    :to="stat.to"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0 flex-1">
        <p class="text-xs text-muted truncate">{{ stat.title }}</p>
        <p class="text-2xl font-bold mt-1 truncate">{{ formattedValue }}</p>
        <div v-if="stat.trend !== undefined" class="flex items-center gap-1 mt-1">
          <UIcon
            :name="stat.trend >= 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
            :class="stat.trend >= 0 ? 'text-success' : 'text-error'"
            class="size-3.5 shrink-0"
          />
          <span
            :class="stat.trend >= 0 ? 'text-success' : 'text-error'"
            class="text-xs font-medium"
          >
            {{ stat.trend >= 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
          <span v-if="stat.trendLabel" class="text-xs text-muted">{{ stat.trendLabel }}</span>
        </div>
      </div>
      <div class="size-12 shrink-0 flex items-center justify-center rounded-full bg-elevated">
        <UIcon :name="stat.icon" class="size-5" :class="stat.color" />
      </div>
    </div>
  </UCard>
</template>
