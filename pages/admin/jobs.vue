<script setup>
import { ref, onMounted, computed } from 'vue';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-vue-next';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import JobFormDialog from '@/components/admin/jobs/JobFormDialog.vue';
import { useAdminJobs } from '@/composables/useAdminJobs';
import { toast } from 'vue-sonner';

definePageMeta({ layout: 'admin-dashboard' });

// Data & API
const { jobs, isLoading, error, fetchJobs, deleteJob } = useAdminJobs();

// UI state
const search = ref('');
const jobType = ref('ALL');
const experienceLevel = ref('ALL');
const remote = ref('ALL'); // ALL | YES | NO

const page = ref(1);
const pageSize = ref(10);

const sortBy = ref('posted'); // 'title' | 'company' | 'posted' | 'salary'
const sortDir = ref('desc'); // 'asc' | 'desc'

const filtered = computed(() => {
  let arr = Array.isArray(jobs.value) ? [...jobs.value] : [];

  // search by title/company
  const term = search.value.trim().toLowerCase();
  if (term) {
    arr = arr.filter((j) => (j.title || '').toLowerCase().includes(term) || (j.company?.name || j.company || '').toLowerCase().includes(term));
  }

  // jobType
  if (jobType.value !== 'ALL') {
    arr = arr.filter((j) => (j.jobType || j.employment_type || '').toString().toUpperCase() === jobType.value);
  }

  // experienceLevel
  if (experienceLevel.value !== 'ALL') {
    arr = arr.filter((j) => (j.experienceLevel || j.seniority_level || j.experience || '').toString().toUpperCase() === experienceLevel.value);
  }

  // remote
  if (remote.value !== 'ALL') {
    const wantRemote = remote.value === 'YES';
    arr = arr.filter((j) => Boolean(j.isRemote ?? j.is_remote ?? j.location?.is_remote) === wantRemote);
  }

  // sort
  const dir = sortDir.value === 'asc' ? 1 : -1;
  arr.sort((a, b) => {
    const val = (k, obj) => obj?.[k] ?? obj?.company?.[k] ?? obj?.location?.[k] ?? null;
    if (sortBy.value === 'title') return String(a.title || '').localeCompare(String(b.title || '')) * dir;
    if (sortBy.value === 'company') return String(a.company?.name || a.company || '').localeCompare(String(b.company?.name || b.company || '')) * dir;
    if (sortBy.value === 'salary') return ((a.maxSalary || a.salary_max || 0) - (b.maxSalary || b.salary_max || 0)) * dir;
    // posted
    const da = new Date(a.posted_date || a.datePosted || a.created_at || 0);
    const db = new Date(b.posted_date || b.datePosted || b.created_at || 0);
    return (da - db) * dir;
  });

  return arr;
});

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));

const toggleSort = (key) => {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortDir.value = 'asc';
  }
};

// Delete dialog
const deleteDialogOpen = ref(false);
const selected = ref(null);
const onOpenDelete = (row) => {
  selected.value = row;
  deleteDialogOpen.value = true;
};
const onConfirmDelete = async () => {
  try {
    await deleteJob(selected.value.id);
    toast.success('Job deleted');
    deleteDialogOpen.value = false;
    selected.value = null;
    await fetchJobs();
  } catch (e) {
    toast.error(e?.message || 'Gagal menghapus job');
  }
};

onMounted(() => {
  fetchJobs();
});

const pageSizes = [10, 20, 30, 50];

// Create/Edit dialog
const formOpen = ref(false);
const formMode = ref('create');
const editing = ref(null);
const saving = ref(false);

const onOpenCreate = () => {
  formMode.value = 'create';
  editing.value = null;
  formOpen.value = true;
};

const onOpenEdit = (row) => {
  formMode.value = 'edit';
  editing.value = row;
  formOpen.value = true;
};

