<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Students',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Students - Rise Social' })

const { api } = useApi()
const toast = useToast()
const { canEdit } = useAuth()

const {
  data: rawData,
  status,
  refresh
} = await useAsyncData('admin:students', () =>
  api<ApiResponse<AcademyEnrollmentItem[]>>('/admin/academy-enrollments?limit=500')
)

const enrollments = computed(() => rawData.value?.data ?? [])

// ── Filters ──────────────────────────────────────────────────
const search = ref('')
const academyFilter = ref('all')
const assignmentFilter = ref('unassigned')

const assignmentOptions = [
  { label: 'All', value: 'all' },
  { label: 'Not Assigned', value: 'unassigned' },
  { label: 'Assigned', value: 'assigned' }
]

const academyOptions = computed(() => {
  const seen = new Map<number, string>()
  enrollments.value.forEach((e) => seen.set(e.academy_id, e.academy.title))
  return [
    { label: 'All Academies', value: 'all' },
    ...Array.from(seen.entries()).map(([id, title]) => ({ label: title, value: String(id) }))
  ]
})

const unassignedCount = computed(() => enrollments.value.filter((e) => !e.placement).length)

const filteredData = computed(() => {
  let result = [...enrollments.value]

  if (assignmentFilter.value === 'unassigned') {
    result = result.filter((e) => !e.placement)
  } else if (assignmentFilter.value === 'assigned') {
    result = result.filter((e) => !!e.placement)
  }

  if (academyFilter.value !== 'all') {
    result = result.filter((e) => String(e.academy_id) === academyFilter.value)
  }

  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(
      (e) =>
        `${e.user.first_name} ${e.user.last_name}`.toLowerCase().includes(s) ||
        e.user.email.toLowerCase().includes(s)
    )
  }

  return result
})

// ── Assign / Transfer slideover ───────────────────────────────
const isAssignOpen = ref(false)
const assignTarget = ref<AdminCohortPlacement | null>(null)
const assignAcademyName = ref('')
const availableCohorts = ref<AdminCohortSummary[]>([])
const selectedCohortId = ref<number | null>(null)
const isLoadingCohorts = ref(false)
const isAssigning = ref(false)
const isDroppingStudent = ref(false)

function toPlacementAdapter(enrollment: AcademyEnrollmentItem): AdminCohortPlacement {
  return {
    id: enrollment.placement?.id ?? 0,
    academy_enrollment_id: enrollment.id,
    cohort_id: enrollment.placement?.cohort_id ?? 0,
    academy_id: enrollment.academy_id,
    user_id: enrollment.user_id,
    status: enrollment.completed_at ? 'completed' : 'active',
    placed_at: null,
    user: enrollment.user,
    certificate: null
  }
}

async function openAssignModal(enrollment: AcademyEnrollmentItem) {
  assignTarget.value = toPlacementAdapter(enrollment)
  assignAcademyName.value = enrollment.academy.title
  selectedCohortId.value = null
  availableCohorts.value = []
  isAssignOpen.value = true
  isLoadingCohorts.value = true
  try {
    const res = await api<ApiResponse<AdminCohortSummary[]>>(
      `/admin/cohorts?academy_id=${enrollment.academy_id}&status[]=not_started&status[]=ongoing`
    )
    availableCohorts.value = res.data
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isLoadingCohorts.value = false
  }
}

function closeAssignModal() {
  isAssignOpen.value = false
  assignTarget.value = null
  assignAcademyName.value = ''
  selectedCohortId.value = null
  availableCohorts.value = []
}

async function submitAssign() {
  if (!assignTarget.value?.academy_enrollment_id || !selectedCohortId.value) return
  isAssigning.value = true
  try {
    await api(`/admin/academy-enrollments/${assignTarget.value.academy_enrollment_id}/assign`, {
      method: 'POST',
      body: { cohort_id: selectedCohortId.value }
    })
    toast.add({ title: 'Student assigned to cohort', color: 'success' })
    closeAssignModal()
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isAssigning.value = false
  }
}

