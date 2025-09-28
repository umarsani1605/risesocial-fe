<script setup>
import { JOB_TYPE_LABEL_BY_VALUE } from '~/constants/jobs';
import { ref, computed } from 'vue';
import { useFilter } from 'reka-ui';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell, TableEmpty } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { useAdminJobs } from '@/composables/useAdminJobs';
import { useAuthStore } from '@/store/auth';
import { toast } from 'vue-sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import industriesJson from '@/assets/json/linkedin-industries.json';
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { JOB_TYPES, JOB_SENIORITIES } from '@/constants/jobs';
import { $api } from '@/composables/useAPI';

definePageMeta({
  auth: true,
  layout: 'admin-dashboard',
});

const {
  data: jobs,
  pending: isLoading,
  error,
  refresh: refreshJobs,
} = await useAPI('/jobs', {
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
} = await useAPI('/admin/system/settings/linkedin/rate-limit', {
  key: 'admin-rate-limit-data',
  transform: (data) => data?.data || null,
});

const {
  data: savedSyncFilters,
  pending: syncFiltersPending,
  refresh: refreshSavedSyncFilters,
} = await useAPI('/admin/system/settings/linkedin_sync_filters', {
  key: 'admin-sync-filters-data',
  transform: (response) => response?.data?.value || null,
});

const isSyncing = ref(false);
const savingSettings = ref(false);
const confirmOpen = ref(false);
const settingsOpen = ref(false);

const INDUSTRY_OPTIONS = ref(industriesJson);

const syncFilters = ref({
  advanced_title_filter: [],
  location_filter: [],
  description_filter: [],
  organization_description_filter: [],
  organization_specialties_filter: [],
  type_filter: [],
  industry_filter: [],
  seniority_filter: [],
});

const toArray = (inputValue) => (Array.isArray(inputValue) ? inputValue : inputValue ? [inputValue] : []);
const toTypeLabels = (inputValues) => {
  const valueList = toArray(inputValues);
  return valueList.map((value) => {
    const matchedOption = JOB_TYPES.find((option) => option.value === value || option.label === value);
    return matchedOption ? matchedOption.label : String(value);
  });
};

if (savedSyncFilters.value) {
  const defaultFilters = savedSyncFilters.value;
  syncFilters.value = {
    ...syncFilters.value,
    advanced_title_filter: toArray(defaultFilters.advanced_title_filter),
    location_filter: toArray(defaultFilters.location_filter),
    description_filter: toArray(defaultFilters.description_filter),
    organization_description_filter: toArray(defaultFilters.organization_description_filter),
    organization_specialties_filter: toArray(defaultFilters.organization_specialties_filter),
    type_filter: toTypeLabels(defaultFilters.type_filter),
    industry_filter: toArray(defaultFilters.industry_filter),
    seniority_filter: toArray(defaultFilters.seniority_filter),
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
  const remainingOptions = JOB_TYPES.filter((jobTypeOption) => !syncFilters.value.type_filter.includes(jobTypeOption.label));
  return searchType.value ? remainingOptions.filter((jobTypeOption) => contains(jobTypeOption.label, searchType.value)) : remainingOptions;
});

const filteredIndustry = computed(() => {
  const baseIndustries = Array.isArray(INDUSTRY_OPTIONS.value) ? INDUSTRY_OPTIONS.value : [];
  const availableOptions = baseIndustries.filter((industryValue) => !syncFilters.value.industry_filter.includes(industryValue));
  return searchIndustry.value ? availableOptions.filter((industryValue) => contains(industryValue, searchIndustry.value)) : availableOptions;
});

const filteredSeniority = computed(() => {
  const availableOptions = JOB_SENIORITIES.map((option) => option.value).filter(
    (seniorityValue) => !syncFilters.value.seniority_filter.includes(seniorityValue)
  );
  return searchSeniority.value ? availableOptions.filter((seniorityValue) => contains(seniorityValue, searchSeniority.value)) : availableOptions;
});

const search = ref('');
const jobType = ref('ALL');
const experienceLevel = ref('ALL');
const remote = ref('ALL');
const location = ref('ALL');

// Applied filters (yang benar-benar diterapkan)
const appliedSearch = ref('');
const appliedJobType = ref('ALL');
const appliedExperienceLevel = ref('ALL');
const appliedRemote = ref('ALL');
const appliedLocation = ref('ALL');

// Popover state
const filterPopoverOpen = ref(false);

const clearFilters = () => {
  search.value = '';
  jobType.value = 'ALL';
  experienceLevel.value = 'ALL';
  remote.value = 'ALL';
  location.value = 'ALL';
  appliedSearch.value = '';
  appliedJobType.value = 'ALL';
  appliedExperienceLevel.value = 'ALL';
  appliedRemote.value = 'ALL';
  appliedLocation.value = 'ALL';
  filterPopoverOpen.value = false;
};

const applyFilters = () => {
  appliedSearch.value = search.value;
  appliedJobType.value = jobType.value;
  appliedExperienceLevel.value = experienceLevel.value;
  appliedRemote.value = remote.value;
  appliedLocation.value = location.value;
  filterPopoverOpen.value = false;
};

const page = ref(1);
const pageSize = ref(10);

const sortBy = ref('created_at');
const sortDir = ref('desc');

// Unique countries computed - simplified
const uniqueCountries = computed(() => {
  if (!Array.isArray(jobs.value)) return [];

  const countries = jobs.value
    .map((job) => job.location?.country)
    .filter(Boolean)
    .filter((country, index, array) => array.indexOf(country) === index)
    .sort();

  return countries;
});

const filtered = computed(() => {
  let filteredJobs = Array.isArray(jobs.value) ? [...jobs.value] : [];

  const searchTerm = appliedSearch.value.trim().toLowerCase();
  if (searchTerm) {
    filteredJobs = filteredJobs.filter(
      (job) => (job.title || '').toLowerCase().includes(searchTerm) || (job.company?.name || '').toLowerCase().includes(searchTerm)
    );
  }

  if (appliedJobType.value !== 'ALL') {
    filteredJobs = filteredJobs.filter((job) => (job.employment_type || '').toString().toUpperCase() === appliedJobType.value);
  }

  if (appliedExperienceLevel.value !== 'ALL') {
    filteredJobs = filteredJobs.filter((job) => (job.seniority_level || '').toString().toUpperCase() === appliedExperienceLevel.value);
  }

  if (appliedRemote.value !== 'ALL') {
    const wantsRemote = appliedRemote.value === 'YES';
    filteredJobs = filteredJobs.filter((job) => Boolean(job.location?.is_remote) === wantsRemote);
  }

  if (appliedLocation.value !== 'ALL') {
    filteredJobs = filteredJobs.filter((job) => job.location?.country === appliedLocation.value);
  }

  const sortDirection = sortDir.value === 'asc' ? 1 : -1;
  filteredJobs.sort((jobA, jobB) => {
    const getValue = (key, object) => object?.[key] ?? object?.company?.[key] ?? object?.location?.[key] ?? null;

    if (sortBy.value === 'title') {
      return String(jobA.title || '').localeCompare(String(jobB.title || '')) * sortDirection;
    }
    if (sortBy.value === 'company') {
      return String(jobA.company?.name || jobA.company || '').localeCompare(String(jobB.company?.name || jobB.company || '')) * sortDirection;
    }
    if (sortBy.value === 'salary') {
      return ((jobA.maxSalary || jobA.salary_max || 0) - (jobB.maxSalary || jobB.salary_max || 0)) * sortDirection;
    }

    const dateA = new Date(jobA.posted_date || jobA.datePosted || jobA.created_at || 0);
    const dateB = new Date(jobB.posted_date || jobB.datePosted || jobB.created_at || 0);
    return (dateA - dateB) * sortDirection;
  });

  return filteredJobs;
});

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));

