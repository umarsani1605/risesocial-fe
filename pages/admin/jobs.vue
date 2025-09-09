<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useFilter } from 'reka-ui';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import JobFormDialog from '@/components/admin/jobs/JobFormDialog.vue';
import { useAdminJobs } from '@/composables/useAdminJobs';
import { toast } from 'vue-sonner';
import { useAuthStore } from '~/store/auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import industriesJson from '@/assets/json/linkedin-industries.json';
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { JOB_TYPES, JOB_SENIORITIES } from '@/constants/jobs';
import { $api } from '@/composables/useAPI';

const authStore = useAuthStore();

definePageMeta({ layout: 'admin-dashboard' });

const { deleteJob } = useAdminJobs();

const {
  data: jobs,
  pending: isLoading,
  error,
  refresh: refreshJobs,
} = await useAPI('/api/jobs', {
  key: 'admin-jobs-data',
  query: {
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  transform: (response) => (Array.isArray(response?.data) ? response.data : []),
});

const {
  data: rateLimitData,
  pending: rateLimitPending,
  refresh: refreshRateLimit,
} = await useFetch('/api/system/settings/linkedin/rate-limit', {
  server: true,
  baseURL: useRuntimeConfig().public.backendUrl,
  transform: (data) => data?.data || null,
});

const {
  data: savedSyncFilters,
  pending: syncFiltersPending,
  refresh: refreshSavedSyncFilters,
} = await useFetch('/api/system/settings/linkedin_sync_filters', {
  server: true,
  baseURL: useRuntimeConfig().public.backendUrl,
  transform: (response) => response?.data?.value || null,
});

const isSyncing = ref(false);
const savingSettings = ref(false);
const confirmOpen = ref(false);
const settingsOpen = ref(false);

const TYPE_OPTIONS = JOB_TYPES.map((o) => o.value);
const INDUSTRY_OPTIONS = ref(industriesJson);
const SENIORITY_OPTIONS = JOB_SENIORITIES.map((o) => o.value);

const syncFilters = ref({
  title_filter: [],
  location_filter: [],
  description_filter: [],
  organization_description_filter: [],
  organization_specialties_filter: [],
  type_filter: [],
  industry_filter: [],
  seniority_filter: [],
});

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const toTypeLabels = (values) => {
  const list = toArray(values);
  return list.map((val) => {
    const match = JOB_TYPES.find((opt) => opt.value === val || opt.label === val);
    return match ? match.label : String(val);
  });
};

if (savedSyncFilters.value) {
  const defaults = savedSyncFilters.value;
  syncFilters.value = {
    ...syncFilters.value,
    title_filter: toArray(defaults.title_filter),
    location_filter: toArray(defaults.location_filter),
    description_filter: toArray(defaults.description_filter),
    organization_description_filter: toArray(defaults.organization_description_filter),
    organization_specialties_filter: toArray(defaults.organization_specialties_filter),
    type_filter: toTypeLabels(defaults.type_filter),
    industry_filter: toArray(defaults.industry_filter),
    seniority_filter: toArray(defaults.seniority_filter),
  };
}

const openType = ref(false);
const openIndustry = ref(false);
const openSeniority = ref(false);
const searchType = ref('');
const searchIndustry = ref('');
const searchSeniority = ref('');
const { contains } = useFilter({ sensitivity: 'base' });

const filteredType = computed(() => {
  const remaining = JOB_TYPES.filter((jobTypeOption) => !syncFilters.value.type_filter.includes(jobTypeOption.label));
  return searchType.value ? remaining.filter((jobTypeOption) => contains(jobTypeOption.label, searchType.value)) : remaining;
});

const filteredIndustry = computed(() => {
  const base = Array.isArray(INDUSTRY_OPTIONS.value) ? INDUSTRY_OPTIONS.value : [];
  const options = base.filter((industryValue) => !syncFilters.value.industry_filter.includes(industryValue));
  return searchIndustry.value ? options.filter((industryValue) => contains(industryValue, searchIndustry.value)) : options;
});

const filteredSeniority = computed(() => {
  const options = SENIORITY_OPTIONS.filter((seniorityValue) => !syncFilters.value.seniority_filter.includes(seniorityValue));
  return searchSeniority.value ? options.filter((seniorityValue) => contains(seniorityValue, searchSeniority.value)) : options;
});

const rateLimitText = computed(() => {
  if (rateLimitPending.value) {
    return 'Loading rate limit...';
  }
  if (!rateLimitData.value) {
    return 'Rate Limit: N/A';
  }
  const req = rateLimitData.value?.requests || {};
  const jobs = rateLimitData.value?.jobs || {};
  const reqRemain = typeof req.remaining === 'number' ? req.remaining : 0;
  const reqLimit = typeof req.limit === 'number' ? req.limit : 0;
  const jobRemain = typeof jobs.remaining === 'number' ? jobs.remaining : 0;
  const jobLimit = typeof jobs.limit === 'number' ? jobs.limit : 0;
  return `Request Limit: ${reqRemain}/${reqLimit}. Job Limit: ${jobRemain}/${jobLimit}`;
});

const search = ref('');
const jobType = ref('ALL');
const experienceLevel = ref('ALL');
const remote = ref('ALL');

const page = ref(1);
const pageSize = ref(10);

const sortBy = ref('posted');
const sortDir = ref('desc');

const filtered = computed(() => {
  let arr = Array.isArray(jobs.value) ? [...jobs.value] : [];

  const term = search.value.trim().toLowerCase();
  if (term) {
    arr = arr.filter((j) => (j.title || '').toLowerCase().includes(term) || (j.company?.name || j.company || '').toLowerCase().includes(term));
  }

  if (jobType.value !== 'ALL') {
    arr = arr.filter((j) => (j.jobType || j.employment_type || '').toString().toUpperCase() === jobType.value);
  }

  if (experienceLevel.value !== 'ALL') {
    arr = arr.filter((j) => (j.experienceLevel || j.seniority_level || j.experience || '').toString().toUpperCase() === experienceLevel.value);
  }

  if (remote.value !== 'ALL') {
    const wantRemote = remote.value === 'YES';
    arr = arr.filter((j) => Boolean(j.isRemote ?? j.is_remote ?? j.location?.is_remote) === wantRemote);
  }

  const dir = sortDir.value === 'asc' ? 1 : -1;
  arr.sort((a, b) => {
    const val = (k, obj) => obj?.[k] ?? obj?.company?.[k] ?? obj?.location?.[k] ?? null;
    if (sortBy.value === 'title') return String(a.title || '').localeCompare(String(b.title || '')) * dir;
    if (sortBy.value === 'company') return String(a.company?.name || a.company || '').localeCompare(String(b.company?.name || b.company || '')) * dir;
    if (sortBy.value === 'salary') return ((a.maxSalary || a.salary_max || 0) - (b.maxSalary || b.salary_max || 0)) * dir;
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
    await refreshJobs();
  } catch (e) {
    toast.error(e?.message || 'Gagal menghapus job');
  }
};

const syncJobs = async () => {
  if (isSyncing.value) return;
  isSyncing.value = true;

  console.log('Auth store: ' + authStore.user);
  console.log('Auth store: ' + authStore.token);

  try {
    const toEnumValues = (filters) => filters.map((filterVal) => JOB_TYPES.find((label) => label.label === filterVal)?.value || filterVal);

    const filterPayload = {
      ...syncFilters.value,
      type_filter: toEnumValues(syncFilters.value.type_filter),
    };

    console.log('filterPayload: ' + filterPayload);

    const response = await $api('/api/jobs/sync-linkedin', {
      query: { filter: filterPayload, limit: 1 },
    });

    if (response?.success) {
      const saved = response?.data?.saved ?? 0;
      const skipped = response?.data?.skipped ?? 0;
      toast.success(`Sync selesai. Saved: ${saved}`);
      await refreshJobs();
      await refreshRateLimit();
    } else {
      toast.error(response?.message || 'Gagal melakukan sync jobs');
    }
  } catch (err) {
    console.error('[admin/jobs] Sync error:', err);
    toast.error(err?.message || 'Terjadi kesalahan saat sync');
  } finally {
    isSyncing.value = false;
  }
};

const onConfirmSync = async () => {
  confirmOpen.value = false;
  await syncJobs();
};

const onSaveSyncSettings = async () => {
  try {
    savingSettings.value = true;
    const payload = {
      value: { ...syncFilters.value },
      description: 'Default filters for manual LinkedIn sync',
    };
    const res = await $api('/api/system/settings/linkedin_sync_filters', {
      method: 'PUT',
      body: payload,
    });
    if (res?.success) {
      toast.success('Sync settings saved');
      settingsOpen.value = false;
    } else {
      toast.error(res?.message || 'Failed to save settings');
    }
  } catch (e) {
    toast.error(e?.message || 'Failed to save settings');
  } finally {
    savingSettings.value = false;
  }
};

onMounted(async () => {
  // Rate limit data sudah di-fetch di server-side, tidak perlu fetch lagi
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
    await refreshJobs();
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

      <div class="flex items-center justify-end gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <div class="flex items-center gap-2">
                <Icon name="lucide:info" class="w-4 h-4 text-muted-foreground" />
                <span class="text-sm text-muted-foreground">Rate Limit</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{{ rateLimitText }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator orientation="vertical" class="h-[24px]!" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <div class="flex items-center gap-2">
                <Icon name="lucide:calendar" class="w-4 h-4 text-muted-foreground" />
                <span class="text-sm text-muted-foreground">10 September 2025</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Next auto sync: 17 September 2025</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator orientation="vertical" class="h-[24px]!" />
        <div class="inline-flex items-stretch rounded-md overflow-hidden border">
          <Popover :open="confirmOpen" @update:open="(v) => (confirmOpen = v)">
            <PopoverTrigger as-child>
              <Button class="rounded-none" :disabled="isSyncing">
                <Icon name="lucide:refresh-ccw" class="mr-2 h-4 w-4" />
                {{ isSyncing ? 'Syncing...' : 'Sync Job' }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[260px] p-4 space-y-3">
              <p class="text-sm">Perform manual job sync?</p>
              <div class="flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="confirmOpen = false">No</Button>
                <Button size="sm" @click="onConfirmSync">Yes</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Dialog :open="settingsOpen" @update:open="(v) => (settingsOpen = v)">
            <DialogTrigger as-child>
              <Button class="rounded-none">
                <Icon name="lucide:settings" class="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[920px]">
              <DialogHeader>
                <DialogTitle>LinkedIn Job Sync Settings</DialogTitle>
                <DialogDescription>Configure default parameters for LinkedIn job search. If empty, no filter will be applied.</DialogDescription>
              </DialogHeader>
              <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-sm mb-2 block">Job titles</label>
                  <TagsInput v-model="syncFilters.title_filter" class="w-full" placeholder="Add titles">
                    <TagsInputItem v-for="item in syncFilters.title_filter" :key="item" :value="item">
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>
                    <TagsInputInput placeholder="Type and press enter" />
                  </TagsInput>
                </div>
                <div>
                  <label class="text-sm mb-2 block">Job locations</label>
                  <TagsInput v-model="syncFilters.location_filter" class="w-full" placeholder="Add locations">
                    <TagsInputItem v-for="item in syncFilters.location_filter" :key="item" :value="item">
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>
                    <TagsInputInput placeholder="Type and press enter" />
                  </TagsInput>
                </div>
                <div>
                  <label class="text-sm mb-2 block">Job descriptions</label>
                  <TagsInput v-model="syncFilters.description_filter" class="w-full" placeholder="Add keywords">
                    <TagsInputItem v-for="item in syncFilters.description_filter" :key="item" :value="item">
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>
                    <TagsInputInput placeholder="Type and press enter" />
                  </TagsInput>
                </div>
                <div>
                  <label class="text-sm mb-2 block">Job types</label>
                  <!-- eslint-disable-next-line vue/no-v-model-argument -->
                  <Combobox v-model="syncFilters.type_filter" v-model:open="openType" :ignore-filter="true">
                    <ComboboxAnchor as-child>
                      <TagsInput v-model="syncFilters.type_filter" class="w-full mb-2 px-2 gap-2" placeholder="Select or type types">
                        <div class="flex gap-2 flex-wrap items-center">
                          <TagsInputItem v-for="item in syncFilters.type_filter" :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                          </TagsInputItem>
                        </div>
                        <ComboboxInput v-model="searchType" as-child>
                          <TagsInputInput
                            placeholder="Type and press enter"
                            class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                            @click="openType = true"
                            @blur="openType = false"
                            @keydown.enter.prevent
                          />
                        </ComboboxInput>
                      </TagsInput>
                      <ComboboxList class="w-[--reka-popper-anchor-width]">
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          <ComboboxItem
                            v-for="item in filteredType"
                            :key="item.value"
                            :value="item.label"
                            @select.prevent="
                              (ev) => {
                                if (typeof ev.detail.value === 'string') {
                                  searchType = '';
                                  syncFilters.type_filter.push(ev.detail.value);
                                }
                                if (filteredType.length === 0) {
                                  openType = false;
                                }
                              }
                            "
                          >
                            {{ item.label }}
                          </ComboboxItem>
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxAnchor>
                  </Combobox>
                </div>
                <div>
                  <label class="text-sm mb-2 block">Company descriptions</label>
                  <TagsInput v-model="syncFilters.organization_description_filter" class="w-full" placeholder="Add org desc keywords">
                    <TagsInputItem v-for="item in syncFilters.organization_description_filter" :key="item" :value="item">
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>
                    <TagsInputInput placeholder="Type and press enter" />
                  </TagsInput>
                </div>
                <div>
                  <label class="text-sm mb-2 block">Company specialties</label>
                  <TagsInput v-model="syncFilters.organization_specialties_filter" class="w-full" placeholder="Add specialties">
                    <TagsInputItem v-for="item in syncFilters.organization_specialties_filter" :key="item" :value="item">
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>
                    <TagsInputInput placeholder="Type and press enter" />
                  </TagsInput>
                </div>
                <div>
                  <label class="text-sm mb-2 block">Industries</label>
                  <!-- eslint-disable-next-line vue/no-v-model-argument -->
                  <Combobox v-model="syncFilters.industry_filter" v-model:open="openIndustry" :ignore-filter="true">
                    <ComboboxAnchor as-child>
                      <TagsInput
                        v-model="syncFilters.industry_filter"
                        class="w-full mb-2 px-2 gap-2"
                        placeholder="Select or type industries"
                        @click="openIndustry = true"
                      >
                        <div class="flex gap-2 flex-wrap items-center">
                          <TagsInputItem v-for="item in syncFilters.industry_filter" :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                          </TagsInputItem>
                        </div>
                        <ComboboxInput v-model="searchIndustry" as-child>
                          <TagsInputInput
                            placeholder="Type and press enter"
                            class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                            @click="openIndustry = true"
                            @blur="openIndustry = false"
                            @keydown.enter.prevent
                          />
                        </ComboboxInput>
                      </TagsInput>
                      <ComboboxList class="w-[--reka-popper-anchor-width]">
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          <ComboboxItem
                            v-for="item in filteredIndustry"
                            :key="item"
                            :value="item"
                            @select.prevent="
                              (ev) => {
                                if (typeof ev.detail.value === 'string') {
                                  searchIndustry = '';
                                  syncFilters.industry_filter.push(ev.detail.value);
                                }
                                if (filteredIndustry.length === 0) {
                                  openIndustry = false;
                                }
                              }
                            "
                          >
                            {{ item }}
                          </ComboboxItem>
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxAnchor>
                  </Combobox>
                </div>
                <div>
                  <label class="text-sm mb-2 block">Seniority levels</label>
                  <!-- eslint-disable-next-line vue/no-v-model-argument -->
                  <Combobox v-model="syncFilters.seniority_filter" v-model:open="openSeniority" :ignore-filter="true">
                    <ComboboxAnchor as-child>
                      <TagsInput
                        v-model="syncFilters.seniority_filter"
                        class="w-full mb-2 px-2 gap-2"
                        placeholder="Select or type seniority"
                        @click="openSeniority = true"
                      >
                        <div class="flex gap-2 flex-wrap items-center">
                          <TagsInputItem v-for="item in syncFilters.seniority_filter" :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                          </TagsInputItem>
                        </div>
                        <ComboboxInput v-model="searchSeniority" as-child>
                          <TagsInputInput
                            placeholder="Type and press enter"
                            class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                            @click="openSeniority = true"
                            @blur="openSeniority = false"
                            @keydown.enter.prevent
                          />
                        </ComboboxInput>
                      </TagsInput>
                      <ComboboxList class="w-[--reka-popper-anchor-width]">
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          <ComboboxItem
                            v-for="item in filteredSeniority"
                            :key="item"
                            :value="item"
                            @select.prevent="
                              (ev) => {
                                if (typeof ev.detail.value === 'string') {
                                  searchSeniority = '';
                                  syncFilters.seniority_filter.push(ev.detail.value);
                                }
                                if (filteredSeniority.length === 0) {
                                  openSeniority = false;
                                }
                              }
                            "
                          >
                            {{ item }}
                          </ComboboxItem>
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxAnchor>
                  </Combobox>
                </div>
              </div>
              <DialogFooter class="mt-2">
                <div class="flex w-full justify-end gap-2">
                  <Button variant="outline" @click="settingsOpen = false">Cancel</Button>
                  <Button :disabled="savingSettings" @click="onSaveSyncSettings">{{ savingSettings ? 'Saving...' : 'Save' }}</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('company')" class="cursor-pointer"
              >Company
              <span v-if="sortBy === 'company'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Job Type</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead @click="toggleSort('salary')" class="cursor-pointer"
              >Salary
              <span v-if="sortBy === 'salary'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
              </span>
            </TableHead>
            <TableHead @click="toggleSort('posted')" class="cursor-pointer"
              >Posted
              <span v-if="sortBy === 'posted'" class="ml-1 inline-flex items-center text-muted-foreground">
                <Icon v-if="sortDir === 'asc'" name="lucide:arrow-up" class="w-3 h-3" />
                <Icon v-else name="lucide:arrow-down" class="w-3 h-3" />
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
