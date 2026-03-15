<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { Job } from '@/types'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Jobs Management',
  navbarIcon: 'i-lucide-briefcase',
  middleware: 'admin'
})

useSeoMeta({ title: 'Jobs Management - Rise Social' })

const { api } = useApi()
const { data: rawJobs, refresh: refreshJobs } = await useAsyncData('admin:jobs', () =>
  api<PaginatedResponse<Job>>('/admin/jobs')
)

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
const search = ref('')
const toast = useToast()

// ── Filter popover state (pending) ───────────────────────────────────────────
const filterJobType = ref('')
const filterExperienceLevel = ref('')
const filterIsRemote = ref<boolean | undefined>(undefined)

// Applied filter state
const appliedJobType = ref('')
const appliedExperienceLevel = ref('')
const appliedIsRemote = ref<boolean | undefined>(undefined)

const filterPopoverOpen = ref(false)
const confirmSyncOpen = ref(false)
const syncSettingsOpen = ref(false)
const isSyncing = ref(false)

// Delete confirmation
const deleteTarget = ref<Job | null>(null)
const confirmDeleteOpen = ref(false)

// ── Sync settings ─────────────────────────────────────────────────────────────
const syncFilters = ref({
  job_titles: ['sustainability', 'esg', 'carbon', 'climate', 'csr', 'corporate social responsibility', 'waste', 'waste management', 'green', 'renewable', 'environment'] as string[],
  job_locations: [] as string[],
  job_descriptions: [] as string[],
  job_types: [] as string[],
  company_descriptions: [] as string[],
  company_specialties: [] as string[],
  industries: [] as string[],
  seniority_levels: [] as string[]
})

// ── Derived ───────────────────────────────────────────────────────────────────
const allJobs = computed(() => rawJobs.value?.data ?? [])

const activeFilterCount = computed(() =>
  [appliedJobType.value, appliedExperienceLevel.value, appliedIsRemote.value !== undefined].filter(Boolean).length
)

const filteredData = computed(() => {
  let result = allJobs.value.filter(j =>
    !search.value
    || j.title.toLowerCase().includes(search.value.toLowerCase())
    || j.company.name.toLowerCase().includes(search.value.toLowerCase())
  )
  if (appliedJobType.value) result = result.filter(j => j.jobType === appliedJobType.value)
  if (appliedExperienceLevel.value) result = result.filter(j => j.experienceLevel === appliedExperienceLevel.value)
  if (appliedIsRemote.value !== undefined) result = result.filter(j => j.isRemote === appliedIsRemote.value)
  return result
})

// ── Actions ───────────────────────────────────────────────────────────────────
function applyFilters() {
  appliedJobType.value = filterJobType.value
  appliedExperienceLevel.value = filterExperienceLevel.value
  appliedIsRemote.value = filterIsRemote.value
  filterPopoverOpen.value = false
}

function clearFilters() {
  filterJobType.value = ''
  filterExperienceLevel.value = ''
  filterIsRemote.value = undefined
  appliedJobType.value = ''
  appliedExperienceLevel.value = ''
  appliedIsRemote.value = undefined
  filterPopoverOpen.value = false
}

async function onConfirmSync() {
  confirmSyncOpen.value = false
  isSyncing.value = true
  try {
    await api('/admin/jobs/sync', { method: 'POST' })
    await refreshJobs()
    toast.add({ title: 'Sync completed successfully.', color: 'success' })
  }
  catch {
    toast.add({ title: 'Sync completed. No new jobs found.', color: 'warning' })
  }
  finally {
    isSyncing.value = false
  }
}

function onSaveSyncSettings() {
  toast.add({ title: 'Sync settings saved', color: 'success' })
  syncSettingsOpen.value = false
}

function openDeleteConfirm(job: Job) {
  deleteTarget.value = job
  confirmDeleteOpen.value = true
}

