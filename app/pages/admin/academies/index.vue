<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminAcademy } from '@/types'
import {
  ACADEMY_STATUS_FILTER_OPTIONS,
  ACADEMY_DURATION_OPTIONS,
  ACADEMY_FORMAT_OPTIONS
} from '@/constants/academy'
import { academyCreateSchema } from '@/schemas/academy'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'All Academy',
  middleware: 'admin'
})

const { api } = useApi()
const toast = useToast()

const { data: rawAcademies, refresh } = await useAsyncData('admin:academies', () =>
  api<ApiResponse<AdminAcademy[]>>('/admin/academies')
)

const deleteTarget = ref<AdminAcademy | null>(null)
const deleteModalOpen = ref(false)
const loading = ref(false)

// Create academy dialog
const createModalOpen = ref(false)
const isCreating = ref(false)
const createFormRef = useTemplateRef('createFormRef')
const createForm = reactive({ title: '', description: '', duration: '', format: '', category: '' })

async function onCreateAcademy() {
  isCreating.value = true
  const fd = new FormData()
  fd.append('title', createForm.title)
  fd.append('description', createForm.description)
  fd.append('duration', createForm.duration)
  fd.append('format', createForm.format)
  fd.append('category', createForm.category)
  fd.append('status', 'DRAFT')
  fd.append('certificate', 'false')
  fd.append('portfolio', 'false')
  try {
    const res = await api<ApiResponse<{ slug: string }>>('/admin/academies', {
      method: 'POST',
      body: fd
    })
    toast.add({ title: 'Academy created', color: 'success' })
    createModalOpen.value = false
    await navigateTo(`/admin/academies/${res.data.slug}/edit`)
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isCreating.value = false
  }
}

watch(createModalOpen, (val) => {
  if (!val) return
  createForm.title = ''
  createForm.description = ''
  createForm.duration = ''
  createForm.format = ''
  createForm.category = ''
})

function confirmDelete(academy: AdminAcademy) {
  deleteTarget.value = academy
  deleteModalOpen.value = true
}

async function onDelete() {
  if (!deleteTarget.value) return
  loading.value = true
  try {
    await api(`/admin/academies/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Academy deleted', color: 'success' })
    deleteModalOpen.value = false
    deleteTarget.value = null
    await refresh()
  } catch (error: any) {
    const message = error?.data?.message ?? 'An error occurred'
    toast.add({ title: message, color: 'error' })
  } finally {
    loading.value = false
  }
}

const categoryOptions = computed(() => {
  const cats = [...new Set((rawAcademies.value?.data ?? []).map((a) => a.category))]
  return [{ label: 'All Category', value: 'all' }, ...cats.map((c) => ({ label: c, value: c }))]
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const search = ref('')
const categoryFilter = ref('all')
const statusFilter = ref<'all' | 'ACTIVE' | 'ARCHIVED'>('all')

const statusOptions = ACADEMY_STATUS_FILTER_OPTIONS

const filteredData = computed(() => {
  let result = rawAcademies.value?.data ?? []
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(
      (a) => a.title.toLowerCase().includes(s) || a.category.toLowerCase().includes(s)
    )
  }
  if (categoryFilter.value !== 'all') {
    result = result.filter((a) => a.category === categoryFilter.value)
  }
  if (statusFilter.value !== 'all') {
    result = result.filter((a) => a.status === statusFilter.value)
  }
  return result
})

const columns: TableColumn<AdminAcademy>[] = [
  {
    id: 'no',
    header: '#',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.index + 1)
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.getValue('category'))
  },
  {
    accessorKey: 'duration',
    header: 'Duration'
  },
  {
    accessorKey: 'format',
    header: 'Format',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.getValue('format'))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const label = statusOptions.find((s) => s.value === status)?.label ?? status
      const color = status === 'ACTIVE' ? ('success' as const) : ('neutral' as const)
      return h(UBadge, { variant: 'subtle', color }, () => label)
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
          to: `/admin/academies/${row.original.slug}/edit`
        }),
        h(UButton, {
          label: 'Delete',
          size: 'sm',
          color: 'error',
          variant: 'outline',
          leadingIcon: 'i-ph-trash-simple-bold',
          onClick: () => confirmDelete(row.original)
        })
      ])
  }
]
</script>

<template>
  <AdminTableCard>
    <template #toolbar>
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <UInput
            v-model="search"
            icon="i-ph-magnifying-glass-bold"
            placeholder="Search..."
            class="w-full sm:w-56"
          />
          <div class="flex w-full sm:w-auto gap-2">
            <USelect
              v-model="categoryFilter"
              :items="categoryOptions"
              class="flex-1 sm:flex-none sm:w-40"
            />
            <USelect
              v-model="statusFilter"
              :items="statusOptions"
              class="flex-1 sm:flex-none sm:w-36"
            />
          </div>
        </div>
        <UButton
          label="Add New"
          icon="i-ph-plus-bold"
          color="primary"
          @click="createModalOpen = true"
        />
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
          {{ table?.tableApi?.getPaginationRowModel().rows.length ?? 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length ?? 0 }} shown.
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

  <UModal v-model:open="createModalOpen" title="Add New Academy" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm
        ref="createFormRef"
        :schema="academyCreateSchema"
        :state="createForm"
        class="space-y-4"
        @submit="onCreateAcademy"
      >
        <UFormField name="title" label="Title" required>
          <UInput v-model="createForm.title" placeholder="Academy title" class="w-full" />
        </UFormField>
        <UFormField name="description" label="Description" required>
          <UTextarea
            v-model="createForm.description"
            placeholder="Academy description"
            :rows="3"
            class="w-full"
          />
        </UFormField>
        <UFormField name="duration" label="Duration" required>
          <USelect
            v-model="createForm.duration"
            :items="ACADEMY_DURATION_OPTIONS"
            placeholder="Select duration"
            class="w-full"
          />
        </UFormField>
        <UFormField name="format" label="Format" required>
          <USelect
            v-model="createForm.format"
            :items="ACADEMY_FORMAT_OPTIONS"
            placeholder="Select format"
            class="w-full"
          />
        </UFormField>
        <UFormField name="category" label="Category" required>
          <UInput
            v-model="createForm.category"
            placeholder="e.g. Carbon Accounting"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="createModalOpen = false" />
      <UButton
        label="Create"
        color="primary"
        :loading="isCreating"
        @click="createFormRef?.submit()"
      />
    </template>
  </UModal>

  <UModal v-model:open="deleteModalOpen" title="Delete Academy" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-sm">
        Are you sure you want to delete
        <span class="font-semibold">{{ deleteTarget?.title }}</span
        >? <br />This action cannot be undone.
      </p>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="deleteModalOpen = false" />
      <UButton label="Delete" color="error" :loading="loading" @click="onDelete" />
    </template>
  </UModal>
</template>
