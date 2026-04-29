<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Job, RateLimitData } from '@/types'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Jobs Management',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Jobs Management - Rise Social' })

const { api } = useApi()
const { canEdit } = useAuth()
const { data: rawJobs, refresh: refreshJobs } = await useAsyncData('admin:jobs', () =>
  api<PaginatedResponse<Job>>('/admin/jobs')
)
const { data: rateLimitRaw, refresh: refreshRateLimit } = await useAsyncData(
  'admin:jobs:rate-limit',
  () => api<ApiResponse<RateLimitData>>('/admin/system/settings/linkedin/rate-limit')
)
const rateLimit = computed(() => rateLimitRaw.value?.data)

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const search = ref('')
const toast = useToast()

// ── Filter popover state (pending) ───────────────────────────────────────────
const filterEmploymentType = ref<string | undefined>(undefined)
const filterSeniorityLevel = ref<string | undefined>(undefined)
const filterIsRemote = ref<string | undefined>(undefined)
const filterCountry = ref<string | undefined>(undefined)

// Applied filter state
const appliedEmploymentType = ref<string | undefined>(undefined)
const appliedSeniorityLevel = ref<string | undefined>(undefined)
const appliedIsRemote = ref<string | undefined>(undefined)
const appliedCountry = ref<string | undefined>(undefined)

const dataTableRef = ref()

const filterPopoverOpen = ref(false)
const confirmSyncOpen = ref(false)
const syncSettingsOpen = ref(false)
const isSyncing = ref(false)

// Delete confirmation
const deleteTarget = ref<Job | null>(null)
const confirmDeleteOpen = ref(false)
const isDeleting = ref(false)

// ── Sync settings ─────────────────────────────────────────────────────────────
const syncFilters = ref({
  advanced_title_filter: [
    'sustainability',
    'esg',
    'carbon',
    'climate',
    'csr',
    'corporate social responsibility',
    'waste',
    'waste management',
    'green',
    'renewable',
    'environment'
  ] as string[],
  location_filter: [] as string[],
  description_filter: [] as string[],
  type_filter: [] as string[],
  organization_description_filter: [] as string[],
  organization_specialties_filter: [] as string[],
  industry_filter: [] as string[],
  seniority_filter: [] as string[]
})

const isSavingSettings = ref(false)

onMounted(async () => {
  try {
    const res = await api<ApiResponse<{ value: typeof syncFilters.value }>>(
      '/admin/system/settings/linkedin_sync_filters'
    )
    if (res?.data?.value) {
      Object.assign(syncFilters.value, res.data.value)
    }
  } catch {
    // setting belum pernah disimpan — pakai default
  }
})

// ── Derived ───────────────────────────────────────────────────────────────────
const allJobs = computed(() => rawJobs.value?.data ?? [])

const rateLimitText = computed(() => {
  const req = rateLimit.value?.requests
  const jobs = rateLimit.value?.jobs
  return `Requests: ${req?.remaining ?? '–'}/${req?.limit ?? '–'} · Jobs: ${jobs?.remaining ?? '–'}/${jobs?.limit ?? '–'}`
})

const syncDateText = computed(() => {
  const lastUpdated = rateLimit.value?.last_updated
  return lastUpdated ? `Next Sync: ${formatDatetime(lastUpdated)}` : '–'
})

const activeFilterCount = computed(
  () =>
    [
      appliedEmploymentType.value,
      appliedSeniorityLevel.value,
      appliedIsRemote.value,
      appliedCountry.value
    ].filter(Boolean).length
)

const uniqueCountries = computed(() => {
  const countries = [
    ...new Set(allJobs.value.map((j) => j.location?.country).filter(Boolean))
  ].sort() as string[]
  return countries.map((c) => ({ label: c, value: c }))
})

const filteredData = computed(() => {
  let result = allJobs.value.filter(
    (j) =>
      !search.value ||
      j.title.toLowerCase().includes(search.value.toLowerCase()) ||
      j.company.name.toLowerCase().includes(search.value.toLowerCase())
  )
  if (appliedEmploymentType.value)
    result = result.filter((j) => j.employment_type === appliedEmploymentType.value)
  if (appliedSeniorityLevel.value)
    result = result.filter((j) => j.seniority_level === appliedSeniorityLevel.value)
  if (appliedIsRemote.value === 'yes') result = result.filter((j) => j.location?.is_remote === true)
  if (appliedIsRemote.value === 'no') result = result.filter((j) => j.location?.is_remote === false)
  if (appliedCountry.value)
    result = result.filter((j) => j.location?.country === appliedCountry.value)
  return result
})