async function submitDropFromCohort() {
  if (!assignTarget.value?.id) return
  isDroppingStudent.value = true
  try {
    await api(`/admin/cohort-placements/${assignTarget.value.id}/drop`, { method: 'POST' })
    toast.add({ title: 'Student removed from cohort', color: 'success' })
    closeAssignModal()
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDroppingStudent.value = false
  }
}

// ── Table ─────────────────────────────────────────────────────
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')

const columns: TableColumn<AcademyEnrollmentItem>[] = [
  {
    id: 'no',
    header: '',
    size: 48,
    cell: ({ row }) => h('span', { class: 'text-sm text-muted' }, row.index + 1)
  },
  {
    id: 'student',
    header: 'Student',
    cell: ({ row }) => {
      const e = row.original
      const name = `${e.user.first_name ?? ''} ${e.user.last_name ?? ''}`.trim()
      const initials =
        `${e.user.first_name?.[0] ?? ''}${e.user.last_name?.[0] ?? ''}`.toUpperCase() || '?'
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: e.user.avatar ?? undefined,
          text: initials,
          size: 'sm',
          color: 'primary',
          class: 'bg-primary text-white text-xs rounded-full'
        }),
        h('div', [h('p', { class: 'text-sm font-medium leading-tight' }, name)])
      ])
    }
  },
  {
    id: 'academy',
    header: 'Academy',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.academy.title)
  },
  {
    id: 'cohort',
    header: 'Cohort',
    cell: ({ row }) => {
      const p = row.original.placement
      if (!p?.cohort) return h('span', { class: 'text-muted' }, ' - ')
      return h('span', p.cohort.name)
    }
  },
  {
    id: 'paid_at',
    header: 'Purchase Date',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-sm text-muted' },
        formatDatetimeLong(row.original.transaction?.paid_at ?? '')
      )
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isAssigned = !!row.original.placement
      return h(UBadge, { variant: 'subtle', color: isAssigned ? 'success' : 'warning' }, () =>
        isAssigned ? 'Assigned' : 'Not Assigned'
      )
    }
  },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) => {
      const isPlaced = !!row.original.placement
      return h(UButton, {
        label: isPlaced ? 'Move Cohort' : 'Assign Cohort',
        color: 'primary',
        variant: 'light',
        size: 'sm',
        leadingIcon: isPlaced ? 'i-ph-arrows-left-right-bold' : 'i-ph-plus-bold',
        disabled: !canEdit('admin.cohort'),
        onClick: () => openAssignModal(row.original)
      })
    }
  }
]
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="unassignedCount > 0"
      title="Unassigned Students"
      :description="`There are ${unassignedCount} students who have paid but are not assigned to a cohort.`"
      variant="subtle"
      icon="i-ph-warning-circle-bold"
    />

    <AdminDataTable
      v-model:search="search"
      :data="filteredData"
      :columns="columns"
      :loading="status === 'pending'"
      search-placeholder="Search by name or email..."
      search-class="w-full sm:w-72"
      table-class="px-4 sm:px-6"
      :column-pinning="{}"
    >
      <template #toolbar-left>
        <div class="flex w-full sm:w-auto gap-2">
          <USelect
            v-model="academyFilter"
            :items="academyOptions"
            class="flex-1 sm:flex-none sm:w-48"
          />
          <USelect
            v-model="assignmentFilter"
            :items="assignmentOptions"
            class="flex-1 sm:flex-none sm:w-44"
          />
        </div>
      </template>
    </AdminDataTable>
  </div>

  <AdminCohortAssignCohortSlideover
    :open="isAssignOpen"
    :placement="assignTarget"
    :academy-name="assignAcademyName"
    :cohorts="availableCohorts"
    :selected-cohort-id="selectedCohortId"
    :is-loading-cohorts="isLoadingCohorts"
    :is-assigning="isAssigning"
    :is-dropping-student="isDroppingStudent"
    @update:open="
      (v) => {
        if (!v) closeAssignModal()
      }
    "
    @update:selected-cohort-id="(v) => (selectedCohortId = v)"
    @confirm="submitAssign"
    @drop="submitDropFromCohort"
  />
</template>
