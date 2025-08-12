<script setup>
import { computed } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DISCOVER_SOURCES, SCHOLARSHIP_TYPES, GENDER_OPTIONS } from '~/constants/ryls';
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
  return `${props.registration.fullName || 'Unknown'} - `;
});

/** @type {import('vue').ComputedRef<string>} */
const formattedDateOfBirth = computed(() => {
  const dob = props.registration?.date_of_birth;
  if (!dob) return 'Not provided';
  return new Date(dob).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

console.log('Registration data: ', props.registration);

// Format gender using GENDER_OPTIONS
const formattedGender = computed(() => {
  if (!props.registration?.gender) return 'Not provided';
  const gender = GENDER_OPTIONS.find((g) => g.value === props.registration.gender);
  return gender ? gender.label : props.registration.gender;
});

// Format discover source using DISCOVER_SOURCES
const formattedDiscoverSource = computed(() => {
  if (!props.registration?.discover_source) return 'Not provided';

  if (props.registration.discover_source === 'OTHER' && props.registration.discover_other_text) {
    return `Other: ${props.registration.discover_other_text}`;
  }

  const source = DISCOVER_SOURCES.find((s) => s.value === props.registration.discover_source);
  return source ? source.label : props.registration.discover_source;
});

// Format scholarship type using SCHOLARSHIP_TYPES
const formattedScholarshipType = computed(() => {
  if (!props.registration?.scholarship_type) return 'Not provided';
  const type = SCHOLARSHIP_TYPES.find((t) => t.value === props.registration.scholarship_type);
  return type ? type.label : props.registration.scholarship_type;
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
const handleFileDownload = (id) => {
  emit('download-file', id);
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
    FRIENDS: 'Friends/Colleagues',
    UNIVERSITY: 'University',
    OTHER: 'Other',
  };
  return sourceMap[source] || source;
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="(value) => (isOpen = value)">
    <DialogContent class="min-w-3xl max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Registration Details</DialogTitle>
      </DialogHeader>

      <ScrollArea class="max-h-[70vh] pr-4">
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="registration" class="space-y-6">
          <Separator />
          <div class="space-y-4">
            <h3 class="text-base font-semibold flex items-center gap-2">Personal Information</h3>

            <div class="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-muted-foreground">Full Name</label>
                <p>{{ registration.full_name || 'Not provided' }}</p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">Email</label>
                <p>
                  {{ registration.email || 'Not provided' }}
                </p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">WhatsApp</label>
                <p>
                  {{ registration.whatsapp || 'Not provided' }}
                </p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">Gender</label>
                <p>{{ registration.gender == 'MALE' ? 'Male' : 'Female' || 'Not provided' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-muted-foreground">Date of Birth</label>
                <p>{{ formattedDateOfBirth }}</p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">Residence</label>
                <p>
                  {{ registration.residence || 'Not provided' }}
                </p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">Nationality</label>
                <p>{{ registration.nationality || 'Not provided' }}</p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">Second Nationality</label>
                <p>{{ registration.secondNationality ? registration.secondNationality : '-' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-muted-foreground">Institution</label>
                <p>
                  {{ registration.institution || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="text-xs font-medium text-muted-foreground">Discover Source</label>
                <p>{{ formattedDiscoverSource }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-muted-foreground">Scholarship Type</label>
                <p>{{ formattedScholarshipType }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-muted-foreground">Payment Type</label>
                <NuxtImg
                  v-if="registration.payments[0].type === 'PAYPAL'"
                  src="/images/payment-logo/paypal_small.png"
                  alt="paypal"
                  class="h-6 mt-2"
                />
                <NuxtImg
                  v-if="registration.payments[0].type === 'MIDTRANS'"
                  src="/images/payment-logo/midtrans.png"
                  alt="midtrans"
                  class="h-5 mt-2"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div v-if="registration.scholarship_type === 'FULLY_FUNDED'" class="space-y-4">
            <h3 class="text-base font-semibold flex items-center gap-2">Fully Funded</h3>
            <div>
              <label class="text-xs font-medium text-muted-foreground">Essay Topic</label>
              <p class="text-xs">{{ registration.fully_funded_submission.essay_topic || 'Not provided' }}</p>
            </div>

            <div v-if="registration.fully_funded_submission.essay_description">
              <label class="text-xs font-medium text-muted-foreground">Essay Description</label>
              <p class="text-xs bg-muted/50 p-3 rounded-md">{{ registration.fully_funded_submission.essay_description }}</p>
            </div>

            <div v-if="registration.fully_funded_submission.essay_file">
              <label class="text-xs font-medium text-muted-foreground">Essay File</label>
              <div class="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  class="flex items-center gap-1"
                  @click="handleFileDownload(registration.fully_funded_submission.essay_file)"
                >
                  <Download class="w-3 h-3" />
                  Download
                </Button>
                <span class="text-xs text-muted-foreground">
                  {{ Math.round(registration.fully_funded_submission.essay_file.fileSize / 1024) }} KB
                </span>
              </div>
            </div>
          </div>
          <div v-if="registration.scholarship_type === 'SELF_FUNDED'" class="space-y-4">
            <h3 class="text-base font-semibold flex items-center gap-2">Self Funded</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-muted-foreground">Passport Number</label>
                <p>
                  {{ registration.self_funded_submission.passport_number || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="text-xs font-medium text-muted-foreground">Need Visa?</label>
                <p>
                  {{ registration.self_funded_submission.need_visa ? 'Yes' : 'No' }}
                </p>
              </div>
              <div>
                <label class="text-xs font-medium text-muted-foreground">Headshot File</label>
                <p>
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1"
                    @click="handleFileDownload(registration.self_funded_submission.headshot_file_id)"
                  >
                    <Download class="w-3 h-3" />
                    Download
                  </Button>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div class="space-y-4">
            <h3 class="text-base font-semibold flex items-center gap-2">Payment Information</h3>

            <div class="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-muted-foreground">Payment Type</label>
                <NuxtImg
                  v-if="registration.payments[0].type === 'PAYPAL'"
                  src="/images/payment-logo/paypal_small.png"
                  alt="paypal"
                  class="h-6 mt-2"
                />
                <NuxtImg
                  v-if="registration.payments[0].type === 'MIDTRANS'"
                  src="/images/payment-logo/midtrans.png"
                  alt="midtrans"
                  class="h-5 mt-2"
                />
              </div>

              <div v-if="registration.payments[0].type === 'PAYPAL'">
                <label class="text-xs font-medium text-muted-foreground">Payment Proof</label>
                <div class="mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1"
                    @click="handleFileDownload(registration.payments[0].payment_proof_id)"
                  >
                    <Download class="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>

              <div v-if="registration.payments[0].type === 'MIDTRANS'">
                <label class="text-xs font-medium text-muted-foreground">Order ID</label>
                <p>{{ registration.payments[0].midtrans.order_id }}</p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">Amount</label>
                <p>{{ registration.payments[0].amount ? `Rp${registration.payments[0].amount.toLocaleString('id-ID')}` : 'Not provided' }}</p>
              </div>

              <div>
                <label class="text-xs font-medium text-muted-foreground">Payment Date</label>
                <p>{{ registration.payments[0].created_at ? new Date(registration.payments[0].created_at).toLocaleString() : 'Not available' }}</p>
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
