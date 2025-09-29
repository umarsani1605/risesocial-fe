<script setup>
import { ref, computed } from 'vue';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'admin-dashboard',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/',
  },
  middleware: ['sidebase-auth'],
});

const {
  data: academies,
  pending: isLoading,
  error,
  refresh: refreshAcademies,
} = await useAPI('/admin/academies', {
  key: 'admin-academies-data',
  query: {
    limit: 100,
    sortBy: 'id',
    sortOrder: 'asc',
  },
  server: false,
  transform: (response) => (Array.isArray(response?.data) ? response.data : []),
});

const page = ref(1);
const pageSize = ref(10);
const sortBy = ref('id');
const sortDir = ref('asc');

// Filter states
const search = ref('');
const category = ref('ALL');
const status = ref('ALL');

// Unique categories computed
const uniqueCategories = computed(() => {
  if (!Array.isArray(academies.value)) return [];

  const categories = academies.value
    .map((academy) => academy.category)
    .filter(Boolean)
    .filter((category, index, array) => array.indexOf(category) === index)
    .sort();

  return categories;
});

const filtered = computed(() => {
  let filteredAcademies = Array.isArray(academies.value) ? [...academies.value] : [];

  const searchTerm = search.value.trim().toLowerCase();
  if (searchTerm) {
    filteredAcademies = filteredAcademies.filter(
      (academy) => (academy.title || '').toLowerCase().includes(searchTerm) || (academy.category || '').toLowerCase().includes(searchTerm)
    );
  }

  if (category.value !== 'ALL') {
    filteredAcademies = filteredAcademies.filter((academy) => academy.category === category.value);
  }

  if (status.value !== 'ALL') {
    filteredAcademies = filteredAcademies.filter((academy) => (academy.status || '').toString().toUpperCase() === status.value);
  }

  const sortDirection = sortDir.value === 'asc' ? 1 : -1;
  filteredAcademies.sort((a, b) => {
    if (sortBy.value === 'title') {
      return String(a.title || '').localeCompare(String(b.title || '')) * sortDirection;
    }
    if (sortBy.value === 'created_at') {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return (dateA - dateB) * sortDirection;
    }
    return 0;
  });

  return filteredAcademies;
});

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));
const showingStart = computed(() => Math.min((page.value - 1) * pageSize.value + 1, filtered.value.length));
const showingEnd = computed(() => Math.min(page.value * pageSize.value, filtered.value.length));

const toggleSort = (sortKey) => {
  if (sortBy.value === sortKey) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = sortKey;
    sortDir.value = 'asc';
  }
};

const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'success';
    case 'DRAFT':
      return 'warning';
    case 'ARCHIVED':
      return 'outline';
    default:
      return 'outline';
  }
};

const deleteDialogOpen = ref(false);
const selected = ref(null);

const onOpenDelete = (academy) => {
  selected.value = academy;
  deleteDialogOpen.value = true;
};

const onConfirmDelete = async () => {
  try {
    await $api(`/admin/academies/${selected.value.id}`, {
      method: 'DELETE',
    });

    toast.success('Academy berhasil dihapus');
    deleteDialogOpen.value = false;
    selected.value = null;
    await refreshAcademies();
  } catch (error) {
    console.error('Delete academy error:', error);
    toast.error(error?.data?.message || 'Gagal menghapus academy');
  }
};

const onOpenEdit = async (academy) => {
  await navigateTo(`/admin/academy/${academy.path_slug}`);
};

const onOpenAdd = async () => {
  await navigateTo('/admin/academy/new');
};