// ── Actions ───────────────────────────────────────────────────────────────────
function applyFilters() {
  appliedEmploymentType.value = filterEmploymentType.value
  appliedSeniorityLevel.value = filterSeniorityLevel.value
  appliedIsRemote.value = filterIsRemote.value
  appliedCountry.value = filterCountry.value
  filterPopoverOpen.value = false
}

function clearFilters() {
  filterEmploymentType.value = undefined
  filterSeniorityLevel.value = undefined
  filterIsRemote.value = undefined
  filterCountry.value = undefined
  appliedEmploymentType.value = undefined
  appliedSeniorityLevel.value = undefined
  appliedIsRemote.value = undefined
  appliedCountry.value = undefined
  filterPopoverOpen.value = false
}

async function onConfirmSync() {
  confirmSyncOpen.value = false
  isSyncing.value = true
  try {
    await api('/admin/jobs/sync-linkedin', { method: 'POST', body: { filter: syncFilters.value } })
    await refreshJobs()
    await refreshRateLimit()
    toast.add({ title: 'Sync completed successfully.', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error, 'Sync failed'), color: 'error' })
  } finally {
    isSyncing.value = false
  }
}

async function onSaveSyncSettings() {
  isSavingSettings.value = true
  try {
    await api('/admin/system/settings/linkedin_sync_filters', {
      method: 'PUT',
      body: { value: syncFilters.value }
    })
    toast.add({ title: 'Sync settings saved', color: 'success' })
    syncSettingsOpen.value = false
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSavingSettings.value = false
  }
}

function onCloseSyncSettings() {
  syncSettingsOpen.value = false
}

function openDeleteConfirm(job: Job) {
  deleteTarget.value = job
  confirmDeleteOpen.value = true
}

async function onConfirmDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/jobs/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.add({ title: `Job "${deleteTarget.value.title}" deleted`, color: 'success' })
    await refreshJobs()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    confirmDeleteOpen.value = false
    deleteTarget.value = null
    isDeleting.value = false
  }
}

const syncDate = computed(() => {
  const d = rateLimit.value?.last_updated
  return d ? formatDateLong(d) : '–'
})

// ── Table columns ─────────────────────────────────────────────────────────────
const columns: TableColumn<Job>[] = [
  {
    id: 'no',
    header: '#',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-muted' },
        row.index +
          1 +
          (dataTableRef.value?.pagination?.pageIndex ?? 0) *
            (dataTableRef.value?.pagination?.pageSize ?? 10)
      )
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'line-clamp-2 text-sm leading-snug', title: row.getValue('title') },
        row.getValue('title')
      )
  },
  {
    id: 'company',
    header: 'Company',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-sm truncate block', title: row.original.company.name },
        row.original.company.name
      )
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const l = row.original.location
      const loc = formatLocation(
        l
          ? { city: l.city ?? undefined, region: l.region ?? undefined, country: l.country }
          : undefined
      )
      return h('span', { class: 'text-sm truncate block', title: loc }, loc)
    }
  },
  {
    id: 'industry',
    header: 'Industry',
    cell: ({ row }) =>
      h('span', { class: 'text-sm truncate block' }, row.original.company.industry ?? '–')
  },
  {
    id: 'website',
    header: 'Website',
    cell: ({ row }) => {
      const url = row.original.company.website_url
      return url
        ? h(
            'a',
            {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'text-primary text-sm hover:underline'
            },
            url
          )
        : h('span', { class: 'text-muted text-sm' }, '–')
    }
  },
  {
    id: 'posted_date',
    header: 'Posted',
    cell: ({ row }) => {
      const d = row.original.posted_date
      return h('span', { class: 'text-sm whitespace-nowrap' }, d ? formatDate(d) : '–')
    }
  },
  {
    id: 'employment_type',
    header: 'Type',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatJobType(row.original.employment_type))
  },
  {
    id: 'seniority_level',
    header: 'Level',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-sm whitespace-nowrap' },
        formatExperienceLevel(row.original.seniority_level ?? '')
      )
  },
  {
    id: 'salary',
    header: 'Salary',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap text-muted' }, row.original.salary_raw ?? '–')
  },
  {
    id: 'is_remote',
    header: 'Remote',
    cell: ({ row }) => {
      const remote = row.original.location?.is_remote ?? false
      return h(UBadge, { variant: 'subtle', color: remote ? 'success' : 'neutral' }, () =>
        remote ? 'Yes' : 'No'
      )
    }
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.original.status === 'active'
      return h(
        UBadge,
        { variant: 'subtle', color: active ? 'success' : 'neutral', class: 'capitalize' },
        () => row.original.status
      )
    }
  },
  {
    id: 'valid_until',
    header: 'Deadline',
    cell: ({ row }) => {
      const d = row.original.valid_until
      return h('span', { class: 'text-sm whitespace-nowrap' }, d ? formatDate(d) : '–')
    }
  },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UButton, {
          label: 'Edit',
          size: 'sm',
          color: 'primary',
          variant: 'light',
          leadingIcon: 'i-ph-pencil-simple-bold',
          to: `/admin/jobs/${row.original.id}/edit`
        }),
        canEdit('admin.jobs') && h(UButton, {
          label: 'Delete',
          size: 'sm',
          color: 'error',
          variant: 'light',
          leadingIcon: 'i-ph-trash-simple-bold',
          onClick: () => openDeleteConfirm(row.original)
        })
      ].filter(Boolean))
  }
]
</script>

