<script setup>
import { ref, watch, computed } from 'vue';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/admin/ryls/StatusBadge.vue';
import ScholarshipBadge from '@/components/admin/ryls/ScholarshipBadge.vue';
import RegistrationDetailModal from '@/components/admin/ryls/RegistrationDetailModal.vue';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { Toaster } from '@/components/ui/sonner';
import { ArrowUp, ArrowDown, Eye, Download, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useRylsAdmin } from '@/composables/useRylsAdmin';

definePageMeta({ layout: 'admin-dashboard' });

// Server-side params
const page = ref(1);
const limit = ref(10);
const search = ref('');
const status = ref('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
const scholarshipType = ref('ALL'); // 'ALL' | 'FULLY_FUNDED' | 'SELF_FUNDED'

// Computed filters
const statusFilter = computed(() => (status.value === 'ALL' ? '' : status.value));
const scholarshipFilter = computed(() => (scholarshipType.value === 'ALL' ? '' : scholarshipType.value));

// Use RYLS admin composable (pattern mirip useAdminJobs)
const { registrations, isLoading, error, fetchRegistrations, getRegistrationById, deleteRegistration, exportRegistrations, downloadFile } =
  useRylsAdmin();

const meta = ref({ page: 1, limit: 10, total: 0, totalPages: 1 });

const fetchData = async () => {
  try {
    const result = await fetchRegistrations({
      page: page.value,
      limit: limit.value,
      search: search.value || undefined,
      status: statusFilter.value || undefined,
      scholarshipType: scholarshipFilter.value || undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
    });

    meta.value = result.pagination;
  } catch (e) {
    toast.error('Failed to fetch registrations');
  }
};

watch([page, limit, search, status, scholarshipType], fetchData, { immediate: true });

// Client-side sorting (on current page data)
const sortBy = ref('personalInfo.fullName');
const sortDir = ref('asc'); // 'asc' | 'desc'
const toggleSort = (key) => {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDir.value = 'asc';
  }
};

const sortedRegistrations = computed(() => {
  const arr = Array.isArray(registrations.value) ? [...registrations.value] : [];
  const dir = sortDir.value === 'asc' ? 1 : -1;
  return arr.sort((a, b) => {
    let va, vb;

    // Handle nested properties
    if (sortBy.value.includes('.')) {
      const keys = sortBy.value.split('.');
      va = keys.reduce((obj, key) => obj?.[key], a);
      vb = keys.reduce((obj, key) => obj?.[key], b);
    } else {
      va = a[sortBy.value];
      vb = b[sortBy.value];
    }

    if (va == null && vb == null) return 0;
    if (va == null) return -1 * dir;
    if (vb == null) return 1 * dir;
    if (sortBy.value === 'timestamps.createdAt') return (new Date(va) - new Date(vb)) * dir;
    return String(va).localeCompare(String(vb)) * dir;
  });
});

// Delete confirmation dialog
const deleteDialogOpen = ref(false);
const registrationToDelete = ref(null);
const deleting = ref(false);

// Detail modal
const detailModalOpen = ref(false);
const selectedRegistration = ref(null);
const loadingDetail = ref(false);

const openView = async (registration) => {
  try {
    loadingDetail.value = true;
    selectedRegistration.value = await getRegistrationById(registration.id);
    detailModalOpen.value = true;
  } catch (e) {
    toast.error('Failed to load registration details');
  } finally {
    loadingDetail.value = false;
  }
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
    fetchData();
  } catch (e) {
    toast.error(e.message || 'Failed to delete registration');
  } finally {
    deleting.value = false;
  }
};

const handleFileDownload = async (file) => {
  try {
    await downloadFile(file.id);
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
  return dateString ? new Date(dateString).toLocaleString() : '-';
};

const pageSizes = [10, 20, 30, 50];
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">RYLS Registrations</h1>
      <Button @click="handleExport" :disabled="isLoading" class="flex items-center gap-2">
        <Download class="w-4 h-4" />
        {{ isLoading ? 'Exporting...' : 'Export CSV' }}
      </Button>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto flex-wrap">
        <Input class="w-full sm:w-64" placeholder="Search name/email/submission ID" v-model="search" />
        <Select v-model="status">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
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
            <TableHead @click="toggleSort('submissionId')" class="cursor-pointer">
              Submission ID
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'submissionId'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('personalInfo.fullName')" class="cursor-pointer">
              Full Name
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'personalInfo.fullName'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('personalInfo.email')" class="cursor-pointer">
              Email
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'personalInfo.email'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Scholarship Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead @click="toggleSort('timestamps.createdAt')" class="cursor-pointer">
              Created
              <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'timestamps.createdAt'">
                <ArrowDown v-if="sortDir === 'asc'" class="w-3 h-3" />
                <ArrowUp v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="!isLoading && sortedRegistrations.length">
            <TableRow v-for="registration in sortedRegistrations" :key="registration.id">
              <TableCell class="font-mono text-sm">
                {{ registration.submissionId }}
              </TableCell>
              <TableCell class="font-medium">
                {{ registration.personalInfo?.fullName || '-' }}
              </TableCell>
              <TableCell>
                {{ registration.personalInfo?.email || '-' }}
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ registration.personalInfo?.nationality || '-' }}
              </TableCell>
              <TableCell>
                <ScholarshipBadge :type="registration.applicationInfo?.scholarshipType" />
              </TableCell>
              <TableCell>
                <StatusBadge :status="registration.applicationInfo?.status" />
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ formatDate(registration.timestamps?.createdAt) }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" class="flex items-center gap-1" @click="openView(registration)" :disabled="loadingDetail">
                    <Eye class="w-3 h-3" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else-if="!isLoading" :colspan="8">
            {{ error ? 'Failed to load data' : 'No registrations found' }}
          </TableEmpty>
          <TableRow v-else>
            <TableCell :colspan="8" class="text-center py-6"> Loading registrations... </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-2">
        <span class="text-sm">Rows per page</span>
        <Select :model-value="String(meta.limit)" @update:model-value="(v) => (limit = Number(v))">
          <SelectTrigger class="h-8 w-[80px]">
            <SelectValue :placeholder="String(meta.limit)" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="s in pageSizes" :key="s" :value="String(s)">{{ s }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" class="h-8 px-2" :disabled="meta.page <= 1" @click="page = Math.max(1, meta.page - 1)"> Prev </Button>
        <span class="text-sm">Page {{ meta.page }} of {{ meta.totalPages || 1 }}</span>
        <Button
          variant="outline"
          class="h-8 px-2"
          :disabled="meta.page >= (meta.totalPages || 1)"
          @click="page = Math.min(meta.totalPages || 1, meta.page + 1)"
        >
          Next
        </Button>
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
