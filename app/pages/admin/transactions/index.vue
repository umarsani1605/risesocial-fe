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
  PROVIDER_LABEL,
} from '@/constants/transaction'
import { SCHOLARSHIP_TYPES } from '@/utils/ryls'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Transactions',
  navbarIcon: 'i-lucide-receipt',
  middleware: 'admin',
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

const queryParams = computed(() => ({
  page: page.value,
  limit: 10,
  ...(search.value && { search: search.value }),
  ...(statusFilter.value !== 'all' && { status: statusFilter.value }),
  ...(typeFilter.value !== 'all' && { product_type: typeFilter.value }),
}))

const { data: txData, refresh } = await useAsyncData(
  'admin-transactions',
  () => api<PaginatedResponse<AdminTransaction>>('/admin/transactions', { query: queryParams.value }),
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
const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const columns: TableColumn<AdminTransaction>[] = [
  {
    accessorKey: 'transaction_code',
    header: 'Transaction Code',
    cell: ({ row }) =>
      h('span', { class: 'font-mono text-sm' }, row.getValue('transaction_code')),
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const tx = row.original
      return h('div', { class: 'text-sm space-y-0.5' }, [
        h('div', tx.customer_name),
        h('div', { class: 'text-muted' }, tx.customer_email),
        tx.customer_phone ? h('div', { class: 'text-muted' }, tx.customer_phone) : null,
      ])
    },
  },
  {
    accessorKey: 'product_type',
    header: 'Product Type',
    cell: ({ row }) => {
      const label = PRODUCT_TYPE_LABEL[row.getValue('product_type') as string] ?? row.getValue('product_type')
      return h('span', { class: 'text-sm truncate max-w-40 block', title: label as string }, label)
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) =>
      h('span', { class: 'text-sm' }, formatPrice(row.getValue('amount'))),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h('span', { class: 'text-sm' }, TRANSACTION_STATUS_LABEL[row.getValue('status') as string] ?? row.getValue('status')),
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({ row }) => {
      const provider = row.getValue('provider') as string | null
      return h('span', { class: 'text-sm' }, provider ? (PROVIDER_LABEL[provider] ?? provider) : '—')
    },
  },
  {
    accessorKey: 'payment_method',
    header: 'Method',
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as string | null
      const label = method ? (PAYMENT_METHOD_LABEL[method] ?? method) : '—'
      return h('span', { class: 'text-sm' }, label)
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) =>
      h('span', { class: 'text-sm' }, formatDate(row.getValue('created_at'))),
  },
  {
    id: 'actions',
    size: 80,
    cell: ({ row }) =>
      h(UButton, {
        label: 'Detail',
        color: 'primary',
        variant: 'outline',
        size: 'sm',
        onClick: () => openDetail(row.original.id),
      }),
  },
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
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
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
    { label: 'Payment Method', value: d.payment_method ? (PAYMENT_METHOD_LABEL[d.payment_method] ?? d.payment_method) : '—' },
    { label: 'Created At', value: formatDateTime(d.created_at) },
    { label: 'Paid At', value: formatDateTime(d.paid_at) },
    { label: 'Expired At', value: formatDateTime(d.expired_at) },
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
    { label: 'Country Code', value: c.country_code ?? '—' },
  ]
})

const itemsTotal = computed(() =>
  detail.value?.product_details.items.reduce((sum, i) => sum + i.total_price, 0) ?? 0
)
</script>

<template>
  <UCard :ui="{ root: 'overflow-scroll', body: 'p-0! border-none' }">
    <template #header>
      <div class="flex flex-wrap items-center gap-2">
        <UInput
          v-model="searchInput"
          icon="i-lucide-search"
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
          icon="i-lucide-x"
          @click="resetFilters"
        />
      </div>
    </template>

    <div class="overflow-x-auto">
      <UTable
        ref="table"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="transactions"
        :columns="columns"
        :ui="{ td: 'align-top' }"
        class="px-4 sm:px-6"
      />
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p class="text-sm text-muted">
          {{ table?.tableApi?.getPaginationRowModel().rows.length ?? 0 }} of
          {{ meta?.total ?? 0 }} transactions
        </p>
        <UPagination
          v-if="meta && meta.totalPages > 1"
          v-model:page="page"
          :total="meta.total"
          :items-per-page="meta.limit"
          variant="ghost"
        />
      </div>
    </template>
  </UCard>

  <!-- Detail Slideover -->
  <USlideover v-model:open="isSlideoverOpen" title="Transaction Detail" side="right" :ui="{ content: 'max-w-xl' }">
    <template #body>
      <div v-if="isLoadingDetail" class="flex items-center justify-center py-16">
        <UIcon name="i-lucide-loader" class="size-6 animate-spin text-muted" />
      </div>

      <div v-else-if="detail" class="space-y-6">
        <!-- Section 1: Transaction Details -->
        <div>
          <p class="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Transaction Details</p>
          <div class="space-y-2">
            <div
              v-for="row in detailRows"
              :key="row.label"
              class="grid grid-cols-2 gap-2 text-sm"
            >
              <span class="text-muted">{{ row.label }}</span>
              <span>{{ row.value }}</span>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Section 2: Customer Details -->
        <div>
          <p class="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Customer Details</p>
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
                <UIcon name="i-lucide-external-link" class="size-3" />
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
        <div>
          <p class="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Product Details</p>

          <!-- Invoice table -->
          <table class="w-full text-sm mb-4">
            <thead>
              <tr class="border-b border-default">
                <th class="text-left py-2 font-medium text-muted">Product</th>
                <th class="text-center py-2 font-medium text-muted w-12">Qty</th>
                <th class="text-right py-2 font-medium text-muted">Unit Price</th>
                <th class="text-right py-2 font-medium text-muted">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in detail.product_details.items"
                :key="item.id"
                class="border-b border-default"
              >
                <td class="py-2">{{ item.product_name }}</td>
                <td class="py-2 text-center">{{ item.quantity }}</td>
                <td class="py-2 text-right">{{ formatPrice(item.unit_price) }}</td>
                <td class="py-2 text-right">{{ formatPrice(item.total_price) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="pt-3 text-right font-medium text-muted">Total</td>
                <td class="pt-3 text-right font-medium">{{ formatPrice(itemsTotal) }}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Academy Enrollment sub-section -->
          <div v-if="detail.product_details.enrollment" class="space-y-2">
            <p class="text-xs font-semibold text-muted uppercase tracking-wide">Academy Enrollment</p>
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
                <UIcon name="i-lucide-external-link" class="size-3" />
              </NuxtLink>
            </div>
          </div>

          <!-- RYLS Registration sub-section -->
          <div v-if="detail.product_details.ryls_registration" class="space-y-2">
            <p class="text-xs font-semibold text-muted uppercase tracking-wide">RYLS Registration</p>
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
                <UIcon name="i-lucide-external-link" class="size-3" />
              </NuxtLink>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-muted">Scholarship Type</span>
              <span>{{ getScholarshipLabel(detail.product_details.ryls_registration.scholarship_type) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
