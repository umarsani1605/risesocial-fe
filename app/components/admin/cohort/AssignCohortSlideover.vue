<script setup lang="ts">
import { COHORT_STATUS_COLOR, COHORT_STATUS_LABEL } from '~/constants/cohort'

const props = defineProps<{
  open: boolean
  placement: AdminCohortPlacement | null
  academyName?: string
  cohorts: AdminCohortSummary[]
  selectedCohortId: number | null
  isLoadingCohorts?: boolean
  isAssigning?: boolean
  isDroppingStudent?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:selectedCohortId': [value: number | null]
  confirm: []
  drop: []
}>()

const isTransferMode = computed(() => !!props.placement?.cohort_id)

const title = computed(() => (isTransferMode.value ? 'Move Cohort' : 'Assign Cohort'))

const confirmLabel = computed(() => (isTransferMode.value ? 'Confirm Move' : 'Confirm Assign'))

function studentName(placement: AdminCohortPlacement) {
  return `${placement.user.first_name} ${placement.user.last_name}`.trim()
}

function initials(placement: AdminCohortPlacement) {
  return (
    `${placement.user.first_name?.[0] ?? ''}${placement.user.last_name?.[0] ?? ''}`.toUpperCase() ||
    '?'
  )
}

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return '—'
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  if (start) return `Mulai ${fmt(start)}`
  return `s.d. ${fmt(end!)}`
}

function selectCohort(id: number) {
  emit('update:selectedCohortId', id === props.selectedCohortId ? null : id)
}
</script>

<template>
  <USlideover
    :open="open"
    side="right"
    :ui="{ content: 'max-w-md' }"
    @update:open="emit('update:open', $event)"
  >
    <template #content>
      <div class="flex flex-col h-full">
        <div class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-default">
          <div>
            <h2 class="text-base font-semibold text-highlighted">{{ title }}</h2>
          </div>
          <UButton
            icon="i-ph-x-bold"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="emit('update:open', false)"
          />
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-8">
          <div v-if="placement" class="flex flex-col gap-2">
            <p class="font-bold mb-2">Student Details</p>
            <div class="flex gap-2">
              <p class="font-medium text-sm text-muted w-20">Name:</p>
              <p class="font-medium text-sm">{{ studentName(placement) }}</p>
            </div>
            <div class="flex gap-2">
              <p class="font-medium text-sm text-muted w-20">Email:</p>
              <p class="font-medium text-sm">{{ placement.user.email }}</p>
            </div>
            <div class="flex gap-2">
              <p class="font-medium text-sm text-muted w-20">Phone:</p>
              <p class="font-medium text-sm">{{ placement.user.phone ?? '-' }}</p>
            </div>
          </div>

          <div>
            <p class="font-bold mb-4">{{ academyName }}</p>

            <div v-if="isLoadingCohorts" class="flex justify-center py-8">
              <UIcon name="i-ph-spinner-gap-bold" class="size-6 animate-spin text-muted" />
            </div>

            <div v-else-if="cohorts.length === 0" class="py-6 text-center text-sm text-muted">
              No cohorts available for this academy.
            </div>

            <div v-else class="space-y-2">
              <button
                v-for="cohort in cohorts"
                :key="cohort.id"
                type="button"
                class="w-full text-left rounded-xl border p-4 transition-colors flex flex-col gap-2 cursor-pointer"
                :class="[
                  selectedCohortId === cohort.id
                    ? 'border-primary bg-primary/5'
                    : 'border-default hover:border-muted hover:bg-elevated/30'
                ]"
                @click="selectCohort(cohort.id)"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <span class="font-semibold text-sm truncate">{{ cohort.name }}</span>
                    <UBadge
                      v-if="isTransferMode && cohort.id === placement?.cohort_id"
                      label="current"
                      color="primary"
                      variant="subtle"
                    />
                  </div>
                  <UBadge
                    :label="COHORT_STATUS_LABEL[cohort.status] ?? cohort.status"
                    :color="COHORT_STATUS_COLOR[cohort.status] ?? 'neutral'"
                    variant="subtle"
                    class="shrink-0"
                  />
                </div>
                <div class="flex flex-col gap-2 mt-1.5 text-sm text-muted">
                  <span class="flex items-center gap-2">
                    <UIcon name="i-ph-calendar-blank" class="size-4" />
                    {{ formatDateRange(cohort.start_date, cohort.end_date) }}
                  </span>
                  <span class="flex items-center gap-2">
                    <UIcon name="i-ph-users" class="size-4" />
                    {{ cohort.enrollment_count }} students
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-default">
          <div class="flex items-center gap-2">
            <UButton
              v-if="isTransferMode"
              label="Remove"
              icon="i-ph-trash-bold"
              color="error"
              variant="outline"
              :loading="isDroppingStudent"
              :disabled="isAssigning"
              @click="emit('drop')"
            />
            <div class="flex-1" />
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              :disabled="isAssigning || isDroppingStudent"
              @click="emit('update:open', false)"
            />
            <UButton
              :label="confirmLabel"
              color="primary"
              :loading="isAssigning"
              :disabled="!selectedCohortId || isDroppingStudent"
              @click="emit('confirm')"
            />
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
