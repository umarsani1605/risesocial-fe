<script setup>
import { ref, computed } from 'vue';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { toast } from 'vue-sonner';

definePageMeta({
  auth: true,
  layout: 'admin-dashboard',
});

// Data fetching
const {
  data: bootcamps,
  pending: isLoading,
  error,
  refresh: refreshBootcamps,
} = await useAPI('/admin/bootcamps', {
  key: 'admin-bootcamps-data',
  query: {
    limit: 100,
    sortBy: 'title',
    sortOrder: 'asc',
  },
  server: false,
  transform: (response) => (Array.isArray(response?.data) ? response.data : []),
});

// State management
const page = ref(1);
const pageSize = ref(10);
const sortBy = ref('title');
const sortDir = ref('asc');

// Computed properties
const filtered = computed(() => {
  let filteredBootcamps = Array.isArray(bootcamps.value) ? [...bootcamps.value] : [];

  // Sort logic
  const sortDirection = sortDir.value === 'asc' ? 1 : -1;
  filteredBootcamps.sort((a, b) => {
    if (sortBy.value === 'title') {
      return String(a.title || '').localeCompare(String(b.title || '')) * sortDirection;
    }
    if (sortBy.value === 'rating') {
      return ((a.rating || 0) - (b.rating || 0)) * sortDirection;
    }
    if (sortBy.value === 'created_at') {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return (dateA - dateB) * sortDirection;
    }
    return 0;
  });

  return filteredBootcamps;
});

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));

// Helper functions
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
      return 'default';
    case 'DRAFT':
      return 'secondary';
    case 'ARCHIVED':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Delete dialog
const deleteDialogOpen = ref(false);
const selected = ref(null);

const onOpenDelete = (bootcamp) => {
  selected.value = bootcamp;
  deleteDialogOpen.value = true;
};

const onConfirmDelete = async () => {
  try {
    // TODO: Implement delete API call
    toast.success('Bootcamp deleted');
    deleteDialogOpen.value = false;
    selected.value = null;
    await refreshBootcamps();
  } catch (error) {
    toast.error(error?.message || 'Gagal menghapus bootcamp');
  }
};

const onOpenEdit = (bootcamp) => {
  // Navigate to edit page
  navigateTo(`/admin/bootcamp/${bootcamp.path_slug}`);
};

// Page sizes
const pageSizes = [10, 20, 30, 50];
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Bootcamp Management</h1>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto">
        <!-- No search/filter for now as requested -->
      </div>
      <div class="flex items-center justify-end gap-5">
        <!-- Future action buttons can be added here -->
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead @click="toggleSort('title')" class="cursor-pointer max-w-xs">
              Title
              <span v-if="sortBy === 'title'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead class="max-w-48">Slug</TableHead>
            <TableHead class="max-w-24">Status</TableHead>
            <TableHead class="max-w-32">Category</TableHead>
            <TableHead class="max-w-24">Duration</TableHead>
            <TableHead class="max-w-24">Format</TableHead>
            <TableHead @click="toggleSort('rating')" class="cursor-pointer max-w-20">
              Rating
              <span v-if="sortBy === 'rating'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('created_at')" class="cursor-pointer max-w-36">
              Created At
              <span v-if="sortBy === 'created_at'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead class="px-4 sticky right-0 bg-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="paginated.length">
            <TableRow v-for="bootcamp in paginated" :key="bootcamp.id">
              <TableCell class="font-medium max-w-xs truncate" :title="bootcamp.title">
                {{ bootcamp.title }}
              </TableCell>
              <TableCell class="max-w-48 truncate" :title="bootcamp.path_slug">
                {{ bootcamp.path_slug || '-' }}
              </TableCell>
              <TableCell class="max-w-24">
                <Badge :variant="getStatusVariant(bootcamp.status)" class="text-xs">
                  {{ bootcamp.status || '-' }}
                </Badge>
              </TableCell>
              <TableCell class="max-w-32 truncate" :title="bootcamp.category">
                {{ bootcamp.category || '-' }}
              </TableCell>
              <TableCell class="max-w-24 truncate" :title="bootcamp.duration">
                {{ bootcamp.duration || '-' }}
              </TableCell>
              <TableCell class="max-w-24 truncate" :title="bootcamp.format">
                {{ bootcamp.format || '-' }}
              </TableCell>
              <TableCell class="max-w-20 text-center">
                <div v-if="bootcamp.rating" class="flex items-center gap-1">
                  <Icon name="lucide:star" class="w-3 h-3 text-yellow-500 fill-current" />
                  <span class="text-sm">{{ bootcamp.rating.toFixed(1) }}</span>
                </div>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell
                class="text-muted-foreground max-w-36 truncate"
                :title="bootcamp.created_at ? new Date(bootcamp.created_at).toLocaleString() : '-'"
              >
                {{ bootcamp.created_at ? new Date(bootcamp.created_at).toLocaleString() : '-' }}
              </TableCell>
              <TableCell class="px-4 sticky right-0 bg-white">
                <div class="flex items-center gap-2">
                  <Button size="sm" variant="outline" @click="onOpenEdit(bootcamp)"> Edit </Button>
                  <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onOpenDelete(bootcamp)"> Delete </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else :colspan="9">No data</TableEmpty>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-2">
        <span class="text-sm">Rows per page</span>
        <Select :model-value="String(pageSize)" @update:model-value="(newValue) => (pageSize = Number(newValue))">
          <SelectTrigger class="h-8 w-[80px]">
            <SelectValue :placeholder="String(pageSize)" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSizeOption in pageSizes" :key="pageSizeOption" :value="String(pageSizeOption)">
              {{ pageSizeOption }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" class="h-8 px-2" :disabled="page <= 1" @click="page = Math.max(1, page - 1)"> Prev </Button>
        <span class="text-sm">Page {{ page }} of {{ totalPages }}</span>
        <Button variant="outline" class="h-8 px-2" :disabled="page >= totalPages" @click="page = Math.min(totalPages, page + 1)"> Next </Button>
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
      Are you sure you want to delete bootcamp <span class="font-medium">{{ selected?.title }}</span
      >? This action cannot be undone.
    </DeleteConfirmDialog>
  </div>
</template>
