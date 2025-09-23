<script setup>
import { ref, watch, computed } from 'vue';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RegistrationDetailModal from '@/components/admin/ryls/RegistrationDetailModal.vue';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { Toaster } from '~/components/ui/sonner';
import { toast } from 'vue-sonner';
import { useRylsAdmin } from '@/composables/useRylsAdmin';
import { DISCOVER_SOURCES, SCHOLARSHIP_TYPES, GENDER_OPTIONS } from '~/constants/ryls';

definePageMeta({
  auth: true,
  layout: 'admin-dashboard',
});

const search = ref('');
const status = ref('ALL'); // 'ALL' | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
const scholarshipType = ref('ALL'); // 'ALL' | 'FULLY_FUNDED' | 'SELF_FUNDED'
const gender = ref('ALL'); // 'ALL' | 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY'
const nationality = ref('ALL'); // 'ALL' | specific nationality values
const paymentType = ref('ALL'); // 'ALL' | 'PAYPAL' | 'MIDTRANS'

const statusFilter = computed(() => (status.value === 'ALL' ? '' : status.value));
const scholarshipFilter = computed(() => (scholarshipType.value === 'ALL' ? '' : scholarshipType.value));
const genderFilter = computed(() => (gender.value === 'ALL' ? '' : gender.value));
const nationalityFilter = computed(() => (nationality.value === 'ALL' ? '' : nationality.value));
const paymentTypeFilter = computed(() => (paymentType.value === 'ALL' ? '' : paymentType.value));

// Get unique nationalities for filter options
const nationalityOptions = computed(() => {
  if (!Array.isArray(allRegistrations.value)) return [];

  // Get all nationalities, filter out null/undefined/empty values
  const allNationalities = allRegistrations.value
    .map((r) => r.nationality)
    .filter(Boolean) // Remove null, undefined, empty string
    .map((nat) => nat.trim()) // Remove leading/trailing whitespace
    .filter((nat) => nat.length > 0); // Remove empty strings after trim

  // Create a map to store original case versions
  const nationalityMap = new Map();

  allNationalities.forEach((nat) => {
    const lowerCase = nat.toLowerCase();
    // Keep the first occurrence with proper case, or update if current has better case (Title Case)
    if (!nationalityMap.has(lowerCase) || (nat.charAt(0) === nat.charAt(0).toUpperCase() && nat.slice(1) === nat.slice(1).toLowerCase())) {
      nationalityMap.set(lowerCase, nat);
    }
  });

  // Get unique nationalities with preserved case
  const uniqueNationalities = Array.from(nationalityMap.values());

  // Sort alphabetically
  return uniqueNationalities.sort((a, b) => a.localeCompare(b));
});

const { $api } = useNuxtApp();

const {
  data: allRegistrations,
  pending: isLoading,
  error,
  refresh: refreshRegistrations,
} = await useAPI('/admin/ryls/registrations', {
  key: 'admin-ryls-registrations-data',
  query: {
    page: 1,
    limit: 100,
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  transform: (response) => response?.data?.registrations || [],
});

// Action-based API calls using $api
const deleteRegistration = async (id) => {
  await $api(`/api/admin/ryls/registrations/${id}`, {
    method: 'DELETE',
  });
};

const exportRegistrationsExcel = async () => {
  const response = await $api('/admin/ryls/registrations/export-excel', {
    responseType: 'blob',
  });
  return response;
};

const downloadFile = async (fileId) => {
  const response = await $api(`/api/admin/uploads/${fileId}`);
  return response;
};

// Generate public file URL
const getFileUrl = (fileId) => {
  const baseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl}/api/uploads/${fileId}`;
};

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

    // Gender filter
    const matchesGender = gender.value === 'ALL' || registration.gender === gender.value;

    // Nationality filter
    const matchesNationality = nationality.value === 'ALL' || registration.nationality === nationality.value;

    // Payment type filter
    const matchesPaymentType = paymentType.value === 'ALL' || registration.payments?.some((p) => p.type === paymentType.value);

    return matchesSearch && matchesStatus && matchesScholarshipType && matchesGender && matchesNationality && matchesPaymentType;
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
    refreshRegistrations();
  } catch (e) {
    toast.error(e.message || 'Failed to delete registration');
  } finally {
    deleting.value = false;
  }
};

const formatGender = (gender) => {
  if (!gender) return '-';
  const option = GENDER_OPTIONS.find((g) => g.value === gender);
  return option.label;
};

const formatDateOfBirth = (date_of_birth) => {
  if (!date_of_birth) return '-';
  return new Date(date_of_birth).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDiscoverSource = (discover_source, discover_other_text) => {
  if (!discover_source) return '-';

  if (discover_source === 'OTHER' && discover_other_text) {
    return `Other: ${discover_other_text}`;
  }

  const source = DISCOVER_SOURCES.find((s) => s.value === discover_source);
  return source ? source.label : discover_source;
};

// Export functionality
const handleExportExcel = async () => {
  try {
    const blob = await exportRegistrationsExcel();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `ryls-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success('Excel export completed successfully');
  } catch (e) {
    toast.error('Failed to export Excel data');
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
  if (!type) return '-';
  return type === 'FULLY_FUNDED' ? 'Fully Funded' : 'Self Funded';
};

