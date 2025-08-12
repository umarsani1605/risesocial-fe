<script setup>
import { ref, watch, computed } from 'vue';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RegistrationDetailModal from '@/components/admin/ryls/RegistrationDetailModal.vue';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { Toaster } from '@/components/ui/sonner';
import { ArrowUp, ArrowDown, Eye, Download, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useRylsAdmin } from '@/composables/useRylsAdmin';

definePageMeta({ layout: 'admin-dashboard', middleware: 'auth' });

// Client-side state
const search = ref('');
const status = ref('ALL'); // 'ALL' | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
const scholarshipType = ref('ALL'); // 'ALL' | 'FULLY_FUNDED' | 'SELF_FUNDED'

// Computed filters
const statusFilter = computed(() => (status.value === 'ALL' ? '' : status.value));
const scholarshipFilter = computed(() => (scholarshipType.value === 'ALL' ? '' : scholarshipType.value));

// Use RYLS admin composable
const {
  registrations: allRegistrations,
  isLoading,
  error,
  fetchRegistrations,
  deleteRegistration,
  exportRegistrations,
  downloadFile,
} = useRylsAdmin();

// Fetch all data once
const fetchAllData = async () => {
  try {
    await fetchRegistrations({
      page: 1,
      limit: 1000, // Fetch all data at once
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  } catch (e) {
    toast.error('Failed to fetch registrations');
  }
};

// Initial data fetch
fetchAllData();

// Client-side filtered data
const filteredRegistrations = computed(() => {
  if (!Array.isArray(allRegistrations.value)) return [];

  return allRegistrations.value.filter((registration) => {
    // Search filter
    const matchesSearch =
      !search.value ||
      registration.full_name?.toLowerCase().includes(search.value.toLowerCase()) ||
      registration.email?.toLowerCase().includes(search.value.toLowerCase()) ||
      registration.whatsapp?.includes(search.value) ||
      registration.institution?.toLowerCase().includes(search.value.toLowerCase());

    // Status filter
    const matchesStatus = status.value === 'ALL' || registration.payments?.some((p) => p.status === status.value);

    // Scholarship type filter
    const matchesScholarshipType = scholarshipType.value === 'ALL' || registration.scholarship_type === scholarshipType.value;

    return matchesSearch && matchesStatus && matchesScholarshipType;
  });
});

// Client-side sorting state
const sortBy = ref('created_at');
const sortDir = ref('desc'); // 'asc' | 'desc'

// Toggle sort direction or change sort column
const toggleSort = (key) => {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDir.value = 'asc';
  }
};

// Deep get nested property helper with array support
const getNestedValue = (obj, path) => {
  if (!obj) return '';
  return path.split('.').reduce((o, p) => {
    if (o === null || o === undefined) return '';
    if (Array.isArray(o) && !isNaN(p)) {
      return o[parseInt(p)] || '';
    }
    return o[p] !== undefined ? o[p] : '';
  }, obj);
};

// Apply sorting to filtered registrations
const sortedRegistrations = computed(() => {
  if (!filteredRegistrations.value.length) return [];

  const dir = sortDir.value === 'asc' ? 1 : -1;
  const sortKey = sortBy.value;

  return [...filteredRegistrations.value].sort((a, b) => {
    let aVal = getNestedValue(a, sortKey);
    let bVal = getNestedValue(b, sortKey);

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return -1 * dir;
    if (bVal == null) return 1 * dir;

    // Special handling for dates
    if (sortKey.includes('date') || sortKey.includes('created') || sortKey.includes('updated')) {
      const dateA = new Date(aVal);
      const dateB = new Date(bVal);
      const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
      const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
      return (timeA - timeB) * dir;
    }

    // Numeric comparison for numeric fields
    if (['amount', 'id'].some((prefix) => sortKey.includes(prefix))) {
      const numA = Number(aVal);
      const numB = Number(bVal);
      return (isNaN(numA) ? 0 : numA - (isNaN(numB) ? 0 : numB)) * dir;
    }

    // Default to case-insensitive string comparison
    return (
      String(aVal || '')
        .toLowerCase()
        .localeCompare(String(bVal || '').toLowerCase()) * dir
    );
  });
});

// Pagination
const page = ref(1);
const pageSize = ref(10);

// Compute paginated data from sorted results
const paginatedRegistrations = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedRegistrations.value.slice(start, end);
});

// Total pages for pagination
const pageCount = computed(() => Math.ceil(filteredRegistrations.value.length / pageSize.value));

// Delete confirmation dialog
const deleteDialogOpen = ref(false);
const registrationToDelete = ref(null);
const deleting = ref(false);

// Detail modal
const detailModalOpen = ref(false);
const selectedRegistration = ref(null);
const loadingDetail = ref(false);

const openView = (registration) => {
  selectedRegistration.value = registration;
  detailModalOpen.value = true;
};

const openDelete = (registration) => {
  registrationToDelete.value = registration;
  deleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (!registrationToDelete.value) return;
  try {
    deleting.value = true;
    await deleteRegistration(registrationToDelete.value.id);
    toast.success('Registration deleted successfully');
    deleteDialogOpen.value = false;
    registrationToDelete.value = null;
    fetchAllData();
  } catch (e) {
    toast.error(e.message || 'Failed to delete registration');
  } finally {
    deleting.value = false;
  }
};

const handleFileDownload = async (fileId) => {
  try {
    await downloadFile(fileId);
    toast.success('File download started');
  } catch (e) {
    toast.error(e.message || 'Failed to download file');
  }
};

