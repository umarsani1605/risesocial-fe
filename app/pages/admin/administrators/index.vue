<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Administrators',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Administrators - Rise Social' })

const { api } = useApi()
const toast = useToast()
const { canEdit } = useAuth()

const { data: rawUsers, refresh } = await useAsyncData('admin:administrators', () =>
  api<ApiResponse<UserProfile[]>>('/admin/users')
)

const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')

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
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isCreating.value = false
  }
}

// ── Detail slideover ─────────────────────────────
const isDetailOpen = ref(false)
const isDetailSaving = ref(false)
const selectedAdministrator = ref<UserProfile | null>(null)

function openDetail(user: UserProfile) {
  selectedAdministrator.value = user
  isDetailOpen.value = true
}

async function onSaveDetail(form: AdminUserDetailForm) {
  if (!selectedAdministrator.value) return

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
    body.append('avatar', form.avatar.trim())
    if (form.avatarFile) {
      body.append('image', form.avatarFile)
    }

    await api(`/admin/users/${selectedAdministrator.value.id}`, {
      method: 'PUT',
      body
    })

    toast.add({ title: 'Administrator updated', color: 'success' })
    isDetailOpen.value = false
    await refresh()
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isDetailSaving.value = false
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
      title: `Administrator "${deleteTarget.value.first_name} ${deleteTarget.value.last_name}" deleted`,
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

const columns: TableColumn<UserProfile>[] = [
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
          size: 'md',
          color: 'primary',
          class: 'bg-primary text-white text-sm rounded-full'
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
      h(
        'div',
        { class: 'flex items-center gap-2' },
        [
          h(UButton, {
            label: 'Detail',
            size: 'sm',
            color: 'primary',
            variant: 'light',
            leadingIcon: 'i-ph-magnifying-glass-bold',
            onClick: () => openDetail(row.original)
          })
        ].filter(Boolean)
      )
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
      <UButton
        v-if="canEdit('admin.users')"
        label="Add New"
        icon="i-ph-plus-bold"
        color="primary"
        @click="openCreate"
      />
    </template>
  </AdminDataTable>

  <AdminUserFormModal
    v-model:open="isCreateOpen"
    v-model:form="createForm"
    title="Add New Administrator"
    mode="create"
    :loading="isCreating"
    @submit="onCreate"
    @cancel="isCreateOpen = false"
  />

  <AdminUserDetailSlideover
    v-model:open="isDetailOpen"
    :user="selectedAdministrator"
    :user-id="selectedAdministrator?.id"
    :loading="isDetailSaving"
    title="Administrator Detail"
    description="Edit administrator information."
    :show-permissions="true"
    :show-delete="canEdit('admin.users')"
    delete-label="Hapus"
    :role-items="[
      { label: 'User', value: 'USER' },
      { label: 'Admin', value: 'ADMIN' }
    ]"
    @submit="onSaveDetail"
    @delete="
      () => {
        if (!selectedAdministrator) return
        isDetailOpen = false
        confirmDelete(selectedAdministrator)
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
