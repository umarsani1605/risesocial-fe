<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminTransaction } from '@/types'
import {
  TRANSACTION_STATUS_ITEMS,
  TRANSACTION_STATUS_COLOR,
  PRODUCT_TYPE_ITEMS,
  PRODUCT_TYPE_LABEL,
  PAYMENT_METHOD_LABEL,
  formatProductName
} from '@/constants/transaction'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Transactions',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Transactions - Rise Social' })

const { api } = useApi()
const toast = useToast()

// ── Filters ───────────────────────────────────────────────────────────────────

const searchInput = ref('')
const search = refDebounced(searchInput, 200)
const statusFilter = ref('all')
const typeFilter = ref('all')

const statusOptions = [{ label: 'All Status', value: 'all' }, ...TRANSACTION_STATUS_ITEMS]
const typeOptions = [{ label: 'All Types', value: 'all' }, ...PRODUCT_TYPE_ITEMS]

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
}

// ── Table ─────────────────────────────────────────────────────────────────────

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

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
      return h(
        UBadge,
        { variant: 'subtle', color: TRANSACTION_STATUS_COLOR[status] ?? 'neutral' },
        () => label
      )
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
            placeholder="Search code, name, or email"
            class="w-full sm:w-72"
          />
          <USelect v-model="statusFilter" :items="statusOptions" class="w-full sm:w-40" />
          <USelect v-model="typeFilter" :items="typeOptions" class="w-full sm:w-56" />
          <UButton
            v-if="searchInput || statusFilter !== 'all' || typeFilter !== 'all'"
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
