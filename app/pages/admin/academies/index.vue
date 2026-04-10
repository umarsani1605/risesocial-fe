<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminAcademy } from '@/types'
import { ACADEMY_STATUS_FILTER_OPTIONS } from '@/constants/academy'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'All Academy',
  middleware: ['auth', 'admin']
})

const { api } = useApi()
const toast = useToast()

const { data: rawAcademies, refresh } = await useAsyncData('admin:academies', () =>
  api<ApiResponse<AdminAcademy[]>>('/admin/academies')
)

const deleteTarget = ref<AdminAcademy | null>(null)
const isDeleteOpen = ref(false)
const isDeleting = ref(false)

const createModalOpen = ref(false)
const isCreating = ref(false)
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
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isCreating.value = false
  }
}

watch(createModalOpen, (val) => {
  if (!val) return
  Object.assign(createForm, { title: '', description: '', duration: '', format: '', category: '' })
})

function confirmDelete(academy: AdminAcademy) {
  deleteTarget.value = academy
  isDeleteOpen.value = true
}

async function onDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/academies/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Academy deleted', color: 'success' })
    isDeleteOpen.value = false
    deleteTarget.value = null
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const categoryOptions = computed(() => {
  const cats = [...new Set((rawAcademies.value?.data ?? []).map((a) => a.category))]
  return [{ label: 'All Category', value: 'all' }, ...cats.map((c) => ({ label: c, value: c }))]
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

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
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
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
  <AdminDataTable
    v-model:search="search"
    :data="filteredData"
    :columns="columns"
    search-class="w-full sm:w-56"
  >
    <template #toolbar-left>
      <div class="flex w-full sm:w-auto gap-2">
        <USelect v-model="categoryFilter" :items="categoryOptions" class="flex-1 sm:flex-none sm:w-40" />
        <USelect v-model="statusFilter" :items="statusOptions" class="flex-1 sm:flex-none sm:w-36" />
      </div>
    </template>
    <template #toolbar-right>
      <UButton label="Add New" icon="i-ph-plus-bold" color="primary" @click="createModalOpen = true" />
    </template>
  </AdminDataTable>

  <AdminAcademyCreateModal
    v-model:open="createModalOpen"
    v-model:form="createForm"
    :loading="isCreating"
    @submit="onCreateAcademy"
  />

  <AdminConfirmDeleteModal
    v-model:open="isDeleteOpen"
    :item-name="deleteTarget?.title"
    :loading="isDeleting"
    @confirm="onDelete"
  />
</template>
