<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Administrators',
  middleware: 'admin'
})

useSeoMeta({ title: 'Administrators - Rise Social' })

const { api } = useApi()
const toast = useToast()

const { data: rawUsers, refresh } = await useAsyncData('admin:administrators', () =>
  api<ApiResponse<AdminUser[]>>('/admin/users')
)

const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
const columnPinning = ref({ right: ['actions'] })
const search = ref('')

const filteredData = computed(() => {
  let result = (rawUsers.value?.data ?? []).filter((u) => u.role === 'ADMIN')
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(
      (u) =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
    )
  }
  return result
})

// ── Create modal ─────────────────────────────────
const isCreateOpen = ref(false)
const isCreating = ref(false)

const createForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function openCreate() {
  createForm.first_name = ''
  createForm.last_name = ''
  createForm.email = ''
  createForm.password = ''
  createForm.confirmPassword = ''
  isCreateOpen.value = true
}

async function onCreate() {
  if (createForm.password !== createForm.confirmPassword) {
    toast.add({ title: 'Passwords do not match', color: 'error' })
    return
  }
  isCreating.value = true
  try {
    await api('/admin/users', {
      method: 'POST',
      body: {
        first_name: createForm.first_name,
        last_name: createForm.last_name,
        email: createForm.email,
        password: createForm.password,
        role: 'admin'
      }
    })
    toast.add({ title: 'Administrator created', color: 'success' })
    isCreateOpen.value = false
    await refresh()
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isCreating.value = false
  }
}

// ── Edit modal ───────────────────────────────────
const isEditOpen = ref(false)
const isSaving = ref(false)
const editingUser = ref<AdminUser | null>(null)

const editForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function openEdit(user: AdminUser) {
  editingUser.value = user
  editForm.first_name = user.first_name
  editForm.last_name = user.last_name
  editForm.email = user.email
  editForm.password = ''
  editForm.confirmPassword = ''
  isEditOpen.value = true
}

async function onSave() {
  if (!editingUser.value) return
  if (editForm.password !== editForm.confirmPassword) {
    toast.add({ title: 'Passwords do not match', color: 'error' })
    return
  }
  isSaving.value = true
  try {
    await api(`/admin/users/${editingUser.value.id}`, {
      method: 'PUT',
      body: {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        ...(editForm.password && { password: editForm.password })
      }
    })
    toast.add({ title: 'Administrator updated', color: 'success' })
    isEditOpen.value = false
    await refresh()
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

// ── Delete modal ─────────────────────────────────
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const deleteTarget = ref<AdminUser | null>(null)

function confirmDelete(user: AdminUser) {
  deleteTarget.value = user
  isDeleteOpen.value = true
}

async function executeDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/users/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.add({
      title: `Administrator "${deleteTarget.value.first_name} ${deleteTarget.value.last_name}" deleted`,
      color: 'success'
    })
    isDeleteOpen.value = false
    deleteTarget.value = null
    await refresh()
  } catch (error: any) {
    toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const columns: TableColumn<AdminUser>[] = [
  {
    id: 'no',
    header: '#',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.index + 1)
  },
  {
    accessorKey: 'first_name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original
      const name = `${user.first_name} ${user.last_name}`
      const initials = `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, { src: user.avatar ?? undefined, text: initials, size: 'xs', color: 'error' }),
        h('span', { class: 'font-medium' }, name)
      ])
    }
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) =>
      h('span', { class: row.getValue('phone') ? '' : 'text-muted' }, row.getValue('phone') ?? '–')
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => h('span', { class: 'text-muted' }, formatDate(row.getValue('created_at')))
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
          onClick: () => openEdit(row.original)
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
        <UInput
          v-model="search"
          icon="i-ph-magnifying-glass-bold"
          placeholder="Search name or email..."
          class="w-full sm:w-64"
        />
        <UButton label="Add New" icon="i-ph-plus-bold" color="primary" @click="openCreate" />
      </div>
    </template>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:column-pinning="columnPinning"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="filteredData"
      :columns="columns"
    />

    <template #footer>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-sm text-muted shrink-0">
          Showing {{ pagination.pageIndex * pagination.pageSize + 1 }} to
          {{ Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length) }} of
          {{ filteredData.length }} entries
        </p>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <USelect
              :model-value="pagination.pageSize"
              :items="[10, 25, 50, 100]"
              size="sm"
              class="w-20"
              @update:model-value="
                (val: number) => {
                  pagination.pageSize = Number(val)
                  pagination.pageIndex = 0
                }
              "
            />
          </div>
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            size="sm"
            variant="ghost"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </AdminTableCard>

  <AdminUserFormModal
    v-model:open="isCreateOpen"
    v-model:form="createForm"
    title="Add New Administrator"
    mode="create"
    :loading="isCreating"
    @submit="onCreate"
    @cancel="isCreateOpen = false"
  />

  <AdminUserFormModal
    v-model:open="isEditOpen"
    v-model:form="editForm"
    title="Edit Administrator"
    mode="edit"
    :loading="isSaving"
    @submit="onSave"
    @cancel="isEditOpen = false"
  />

  <AdminConfirmDeleteModal
    v-model:open="isDeleteOpen"
    :item-name="`${deleteTarget?.first_name} ${deleteTarget?.last_name}`"
    :loading="isDeleting"
    @confirm="executeDelete"
  />
</template>
