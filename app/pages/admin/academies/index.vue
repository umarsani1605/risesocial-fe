<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminAcademy } from '@/types'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'All Academy',
  navbarIcon: 'i-lucide-graduation-cap',
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
const statusFilter = ref('all')

const statusOptions: { label: string; value: 'all' | 'ACTIVE' | 'ARCHIVED' }[] = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Archived', value: 'ARCHIVED' }
]

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
    size: 150,
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UButton, {
          label: 'Edit',
          size: 'sm',
          color: 'primary',
          variant: 'outline',
          leadingIcon: 'ph:pencil-simple-bold',
          to: `/admin/academies/${row.original.slug}/edit`
        }),
        h(UButton, {
          label: 'Hapus',
          size: 'sm',
          color: 'error',
          variant: 'outline',
          leadingIcon: 'i-lucide-trash-2',
          onClick: () => confirmDelete(row.original)
        })
      ])
  }
]
</script>

<template>
  <UCard :ui="{ body: 'p-2!' }">
    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div class="flex flex-wrap items-center gap-2">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Search..." class="w-56" />
        <USelect v-model="categoryFilter" :items="categoryOptions" class="w-40" />
        <USelect v-model="statusFilter" :items="statusOptions" class="w-36" />
      </div>

      <UButton label="Add New" icon="i-lucide-plus" color="primary" to="/admin/academies/create" />
    </div>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="filteredData"
      :columns="columns"
    />

    <div class="flex items-center justify-between px-4 py-3">
      <p class="text-sm text-muted">
        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
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
  </UCard>

  <UModal v-model:open="deleteModalOpen" title="Hapus Academy" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-sm">
        Apakah kamu yakin ingin menghapus academy
        <span class="font-semibold">{{ deleteTarget?.title }}</span
        >? <br />Tindakan ini tidak dapat dibatalkan.
      </p>
    </template>
    <template #footer>
      <UButton label="Batal" color="neutral" variant="outline" @click="deleteModalOpen = false" />
      <UButton label="Hapus" color="error" :loading="loading" @click="onDelete" />
    </template>
  </UModal>
</template>