const { createJob, updateJob } = useAdminJobs();
const onSubmitForm = async (payload) => {
  try {
    saving.value = true;
    if (formMode.value === 'create') {
      await createJob(payload);
      toast.success('Job created');
    } else if (editing.value) {
      await updateJob(editing.value.id, payload);
      toast.success('Job updated');
    }
    formOpen.value = false;
    await fetchJobs();
  } catch (e) {
    toast.error(e?.message || 'Gagal menyimpan job');
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Jobs Management</h1>

    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto">
        <Input v-model="search" placeholder="Search title/company" class="w-full sm:w-72" />
        <Select v-model="jobType">
          <SelectTrigger class="w-40"><SelectValue placeholder="Job Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="FULL_TIME">FULL_TIME</SelectItem>
            <SelectItem value="PART_TIME">PART_TIME</SelectItem>
            <SelectItem value="CONTRACT">CONTRACT</SelectItem>
            <SelectItem value="INTERNSHIP">INTERNSHIP</SelectItem>
            <SelectItem value="FREELANCE">FREELANCE</SelectItem>
            <SelectItem value="REMOTE">REMOTE</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="experienceLevel">
          <SelectTrigger class="w-44"><SelectValue placeholder="Experience" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="ENTRY_LEVEL">ENTRY_LEVEL</SelectItem>
            <SelectItem value="JUNIOR">JUNIOR</SelectItem>
            <SelectItem value="MID_LEVEL">MID_LEVEL</SelectItem>
            <SelectItem value="SENIOR">SENIOR</SelectItem>
            <SelectItem value="LEAD">LEAD</SelectItem>
            <SelectItem value="MANAGER">MANAGER</SelectItem>
            <SelectItem value="DIRECTOR">DIRECTOR</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="remote">
          <SelectTrigger class="w-32"><SelectValue placeholder="Remote" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="YES">Yes</SelectItem>
            <SelectItem value="NO">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex justify-end">
        <Button>
          <RefreshCcw class="text-white!" />
          Sync Job
        </Button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead @click="toggleSort('title')" class="cursor-pointer"
              >Title
              <span v-if="sortBy === 'title'" class="ml-1 inline-flex items-center text-muted-foreground">
                <ArrowUp v-if="sortDir === 'asc'" class="w-3 h-3" /><ArrowDown v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('company')" class="cursor-pointer"
              >Company
              <span v-if="sortBy === 'company'" class="ml-1 inline-flex items-center text-muted-foreground">
                <ArrowUp v-if="sortDir === 'asc'" class="w-3 h-3" /><ArrowDown v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Job Type</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead @click="toggleSort('salary')" class="cursor-pointer"
              >Salary
              <span v-if="sortBy === 'salary'" class="ml-1 inline-flex items-center text-muted-foreground">
                <ArrowUp v-if="sortDir === 'asc'" class="w-3 h-3" /><ArrowDown v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('posted')" class="cursor-pointer"
              >Posted
              <span v-if="sortBy === 'posted'" class="ml-1 inline-flex items-center text-muted-foreground">
                <ArrowUp v-if="sortDir === 'asc'" class="w-3 h-3" /><ArrowDown v-else class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="paginated.length">
            <TableRow v-for="j in paginated" :key="j.id">
              <TableCell class="font-medium">{{ j.title }}</TableCell>
              <TableCell>{{ j.company?.name || j.company }}</TableCell>
              <TableCell class="text-muted-foreground">
                {{ j.location?.city || j.location?.region || j.location?.country || '—' }}
              </TableCell>
              <TableCell>{{ j.jobType || j.employment_type || '-' }}</TableCell>
              <TableCell>{{ j.experienceLevel || j.seniority_level || j.experience || '-' }}</TableCell>
              <TableCell class="text-muted-foreground">
                <span v-if="j.salary_min || j.minSalary || j.salary_max || j.maxSalary">
                  {{ j.minSalary || j.salary_min ? j.minSalary || j.salary_min : '' }}
                  <span v-if="j.maxSalary || j.salary_max"> - {{ j.maxSalary || j.salary_max }}</span>
                </span>
                <span v-else>-</span>
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ j.posted_date ? new Date(j.posted_date).toLocaleString() : j.created_at ? new Date(j.created_at).toLocaleString() : '-' }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button size="sm" variant="outline" @click="onOpenEdit(j)">Edit</Button>
                  <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onOpenDelete(j)">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else :colspan="8">No data</TableEmpty>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-2">
        <span class="text-sm">Rows per page</span>
        <Select :model-value="String(pageSize)" @update:model-value="(v) => (pageSize = Number(v))">
          <SelectTrigger class="h-8 w-[80px]"><SelectValue :placeholder="String(pageSize)" /></SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="s in pageSizes" :key="s" :value="String(s)">{{ s }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" class="h-8 px-2" :disabled="page <= 1" @click="page = Math.max(1, page - 1)">Prev</Button>
        <span class="text-sm">Page {{ page }} of {{ totalPages }}</span>
        <Button variant="outline" class="h-8 px-2" :disabled="page >= totalPages" @click="page = Math.min(totalPages, page + 1)">Next</Button>
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
      Are you sure you want to delete job <span class="font-medium">{{ selected?.title }}</span
      >? This action cannot be undone.
    </DeleteConfirmDialog>

    <!-- Create/Edit Form -->
    <JobFormDialog v-model="formOpen" :mode="formMode" :job="editing" :pending="saving" @submit="onSubmitForm" />
  </div>
</template>
