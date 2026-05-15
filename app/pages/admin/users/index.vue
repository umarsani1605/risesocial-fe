<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'All Users',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'All Users - Rise Social' })

const { api } = useApi()
const toast = useToast()
const { canEdit } = useAuth()

const { data: rawUsers, refresh } = await useAsyncData('admin:users', () =>
  api<ApiResponse<UserProfile[]>>('/admin/users')
)

const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')

const route = useRoute()

const search = ref('')

const idFilter = computed(() => (route.query.id ? Number(route.query.id) : null))

const filteredData = computed(() => {
  let result = rawUsers.value?.data ?? []
  if (idFilter.value) {
    return result.filter((u) => u.id === idFilter.value)
  }
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
  isCreating.value = true
  try {
    await api('/admin/users', {
      method: 'POST',
      body: {
        first_name: createForm.first_name,
        last_name: createForm.last_name,
        email: createForm.email,
        password: createForm.password,
        role: 'user'
      }
    })
    toast.add({ title: 'User created', color: 'success' })
    isCreateOpen.value = false
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isCreating.value = false
  }
}

// ── Edit modal ───────────────────────────────────
const isEditOpen = ref(false)
const isSaving = ref(false)
const editingUser = ref<AdminUser | null>(null)
const isDetailOpen = ref(false)
const selectedUserDetail = ref<UserProfile | null>(null)
const isDetailSaving = ref(false)

const editForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '' as string
})

function openEdit(user: AdminUser) {
  editingUser.value = user
  editForm.first_name = user.first_name
  editForm.last_name = user.last_name
  editForm.email = user.email
  editForm.password = ''
  editForm.confirmPassword = ''
  editForm.role = user.role.toLowerCase()
  isEditOpen.value = true
}

function openDetail(user: UserProfile) {
  selectedUserDetail.value = user
  isDetailOpen.value = true
}

function normalizeOptionalText(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

async function onSaveDetail(form: AdminUserDetailForm) {
  if (!selectedUserDetail.value) return

  isDetailSaving.value = true
  try {
    const body = new FormData()
    body.append('username', form.username.trim())
    body.append('first_name', form.first_name.trim())
    body.append('last_name', form.last_name.trim())
    body.append('email', form.email.trim())
    body.append('phone', form.phone.trim())
    body.append('role', form.role)
    body.append('gender', form.gender)
    body.append('country', form.country.trim())
    body.append('province', form.province.trim())
    body.append('city', form.city.trim())
    body.append('last_education', form.last_education.trim())
    body.append('current_job', form.current_job.trim())
    body.append('current_company', form.current_company.trim())
    body.append('avatar', normalizeOptionalText(form.avatar) ?? '')
    if (form.avatarFile) {
      body.append('image', form.avatarFile)
    }

    await api(`/admin/users/${selectedUserDetail.value.id}`, {
      method: 'PUT',
      body
    })

    toast.add({ title: 'User updated', color: 'success' })
    isDetailOpen.value = false
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDetailSaving.value = false
  }
}

async function onSave() {
  if (!editingUser.value) return
  isSaving.value = true
  try {
    await api(`/admin/users/${editingUser.value.id}`, {
      method: 'PUT',
      body: {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        ...(editForm.password && { password: editForm.password }),
        ...(editForm.role && { role: editForm.role })
      }
    })
    toast.add({ title: 'User updated', color: 'success' })
    isEditOpen.value = false
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSaving.value = false
  }
}

// ── Delete modal ─────────────────────────────────
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const deleteTarget = ref<UserProfile | null>(null)

function confirmDelete(user: UserProfile) {
  deleteTarget.value = user
  isDeleteOpen.value = true
}

async function executeDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await api(`/admin/users/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.add({
      title: `User "${deleteTarget.value.first_name} ${deleteTarget.value.last_name}" deleted`,
      color: 'success'
    })
    isDeleteOpen.value = false
    deleteTarget.value = null
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

// ── Export ───────────────────────────────────────────────────────
const isExporting = ref(false)

async function exportExcel() {
  isExporting.value = true
  try {
    const blob = await api('/admin/users/export-excel', { responseType: 'blob' }) as Blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isExporting.value = false
  }
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
        h(UAvatar, {
          src: user.avatar ?? undefined,
          text: initials,
          size: 'sm',
          color: 'primary',
          class: 'bg-primary text-white text-xs rounded-full'
        }),
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
    cell: ({ row }) =>
      h('span', { class: 'text-muted' }, formatDatetime(row.getValue('created_at')))
  },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UButton, {
          label: 'Detail',
          size: 'sm',
          color: 'primary',
          variant: 'light',
          leadingIcon: 'i-ph-magnifying-glass-bold',
          onClick: () => openDetail(row.original)
        })
      ].filter(Boolean))
  }
]
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :data="filteredData"
    :columns="columns"
    search-placeholder="Search name or email..."
  >
    <template #toolbar-right>
      <div class="flex items-center gap-2">
        <UButton
          label="Export Excel"
          leading-icon="i-ph-download-simple-bold"
          color="neutral"
          variant="outline"
          :loading="isExporting"
          :disabled="isExporting"
          @click="exportExcel"
        />
        <UButton v-if="canEdit('admin.users')" label="Add New" icon="i-ph-plus-bold" color="primary" @click="openCreate" />
      </div>
    </template>
  </AdminDataTable>

  <AdminUserFormModal
    v-model:open="isCreateOpen"
    v-model:form="createForm"
    title="Add New User"
    mode="create"
    :loading="isCreating"
    @submit="onCreate"
    @cancel="isCreateOpen = false"
  />

  <AdminUserFormModal
    v-model:open="isEditOpen"
    v-model:form="editForm"
    title="Edit User"
    mode="edit"
    :loading="isSaving"
    @submit="onSave"
    @cancel="isEditOpen = false"
  />

  <AdminUserDetailSlideover
    v-model:open="isDetailOpen"
    :user="selectedUserDetail"
    :loading="isDetailSaving"
    :show-delete="canEdit('admin.users')"
    delete-label="Hapus User"
    @submit="onSaveDetail"
    @delete="
      () => {
        if (!selectedUserDetail) return
        isDetailOpen = false
        confirmDelete(selectedUserDetail)
      }
    "
  />

  <AdminConfirmDeleteModal
    v-model:open="isDeleteOpen"
    :item-name="`${deleteTarget?.first_name} ${deleteTarget?.last_name}`"
    :loading="isDeleting"
    @confirm="executeDelete"
  />
</template>