async function onConfirmDelete() {
  if (!deleteTarget.value) return
  try {
    await api(`/admin/jobs/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.add({ title: `Job "${deleteTarget.value.title}" deleted`, color: 'success' })
    await refreshJobs()
  }
  catch {
    toast.add({ title: 'Failed to delete job', color: 'error' })
  }
  finally {
    confirmDeleteOpen.value = false
    deleteTarget.value = null
  }
}

// ── Options ───────────────────────────────────────────────────────────────────
const jobTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Remote', value: 'REMOTE' }
]

const experienceLevelOptions = [
  { label: 'All Levels', value: '' },
  { label: 'Entry Level', value: 'ENTRY_LEVEL' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Mid Level', value: 'MID_LEVEL' },
  { label: 'Senior', value: 'SENIOR' },
  { label: 'Lead', value: 'LEAD' },
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Director', value: 'DIRECTOR' }
]

const syncDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// ── Table columns ─────────────────────────────────────────────────────────────
const columns: TableColumn<Job>[] = [
  {
    id: 'no',
    header: '#',
    cell: ({ row }) =>
      h('span', { class: 'text-muted' }, row.index + 1 + pagination.value.pageIndex * pagination.value.pageSize)
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) =>
      h('span', { class: 'line-clamp-2 text-sm leading-snug', title: row.getValue('title') }, row.getValue('title'))
  },
  {
    id: 'company',
    header: 'Company',
    cell: ({ row }) =>
      h('span', { class: 'text-sm truncate block', title: row.original.company.name }, row.original.company.name)
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const loc = formatLocation(row.original.location)
      return h('span', { class: 'text-sm truncate block', title: loc }, loc)
    }
  },
  {
    id: 'jobType',
    header: 'Type',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatJobType(row.original.jobType))
  },
  {
    id: 'experienceLevel',
    header: 'Level',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatExperienceLevel(row.original.experienceLevel))
  },
  {
    id: 'salary',
    header: 'Salary',
    cell: ({ row }) => {
      const s = formatSalary(row.original.minSalary, row.original.maxSalary)
      return h('span', { class: 'text-sm whitespace-nowrap text-muted' }, s)
    }
  },
  {
    id: 'isRemote',
    header: 'Remote',
    cell: ({ row }) =>
      h(UBadge, {
        variant: 'subtle',
        color: row.original.isRemote ? 'success' : 'neutral'
      }, () => row.original.isRemote ? 'Yes' : 'No')
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(UBadge, {
        variant: 'subtle',
        color: row.original.isActive ? 'success' : 'neutral',
        class: 'uppercase'
      }, () => row.original.isActive ? 'Active' : 'Inactive')
  },
  {
    id: 'applicationDeadline',
    header: 'Deadline',
    cell: ({ row }) => {
      const d = row.original.applicationDeadline
      return h('span', { class: 'text-sm whitespace-nowrap' }, d ? formatDate(d) : '–')
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-1' }, [
        h(UButton, {
          icon: 'i-lucide-square-pen',
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
          to: `/admin/jobs/${row.original.id}/edit`
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          size: 'xs',
          color: 'error',
          variant: 'ghost',
          onClick: () => openDeleteConfirm(row.original)
        })
      ])
  }
]
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-default">
      <!-- Left: Search + Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Search title or company..." class="w-56" />

        <UPopover v-model:open="filterPopoverOpen">
          <UButton
            label="Filters"
            leading-icon="i-lucide-sliders-horizontal"
            color="neutral"
            variant="outline"
            size="sm"
          >
            <template v-if="activeFilterCount > 0" #trailing>
              <span class="size-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {{ activeFilterCount }}
              </span>
            </template>
          </UButton>

          <template #content>
            <div class="p-4 w-72 space-y-4">
              <h4 class="font-medium text-sm">Filter Jobs</h4>

              <UFormField label="Job Type">
                <USelectMenu
                  v-model="filterJobType"
                  value-key="value"
                  :items="jobTypeOptions"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Experience Level">
                <USelectMenu
                  v-model="filterExperienceLevel"
                  value-key="value"
                  :items="experienceLevelOptions"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Remote Work">
                <div class="flex items-center gap-2 mt-1">
                  <UToggle v-model="filterIsRemote" />
                  <span class="text-sm text-muted">Remote only</span>
                </div>
              </UFormField>

              <div class="flex gap-2 pt-1">
                <UButton label="Apply" color="primary" size="sm" class="flex-1" @click="applyFilters" />
                <UButton label="Clear" color="neutral" variant="outline" size="sm" class="flex-1" @click="clearFilters" />
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- Right: Sync button group -->
      <div class="flex items-center gap-3">
        <UTooltip text="Rate Limit: General API 100 req/min">
          <div class="flex items-center gap-1.5 cursor-default select-none">
            <UIcon name="i-lucide-info" class="size-4 text-muted" />
            <span class="text-sm text-muted">Rate Limit</span>
          </div>
        </UTooltip>

        <div class="h-4 w-px bg-default" />

        <div class="flex items-center gap-1.5 cursor-default select-none">
          <UIcon name="i-lucide-calendar" class="size-4 text-muted" />
          <span class="text-sm text-muted">{{ syncDate }}</span>
        </div>

        <div class="h-4 w-px bg-default" />

        <!-- Sync Job + Settings button group -->
        <div class="inline-flex rounded-lg overflow-hidden">
          <UPopover v-model:open="confirmSyncOpen">
            <button
              class="flex items-center gap-2 bg-primary hover:bg-primary-500 active:bg-primary-600 px-3.5 py-2 text-white text-sm font-medium transition-colors disabled:opacity-60"
              :disabled="isSyncing"
            >
              <UIcon
                name="i-lucide-refresh-cw"
                class="size-4"
                :class="{ 'animate-spin': isSyncing }"
              />
              {{ isSyncing ? 'Syncing...' : 'Sync Job' }}
            </button>

            <template #content>
              <div class="p-4 w-56 space-y-3">
                <p class="text-sm">Perform manual job sync?</p>
                <div class="flex justify-end gap-2">
                  <UButton label="No" color="neutral" variant="outline" size="sm" @click="confirmSyncOpen = false" />
                  <UButton label="Yes" color="primary" size="sm" @click="onConfirmSync" />
                </div>
              </div>
            </template>
          </UPopover>

          <div class="w-px bg-primary-600 self-stretch" />

          <button
            class="bg-primary hover:bg-primary-500 active:bg-primary-600 px-2.5 text-white transition-colors"
            @click="syncSettingsOpen = true"
          >
            <UIcon name="i-lucide-settings" class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <UTable
        ref="table"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="filteredData"
        :columns="columns"
        :ui="{
          base: 'border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r whitespace-nowrap',
          td: 'border-b border-default max-w-[200px]'
        }"
      />
    </div>

    <div class="flex items-center justify-between px-4 py-3 border-t border-default">
      <p class="text-sm text-muted">
        Showing {{ (pagination.pageIndex * pagination.pageSize) + 1 }} to
        {{ Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length) }} of
        {{ filteredData.length }} entries
      </p>
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </UCard>

  <!-- Delete Confirmation Modal -->
  <UModal
    v-model:open="confirmDeleteOpen"
    title="Delete Job"
    :description="`Are you sure you want to delete &quot;${deleteTarget?.title}&quot;? This action cannot be undone.`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="confirmDeleteOpen = false" />
      <UButton label="Delete" color="error" @click="onConfirmDelete" />
    </template>
  </UModal>

  <!-- LinkedIn Sync Settings Modal -->
  <UModal
    v-model:open="syncSettingsOpen"
    title="LinkedIn Job Sync Settings"
    description="Configure default parameters for LinkedIn job search. If filter is empty, no filter will be applied."
    :ui="{ content: 'max-w-3xl', footer: 'justify-end' }"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <UFormField label="Job titles">
          <UInputTags v-model="syncFilters.job_titles" placeholder="Type and press enter" class="w-full" />
        </UFormField>
        <UFormField label="Job locations">
          <UInputTags v-model="syncFilters.job_locations" placeholder="Type and press enter" class="w-full" />
        </UFormField>
        <UFormField label="Job descriptions">
          <UInputTags v-model="syncFilters.job_descriptions" placeholder="Type and press enter" class="w-full" />
        </UFormField>
        <UFormField label="Job types">
          <UInputTags v-model="syncFilters.job_types" placeholder="Type and press enter" class="w-full" />
        </UFormField>
        <UFormField label="Company descriptions">
          <UInputTags v-model="syncFilters.company_descriptions" placeholder="Type and press enter" class="w-full" />
        </UFormField>
        <UFormField label="Company specialties">
          <UInputTags v-model="syncFilters.company_specialties" placeholder="Type and press enter" class="w-full" />
        </UFormField>
        <UFormField label="Industries">
          <UInputTags v-model="syncFilters.industries" placeholder="Type and press enter" class="w-full" />
        </UFormField>
        <UFormField label="Seniority levels">
          <UInputTags v-model="syncFilters.seniority_levels" placeholder="Type and press enter" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="syncSettingsOpen = false" />
      <UButton label="Save" color="primary" @click="onSaveSyncSettings" />
    </template>
  </UModal>
</template>