// Export functionality
const handleExport = async () => {
  try {
    const blob = await exportRegistrations({
      status: statusFilter.value || undefined,
      scholarshipType: scholarshipFilter.value || undefined,
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `ryls-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success('Export completed successfully');
  } catch (e) {
    toast.error('Failed to export data');
  }
};

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

const formatPaymentStatus = (status) => {
  if (!status) return 'PENDING';
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getPaymentStatusVariant = (status) => {
  if (!status) return 'outline';

  switch (status.toLowerCase()) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
    case 'expired':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Format scholarship type for display
const formatScholarshipType = (type) => {
  if (!type) return 'N/A';
  return type === 'FULLY_FUNDED' ? 'Fully Funded' : 'Self Funded';
};

// Clear all filters
const clearFilters = () => {
  search.value = '';
  status.value = 'ALL';
  scholarshipType.value = 'ALL';
  page.value = 1; // Reset to first page when clearing filters
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Rise Young Leaders Scholarship Registrations</h1>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto flex-wrap">
        <Input class="w-full sm:w-64" placeholder="Search name or email..." v-model="search" />
        <Select v-model="scholarshipType">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="FULLY_FUNDED">Fully Funded</SelectItem>
            <SelectItem value="SELF_FUNDED">Self Funded</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-16">No</TableHead>
            <TableHead @click="toggleSort('full_name')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Name</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'full_name'">
                  <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                  <ArrowUp v-else class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead class="cursor-pointer">
              <div class="flex items-center">
                <span>Email</span>
              </div>
            </TableHead>
            <TableHead class="cursor-pointer">
              <div class="flex items-center">
                <span>Whatsapp</span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('nationality')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Nationality</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'nationality'">
                  <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                  <ArrowUp v-else class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('institution')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Institution</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'institution'">
                  <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                  <ArrowUp v-else class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('scholarship_type')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Type</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'scholarship_type'">
                  <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                  <ArrowUp v-else class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('scholarship_type')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Payment</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'scholarship_type'">
                  <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                  <ArrowUp v-else class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('created_at')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Registration Date</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'created_at'">
                  <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                  <ArrowUp v-else class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="!isLoading && sortedRegistrations.length > 0">
            <TableRow v-for="(registration, index) in paginatedRegistrations" :key="registration.id" class="hover:bg-muted/50">
              <TableCell class="text-center text-sm">
                {{ (page - 1) * pageSize + index + 1 }}
              </TableCell>
              <TableCell class="font-medium">
                {{ registration.full_name || 'N/A' }}
              </TableCell>
              <TableCell>
                {{ registration.email }}
              </TableCell>
              <TableCell>
                {{ registration.whatsapp }}
              </TableCell>
              <TableCell class="text-sm">
                {{ registration.nationality || 'N/A' }}
              </TableCell>
              <TableCell class="text-sm">
                {{ registration.institution || 'N/A' }}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  :class="[
                    'whitespace-nowrap',
                    registration.scholarship_type === 'FULLY_FUNDED' ? 'bg-primary text-white' : 'bg-primary/5 text-primary border border-primary',
                  ]"
                >
                  {{ formatScholarshipType(registration.scholarship_type) }}
                </Badge>
              </TableCell>
              <TableCell>
                <NuxtImg v-if="registration.payments[0].type === 'PAYPAL'" src="/images/payment-logo/paypal_small.png" alt="paypal" class="h-4" />
                <NuxtImg v-if="registration.payments[0].type === 'MIDTRANS'" src="/images/payment-logo/midtrans.png" alt="midtrans" class="h-3" />
              </TableCell>
              <TableCell class="text-sm text-muted-foreground whitespace-nowrap">
                {{ formatDate(registration.created_at) }}
              </TableCell>
              <TableCell class="w-24">
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" @click="openView(registration)">
                    <span>View</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else-if="isLoading">
            <TableCell :colspan="8" class="text-center py-8">
              <div class="flex flex-col items-center justify-center gap-2">
                <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
                <span class="text-sm text-muted-foreground">Loading registrations...</span>
              </div>
            </TableCell>
          </TableRow>

          <TableRow v-else>
            <TableCell :colspan="8" class="text-center py-8">
              <div class="flex flex-col items-center justify-center gap-2">
                <span class="text-muted-foreground">
                  {{ search || status !== 'ALL' || scholarshipType !== 'ALL' ? 'No matching registrations found' : 'No registrations yet' }}
                </span>
                <Button v-if="search || status !== 'ALL' || scholarshipType !== 'ALL'" variant="ghost" size="sm" @click="clearFilters" class="mt-2">
                  Clear filters
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">
          Showing {{ Math.min((page - 1) * pageSize + 1, filteredRegistrations.length) }} to
          {{ Math.min(page * pageSize, filteredRegistrations.length) }} of {{ filteredRegistrations.length }} entries
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <span class="whitespace-nowrap text-sm">Rows per page:</span>
          <Select v-model="pageSize" :disabled="isLoading">
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
          <Button variant="outline" size="sm" :disabled="page <= 1 || isLoading" @click="page--" class="h-8 w-8 p-0">
            <ChevronLeft class="h-4 w-4" />
            <span class="sr-only">Previous page</span>
          </Button>
          <div class="flex items-center justify-center w-8 h-8 text-sm">
            {{ page }}
          </div>
          <Button variant="outline" size="sm" :disabled="page >= pageCount || isLoading" @click="page++" class="h-8 w-8 p-0">
            <ChevronRight class="h-4 w-4" />
            <span class="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Registration Detail Modal -->
    <RegistrationDetailModal
      :open="detailModalOpen"
      @update:open="(value) => (detailModalOpen = value)"
      :registration="selectedRegistration"
      :loading="loadingDetail"
      @download-file="handleFileDownload"
    />
  </div>
</template>