// Clear all filters
const clearFilters = () => {
  search.value = '';
  status.value = 'ALL';
  scholarshipType.value = 'ALL';
  gender.value = 'ALL';
  nationality.value = 'ALL';
  paymentType.value = 'ALL';
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
        <Select v-model="gender">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Genders</SelectItem>
            <SelectItem v-for="option in GENDER_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="nationality">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Nationality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Nationalities</SelectItem>
            <SelectItem v-for="nat in nationalityOptions" :key="nat" :value="nat">
              {{ nat }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="paymentType">
          <SelectTrigger class="w-36">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Payments</SelectItem>
            <SelectItem value="PAYPAL">PayPal</SelectItem>
            <SelectItem value="MIDTRANS">Midtrans</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Export Button -->
      <div class="flex gap-2">
        <Button size="sm" @click="handleExportExcel" :disabled="isLoading || sortedRegistrations.length === 0" class="flex items-center gap-2">
          <Icon name="lucide:download" class="w-4 h-4" />
          Export Excel
        </Button>
      </div>
    </div>

    <div class="rounded-md border w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-16">No</TableHead>
            <TableHead @click="toggleSort('full_name')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Name</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'full_name'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
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
            <TableHead class="cursor-pointer">
              <div class="flex items-center">
                <span>Gender</span>
              </div>
            </TableHead>
            <TableHead class="cursor-pointer">
              <div class="flex items-center">
                <span>Date of Birth</span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('nationality')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Residence</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'residence'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('nationality')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Nationality</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'nationality'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('nationality')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Second Nationality</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'nationality'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('institution')" class="cursor-pointer max-w-sm">
              <div class="flex items-center">
                <span>Institution</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'institution'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('discover_source')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Discover Source</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'discover_source'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('scholarship_type')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Type</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'scholarship_type'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('scholarship_type')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Payment</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'scholarship_type'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('scholarship_type')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Proof / Order ID</span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('scholarship_type')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Amount</span>
              </div>
            </TableHead>
            <TableHead @click="toggleSort('created_at')" class="cursor-pointer">
              <div class="flex items-center">
                <span>Registration Date</span>
                <span class="ml-1 text-muted-foreground inline-flex items-center" v-if="sortBy === 'created_at'">
                  <Icon v-if="sortDir === 'asc'" name="lucide:arrow-down" class="w-3 h-3" />
                  <Icon v-else name="lucide:arrow-up" class="w-3 h-3" />
                </span>
              </div>
            </TableHead>
            <TableHead class="px-4 sticky right-0 bg-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="!isLoading && sortedRegistrations.length > 0">
            <TableRow v-for="(registration, index) in paginatedRegistrations" :key="registration.id" class="hover:bg-muted/50">
              <TableCell class="text-center text-sm">
                {{ (page - 1) * pageSize + index + 1 }}
              </TableCell>
              <TableCell class="font-medium">
                {{ registration.full_name || '-' }}
              </TableCell>
              <TableCell>
                {{ registration.email }}
              </TableCell>
              <TableCell>
                {{ registration.whatsapp }}
              </TableCell>
              <TableCell class="text-sm capitalize">
                {{ formatGender(registration.gender) }}
              </TableCell>
              <TableCell class="text-sm">
                {{ formatDateOfBirth(registration.date_of_birth) }}
              </TableCell>
              <TableCell class="text-sm">
                {{ registration.residence || '-' }}
              </TableCell>
              <TableCell class="text-sm">
                {{ registration.nationality || '-' }}
              </TableCell>
              <TableCell class="text-sm">
                {{ registration.second_nationality || '-' }}
              </TableCell>
              <TableCell class="text-sm max-w-sm overflow-hidden overflow-ellipsis">
                {{ registration.institution || '-' }}
              </TableCell>
              <TableCell class="text-sm">
                {{ formatDiscoverSource(registration.discover_source, registration.discover_other_text) }}
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
                <NuxtImg
                  v-if="registration.payments[0].type === 'PAYPAL'"
                  src="/images/payment-logo/paypal_small.png"
                  alt="paypal"
                  class="h-4 w-auto object-contain"
                />
                <NuxtImg
                  v-if="registration.payments[0].type === 'MIDTRANS'"
                  src="/images/payment-logo/midtrans.png"
                  alt="midtrans"
                  class="h-5 w-auto object-contain"
                />
              </TableCell>
              <TableCell class="text-sm whitespace-nowrap max-w-52 overflow-hidden">
                <span v-if="registration.payments[0].type === 'PAYPAL'">
                  <a
                    as="a"
                    :href="getFileUrl(registration.payments[0].payment_proof_id)"
                    target="_blank"
                    class="flex items-center gap-2 overflow-hidden overflow-ellipsis justify-start hover:underline hover:text-primary"
                  >
                    <Icon name="lucide:square-arrow-out-up-right" class="size-3!" />
                    Payment Proof File
                  </a>
                </span>
                <span v-if="registration.payments[0].type === 'MIDTRANS'">
                  <a
                    as="a"
                    :href="`https://dashboard.midtrans.com/beta/transactions?type=order_id&query=${registration.payments[0].midtrans?.order_id}`"
                    target="_blank"
                    class="flex items-center gap-2 overflow-hidden overflow-ellipsis justify-start hover:underline hover:text-primary"
                  >
                    <Icon name="lucide:square-arrow-out-up-right" class="size-3!" />
                    {{ registration.payments[0].midtrans?.order_id }}
                  </a>
                </span>
              </TableCell>
              <TableCell class="text-sm">
                {{ `Rp${registration.payments[0].amount.toLocaleString('id-ID')}` || '-' }}
              </TableCell>
              <TableCell class="text-sm whitespace-nowrap">
                {{ formatDate(registration.created_at) }}
              </TableCell>
              <TableCell class="px-4 sticky right-0 bg-white">
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
                <Icon name="lucide:loader-2" class="h-6 w-6 animate-spin text-muted-foreground" />
                <span class="text-sm text-muted-foreground">Loading registrations...</span>
              </div>
            </TableCell>
          </TableRow>

          <TableRow v-else>
            <TableCell :colspan="17" class="text-center py-8">
              <div class="flex flex-col items-center justify-center gap-2">
                <span class="text-muted-foreground">
                  {{
                    search || status !== 'ALL' || scholarshipType !== 'ALL' || gender !== 'ALL' || nationality !== 'ALL' || paymentType !== 'ALL'
                      ? 'No matching registrations found'
                      : 'No registrations yet'
                  }}
                </span>
                <Button
                  v-if="search || status !== 'ALL' || scholarshipType !== 'ALL' || gender !== 'ALL' || nationality !== 'ALL' || paymentType !== 'ALL'"
                  variant="outline"
                  size="sm"
                  @click="clearFilters"
                  class="mt-2"
                >
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
            <Icon name="lucide:chevron-left" class="h-4 w-4" />
            <span class="sr-only">Previous page</span>
          </Button>
          <div class="flex items-center justify-center w-8 h-8 text-sm">
            {{ page }}
          </div>
          <Button variant="outline" size="sm" :disabled="page >= pageCount || isLoading" @click="page++" class="h-8 w-8 p-0">
            <Icon name="lucide:chevron-right" class="h-4 w-4" />
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
      @download-file="getFileUrl"
    />
  </div>
</template>
