<script setup>
import { ref, watch, computed } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'create' }, // 'create' | 'edit'
  job: { type: Object, default: null },
  pending: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const form = ref({
  title: '',
  description: '',
  company: '',
  location: '',
  jobType: 'FULL_TIME',
  experienceLevel: 'ENTRY_LEVEL',
  minSalary: '',
  maxSalary: '',
  isRemote: 'false', // as string for Select; converted to boolean on submit
  applicationDeadline: '',
  applicationUrl: '',
  contactEmail: '',
  companyDescription: '',
  companyWebsite: '',
  companySize: '',
  skillsInput: '', // comma separated
  requirementsInput: '',
  benefitsInput: '',
});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      if (props.mode === 'edit' && props.job) {
        const j = props.job;
        form.value = {
          title: j.title || '',
          description: j.description || '',
          company: j.company?.name || j.company || '',
          location: j.location?.city || j.location || '',
          jobType: (j.jobType || j.employment_type || 'FULL_TIME').toString().toUpperCase(),
          experienceLevel: (j.experienceLevel || j.seniority_level || 'ENTRY_LEVEL').toString().toUpperCase(),
          minSalary: j.minSalary || j.salary_min || '',
          maxSalary: j.maxSalary || j.salary_max || '',
          isRemote: String(j.isRemote ?? j.is_remote ?? false),
          applicationDeadline: j.applicationDeadline || j.application_deadline || '',
          applicationUrl: j.applicationUrl || '',
          contactEmail: j.contactEmail || '',
          companyDescription: j.companyDescription || '',
          companyWebsite: j.companyWebsite || '',
          companySize: j.companySize || '',
          skillsInput: Array.isArray(j.skills) ? j.skills.join(', ') : '',
          requirementsInput: Array.isArray(j.requirements) ? j.requirements.join(', ') : '',
          benefitsInput: Array.isArray(j.benefits) ? j.benefits.join(', ') : '',
        };
      } else {
        // reset create
        form.value = {
          title: '',
          description: '',
          company: '',
          location: '',
          jobType: 'FULL_TIME',
          experienceLevel: 'ENTRY_LEVEL',
          minSalary: '',
          maxSalary: '',
          isRemote: 'false',
          applicationDeadline: '',
          applicationUrl: '',
          contactEmail: '',
          companyDescription: '',
          companyWebsite: '',
          companySize: '',
          skillsInput: '',
          requirementsInput: '',
          benefitsInput: '',
        };
      }
    }
  },
  { immediate: true }
);

const titleText = computed(() => (props.mode === 'edit' ? 'Edit Job' : 'Create Job'));
const onClose = () => emit('update:modelValue', false);

const buildPayload = () => {
  const toArray = (v) =>
    (v || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  return {
    title: form.value.title,
    description: form.value.description,
    company: form.value.company,
    location: form.value.location,
    jobType: form.value.jobType,
    experienceLevel: form.value.experienceLevel,
    minSalary: form.value.minSalary ? Number(form.value.minSalary) : undefined,
    maxSalary: form.value.maxSalary ? Number(form.value.maxSalary) : undefined,
    isRemote: form.value.isRemote === 'true',
    applicationDeadline: form.value.applicationDeadline || undefined,
    applicationUrl: form.value.applicationUrl || undefined,
    contactEmail: form.value.contactEmail || undefined,
    companyDescription: form.value.companyDescription || undefined,
    companyWebsite: form.value.companyWebsite || undefined,
    companySize: form.value.companySize || undefined,
    skills: toArray(form.value.skillsInput),
    requirements: toArray(form.value.requirementsInput),
    benefits: toArray(form.value.benefitsInput),
  };
};

const onSubmit = () => {
  emit('submit', buildPayload());
};
</script>

<template>
  <Dialog :open="modelValue" @update:open="onClose">
    <DialogContent class="sm:max-w-3xl max-h-[85vh] overflow-hidden">
      <DialogHeader class="pb-2 px-6 pt-6">
        <DialogTitle>{{ titleText }}</DialogTitle>
      </DialogHeader>

      <!-- Scrollable body -->
      <div class="px-6 pb-4 overflow-y-auto max-h-[65vh]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2 space-y-2">
            <Label for="title">Title</Label>
            <Input id="title" v-model="form.title" required placeholder="e.g. Senior Frontend Engineer" />
          </div>

          <div class="space-y-2">
            <Label for="company">Company</Label>
            <Input id="company" v-model="form.company" required placeholder="Company Inc." />
          </div>
          <div class="space-y-2">
            <Label for="location">Location</Label>
            <Input id="location" v-model="form.location" required placeholder="Jakarta, ID" />
          </div>

          <div class="space-y-2">
            <Label for="jobType">Job Type</Label>
            <Select v-model="form.jobType">
              <SelectTrigger class="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
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
            <Label for="experienceLevel">Experience Level</Label>
            <Select v-model="form.experienceLevel">
              <SelectTrigger class="w-full"><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>
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
            <Label for="minSalary">Min Salary</Label>
            <Input id="minSalary" type="number" v-model="form.minSalary" placeholder="e.g. 8000000" />
          </div>
          <div class="space-y-2">
            <Label for="maxSalary">Max Salary</Label>
            <Input id="maxSalary" type="number" v-model="form.maxSalary" placeholder="e.g. 15000000" />
          </div>

          <div class="space-y-2">
            <Label for="isRemote">Remote</Label>
            <Select v-model="form.isRemote">
              <SelectTrigger class="w-full"><SelectValue placeholder="Remote" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="applicationDeadline">Application Deadline</Label>
            <Input id="applicationDeadline" type="datetime-local" v-model="form.applicationDeadline" />
          </div>

          <div class="space-y-2">
            <Label for="applicationUrl">Application URL</Label>
            <Input id="applicationUrl" v-model="form.applicationUrl" placeholder="https://..." />
          </div>
          <div class="space-y-2">
            <Label for="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" v-model="form.contactEmail" placeholder="[email protected]" />
          </div>

          <div class="md:col-span-2 space-y-2">
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="form.description"
              rows="5"
              required
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>

          <div class="md:col-span-2 space-y-2">
            <Label for="skills">Skills (comma separated)</Label>
            <Input id="skills" v-model="form.skillsInput" placeholder="JavaScript, Vue, Tailwind" />
          </div>

          <div class="md:col-span-2 space-y-2">
            <Label for="requirements">Requirements (comma separated)</Label>
            <Input id="requirements" v-model="form.requirementsInput" placeholder="3+ years experience, Bachelor's degree" />
          </div>

          <div class="md:col-span-2 space-y-2">
            <Label for="benefits">Benefits (comma separated)</Label>
            <Input id="benefits" v-model="form.benefitsInput" placeholder="Health insurance, Remote stipend" />
          </div>

          <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="companyWebsite">Company Website</Label>
              <Input id="companyWebsite" v-model="form.companyWebsite" placeholder="https://company.com" />
            </div>
            <div class="space-y-2">
              <Label for="companySize">Company Size</Label>
              <Input id="companySize" v-model="form.companySize" placeholder="51-200" />
            </div>
          </div>
          <div class="md:col-span-2 space-y-2">
            <Label for="companyDescription">Company Description</Label>
            <Textarea id="companyDescription" v-model="form.companyDescription" rows="3" placeholder="About the company..." />
          </div>
        </div>
      </div>

      <DialogFooter class="mt-2 px-6 pb-6">
        <Button variant="outline" @click="onClose" :disabled="pending">Cancel</Button>
        <Button @click="onSubmit" :disabled="pending">{{ pending ? 'Saving...' : 'Save' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
