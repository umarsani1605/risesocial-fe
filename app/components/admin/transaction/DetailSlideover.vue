<script setup lang="ts">
import type { AdminTransactionDetail } from '@/types'
import {
  TRANSACTION_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PROVIDER_LABEL
} from '@/constants/transaction'
import { SCHOLARSHIP_TYPES } from '@/utils/ryls'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  transactionId: number | null
}>()

const { api } = useApi()

const isLoading = ref(false)
const detail = ref<AdminTransactionDetail | null>(null)

watch(
  () => props.transactionId,
  async (id) => {
    if (!id) return
    isLoading.value = true
    detail.value = null
    try {
      const res = await api<ApiResponse<AdminTransactionDetail>>(`/admin/transactions/${id}`)
      detail.value = res.data
    } finally {
      isLoading.value = false
    }
  }
)

function fmt(dt: string | null) {
  if (!dt) return '—'
  return formatDatetime(dt)
}

function getScholarshipLabel(type: string) {
  return SCHOLARSHIP_TYPES.find((s) => s.value === type)?.label ?? type
}

const detailRows = computed(() => {
  if (!detail.value) return []
  const d = detail.value
  return [
    { label: 'Transaction Code', value: d.transaction_code },
    { label: 'Amount', value: formatPrice(d.amount) },
    { label: 'Status', value: TRANSACTION_STATUS_LABEL[d.status] ?? d.status },
    { label: 'Provider', value: PROVIDER_LABEL[d.provider] ?? d.provider },
    {
      label: 'Payment Method',
      value: d.payment_method ? (PAYMENT_METHOD_LABEL[d.payment_method] ?? d.payment_method) : '—'
    },
    { label: 'Created At', value: fmt(d.created_at) },
    { label: 'Paid At', value: fmt(d.paid_at) },
    { label: 'Expired At', value: fmt(d.expired_at) }
  ]
})

const customerRows = computed(() => {
  if (!detail.value) return []
  const c = detail.value.customer_details
  return [
    { label: 'Name', value: c.name },
    { label: 'Email', value: c.email },
    { label: 'Phone', value: c.phone ?? '—' },
    { label: 'Address', value: c.address ?? '—' },
    { label: 'City', value: c.city ?? '—' },
    { label: 'Postal Code', value: c.postal_code ?? '—' },
    { label: 'Country Code', value: c.country_code ?? '—' }
  ]
})
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Transaction Detail"
    side="right"
    :ui="{ content: 'max-w-xl', body: 'p-0!' }"
  >
    <template #body>
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <UIcon name="i-ph-spinner-bold" class="size-6 animate-spin text-muted" />
      </div>

      <div v-else-if="detail">
        <!-- Section 1: Transaction Details -->
        <div class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-4">Transaction Details</p>
          <div class="space-y-2">
            <div v-for="row in detailRows" :key="row.label" class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">{{ row.label }}</span>
              <span>{{ row.value }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Section 2: Customer Details -->
        <div class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-4">Customer Details</p>
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">User</span>
              <span v-if="!detail.customer_details.user_id">Guest</span>
              <NuxtLink
                v-else
                :to="`/admin/users?id=${detail.customer_details.user_id}`"
                target="_blank"
                class="text-primary hover:underline flex items-center gap-1"
              >
                {{ detail.customer_details.user_name }}
                <UIcon name="i-ph-arrow-square-out-bold" class="size-3" />
              </NuxtLink>
            </div>
            <div
              v-for="row in customerRows"
              :key="row.label"
              class="grid grid-cols-2 gap-2 text-sm"
            >
              <span class="text-muted">{{ row.label }}</span>
              <span>{{ row.value }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Section 3: Product Details -->
        <div class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-4">Product Details</p>
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Product Name</span>
              <span>{{ detail.product_details.items[0]?.product_name }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Quantity</span>
              <span>{{ detail.product_details.items[0]?.quantity }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Unit Price</span>
              <span>{{ formatPrice(detail.product_details.items[0]?.unit_price ?? 0) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Total</span>
              <span>{{ formatPrice(detail.product_details.items[0]?.total_price ?? 0) }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <div class="p-6">
          <!-- Academy Enrollment sub-section -->
          <div v-if="detail.product_details.enrollment" class="space-y-2">
            <p class="text-xs font-bold uppercase tracking-wide mb-4">Academy Enrollment</p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Cohort ID</span>
              <span>{{ detail.product_details.enrollment.cohort_id }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Cohort Name</span>
              <NuxtLink
                :to="`/admin/cohorts?id=${detail.product_details.enrollment.cohort_id}`"
                target="_blank"
                class="text-primary hover:underline flex items-center gap-1"
              >
                {{ detail.product_details.enrollment.cohort_name }}
                <UIcon name="i-ph-arrow-square-out-bold" class="size-3" />
              </NuxtLink>
            </div>
          </div>

          <!-- RYLS Registration sub-section -->
          <div v-if="detail.product_details.ryls_registration" class="space-y-2">
            <p class="text-xs font-bold uppercase tracking-wide mb-4">RYLS Registration</p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Registration ID</span>
              <span>{{ detail.product_details.ryls_registration.id }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Full Name</span>
              <NuxtLink
                :to="`/admin/programs/ryls?id=${detail.product_details.ryls_registration.id}`"
                target="_blank"
                class="text-primary hover:underline flex items-center gap-1"
              >
                {{ detail.product_details.ryls_registration.full_name }}
                <UIcon name="i-ph-arrow-square-out-bold" class="size-3" />
              </NuxtLink>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Scholarship Type</span>
              <span>{{
                getScholarshipLabel(detail.product_details.ryls_registration.scholarship_type)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