const pageSizes = [10, 20, 50, 100];
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Academy Management</h1>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto flex-wrap">
        <Input v-model="search" placeholder="Search title or category..." class="w-full sm:w-64" />
        <Select v-model="category">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem v-for="cat in uniqueCategories" :key="cat" :value="cat">
              {{ cat }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="status">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center justify-end gap-5">
        <Button @click="onOpenAdd" class="flex items-center gap-2">
          <Icon name="lucide:plus" size="16" />
          Add Academy
        </Button>
      </div>
    </div>

    <div class="rounded-md border">
      <Table class="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead class="w-[50px] min-w-[50px]">ID</TableHead>
            <TableHead @click="toggleSort('title')" class="cursor-pointer w-[300px] min-w-[300px]">
              Title
              <span v-if="sortBy === 'title'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead class="w-[120px] min-w-[120px]">Category</TableHead>
            <TableHead class="w-[100px] min-w-[100px]">Status</TableHead>
            <TableHead class="w-[100px] min-w-[100px]">Duration</TableHead>
            <TableHead class="w-[120px] min-w-[120px]">Format</TableHead>
            <TableHead @click="toggleSort('created_at')" class="cursor-pointer w-[150px] min-w-[150px]">
              Created At
              <span v-if="sortBy === 'created_at'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead class="px-4 sticky right-0 w-[120px] min-w-[120px] bg-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isLoading">
            <TableRow v-for="i in 5" :key="`loading-${i}`">
              <TableCell class="animate-pulse w-[50px] min-w-[50px]">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              </TableCell>
              <TableCell class="animate-pulse w-[300px] min-w-[300px]">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              </TableCell>
              <TableCell class="animate-pulse w-[120px] min-w-[120px]">
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              </TableCell>
              <TableCell class="animate-pulse w-[100px] min-w-[100px]">
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </TableCell>
              <TableCell class="animate-pulse w-[100px] min-w-[100px]">
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </TableCell>
              <TableCell class="animate-pulse w-[120px] min-w-[120px]">
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              </TableCell>
              <TableCell class="animate-pulse w-[150px] min-w-[150px]">
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </TableCell>
              <TableCell class="px-4 sticky right-0 w-[120px] min-w-[120px]">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <!-- Data Rows -->
          <template v-else-if="paginated.length">
            <TableRow v-for="academy in paginated" :key="academy.id">
              <TableCell class="font-medium truncate w-[50px] min-w-[50px]" :title="academy.id">
                {{ academy.id }}
              </TableCell>
              <TableCell class="font-medium truncate w-[300px] min-w-[300px]" :title="academy.title">
                {{ academy.title }}
              </TableCell>
              <TableCell class="truncate w-[120px] min-w-[120px]" :title="academy.category">
                {{ academy.category || '-' }}
              </TableCell>
              <TableCell class="w-[100px] min-w-[100px]">
                <Badge :variant="getStatusVariant(academy.status)">
                  {{ academy.status || '-' }}
                </Badge>
              </TableCell>
              <TableCell class="truncate w-[100px] min-w-[100px]" :title="academy.duration">
                {{ academy.duration || '-' }}
              </TableCell>
              <TableCell class="truncate w-[120px] min-w-[120px]" :title="academy.format">
                {{ academy.format || '-' }}
              </TableCell>
              <TableCell
                class="text-muted-foreground truncate w-[150px] min-w-[150px]"
                :title="academy.created_at ? new Date(academy.created_at).toLocaleString() : '-'"
              >
                {{ academy.created_at ? new Date(academy.created_at).toLocaleDateString() : '-' }}
              </TableCell>
              <TableCell class="px-4 sticky right-0 w-[120px] min-w-[120px] bg-white">
                <div class="flex items-center gap-2">
                  <Button size="sm" variant="outline" @click="onOpenEdit(academy)">
                    <Icon name="lucide:edit" class="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    class="hover:bg-destructive/90 hover:text-destructive-foreground"
                    @click="onOpenDelete(academy)"
                  >
                    <Icon name="lucide:trash-2" class="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <!-- Empty State -->
          <TableEmpty v-else :colspan="7">No data</TableEmpty>
        </TableBody>
      </Table>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground"> Showing {{ showingStart }} to {{ showingEnd }} of {{ filtered.length }} entries </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <span class="whitespacetext-sm text-muted-foreground">Rows per page:</span>
          <Select
            :model-value="pageSize"
            @update:model-value="
              (v) => {
                pageSize = Number(v);
                page = 1;
              }
            "
          >
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in pageSizes" :key="size" :value="size">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center gap-1">
          <Button variant="outline" size="sm" :disabled="page <= 1 || isLoading" @click="page--" class="h-8 w-8 p-0">
            <Icon name="lucide:chevron-left" class="h-4 w-4" />
            <span class="sr-only">Previous page</span>
          </Button>
          <div class="flex items-center justify-center w-8 h-8 text-sm">
            {{ page }}
          </div>
          <Button variant="outline" size="sm" :disabled="page >= totalPages || isLoading" @click="page++" class="h-8 w-8 p-0">
            <Icon name="lucide:chevron-right" class="h-4 w-4" />
            <span class="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Delete dialog -->
    <DeleteConfirmDialog
      v-model="deleteDialogOpen"
      :pending="false"
      title="Confirm Delete"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="onConfirmDelete"
    >
      Are you sure you want to delete academy <span class="font-medium">{{ selected?.title }}</span
      >? This action cannot be undone.
    </DeleteConfirmDialog>
  </div>
</template>