const toggleSort = (sortKey) => {
  if (sortBy.value === sortKey) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = sortKey;
    sortDir.value = 'asc';
  }
};

// Delete dialog
const deleteDialogOpen = ref(false);
const selected = ref(null);
const onOpenDelete = (jobRow) => {
  selected.value = jobRow;
  deleteDialogOpen.value = true;
};
const onConfirmDelete = async () => {
  try {
    const response = await $api(`/admin/jobs/${selected.value.id}`, { method: 'DELETE' });

    if (response?.success === false) {
      toast.error(response?.message || 'Failed to delete job');
      return;
    }

    toast.success('Job deleted');
    deleteDialogOpen.value = false;
    selected.value = null;
    await refreshJobs();
  } catch (error) {
    console.error('[admin/jobs/index] delete error:', error);
    toast.error(error?.data?.message || 'Failed to delete job');
  }
};

// Helpers
const employmentTypeLabel = (value) => JOB_TYPE_LABEL_BY_VALUE?.[value] || value || '-';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'success';
    case 'ARCHIVED':
      return 'outline';
    default:
      return 'outline';
  }
};

const syncJobs = async () => {
  if (isSyncing.value) return;
  isSyncing.value = true;

  const { data: user, token } = useAuth();
  console.log('Auth user: ' + user.value);
  console.log('Auth token: ' + token.value);

  try {
    const toEnumValues = (filterValues) =>
      filterValues.map((filterValue) => JOB_TYPES.find((option) => option.label === filterValue)?.value || filterValue);

    const filterPayload = {
      ...syncFilters.value,
      type_filter: toEnumValues(syncFilters.value.type_filter),
    };

    console.log('filterPayload: ' + filterPayload);

    const response = await $api('/admin/jobs/sync-linkedin', {
      method: 'POST',
      body: { filter: filterPayload },
    });

    if (response?.success) {
      const savedCount = response?.data?.saved ?? response?.data?.savedJobs ?? 0;
      if (savedCount > 0) {
        const noun = savedCount === 1 ? 'job' : 'jobs';
        const verb = savedCount === 1 ? 'has' : 'have';
        toast.success(`${savedCount} ${noun} ${verb} been added.`);
      } else {
        toast.warning('No jobs found. Please adjust your search parameters and try again.');
      }
      await refreshJobs();
      await refreshRateLimit();
    } else {
      toast.error(response?.message || 'Gagal melakukan sync jobs');
    }
  } catch (error) {
    console.error('[admin/jobs] Sync error:', error);
    toast.error(error?.message || 'Terjadi kesalahan saat sync');
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
    const settingsPayload = {
      value: { ...syncFilters.value },
      description: 'Default filters for manual LinkedIn sync',
    };
    const response = await $api('/admin/system/settings/linkedin_sync_filters', {
      method: 'PUT',
      body: settingsPayload,
    });
    if (response?.success) {
      toast.success('Sync settings saved');
      settingsOpen.value = false;
    } else {
      toast.error(response?.message || 'Failed to save settings');
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to save settings');
  } finally {
    savingSettings.value = false;
  }
};

const pageSizes = [10, 20, 30, 50];

const onOpenEdit = async (jobRow) => {
  await navigateTo(`/admin/jobs/${jobRow.id}`);
};
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Jobs Management</h1>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2 w-full sm:w-auto">
        <Input v-model="search" placeholder="Search title or company..." class="w-full sm:w-64" />
        <Popover :open="filterPopoverOpen" @update:open="(isOpen) => (filterPopoverOpen = isOpen)">
          <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="flex items-center gap-2">
              <Icon name="lucide:sliders-horizontal" class="w-4 h-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80 p-4" side="bottom" align="start">
            <div class="space-y-4">
              <h4 class="font-medium text-sm">Filter Jobs</h4>
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">Job Type</label>
                <Select v-model="jobType">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
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
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">Experience Level</label>
                <Select v-model="experienceLevel">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
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
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">Remote Work</label>
                <Select v-model="remote">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select remote option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground">Country</label>
                <Select v-model="location">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Countries</SelectItem>
                    <SelectItem v-for="country in uniqueCountries" :key="country" :value="country">
                      {{ country }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex gap-2 pt-2">
                <Button size="sm" @click="applyFilters" class="flex-1"> Apply </Button>
                <Button size="sm" variant="outline" @click="clearFilters" class="flex-1"> Clear </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
              <p>Request Limit: {{ rateLimitData?.requests?.remaining || 0 }}/{{ rateLimitData?.requests?.limit || 0 }}</p>
              <p>Job Limit: {{ rateLimitData?.jobs?.remaining || 0 }}/{{ rateLimitData?.jobs?.limit || 0 }}</p>
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
          <Popover :open="confirmOpen" @update:open="(isOpen) => (confirmOpen = isOpen)">
            <PopoverTrigger as-child>
              <Button class="rounded-none" :disabled="isSyncing" :aria-busy="isSyncing">
                <Icon name="lucide:refresh-ccw" class="mr-2 h-4 w-4" :class="{ 'animate-spin': isSyncing }" />
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
          <Dialog :open="settingsOpen" @update:open="(isOpen) => (settingsOpen = isOpen)">
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
                  <TagsInput v-model="syncFilters.advanced_title_filter" class="w-full" placeholder="Add titles">
                    <TagsInputItem v-for="item in syncFilters.advanced_title_filter" :key="item" :value="item">
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

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-10">#</TableHead>
            <TableHead @click="toggleSort('title')" class="cursor-pointer max-w-xs">Title</TableHead>
            <TableHead @click="toggleSort('company')" class="cursor-pointer w-40">Company</TableHead>
            <TableHead class="w-40">Location</TableHead>
            <TableHead class="max-w-40">Industry</TableHead>
            <TableHead class="max-w-32">Website</TableHead>
            <TableHead class="max-w-32">LinkedIn</TableHead>
            <TableHead class="w-40">Employment Type</TableHead>
            <TableHead class="w-40">Seniority</TableHead>
            <TableHead class="max-w-20">Status</TableHead>
            <TableHead class="w-40">Posted Date</TableHead>
            <TableHead class="w-40">Valid Through</TableHead>
            <TableHead class="px-4 sticky right-0">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="paginated.length">
            <TableRow v-for="(job, idx) in paginated" :key="job.id">
              <TableCell class="text-muted-foreground">{{ idx + 1 }}</TableCell>
              <TableCell class="truncate" :title="job.title">{{ job.title }}</TableCell>
              <TableCell class="w-40 truncate" :title="job.company?.name">{{ job.company?.name || '-' }}</TableCell>
              <TableCell
                class="w-40 truncate"
                :title="[job.location?.city, job.location?.region, job.location?.country].filter(Boolean).join(', ') || '—'"
              >
                {{ [job.location?.city, job.location?.region, job.location?.country].filter(Boolean).join(', ') || '—' }}
              </TableCell>
              <TableCell class="max-w-40 truncate" :title="job.company?.industry || '-'">{{ job.company?.industry || '-' }}</TableCell>
              <TableCell class="max-w-32 truncate">
                <a
                  v-if="job.company?.website_url"
                  :href="job.company.website_url"
                  target="_blank"
                  class="flex items-center text-primary hover:underline"
                >
                  <Icon name="lucide:external-link" class="w-3 h-3 inline mr-1" />
                  Website
                </a>
              </TableCell>
              <TableCell class="max-w-32 truncate">
                <a
                  v-if="job.company?.linkedin_url"
                  :href="job.company.linkedin_url"
                  target="_blank"
                  class="flex items-center text-primary hover:underline"
                >
                  <Icon name="lucide:external-link" class="w-3 h-3 inline mr-1" />
                  LinkedIn
                </a>
              </TableCell>
              <TableCell class="max-w-24 truncate" :title="employmentTypeLabel(job.employment_type)">
                {{ employmentTypeLabel(job.employment_type) }}
              </TableCell>
              <TableCell class="w-40 truncate" :title="job.seniority_level || '-'">{{ job.seniority_level || '-' }}</TableCell>
              <TableCell class="w-40">
                <Badge :variant="getStatusVariant(job.status)">
                  {{ job.status || '-' }}
                </Badge>
              </TableCell>
              <TableCell class="w-40 truncate" :title="formatDate(job.posted_date)">
                {{ formatDate(job.posted_date) }}
              </TableCell>
              <TableCell class="w-40 truncate" :title="formatDate(job.valid_until)">
                {{ formatDate(job.valid_until) }}
              </TableCell>
              <TableCell class="px-4 sticky right-0 text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="onOpenEdit(job)">
                    <Icon name="lucide:edit" class="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onOpenDelete(job)">
                    <Icon name="lucide:trash-2" class="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else :colspan="13">No data</TableEmpty>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-2">
        <span class="text-sm">Rows per page</span>
        <Select :model-value="String(pageSize)" @update:model-value="(newValue) => (pageSize = Number(newValue))">
          <SelectTrigger class="h-8 w-[80px]"><SelectValue :placeholder="String(pageSize)" /></SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSizeOption in pageSizes" :key="pageSizeOption" :value="String(pageSizeOption)">{{ pageSizeOption }}</SelectItem>
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
  </div>
</template>