<template>
  <AdminDataTable ref="dataTableRef" :data="filteredData" :columns="columns" pinned-shadow>
    <template #toolbar>
      <div class="flex flex-wrap items-center justify-between">
        <!-- Left: Search + Filters -->
        <div class="flex flex-wrap items-center gap-2">
          <UInput
            v-model="search"
            icon="i-ph-magnifying-glass-bold"
            placeholder="Search title or company..."
            class="w-full sm:w-56"
          />

          <AdminJobsFiltersPopover
            v-model:open="filterPopoverOpen"
            v-model:employment-type="filterEmploymentType"
            v-model:seniority-level="filterSeniorityLevel"
            v-model:is-remote="filterIsRemote"
            v-model:country="filterCountry"
            :active-filter-count="activeFilterCount"
            :unique-countries="uniqueCountries"
            @apply="applyFilters"
            @clear="clearFilters"
          />
        </div>

        <!-- Right: Add Job + Sync button group -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <div class="hidden sm:block h-4 w-px bg-default" />
          <UTooltip :text="rateLimitText">
            <div class="flex items-center gap-1.5 cursor-default select-none">
              <UIcon name="i-ph-info-bold" class="size-4 text-muted" />
              <span class="text-sm text-muted">Rate Limit Info</span>
            </div>
          </UTooltip>

          <div class="hidden sm:block h-4 w-px bg-default" />

          <UTooltip :text="syncDateText">
            <div class="flex items-center gap-1.5 cursor-default select-none">
              <UIcon name="i-ph-calendar-bold" class="size-4 text-muted" />
              <span class="text-sm text-muted">{{ syncDate }}</span>
            </div>
          </UTooltip>

          <div class="hidden sm:block h-4 w-px bg-default" />

          <!-- Sync Job + Settings button group -->
          <UFieldGroup>
            <UPopover v-model:open="confirmSyncOpen">
              <UButton
                color="primary"
                leading-icon="i-ph-arrow-clockwise-bold"
                :label="isSyncing ? 'Syncing...' : 'Sync Job'"
                :disabled="isSyncing"
                :ui="{ leadingIcon: isSyncing ? 'animate-spin' : '' }"
              />

              <template #content>
                <div class="p-4 w-56 space-y-3">
                  <p class="text-sm">Perform manual job sync?</p>
                  <div class="flex justify-end gap-2">
                    <UButton
                      label="No"
                      color="neutral"
                      variant="outline"
                      size="sm"
                      @click="confirmSyncOpen = false"
                    />
                    <UButton label="Yes" color="primary" size="sm" @click="onConfirmSync" />
                  </div>
                </div>
              </template>
            </UPopover>

            <UButton color="primary" icon="i-ph-gear-bold" @click="syncSettingsOpen = true" />
          </UFieldGroup>
          <UButton v-if="canEdit('admin.jobs')" label="Add Job" icon="i-ph-plus-bold" color="primary" to="/admin/jobs/create" />
        </div>
      </div>
    </template>
  </AdminDataTable>

  <AdminConfirmDeleteModal
    v-model:open="confirmDeleteOpen"
    :item-name="deleteTarget?.title"
    :loading="isDeleting"
    @confirm="onConfirmDelete"
  />

  <AdminJobsSyncSettingsModal
    v-model:open="syncSettingsOpen"
    v-model:sync-filters="syncFilters"
    :loading="isSavingSettings"
    @save="onSaveSyncSettings"
    @cancel="onCloseSyncSettings"
  />
</template>
