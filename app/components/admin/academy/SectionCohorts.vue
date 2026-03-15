<script setup lang="ts">
import type { AdminCohort } from '@/types'

const props = defineProps<{
  academyId: number
}>()

const { api } = useApi()

const items = ref<AdminCohort[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await api<ApiResponse<AdminCohort[]>>(`/admin/cohorts?academy_id=${props.academyId}`)
    items.value = res.data
  } catch {
    // error already shown by useApi's onResponseError
  } finally {
    loading.value = false
  }
})

function statusColor(status: CohortStatus) {
  if (status === 'COMPLETED') return 'success' as const
  if (status === 'ONGOING') return 'warning' as const
  return 'neutral' as const
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton
        label="+ Create Cohort"
        color="primary"
        :to="`/admin/cohorts/create?academyId=${academyId}`"
      />
    </div>

    <div class="border border-default rounded-lg overflow-hidden">
      <div v-if="loading" class="px-4 py-8 text-center text-sm text-muted">
        Loading cohorts...
      </div>

      <template v-else>
        <div class="grid grid-cols-[2.5rem_1fr_8rem_8rem_8rem_auto] gap-4 px-4 py-3 bg-elevated/50 border-b border-default text-sm font-medium">
          <span>#</span>
          <span>Name</span>
          <span>Students</span>
          <span>Start Date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div
          v-for="(cohort, idx) in items"
          :key="cohort.id"
          class="grid grid-cols-[2.5rem_1fr_8rem_8rem_8rem_auto] gap-4 px-4 py-3 border-b border-default last:border-b-0 items-center"
        >
          <span class="text-sm text-muted">{{ idx + 1 }}</span>
          <span class="text-sm font-medium">{{ cohort.name }}</span>
          <span class="text-sm">{{ cohort.enrollment_count }}</span>
          <span class="text-sm text-muted">{{ formatDate(cohort.start_date) }}</span>
          <UBadge :color="statusColor(cohort.status)" variant="subtle" class="w-fit">
            {{ cohort.status }}
          </UBadge>
          <UButton
            label="Detail"
            trailing-icon="i-lucide-chevrons-right"
            size="xs"
            color="neutral"
            variant="outline"
            :to="`/admin/cohorts/${cohort.id}`"
          />
        </div>

        <div v-if="items.length === 0" class="px-4 py-8 text-center text-sm text-muted">
          No cohorts yet. Click "+ Create Cohort" to add one.
        </div>
      </template>
    </div>
  </div>
</template>
