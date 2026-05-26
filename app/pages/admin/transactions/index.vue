<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminTransaction } from '@/types'
import {
  TRANSACTION_STATUS_ITEMS,
  TRANSACTION_STATUS_COLOR,
  PRODUCT_TYPE_ITEMS,
  PRODUCT_TYPE_LABEL,
  PAYMENT_METHOD_LABEL,
  PROVIDER_ITEMS,
  PROVIDER_LABEL,
  formatProductName,
  isPaypalProvider
} from '@/constants/transaction'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

function getFileUrl(filePath?: string | null): string {
  if (!filePath) return ''
  const rel = filePath.includes('/uploads/')
    ? filePath.slice(filePath.indexOf('/uploads/') + '/uploads/'.length)
    : filePath.replace(/^\/+/, '')
  const encoded = rel.split('/').map(encodeURIComponent).join('/')
  return `${apiBaseUrl}/uploads/${encoded}`
}

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Transactions',
  middleware: ['auth', 'admin', 'admin-permission'],
  requiredPermission: 'admin.transactions'
})

useSeoMeta({ title: 'Transactions - Rise Social' })

const { api } = useApi()
const toast = useToast()

// ── Filters ───────────────────────────────────────────────────────────────────

const searchInput = ref('')
const search = refDebounced(searchInput, 200)
const statusFilter = ref('all')
const typeFilter = ref('all')
const providerFilter = ref('all')

const statusOptions = [{ label: 'All Status', value: 'all' }, ...TRANSACTION_STATUS_ITEMS]
const typeOptions = [{ label: 'All Types', value: 'all' }, ...PRODUCT_TYPE_ITEMS]
const providerOptions = [{ label: 'All Payments', value: 'all' }, ...PROVIDER_ITEMS]

// ── Data Fetching (client-side filter + pagination) ───────────────────────────

const { data: txData, status: txStatus } = useLazyAsyncData(
  'admin-transactions',
  () => api<ApiResponse<AdminTransaction[]>>('/admin/transactions'),
  {
    server: false,
    default: (): ApiResponse<AdminTransaction[]> => ({ success: true, data: [] })
  }
)

const transactions = computed(() => txData.value?.data ?? [])
const isTransactionsLoading = computed(() => txStatus.value === 'idle' || txStatus.value === 'pending')

