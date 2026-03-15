<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminUser } from '~/composables/useMockAdminData'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Users Management',
  navbarIcon: 'i-lucide-users',
  middleware: 'admin'
})

useSeoMeta({ title: 'Users Management - Rise Social' })

const { api } = useApi()
const { data: rawUsers } = await useAsyncData('admin:users', () =>
  api<PaginatedResponse<AdminUser>>('/admin/users')
)

const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
const search = ref('')
const toast = useToast()

const filteredData = computed(() => {
  const result = rawUsers.value?.data ?? []
  if (!search.value) return result
  const s = search.value.toLowerCase()
  return result.filter(u =>
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(s) ||
    u.email.toLowerCase().includes(s)
  )
})

// ── Edit modal ──────────────────────────────────
const isEditOpen = ref(false)
const editingUser = ref<AdminUser | null>(null)

const editForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: 'USER',
  avatar: ''
})

const roleOptions = [
  { label: 'User', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Moderator', value: 'MODERATOR' }
]

function openEdit(user: AdminUser) {
  editingUser.value = user
  editForm.first_name = user.first_name
  editForm.last_name = user.last_name
  editForm.email = user.email
  editForm.phone = user.phone ?? ''
  editForm.role = user.role
  editForm.avatar = user.avatar ?? ''
  isEditOpen.value = true
}

async function onSave() {
  if (!editingUser.value) return
  await api(`/admin/users/${editingUser.value.id}`, {
    method: 'PUT',
    body: {
      first_name: editForm.first_name,
      last_name: editForm.last_name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role
    }
  })
  toast.add({ title: 'User updated successfully', color: 'success' })
  isEditOpen.value = false
  await refreshNuxtData('admin:users')
}

async function onDelete(user: AdminUser) {
  await api(`/admin/users/${user.id}`, { method: 'DELETE' })
  toast.add({ title: `User "${user.first_name} ${user.last_name}" deleted`, color: 'error' })
  await refreshNuxtData('admin:users')
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
    accessorKey: 'first_name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original
      const name = `${user.first_name} ${user.last_name}`
      const initials = `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, { src: user.avatar ?? undefined, text: initials, size: 'xs', color: 'primary' }),
        h('span', { class: 'font-medium' }, name)
      ])
    }
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => h('span', { class: row.getValue('phone') ? '' : 'text-muted' }, row.getValue('phone') ?? '–')
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => h('span', {}, formatDate(row.getValue('created_at')))
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
          onClick: () => openEdit(row.original)
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          size: 'xs',
          color: 'error',
          variant: 'ghost',
          onClick: () => onDelete(row.original)
        })
      ])
  }
]
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <div class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-default">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search name or email..."
        class="w-64"
      />
    </div>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="filteredData"
      :columns="columns"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default'
      }"
    />

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

  <!-- Edit User Modal -->
  <UModal v-model:open="isEditOpen" title="Edit User" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="First Name">
            <UInput v-model="editForm.first_name" placeholder="First name" class="w-full" />
          </UFormField>
          <UFormField label="Last Name">
            <UInput v-model="editForm.last_name" placeholder="Last name" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Email">
          <UInput v-model="editForm.email" type="email" placeholder="Email address" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Phone">
            <UInput v-model="editForm.phone" placeholder="+62..." class="w-full" />
          </UFormField>
          <UFormField label="Role">
            <USelect
              v-model="editForm.role"
              :items="roleOptions"
              placeholder="Role"
              class="w-full"
            />
          </UFormField>
        </div>
        <UFormField label="Avatar URL">
          <UInput v-model="editForm.avatar" placeholder="https://..." class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="isEditOpen = false" />
      <UButton label="Save" color="primary" @click="onSave" />
    </template>
  </UModal>
</template>
