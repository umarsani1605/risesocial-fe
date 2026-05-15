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
              <span>{{
                DISCOVER_SOURCE_LABEL[registration.discover_source] ?? registration.discover_source
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Scholarship Type</span>
              <span>{{
                SCHOLARSHIP_TYPE_LABEL[registration.scholarship_type] ??
                registration.scholarship_type
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Registration Date</span>
              <span>{{ formatDatetime(registration.created_at) }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Section 2: Payment Information -->
        <div v-if="registration.payments?.[0]" class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-4">Payment Information</p>
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Payment Type</span>
              <img
                v-if="registration.payments[0].payment_method === 'MIDTRANS'"
                src="/images/payment-logo/midtrans.png"
                alt="Midtrans"
                class="h-5 object-contain"
              />
              <img
                v-else-if="registration.payments[0].payment_method === 'PAYPAL'"
                src="/images/payment-logo/paypal.png"
                alt="PayPal"
                class="h-5 object-contain"
              />
              <span v-else class="font-medium">{{
                PAYMENT_TYPE_LABEL[registration.payments[0].payment_method] ??
                registration.payments[0].payment_method
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
                formatPrice(registration.payments[0].transaction?.amount)
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Payment Date</span>
              <span>{{
                registration.payments[0].transaction?.paid_at
                  ? formatDatetime(registration.payments[0].transaction.paid_at)
                  : '–'
              }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Payment Proof</span>
              <span v-if="!registration.payments[0].payment_proof" class="text-muted">–</span>
              <div v-else>
                <UButton
                  icon="i-ph-download-simple-bold"
                  label="Download"
                  size="sm"
                  color="neutral"
                  variant="light"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
