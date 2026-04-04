<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { AdminTransaction, AdminTransactionDetail } from '@/types'
import {
  TRANSACTION_STATUS_ITEMS,
  TRANSACTION_STATUS_LABEL,
  PRODUCT_TYPE_ITEMS,
  PRODUCT_TYPE_LABEL,
  PAYMENT_METHOD_LABEL,
  PROVIDER_LABEL
} from '@/constants/transaction'
import { SCHOLARSHIP_TYPES } from '@/utils/ryls'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Transactions',
  middleware: 'admin'
})

const { api } = useApi()

// ── Filters ───────────────────────────────────────────────────────────────────

const searchInput = ref('')
const search = refDebounced(searchInput, 300)
const statusFilter = ref('all')
const typeFilter = ref('all')
const page = ref(1)

const statusOptions = [{ label: 'All Status', value: 'all' }, ...TRANSACTION_STATUS_ITEMS]
const typeOptions = [{ label: 'All Types', value: 'all' }, ...PRODUCT_TYPE_ITEMS]

// ── Data Fetching ─────────────────────────────────────────────────────────────

const limit = ref(10)

const queryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  ...(search.value && { search: search.value }),
  ...(statusFilter.value !== 'all' && { status: statusFilter.value }),
  ...(typeFilter.value !== 'all' && { product_type: typeFilter.value })
}))

const { data: txData } = await useAsyncData(
  'admin-transactions',
  () =>
    api<PaginatedResponse<AdminTransaction>>('/admin/transactions', { query: queryParams.value }),
  { watch: [queryParams] }
)

const transactions = computed(() => txData.value?.data ?? [])
const meta = computed(() => txData.value?.meta)

function resetFilters() {
  searchInput.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
  page.value = 1
}

// ── Table ─────────────────────────────────────────────────────────────────────

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
  expired: 'error',
  cancelled: 'neutral',
  refunded: 'info'
}
const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })
const columnPinning = ref({ right: ['actions'] })

const columns: TableColumn<AdminTransaction>[] = [
  {
    accessorKey: 'transaction_code',
    header: 'Transaction Code',
    cell: ({ row }) => h('span', { class: 'font-mono text-sm' }, row.getValue('transaction_code'))
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const tx = row.original
      return h('div', { class: 'text-sm space-y-0.5' }, [
        h('div', tx.customer_name),
        h('div', { class: 'text-muted' }, tx.customer_email),
        tx.customer_phone ? h('div', { class: 'text-muted' }, tx.customer_phone) : null
      ])
    }
  },
  {
    accessorKey: 'product_type',
    header: 'Product Type',
    cell: ({ row }) => {
      const tx = row.original
      const label = PRODUCT_TYPE_LABEL[tx.product_type] ?? tx.product_type
      return h('div', { class: 'text-sm space-y-0.5 max-w-48' }, [
        h('span', { class: 'font-medium block truncate', title: label }, label),
        tx.product_name
          ? h(
              'span',
              { class: 'text-muted text-sm block truncate', title: tx.product_name },
              tx.product_name
            )
          : null
      ])
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatPrice(row.getValue('amount')))
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({ row }) => {
      const provider = row.getValue('provider') as string | null
      return h(
        'span',
        { class: 'text-sm' },
        provider ? (PROVIDER_LABEL[provider] ?? provider) : '—'
      )
    }
  },
  {
    accessorKey: 'payment_method',
    header: 'Method',
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as string | null
      const label = method ? (PAYMENT_METHOD_LABEL[method] ?? method) : '—'
      return h('span', { class: 'text-sm' }, label)
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const label = status.charAt(0).toUpperCase() + status.slice(1)
      return h(UBadge, { variant: 'subtle', color: STATUS_COLOR[status] ?? 'neutral' }, () => label)
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatDatetime(row.getValue('created_at')))
  },
  {
    id: 'actions',
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) =>
      h(UButton, {
        label: 'Detail',
        color: 'primary',
        variant: 'outline',
        size: 'sm',
        leadingIcon: 'i-ph-magnifying-glass-bold',
        onClick: () => openDetail(row.original.id)
      })
  }
]

// ── Slideover ─────────────────────────────────────────────────────────────────

const isSlideoverOpen = ref(false)
const selectedId = ref<number | null>(null)
const isLoadingDetail = ref(false)
const detail = ref<AdminTransactionDetail | null>(null)

async function openDetail(id: number) {
  selectedId.value = id
  isSlideoverOpen.value = true
  isLoadingDetail.value = true
  detail.value = null
  try {
    const res = await api<ApiResponse<AdminTransactionDetail>>(`/admin/transactions/${id}`)
    detail.value = res.data
  } finally {
    isLoadingDetail.value = false
  }
}

function getScholarshipLabel(type: string) {
  return SCHOLARSHIP_TYPES.find((s) => s.value === type)?.label ?? type
}

function formatDateTime(dt: string | null) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
    { label: 'Created At', value: formatDateTime(d.created_at) },
    { label: 'Paid At', value: formatDateTime(d.paid_at) },
    { label: 'Expired At', value: formatDateTime(d.expired_at) }
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

const itemsTotal = computed(
  () => detail.value?.product_details.items.reduce((sum, i) => sum + i.total_price, 0) ?? 0
)
</script>

<template>
  <AdminTableCard>
    <template #toolbar>
      <div class="flex flex-wrap items-center gap-2">
        <UInput
          v-model="searchInput"
          icon="i-ph-magnifying-glass-bold"
          placeholder="Search code, name, or email"
          class="w-full sm:w-72"
        />
        <USelect v-model="statusFilter" :items="statusOptions" class="w-full sm:w-40" />
        <USelect v-model="typeFilter" :items="typeOptions" class="w-full sm:w-56" />
        <UButton
          v-if="searchInput || statusFilter || typeFilter"
          label="Reset"
          color="neutral"
          variant="ghost"
          icon="i-ph-x-bold"
          @click="resetFilters"
        />
      </div>
    </template>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:column-pinning="columnPinning"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      :data="transactions"
      :columns="columns"
      :ui="{ td: 'align-top' }"
      class="px-4 sm:px-6"
    />

    <template #footer>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-sm text-muted shrink-0">
          Showing {{ (page - 1) * limit + 1 }} to {{ Math.min(page * limit, meta?.total ?? 0) }} of
          {{ meta?.total ?? 0 }} entries
        </p>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <USelect
              :model-value="limit"
              :items="[10, 25, 50, 100]"
              size="sm"
              class="w-20"
              @update:model-value="
                (val: number) => {
                  limit = Number(val)
                  page = 1
                }
              "
            />
          </div>
          <UPagination
            v-model:page="page"
            :total="meta?.total ?? 0"
            :items-per-page="limit"
            variant="ghost"
            size="sm"
          />
        </div>
      </div>
    </template>
  </AdminTableCard>

  <!-- Detail Slideover -->
  <USlideover
    v-model:open="isSlideoverOpen"
    title="Transaction Detail"
    side="right"
    :ui="{ content: 'max-w-xl', body: 'p-0!' }"
  >
    <template #body>
      <div v-if="isLoadingDetail" class="flex items-center justify-center py-16">
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
            <!-- User link row -->
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
            <!-- Other customer rows -->
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
            <!-- User link row -->
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