const filteredTransactions = computed(() => {
  const q = search.value.trim().toLowerCase()
  return transactions.value.filter((tx) => {
    if (statusFilter.value !== 'all' && tx.status !== statusFilter.value) return false
    if (typeFilter.value !== 'all' && tx.product_type !== typeFilter.value) return false
    if (providerFilter.value !== 'all') {
      if (providerFilter.value === 'paypal') {
        if (!isPaypalProvider(tx.provider)) return false
      } else if (tx.provider !== providerFilter.value) {
        return false
      }
    }
    if (q) {
      const haystack = [
        tx.transaction_code,
        tx.customer_name,
        tx.customer_email,
        tx.customer_phone
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
})

function resetFilters() {
  searchInput.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
  providerFilter.value = 'all'
}

// ── Table ─────────────────────────────────────────────────────────────────────

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const PROVIDER_LOGO: Record<string, { src: string; class: string }> = {
  midtrans: { src: '/images/payment-logo/midtrans.png', class: 'h-3.5 object-contain' },
  paypal: { src: '/images/payment-logo/paypal.png', class: 'h-4 object-contain' },
  paypal_manual: { src: '/images/payment-logo/paypal.png', class: 'h-4 object-contain' }
}

const columns: TableColumn<AdminTransaction>[] = [
  {
    id: 'no',
    header: '#',
    cell: ({ row }) => h('span', { class: 'text-muted text-sm' }, row.index + 1)
  },
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
      const productName = formatProductName(tx.product_type, tx.product_name)
      return h('div', { class: 'text-sm space-y-0.5 max-w-48' }, [
        h('span', { class: 'font-medium block truncate', title: label }, label),
        productName
          ? h(
              'span',
              { class: 'text-muted text-sm block truncate', title: productName },
              productName
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
    accessorKey: 'payment_method',
    header: 'Method',
    cell: ({ row }) => {
      const tx = row.original
      const providerLabel = PROVIDER_LABEL[tx.provider] ?? tx.provider
      const providerLogo = PROVIDER_LOGO[tx.provider]
      const methodLabel = tx.payment_method
        ? (PAYMENT_METHOD_LABEL[tx.payment_method] ?? tx.payment_method)
        : ''
      return h('div', { class: 'text-sm space-y-2' }, [
        providerLogo
          ? h('img', {
              src: providerLogo.src,
              alt: providerLabel,
              title: providerLabel,
              class: providerLogo.class
            })
          : h('div', { class: 'font-medium' }, providerLabel),
        h('div', { class: 'text-muted' }, methodLabel)
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const label = status.charAt(0).toUpperCase() + status.slice(1)
      return h(
        UBadge,
        { variant: 'subtle', color: TRANSACTION_STATUS_COLOR[status] ?? 'neutral' },
        () => label
      )
    }
  },
  {
    id: 'proof',
    header: 'Proof / Order ID',
    cell: ({ row }) => {
      const tx = row.original
      const linkClass =
        'inline-flex items-center gap-1 text-primary text-sm hover:underline max-w-48 truncate'

      if (isPaypalProvider(tx.provider) && tx.payment_proof_path) {
        const href = getFileUrl(tx.payment_proof_path)
        if (href) {
          return h('a', { href, target: '_blank', rel: 'noopener', class: linkClass }, [
            h(UIcon, { name: 'i-ph-arrow-square-out-bold', class: 'size-3.5 shrink-0' }),
            h('span', { class: 'truncate' }, 'Payment Proof')
          ])
        }
      }

      if (tx.provider === 'midtrans') {
        const orderId = tx.midtrans_order_id ?? tx.transaction_code
        if (orderId) {
          const href = `https://dashboard.midtrans.com/beta/transactions?type=order_id&query=${orderId}`
          return h('a', { href, target: '_blank', rel: 'noopener', class: linkClass }, [
            h(UIcon, { name: 'i-ph-arrow-square-out-bold', class: 'size-3.5 shrink-0' }),
            h('span', { class: 'truncate', title: orderId }, orderId)
          ])
        }
      }

      return h('span', { class: 'text-muted text-sm' }, '—')
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatDatetime(row.getValue('created_at')))
  },
  {
    id: 'actions',
    header: 'Actions',
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) =>
      h(UButton, {
        label: 'Detail',
        color: 'primary',
        variant: 'light',
        size: 'sm',
        leadingIcon: 'i-ph-magnifying-glass-bold',
        onClick: () => openDetail(row.original.id)
      })
  }
]

// ── Export ────────────────────────────────────────────────────────────────────

const isExporting = ref(false)

async function exportExcel() {
  isExporting.value = true
  try {
    const blob = (await api('/admin/transactions/export-excel', { responseType: 'blob' })) as Blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isExporting.value = false
  }
}

// ── Slideover ─────────────────────────────────────────────────────────────────

const isSlideoverOpen = ref(false)
const selectedId = ref<number | null>(null)

function openDetail(id: number) {
  selectedId.value = id
  isSlideoverOpen.value = true
}
</script>

<template>
  <AdminDataTable
    :data="filteredTransactions"
    :columns="columns"
    :table-ui="{ td: 'align-top' }"
    table-class="px-4 sm:px-6"
    :column-pinning="{}"
    :loading="isTransactionsLoading"
  >
    <template #toolbar>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <UInput
            v-model="searchInput"
            icon="i-ph-magnifying-glass-bold"
            placeholder="Search by code, name, or email..."
            class="w-full sm:w-72"
          />
          <USelect v-model="statusFilter" :items="statusOptions" class="w-full sm:w-44" />
          <USelect v-model="typeFilter" :items="typeOptions" class="w-full sm:w-44" />
          <USelect v-model="providerFilter" :items="providerOptions" class="w-full sm:w-44" />
          <UButton
            v-if="searchInput || statusFilter !== 'all' || typeFilter !== 'all' || providerFilter !== 'all'"
            label="Reset"
            color="neutral"
            variant="ghost"
            icon="i-ph-x-bold"
            @click="resetFilters"
          />
        </div>
        <UButton
          label="Export Excel"
          leading-icon="i-ph-download-simple-bold"
          color="primary"
          :loading="isExporting"
          :disabled="isExporting"
          @click="exportExcel"
        />
      </div>
    </template>
  </AdminDataTable>

  <AdminTransactionDetailSlideover v-model:open="isSlideoverOpen" :transaction-id="selectedId" />
</template>
