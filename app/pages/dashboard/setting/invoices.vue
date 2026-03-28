<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { UserTransaction, UserTransactionDetail } from '@/types'

definePageMeta({ layout: 'dashboard-user', middleware: 'auth' })

useSeoMeta({ title: 'Transactions - Rise Social' })

const toast = useToast()
const { fetchTransactions, fetchTransactionDetail, isLoading } = useTransactionHistory()

const page = ref(1)
const limit = 10
const statusFilter = ref<string | undefined>(undefined)
const transactions = ref<UserTransaction[]>([])
const totalPages = ref(0)
const total = ref(0)
const hasFetched = ref(false)

const statusOptions = [
  { label: 'All', value: undefined },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Expired', value: 'expired' }
]

const columns: TableColumn<UserTransaction>[] = [
  { accessorKey: 'created_at', header: 'Date' },
  { accessorKey: 'items', header: 'Product' },
  { accessorKey: 'amount', header: 'Amount' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'payment_method', header: 'Method' }
]

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
  expired: 'neutral'
}

const loadTransactions = async () => {
  try {
    const res = await fetchTransactions({ page: page.value, limit, status: statusFilter.value })
    transactions.value = res.data
    totalPages.value = res.meta?.totalPages ?? 0
    total.value = res.meta?.total ?? 0
  } catch {
    toast.add({ title: 'Failed to load transactions', color: 'error' })
  } finally {
    hasFetched.value = true
  }
}

watch([page, statusFilter], () => {
  if (statusFilter.value !== undefined) page.value = 1
  loadTransactions()
})

onMounted(() => loadTransactions())

// Detail modal
const detailOpen = ref(false)
const detailLoading = ref(false)
const selectedTransaction = ref<UserTransactionDetail | null>(null)

const onRowClick = async (_e: Event, row: { original: UserTransaction }) => {
  detailOpen.value = true
  detailLoading.value = true
  try {
    selectedTransaction.value = await fetchTransactionDetail(row.original.transaction_code)
  } catch {
    toast.add({ title: 'Failed to load transaction detail', color: 'error' })
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}

const formatPaymentMethod = (method: string | null) => {
  if (!method) return '-'
  return method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
</script>

<template>
  <DashboardSettingSidebar>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-xl font-bold">Invoices</h1>
        <USelect
          v-model="statusFilter"
          :items="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Filter by status"
          class="w-full sm:w-40"
        />
      </div>

      <UTable
        v-if="isLoading || transactions.length > 0"
        :data="transactions"
        :columns="columns"
        :loading="isLoading"
        class="w-full p-0! overflow-visible"
        @select="onRowClick"
      >
        <template #created_at-cell="{ row }">
          <span class="text-sm">{{ formatDatetime(row.original.created_at) }}</span>
        </template>
        <template #items-cell="{ row }">
          <span class="text-sm font-medium">
            {{ row.original.items?.[0]?.product_name ?? row.original.product_type }}
          </span>
        </template>
        <template #amount-cell="{ row }">
          <span class="text-sm font-semibold">{{ formatPrice(row.original.amount) }}</span>
        </template>
        <template #status-cell="{ row }">
          <UBadge
            :label="row.original.status"
            :color="statusColor[row.original.status] ?? 'neutral'"
            variant="subtle"
            class="capitalize"
          />
        </template>
        <template #payment_method-cell="{ row }">
          <span class="text-sm text-muted">{{
            formatPaymentMethod(row.original.payment_method)
          }}</span>
        </template>
      </UTable>

      <div v-if="totalPages > 1" class="flex justify-center">
        <UPagination v-model="page" :total="total" :items-per-page="limit" />
      </div>

      <div
        v-if="hasFetched && !isLoading && transactions.length === 0"
        class="text-center py-12 text-muted"
      >
        <UIcon name="i-ph-receipt-bold" class="size-12 mb-4 mx-auto" />
        <p>No transactions found</p>
      </div>
    </div>

    <!-- Detail Modal -->
    <UModal v-model:open="detailOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div v-if="detailLoading" class="flex justify-center py-8">
            <UIcon name="i-ph-spinner-bold" class="size-8 animate-spin text-primary" />
          </div>
          <template v-else-if="selectedTransaction">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold">Invoice Details</h2>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Items</h3>
              <div
                v-for="(item, i) in selectedTransaction.items"
                :key="i"
                class="flex justify-between text-sm py-1"
              >
                <span class="text-muted">{{ item.product_name }}</span>
                <span>{{ formatPrice(item.total_price) }}</span>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <h3 class="font-semibold mb-3">Payment</h3>
              <div class="flex justify-between">
                <span class="text-muted">Transaction Code</span>
                <span>{{ selectedTransaction.transaction_code }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted">Amount</span>
                <span>{{ formatPrice(selectedTransaction.amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted">Status</span>
                <UBadge
                  :label="selectedTransaction.status"
                  :color="statusColor[selectedTransaction.status] ?? 'neutral'"
                  variant="subtle"
                  class="capitalize"
                />
              </div>
              <div class="flex justify-between">
                <span class="text-muted">Provider</span>
                <span class="capitalize">{{ selectedTransaction.provider }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted">Payment Method</span>
                <span>{{ formatPaymentMethod(selectedTransaction.payment_method) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted">Created</span>
                <span>{{ formatDatetime(selectedTransaction.created_at) }}</span>
              </div>
              <div v-if="selectedTransaction.paid_at" class="flex justify-between">
                <span class="text-muted">Paid At</span>
                <span>{{ formatDatetime(selectedTransaction.paid_at) }}</span>
              </div>
              <div v-if="selectedTransaction.expired_at" class="flex justify-between">
                <span class="text-muted">Expired At</span>
                <span>{{ formatDatetime(selectedTransaction.expired_at) }}</span>
              </div>
            </div>
          </template>

          <div class="flex justify-end pt-2">
            <UButton label="Close" variant="outline" @click="detailOpen = false" />
          </div>
        </div>
      </template>
    </UModal>
  </DashboardSettingSidebar>
</template>
