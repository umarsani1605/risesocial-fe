<script setup>
import { ref, computed, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue';
import { toast } from 'vue-sonner';
import { JOB_TYPES, JOB_SENIORITIES } from '@/constants/jobs';

definePageMeta({
  auth: true,
  layout: 'admin-dashboard',
});

const route = useRoute();
const jobId = computed(() => route.params.id);

const {
  data: job,
  pending,
  error,
  refresh,
} = await useAPI(`/jobs/${jobId.value}`, {
  key: () => `admin-job-${jobId.value}`,
  server: false,
  transform: (response) => response?.data || null,
  default: () => null,
});

const onBack = async () => {
  await navigateTo('/admin/jobs');
};

watch(
  error,
  (err) => {
    if (err) {
      console.error('[admin/jobs/edit] load error:', err);
      toast.error(err?.message || 'Failed to load job');
    }
  },
  { immediate: true }
);

// Direct reactive object seperti sync filters
const jobData = ref({
  // Basic fields
  title: '',
  description: '',
  employment_type: '',
  seniority_level: '',
  external_url: '',
  status: '',
  posted_date: '',
  valid_until: '',

  // Company fields
  company_name: '',
  company_website_url: '',
  company_industry: '',
  company_headquarters: '',
  company_description: '',
  company_linkedin_url: '',
  company_linkedin_employees: undefined,
  company_linkedin_size: '',
  company_linkedin_slogan: '',
  company_linkedin_followers: undefined,
  company_linkedin_type: '',
  company_linkedin_specialties: [],
  company_linkedin_locations: [],

  // Location fields
  location_city: '',
  location_region: '',
  location_country: '',
  location_timezone: '',
  location_latitude: '',
  location_longitude: '',
  location_is_remote: 'NO',
});

// Helper functions seperti di sync filters
const toArray = (inputValue) => (Array.isArray(inputValue) ? inputValue : inputValue ? [inputValue] : []);

watch(
  job,
  (data) => {
    if (!data) return;

    jobData.value = {
      // Basic fields
      title: data.title || '',
      description: data.description || '',
      employment_type: data.employment_type || '',
      seniority_level: data.seniority_level || '',
      external_url: data.external_url || '',
      status: data.status || '',
      posted_date: data.posted_date ? new Date(data.posted_date).toISOString().slice(0, 16) : '',
      valid_until: data.valid_until ? new Date(data.valid_until).toISOString().slice(0, 10) : '',

      // Company fields
      company_name: data.company?.name || '',
      company_website_url: data.company?.website_url || '',
      company_industry: data.company?.industry || '',
      company_headquarters: data.company?.headquarters || '',
      company_description: data.company?.description || '',
      company_linkedin_url: data.company?.linkedin_url || '',
      company_linkedin_employees: data.company?.linkedin_employees ?? undefined,
      company_linkedin_size: data.company?.linkedin_size || '',
      company_linkedin_slogan: data.company?.linkedin_slogan || '',
      company_linkedin_followers: data.company?.linkedin_followers ?? undefined,
      company_linkedin_type: data.company?.linkedin_type || '',
      company_linkedin_specialties: toArray(data.company?.linkedin_specialties),
      company_linkedin_locations: toArray(data.company?.linkedin_locations),

      // Location fields
      location_city: data.location?.city || '',
      location_region: data.location?.region || '',
      location_country: data.location?.country || '',
      location_timezone: data.location?.timezone || '',
      location_latitude: data.location?.latitude || '',
      location_longitude: data.location?.longitude || '',
      location_is_remote: data.location?.is_remote ? 'YES' : 'NO',
    };
  },
  { immediate: true }
);

const saving = ref(false);
const deleting = ref(false);
const deleteDialogOpen = ref(false);

// Combobox states untuk specialties dan locations
const openSpecialties = ref(false);
const openLocations = ref(false);
const searchSpecialties = ref('');
const searchLocations = ref('');

const onSave = async () => {
  try {
    saving.value = true;

    const payload = {
      title: jobData.value.title,
      description: jobData.value.description,
      employment_type: jobData.value.employment_type,
      seniority_level: jobData.value.seniority_level,
      external_url: jobData.value.external_url || undefined,
      status: jobData.value.status,
      posted_date: jobData.value.posted_date || undefined,
      valid_until: jobData.value.valid_until || undefined,
      company: {
        name: jobData.value.company_name,
        website_url: jobData.value.company_website_url || undefined,
        industry: jobData.value.company_industry || undefined,
        headquarters: jobData.value.company_headquarters || undefined,
        description: jobData.value.company_description || undefined,
        linkedin_url: jobData.value.company_linkedin_url || undefined,
        linkedin_employees: jobData.value.company_linkedin_employees,
        linkedin_size: jobData.value.company_linkedin_size || undefined,
        linkedin_slogan: jobData.value.company_linkedin_slogan || undefined,
        linkedin_followers: jobData.value.company_linkedin_followers,
        linkedin_type: jobData.value.company_linkedin_type || undefined,
        linkedin_specialties: jobData.value.company_linkedin_specialties || [],
        linkedin_locations: jobData.value.company_linkedin_locations || [],
      },
      location: {
        city: jobData.value.location_city || undefined,
        region: jobData.value.location_region || undefined,
        country: jobData.value.location_country || undefined,
        timezone: jobData.value.location_timezone || undefined,
        latitude: jobData.value.location_latitude || undefined,
        longitude: jobData.value.location_longitude || undefined,
        is_remote: jobData.value.location_is_remote === 'YES',
      },
    };

    const response = await $api(`/admin/jobs/${jobId.value}`, {
      method: 'PUT',
      body: payload,
    });

    if (response?.success === false) {
      toast.error(response?.message || 'Failed to update job');
      return;
    }

    toast.success('Job updated successfully');
    await refresh();
  } catch (e) {
    console.error('[admin/jobs/edit] save error:', e);
    toast.error(e?.data?.message || 'Failed to update job');
  } finally {
    saving.value = false;
  }
};

const onDelete = () => {
  deleteDialogOpen.value = true;
};

const onConfirmDelete = async () => {
  try {
    deleting.value = true;
    const response = await $api(`/admin/jobs/${jobId.value}`, { method: 'DELETE' });
    if (response?.success === false) {
      toast.error(response?.message || 'Failed to delete job');
      return;
    }
    toast.success('Job deleted');

    await navigateTo('/admin/jobs');
  } catch (e) {
    console.error('[admin/jobs/edit] delete error:', e);
    toast.error(e?.data?.message || 'Failed to delete job');
  } finally {
    deleting.value = false;
    deleteDialogOpen.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="relative">
      <div v-if="pending" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p class="text-sm text-gray-600">Loading job...</p>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2">
          <Button @click="onBack" variant="outline" class="flex items-center gap-2 shadow-none">
            <Icon name="lucide:arrow-left" size="18" />
            Back
          </Button>
          <div class="font-medium">Edit Job</div>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" class="hover:bg-red-50 hover:border-red-200" @click="onDelete" :disabled="deleting">
            <Icon name="lucide:trash-2" size="16" />
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </Button>
          <Button :disabled="saving" @click="onSave">
            <Icon name="lucide:circle-check" size="16" />
            {{ saving ? 'Saving...' : 'Save' }}
          </Button>
        </div>
      </div>

      <div v-if="job" class="space-y-6">
        <section class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="lucide:info" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Basic Information</span>
            </div>
          </div>

          <div class="py-1">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="text-sm mb-2 block">Title<span class="text-red-500">*</span></label>
                <Input v-model="jobData.title" placeholder="Enter job title" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Seniority Level<span class="text-red-500">*</span></label>
                <Select v-model="jobData.seniority_level">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="level in JOB_SENIORITIES" :key="level.value" :value="level.value">
                      {{ level.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="text-sm mb-2 block">Employment Type<span class="text-red-500">*</span></label>
                <Select v-model="jobData.employment_type">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="type in JOB_TYPES" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="md:col-span-3">
                <label class="text-sm mb-2 block">Description<span class="text-red-500">*</span></label>
                <Textarea v-model="jobData.description" class="h-52" placeholder="Enter job description" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Status<span class="text-red-500">*</span></label>
                <Select v-model="jobData.status">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="text-sm mb-2 block">Remote</label>
                <Select v-model="jobData.location_is_remote">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label class="text-sm mb-2 block">External URL</label>
                <Input v-model="jobData.external_url" placeholder="https://..." />
              </div>

              <div>
                <label class="text-sm mb-2 block">City</label>
                <Input v-model="jobData.location_city" placeholder="City" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Region</label>
                <Input v-model="jobData.location_region" placeholder="Region" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Country</label>
                <Input v-model="jobData.location_country" placeholder="Country" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Timezone</label>
                <Input v-model="jobData.location_timezone" placeholder="e.g., Asia/Jakarta" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Latitude</label>
                <Input v-model="jobData.location_latitude" placeholder="e.g., -6.2" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Longitude</label>
                <Input v-model="jobData.location_longitude" placeholder="e.g., 106.8" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Posted Date</label>
                <div class="relative">
                  <input
                    type="date"
                    v-model="jobData.posted_date"
                    class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Icon
                    name="lucide:calendar-days"
                    size="16"
                    class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label class="text-sm mb-2 block">Valid Until</label>
                <div class="relative">
                  <input
                    type="date"
                    v-model="jobData.valid_until"
                    class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Icon
                    name="lucide:calendar-days"
                    size="16"
                    class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Company -->
        <section class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-lg font-semibold">
              <div class="size-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                <Icon name="lucide:building-2" size="18" class="text-white" />
              </div>
              <span class="text-xl font-semibold">Company</span>
            </div>
          </div>

          <div class="py-1">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="text-sm mb-2 block">Name<span class="text-red-500">*</span></label>
                <Input v-model="jobData.company_name" placeholder="Company name" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Website</label>
                <Input v-model="jobData.company_website_url" placeholder="https://..." />
              </div>

              <div>
                <label class="text-sm mb-2 block">Industry</label>
                <Input v-model="jobData.company_industry" placeholder="e.g., Software" />
              </div>

              <div class="md:col-span-3">
                <label class="text-sm mb-2 block">Description</label>
                <Textarea v-model="jobData.company_description" class="min-h-48" placeholder="Company description" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Headquarters</label>
                <Input v-model="jobData.company_headquarters" placeholder="City, Region" />
              </div>

              <div>
                <label class="text-sm mb-2 block">LinkedIn URL</label>
                <Input v-model="jobData.company_linkedin_url" placeholder="https://www.linkedin.com/company/..." />
              </div>

              <div>
                <label class="text-sm mb-2 block">Slogan</label>
                <Input v-model="jobData.company_linkedin_slogan" placeholder="Company slogan" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Employees</label>
                <Input v-model="jobData.company_linkedin_employees" type="number" min="0" placeholder="e.g., 100" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Size</label>
                <Input v-model="jobData.company_linkedin_size" placeholder="e.g., 51-200 employees" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Followers</label>
                <Input v-model="jobData.company_linkedin_followers" type="number" min="0" placeholder="e.g., 5000" />
              </div>

              <div>
                <label class="text-sm mb-2 block">Locations</label>
                <TagsInput v-model="jobData.company_linkedin_locations">
                  <TagsInputItem v-for="item in jobData.company_linkedin_locations" :key="item" :value="item">
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                  <TagsInputInput placeholder="Add location and press enter" />
                </TagsInput>
              </div>

              <div>
                <label class="text-sm mb-2 block">Specialties</label>
                <TagsInput v-model="jobData.company_linkedin_specialties">
                  <TagsInputItem v-for="item in jobData.company_linkedin_specialties" :key="item" :value="item">
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                  <TagsInputInput placeholder="Type and press enter" />
                </TagsInput>
              </div>

              <div>
                <label class="text-sm mb-2 block">Type</label>
                <Input v-model="jobData.company_linkedin_type" placeholder="e.g., Private" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Error state -->
      <div v-if="error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">Error Loading Job</h3>
          <p class="text-muted-foreground mb-4">{{ error.message || 'Failed to load job data' }}</p>
          <Button @click="refresh" variant="outline">
            <Icon name="lucide:refresh-cw" size="16" class="mr-2" />
            Try Again
          </Button>
        </div>
      </div>

      <!-- Not found state -->
      <div v-if="!pending && !job && !error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">Job Not Found</h3>
          <p class="text-muted-foreground mb-4">The job you're looking for doesn't exist.</p>
          <Button as="a" href="/admin/jobs" variant="outline">
            <Icon name="lucide:arrow-left" size="16" class="mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :pending="deleting"
        title="Confirm Delete"
        confirm-text="Delete"
        cancel-text="Cancel"
        @confirm="onConfirmDelete"
      >
        Are you sure you want to delete this job? This action cannot be undone.
      </DeleteConfirmDialog>
    </div>
  </div>
</template>
