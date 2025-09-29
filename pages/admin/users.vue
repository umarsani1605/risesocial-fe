<script setup>
import { ref, watch, computed } from 'vue';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import UserFormDialog from '@/components/admin/users/UserFormDialog.vue';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { Toaster } from '~/components/ui/sonner';
import { ArrowUp, ArrowDown } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'admin-dashboard',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: ['sidebase-auth'],
});

const { $api } = useNuxtApp();

const page = ref(1);
const limit = ref(10);
const search = ref('');
const role = ref('ALL'); // 'ALL' | 'USER' | 'ADMIN'
const roleFilter = computed(() => (role.value === 'ALL' ? '' : role.value));

// Initial data fetching with useAPI
const {
  data: usersResponse,
  pending,
  error,
  refresh: refreshUsers,
} = await useAPI('/admin/users', {
  key: 'admin-users-data',
  query: {
    page: String(page.value),
    limit: String(limit.value),
    ...(search.value ? { search: search.value } : {}),
    ...(roleFilter.value ? { role: roleFilter.value } : {}),
  },
  transform: (response) => ({
    users: response?.data || [],
    meta: response?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  }),
});

const users = computed(() => usersResponse.value?.users || []);
const meta = computed(() => usersResponse.value?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });

const pageCount = computed(() => Math.max(1, Number(meta.value.totalPages || 1)));
const totalItems = computed(() => Number(meta.value.total || 0));
const pageSizeDisplay = computed(() => Number(meta.value.limit || limit.value));
const showingStart = computed(() => Math.min((page.value - 1) * pageSizeDisplay.value + 1, totalItems.value));
const showingEnd = computed(() => Math.min(page.value * pageSizeDisplay.value, totalItems.value));

// Watch for changes and refresh data
watch(
  [page, limit, search, role],
  () => {
    refreshUsers();
  },
  { immediate: false }
);

const sortBy = ref('first_name');
const sortDir = ref('asc'); // 'asc' | 'desc'
const toggleSort = (key) => {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDir.value = 'asc';
  }
};

const sortedUsers = computed(() => {
  const arr = [...users.value];
  const dir = sortDir.value === 'asc' ? 1 : -1;
  return arr.sort((a, b) => {
    const va = a[sortBy.value];
    const vb = b[sortBy.value];
    if (va == null && vb == null) return 0;
    if (va == null) return -1 * dir;
    if (vb == null) return 1 * dir;
    if (sortBy.value === 'created_at') return (new Date(va) - new Date(vb)) * dir;
    return String(va).localeCompare(String(vb)) * dir;
  });
});

// Row actions & dialog
const dialogOpen = ref(false);
const dialogMode = ref('create');
const selectedUser = ref(null);
const saving = ref(false);

// Delete confirmation dialog
const deleteDialogOpen = ref(false);
const userToDelete = ref(null);
const deleting = ref(false);

const openCreate = () => {
  dialogMode.value = 'create';
  selectedUser.value = null;
  dialogOpen.value = true;
};
const openEdit = (u) => {
  dialogMode.value = 'edit';
  selectedUser.value = u;
  dialogOpen.value = true;
};
const openDelete = (u) => {
  userToDelete.value = u;
  deleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  try {
    deleting.value = true;
    await $api(`/api/admin/users/${userToDelete.value.id}`, {
      method: 'DELETE',
    });
    toast.success('User deleted');
    deleteDialogOpen.value = false;
    userToDelete.value = null;
    refreshUsers();
  } catch (e) {
    toast.error(e.message || 'Failed to delete user');
  } finally {
    deleting.value = false;
  }
};
const onSubmit = async (payload) => {
  try {
    saving.value = true;
    if (dialogMode.value === 'create') {
      await $api('/admin/users', {
        method: 'POST',
        body: payload,
      });
      toast.success('User created');
    } else {
      const updateBody = { ...payload };
      if (!updateBody.password) delete updateBody.password;
      await $api(`/api/admin/users/${selectedUser.value.id}`, {
        method: 'PUT',
        body: updateBody,
      });
      toast.success('User updated');
    }
    dialogOpen.value = false;
    refreshUsers();
  } catch (e) {
    toast.error(e.message || 'Failed to save user');
  } finally {
    saving.value = false;
  }
};

const pageSizes = [10, 20, 30, 50];
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Users Management</h1>

    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto">
        <Input class="w-full sm:w-64" placeholder="Search name/email/username" v-model="search" />
        <Select v-model="role">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex justify-end">
        <Button @click="openCreate">New User</Button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead @click="toggleSort('first_name')" class="cursor-pointer"
              >Name
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'first_name'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('email')" class="cursor-pointer"
              >Email
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'email'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead @click="toggleSort('role')" class="cursor-pointer"
              >Role
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'role'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('created_at')" class="cursor-pointer"
              >Created
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'created_at'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="sortedUsers.length">
            <TableRow v-for="u in sortedUsers" :key="u.id">
              <TableCell>{{ (u.first_name || '') + ' ' + (u.last_name || '') }}</TableCell>
              <TableCell>{{ u.email }}</TableCell>
              <TableCell class="text-muted-foreground">{{ u.phone || '-' }}</TableCell>
              <TableCell>
                <span
                  :class="u.role === 'ADMIN' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-700'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  >{{ u.role === 'ADMIN' ? 'Admin' : 'User' }}</span
                >
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ u.created_at ? new Date(u.created_at).toLocaleString() : '-' }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" @click="openEdit(u)">Edit</Button>
                  <Button variant="outline" size="sm" @click="openDelete(u)" class="hover:bg-destructive/90 hover:text-destructive-foreground"
                    >Delete</Button
                  >
                </div>
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else :colspan="6">No data</TableEmpty>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination (RYL style) -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground"> Showing {{ showingStart }} to {{ showingEnd }} of {{ totalItems }} entries </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            :model-value="pageSizeDisplay"
            @update:model-value="
              (v) => {
                limit = Number(v);
                page = 1;
              }
            "
          >
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in [10, 20, 50, 100]" :key="size" :value="size">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center gap-1">
          <Button variant="outline" size="sm" :disabled="page <= 1 || pending" @click="page--" class="h-8 w-8 p-0">
            <Icon name="lucide:chevron-left" class="h-4 w-4" />
            <span class="sr-only">Previous page</span>
          </Button>
          <div class="flex items-center justify-center w-8 h-8 text-sm">
            {{ page }}
          </div>
          <Button variant="outline" size="sm" :disabled="page >= pageCount || pending" @click="page++" class="h-8 w-8 p-0">
            <Icon name="lucide:chevron-right" class="h-4 w-4" />
            <span class="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>

    <UserFormDialog v-model="dialogOpen" :mode="dialogMode" :user="selectedUser" :pending="saving" @submit="onSubmit" />
    <DeleteConfirmDialog
      v-model="deleteDialogOpen"
      :pending="deleting"
      title="Confirm Delete"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
    >
      Are you sure you want to delete this user?
    </DeleteConfirmDialog>
  </div>
</template>
