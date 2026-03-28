<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { Job } from '@/types'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Jobs Management',
  middleware: 'admin'
})

useSeoMeta({ title: 'Jobs Management - Rise Social' })

interface RateLimitData {
  requests: { remaining: number; limit: number; reset: number }
  jobs: { remaining: number; limit: number; reset: number }
  last_updated: string
}

const { api } = useApi()
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

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
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
  } catch (error: any) {
    const message = error?.data?.message ?? 'Sync failed'
    toast.add({ title: message, color: 'error' })
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
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
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
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    confirmDeleteOpen.value = false
    deleteTarget.value = null
    isDeleting.value = false
  }
}

// ── Options ───────────────────────────────────────────────────────────────────
const remoteFilterOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
]

const syncDate = computed(() => {
  const d = rateLimit.value?.last_updated
  return d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '–'
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
        row.index + 1 + pagination.value.pageIndex * pagination.value.pageSize
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
    size: 190,
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UButton, {
          label: 'Edit',
          size: 'sm',
          color: 'primary',
          variant: 'outline',
          leadingIcon: 'i-ph-pencil-simple-bold',
          to: `/admin/jobs/${row.original.id}/edit`
        }),
        h(UButton, {
          label: 'Delete',
          size: 'sm',
          color: 'error',
          variant: 'outline',
          leadingIcon: 'i-ph-trash-simple-bold',
          onClick: () => openDeleteConfirm(row.original)
        })
      ])
  }
]
</script>

<template>
  <AdminTableCard>
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

          <UPopover v-model:open="filterPopoverOpen">
            <UButton
              label="Filters"
              leading-icon="i-ph-sliders-horizontal-bold"
              color="neutral"
              variant="outline"
            >
              <template v-if="activeFilterCount > 0" #trailing>
                <span
                  class="size-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
                >
                  {{ activeFilterCount }}
                </span>
              </template>
            </UButton>

            <template #content>
              <div class="p-4 w-72 space-y-4">
                <h4 class="font-medium text-sm">Filter Jobs</h4>

                <UFormField label="Job Type">
                  <USelect
                    v-model="filterEmploymentType"
                    :items="jobTypeOptions"
                    placeholder="All Types"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Experience Level">
                  <USelect
                    v-model="filterSeniorityLevel"
                    :items="experienceLevelOptions"
                    placeholder="All Levels"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Remote Work">
                  <USelect
                    v-model="filterIsRemote"
                    :items="remoteFilterOptions"
                    placeholder="All"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Country">
                  <USelect
                    v-model="filterCountry"
                    :items="uniqueCountries"
                    placeholder="All Countries"
                    class="w-full"
                  />
                </UFormField>

                <div class="flex gap-2 pt-1">
                  <UButton
                    label="Apply"
                    color="primary"
                    size="sm"
                    class="flex-1"
                    block
                    @click="applyFilters"
                  />
                  <UButton
                    label="Clear"
                    color="white"
                    size="sm"
                    class="flex-1"
                    block
                    @click="clearFilters"
                  />
                </div>
              </div>
            </template>
          </UPopover>
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
          <UButton label="Add Job" icon="i-ph-plus-bold" color="primary" to="/admin/jobs/create" />
        </div>
      </div>
    </template>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="filteredData"
      :columns="columns"
    />

    <template #footer>
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <p class="text-sm text-muted">
          Showing {{ pagination.pageIndex * pagination.pageSize + 1 }} to
          {{ Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length) }} of
          {{ filteredData.length }} entries
        </p>
        <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          size="sm"
          variant="ghost"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </template>
  </AdminTableCard>

  <!-- Delete Confirmation Modal -->
  <UModal
    v-model:open="confirmDeleteOpen"
    title="Delete Job"
    :description="`Are you sure you want to delete &quot;${deleteTarget?.title}&quot;? This action cannot be undone.`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="isDeleting"
        @click="confirmDeleteOpen = false"
      />
      <UButton
        label="Delete"
        color="error"
        :loading="isDeleting"
        :disabled="isDeleting"
        @click="onConfirmDelete"
      />
    </template>
  </UModal>

  <!-- LinkedIn Sync Settings Modal -->
  <UModal
    v-model:open="syncSettingsOpen"
    title="LinkedIn Job Sync Settings"
    description="Configure default parameters for LinkedIn job search. If a filter is empty, no filter will be applied."
    :ui="{ content: 'max-w-3xl', footer: 'justify-end' }"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <UFormField label="Job title keywords">
          <UInputTags
            v-model="syncFilters.advanced_title_filter"
            placeholder="Type and press enter"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Locations">
          <UInputTags
            v-model="syncFilters.location_filter"
            placeholder="Type and press enter"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Description keywords">
          <UInputTags
            v-model="syncFilters.description_filter"
            placeholder="Type and press enter"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Job types">
          <USelectMenu
            v-model="syncFilters.type_filter"
            :items="jobTypeOptions"
            value-key="value"
            multiple
            placeholder="Select job types..."
            class="w-full"
          />
        </UFormField>
        <UFormField label="Company description keywords">
          <UInputTags
            v-model="syncFilters.organization_description_filter"
            placeholder="Type and press enter"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Company specialties">
          <UInputTags
            v-model="syncFilters.organization_specialties_filter"
            placeholder="Type and press enter"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Industries">
          <UInputTags
            v-model="syncFilters.industry_filter"
            placeholder="Type and press enter"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Seniority levels">
          <UInputTags
            v-model="syncFilters.seniority_filter"
            placeholder="Type and press enter"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        color="white"
        :disabled="isSavingSettings"
        @click="onCloseSyncSettings"
      />
      <UButton
        label="Save Settings"
        color="primary"
        :loading="isSavingSettings"
        :disabled="isSavingSettings"
        @click="onSaveSyncSettings"
      />
    </template>
  </UModal>
</template>
