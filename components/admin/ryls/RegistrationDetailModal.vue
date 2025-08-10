<script setup>
import { computed } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Mail, Phone, MapPin, GraduationCap, User, FileText, Download, ExternalLink } from 'lucide-vue-next';
import StatusBadge from './StatusBadge.vue';
import ScholarshipBadge from './ScholarshipBadge.vue';

/**
 * Props definition
 * @typedef {Object} Registration
 * @property {number} id - Registration ID
 * @property {string} submissionId - Submission ID
 * @property {Object} personalInfo - Personal information
 * @property {Object} applicationInfo - Application information
 * @property {Object} submissionDetails - Submission details
 * @property {Object} timestamps - Created/updated timestamps
 */
const props = defineProps({
  /** @type {boolean} */
  open: {
    type: Boolean,
    default: false,
  },
  /** @type {Registration|null} */
  registration: {
    type: Object,
    default: null,
  },
  /** @type {boolean} */
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open', 'download-file']);

/** @type {import('vue').ComputedRef<boolean>} */
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

/** @type {import('vue').ComputedRef<string>} */
const modalTitle = computed(() => {
  if (!props.registration) return 'Registration Details';
  return `${props.registration.personalInfo?.fullName || 'Unknown'} - Registration Details`;
});

/** @type {import('vue').ComputedRef<string>} */
const formattedAge = computed(() => {
  const age = props.registration?.personalInfo?.age;
  return age ? `${age} years old` : 'Age not available';
});

/** @type {import('vue').ComputedRef<string>} */
const formattedDateOfBirth = computed(() => {
  const dob = props.registration?.personalInfo?.dateOfBirth;
  if (!dob) return 'Not provided';
  return new Date(dob).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

/** @type {import('vue').ComputedRef<string>} */
const formattedCreatedAt = computed(() => {
  const date = props.registration?.timestamps?.createdAt;
  if (!date) return 'Unknown';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

/**
 * Handle file download
 * @param {Object} file - File object
 */
const handleFileDownload = (file) => {
  if (file?.id) {
    emit('download-file', file);
  }
};

/**
 * Get discover source display text
 * @param {string} source - Discover source enum
 * @returns {string} Display text
 */
const getDiscoverSourceText = (source) => {
  const sourceMap = {
    RISE_INSTAGRAM: 'RISE Instagram',
    RISE_LINKEDIN: 'RISE LinkedIn',
    RISE_WEBSITE: 'RISE Website',
    FRIENDS_COLLEAGUES: 'Friends/Colleagues',
    UNIVERSITY: 'University',
    OTHER: 'Other',
  };
  return sourceMap[source] || source;
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="(value) => (isOpen = value)">
    <DialogContent class="max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{{ modalTitle }}</DialogTitle>
        <DialogDescription> Registration ID: {{ registration?.submissionId || 'N/A' }} </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[70vh] pr-4">
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="registration" class="space-y-6">
          <!-- Status & Application Info -->
          <div class="flex flex-wrap gap-3">
            <StatusBadge :status="registration.applicationInfo?.status" />
            <ScholarshipBadge :type="registration.applicationInfo?.scholarshipType" />
            <Badge variant="outline" class="flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              Applied {{ formattedCreatedAt }}
            </Badge>
          </div>

          <Separator />

          <!-- Personal Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <User class="w-5 h-5" />
              Personal Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p class="text-sm">{{ registration.personalInfo?.fullName || 'Not provided' }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-muted-foreground">Email</label>
                  <p class="text-sm flex items-center gap-1">
                    <Mail class="w-3 h-3" />
                    {{ registration.personalInfo?.email || 'Not provided' }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-muted-foreground">WhatsApp</label>
                  <p class="text-sm flex items-center gap-1">
                    <Phone class="w-3 h-3" />
                    {{ registration.personalInfo?.whatsapp || 'Not provided' }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-muted-foreground">Gender</label>
                  <p class="text-sm">{{ registration.personalInfo?.gender || 'Not provided' }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p class="text-sm">{{ formattedDateOfBirth }} ({{ formattedAge }})</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-muted-foreground">Residence</label>
                  <p class="text-sm flex items-center gap-1">
                    <MapPin class="w-3 h-3" />
                    {{ registration.personalInfo?.residence || 'Not provided' }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-muted-foreground">Nationality</label>
                  <p class="text-sm">{{ registration.personalInfo?.nationality || 'Not provided' }}</p>
                </div>

                <div v-if="registration.personalInfo?.secondNationality">
                  <label class="text-sm font-medium text-muted-foreground">Second Nationality</label>
                  <p class="text-sm">{{ registration.personalInfo.secondNationality }}</p>
                </div>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-muted-foreground">Institution</label>
              <p class="text-sm flex items-center gap-1">
                <GraduationCap class="w-3 h-3" />
                {{ registration.personalInfo?.institution || 'Not provided' }}
              </p>
            </div>
          </div>

          <Separator />

          <!-- Application Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <FileText class="w-5 h-5" />
              Application Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground">How did you discover RISE?</label>
                <p class="text-sm">{{ getDiscoverSourceText(registration.applicationInfo?.discoverSource) }}</p>
                <p v-if="registration.applicationInfo?.discoverOtherText" class="text-xs text-muted-foreground mt-1">
                  "{{ registration.applicationInfo.discoverOtherText }}"
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Submission Details -->
          <div v-if="registration.submissionDetails" class="space-y-4">
            <h3 class="text-lg font-semibold">Submission Details</h3>

            <!-- Fully Funded Submission -->
            <div v-if="registration.submissionDetails.type === 'FULLY_FUNDED'" class="space-y-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Essay Topic</label>
                <p class="text-sm">{{ registration.submissionDetails.essayTopic || 'Not provided' }}</p>
              </div>

              <div v-if="registration.submissionDetails.essayDescription">
                <label class="text-sm font-medium text-muted-foreground">Essay Description</label>
                <p class="text-sm bg-muted/50 p-3 rounded-md">{{ registration.submissionDetails.essayDescription }}</p>
              </div>

              <div v-if="registration.submissionDetails.essayFile">
                <label class="text-sm font-medium text-muted-foreground">Essay File</label>
                <div class="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1"
                    @click="handleFileDownload(registration.submissionDetails.essayFile)"
                  >
                    <Download class="w-3 h-3" />
                    {{ registration.submissionDetails.essayFile.originalName }}
                  </Button>
                  <span class="text-xs text-muted-foreground"> {{ Math.round(registration.submissionDetails.essayFile.fileSize / 1024) }} KB </span>
                </div>
              </div>
            </div>

            <!-- Self Funded Submission -->
            <div v-if="registration.submissionDetails.type === 'SELF_FUNDED'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-muted-foreground">Passport Number</label>
                  <p class="text-sm">{{ registration.submissionDetails.passportNumber || 'Not provided' }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-muted-foreground">Need Visa?</label>
                  <Badge :variant="registration.submissionDetails.needVisa ? 'default' : 'secondary'">
                    {{ registration.submissionDetails.needVisa ? 'Yes' : 'No' }}
                  </Badge>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-muted-foreground">Read Policies</label>
                <Badge :variant="registration.submissionDetails.readPolicies ? 'default' : 'destructive'">
                  {{ registration.submissionDetails.readPolicies ? 'Agreed' : 'Not Agreed' }}
                </Badge>
              </div>

              <div v-if="registration.submissionDetails.headshotFile">
                <label class="text-sm font-medium text-muted-foreground">Headshot File</label>
                <div class="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1"
                    @click="handleFileDownload(registration.submissionDetails.headshotFile)"
                  >
                    <Download class="w-3 h-3" />
                    {{ registration.submissionDetails.headshotFile.originalName }}
                  </Button>
                  <span class="text-xs text-muted-foreground">
                    {{ Math.round(registration.submissionDetails.headshotFile.fileSize / 1024) }} KB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex items-center justify-center py-8">
          <p class="text-muted-foreground">No registration data available</p>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
