<script setup lang="ts">
import type { AdminTransactionDetail } from '@/types'
import {
  TRANSACTION_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PROVIDER_LABEL,
  formatProductName
} from '@/constants/transaction'
import { SCHOLARSHIP_TYPES } from '@/utils/ryls'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  transactionId: number | null
}>()

const { api } = useApi()
const toast = useToast()
const { canEdit } = useAdminPermission('admin.transactions')

const isLoading = ref(false)
const detail = ref<AdminTransactionDetail | null>(null)
const isSyncing = ref(false)
const isUpdateModalOpen = ref(false)
const isUpdatingStatus = ref(false)

const isMidtrans = computed(() => detail.value?.provider === 'midtrans')

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

async function onCheckStatus() {
  if (!detail.value) return
  isSyncing.value = true
  try {
    const res = await api<ApiResponse<AdminTransactionDetail>>(
      `/admin/transactions/${detail.value.id}/check-status`,
      { method: 'POST' }
    )
    detail.value = res.data
    toast.add({ title: 'Transaction status checked', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isSyncing.value = false
  }
}

async function onConfirmUpdate(newStatus: string) {
  if (!detail.value) return
  isUpdatingStatus.value = true
  try {
    const res = await api<ApiResponse<AdminTransactionDetail>>(
      `/admin/transactions/${detail.value.id}/update-status`,
      { method: 'POST', body: { status: newStatus } }
    )
    detail.value = res.data
    isUpdateModalOpen.value = false
    toast.add({ title: 'Transaction status updated', color: 'success' })
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isUpdatingStatus.value = false
  }
}

function fmt(dt: string | null) {
  if (!dt) return '—'
  return formatDatetime(dt)
}

function getScholarshipLabel(type: string) {
  return SCHOLARSHIP_TYPES.find((s) => s.value === type)?.label ?? type
}

const PROVIDER_LOGO: Record<string, string> = {
  midtrans: '/images/payment-logo/midtrans.png',
  paypal: '/images/payment-logo/paypal.png',
  paypal_manual: '/images/payment-logo/paypal.png'
}

const providerLogo = computed(() => {
  const provider = detail.value?.provider
  return provider ? (PROVIDER_LOGO[provider] ?? null) : null
})

const providerLabel = computed(() => {
  const provider = detail.value?.provider
  if (!provider) return '—'
  return PROVIDER_LABEL[provider] ?? provider
})

const detailRows = computed(() => {
  if (!detail.value) return []
  const d = detail.value
  return [
    { label: 'Transaction Code', value: d.transaction_code },
    { label: 'Amount', value: formatPrice(d.amount) },
    { label: 'Status', value: TRANSACTION_STATUS_LABEL[d.status] ?? d.status },
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
          <p class="text-xs font-bold uppercase tracking-wide mb-5">Transaction Details</p>
          <div class="space-y-3">
            <div v-for="row in detailRows" :key="row.label" class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">{{ row.label }}</span>
              <span>{{ row.value }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">Payment</span>
              <span>
                <img
                  v-if="providerLogo"
                  :src="providerLogo"
                  :alt="providerLabel"
                  :title="providerLabel"
                  class="h-4 object-contain"
                >
                <template v-else>{{ providerLabel }}</template>
              </span>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Section 2: Customer Details -->
        <div class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-5">Customer Details</p>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
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
              class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm"
            >
              <span class="text-muted">{{ row.label }}</span>
              <span>{{ row.value }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Section 3: Product Details -->
        <div class="p-6">
          <p class="text-xs font-bold uppercase tracking-wide mb-5">Product Details</p>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">Product Name</span>
              <span>{{ formatProductName(detail.product_details.type, detail.product_details.items[0]?.product_name) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">Unit Price</span>
              <span>{{ formatPrice(detail.product_details.items[0]?.unit_price ?? 0) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">Total</span>
              <span>{{ formatPrice(detail.product_details.items[0]?.total_price ?? 0) }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <div class="p-6">
          <!-- RYLS Registration sub-section -->
          <div v-if="detail.product_details.ryls_registration" class="space-y-2">
            <p class="text-xs font-bold uppercase tracking-wide mb-5">RYLS Registration</p>
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">Registration ID</span>
              <span>{{ detail.product_details.ryls_registration.id }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">Full Name</span>
              <NuxtLink
                :to="`/admin/programs?id=${detail.product_details.ryls_registration.id}`"
                target="_blank"
                class="text-primary hover:underline flex items-center gap-1"
              >
                {{ detail.product_details.ryls_registration.full_name }}
                <UIcon name="i-ph-arrow-square-out-bold" class="size-3" />
              </NuxtLink>
            </div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <span class="text-muted">Scholarship Type</span>
              <span>{{
                getScholarshipLabel(detail.product_details.ryls_registration.scholarship_type)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="detail && canEdit" #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="Change Status"
          color="primary"
          :variant="isMidtrans ? 'light' : 'solid'"
          icon="i-ph-pencil-simple-bold"
          :disabled="isSyncing || isUpdatingStatus"
          @click="isUpdateModalOpen = true"
        />
        <UButton
          v-if="isMidtrans"
          label="Check Status"
          color="primary"
          variant="solid"
          icon="i-ph-arrows-clockwise-bold"
          :loading="isSyncing"
          :disabled="isSyncing || isUpdatingStatus"
          @click="onCheckStatus"
        />
      </div>
    </template>
  </USlideover>

  <AdminTransactionUpdateStatusModal
    v-if="detail && canEdit"
    v-model:open="isUpdateModalOpen"
    :current-status="detail.status"
    :loading="isUpdatingStatus"
    @confirm="onConfirmUpdate"
  />
</template>
