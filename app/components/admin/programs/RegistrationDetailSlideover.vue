<script setup lang="ts">
import { SCHOLARSHIP_TYPE_LABEL, DISCOVER_SOURCE_LABEL, PAYMENT_TYPE_LABEL } from '@/constants/ryls'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  registration: RylsRegistration | null
}>()
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Registration Detail"
    side="right"
    :ui="{ content: 'max-w-xl', body: 'p-0!' }"
  >
    <template #body>
      <div v-if="registration">
        <!-- Section 1: Personal Information -->
        <div class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-4">Personal Information</p>
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Full Name</span>
              <span class="font-medium">{{ registration.full_name }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Email</span>
              <span>{{ registration.email }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">WhatsApp</span>
              <span>{{ registration.whatsapp ?? '–' }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Gender</span>
              <span>{{ registration.gender === 'FEMALE' ? 'Female' : 'Male' }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Date of Birth</span>
              <span>{{ formatDate(registration.date_of_birth) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Residence</span>
              <span>{{ registration.residence ?? '–' }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Nationality</span>
              <span class="capitalize">{{ registration.nationality }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Second Nationality</span>
              <span :class="registration.second_nationality ? '' : 'text-muted'">
                {{ registration.second_nationality ?? '–' }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Institution</span>
              <span>{{ registration.institution ?? '–' }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Discover Source</span>
              <span>{{ DISCOVER_SOURCE_LABEL[registration.discover_source] ?? registration.discover_source }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Scholarship Type</span>
              <span>{{ SCHOLARSHIP_TYPE_LABEL[registration.scholarship_type] ?? registration.scholarship_type }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Registration Date</span>
              <span>{{ formatDatetime(registration.created_at) }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Section 2: Fully Funded -->
        <template v-if="registration.scholarship_type === 'FULLY_FUNDED'">
          <div class="p-6">
            <p class="text-xs font-bold uppercase tracking-wide mb-4">Fully Funded</p>
            <div class="space-y-2">
              <div class="grid grid-cols-2 gap-2 text-sm">
                <span class="text-muted">Essay Topic</span>
                <span
                  :class="
                    registration.fully_funded_submission?.essay_topic ? '' : 'text-muted'
                  "
                >
                  {{ registration.fully_funded_submission?.essay_topic ?? 'Not provided' }}
                </span>
              </div>
            </div>
          </div>
          <USeparator />
        </template>

        <!-- Section 3: Payment Information -->
        <div v-if="registration.payments?.[0]" class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-4">Payment Information</p>
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Payment Type</span>
              <span class="font-medium">{{
                PAYMENT_TYPE_LABEL[registration.payments[0].type] ?? registration.payments[0].type
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Payment Status</span>
              <span class="capitalize">{{
                registration.payments[0].status?.toLowerCase() ?? '–'
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Amount</span>
              <span class="font-medium">{{
                formatPrice(registration.payments[0].amount)
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Payment Date</span>
              <span>{{
                registration.payments[0].paid_at
                  ? formatDatetime(registration.payments[0].paid_at)
                  : '–'
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Payment Proof</span>
              <span v-if="!registration.payments[0].payment_proof" class="text-muted">–</span>
              <UButton
                v-else
                icon="i-ph-download-simple-bold"
                label="Download"
                size="xs"
                color="neutral"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
