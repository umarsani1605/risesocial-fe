<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/table-core'
import type { TableColumn } from '@nuxt/ui'
import type { RylsRegistration } from '~/composables/useMockAdminData'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Rise Young Leaders',
  navbarIcon: 'i-lucide-medal',
  middleware: 'admin'
})

useSeoMeta({ title: 'Rise Young Leaders Scholarship - Rise Social' })

const { api } = useApi()
const { data: rawRegistrations } = await useAsyncData('admin:ryls', () =>
  api<PaginatedResponse<RylsRegistration>>('/admin/ryls/registrations')
)

const rylsNationalityOptions = computed(() => {
  const nats = [...new Set((rawRegistrations.value?.data ?? []).map(r => r.nationality))]
  return [
    { label: 'All Nationalities', value: 'all' },
    ...nats.map(n => ({ label: n, value: n }))
  ]
})

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const table = useTemplateRef('table')
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const search = ref('')
const scholarshipFilter = ref('all')
const genderFilter = ref('all')
const nationalityFilter = ref('all')
const paymentTypeFilter = ref('all')

const selectedRegistration = ref<RylsRegistration | null>(null)
const isDetailOpen = ref(false)

const scholarshipOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Fully Funded', value: 'FULLY_FUNDED' },
  { label: 'Self Funded', value: 'SELF_FUNDED' }
]

const genderOptions = [
  { label: 'All Genders', value: 'all' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Male', value: 'MALE' }
]

const paymentTypeOptions = [
  { label: 'All Payments', value: 'all' },
  { label: 'PayPal', value: 'PAYPAL' },
  { label: 'Midtrans', value: 'MIDTRANS' },
  { label: 'Bank Transfer', value: 'BANK_TRANSFER' }
]

const filteredData = computed(() => {
  let result = rawRegistrations.value?.data ?? []
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(r =>
      r.full_name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      r.whatsapp?.includes(s) ||
      r.institution?.toLowerCase().includes(s)
    )
  }
  if (scholarshipFilter.value !== 'all') {
    result = result.filter(r => r.scholarship_type === scholarshipFilter.value)
  }
  if (genderFilter.value !== 'all') {
    result = result.filter(r => r.gender === genderFilter.value)
  }
  if (nationalityFilter.value !== 'all') {
    result = result.filter(r => r.nationality.toLowerCase() === nationalityFilter.value.toLowerCase())
  }
  if (paymentTypeFilter.value !== 'all') {
    result = result.filter(r => r.payments.some((p: { type: string }) => p.type === paymentTypeFilter.value))
  }
  return result
})

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatRegistrationDate(dateStr: string) {
  if (!dateStr) return '–'
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function formatScholarshipType(type: string) {
  return type === 'FULLY_FUNDED' ? 'Fully Funded' : 'Self Funded'
}

function formatDiscoverSource(source: string) {
  const map: Record<string, string> = {
    FRIENDS: 'Friends/Colleagues',
    SOCIAL_MEDIA: 'Social Media',
    OTHER_INSTAGRAM: 'Instagram',
    WEBSITE: 'Website',
    LINKEDIN: 'LinkedIn'
  }
  return map[source] ?? source
}

function formatPaymentType(type: string) {
  const map: Record<string, string> = {
    PAYPAL: 'PayPal',
    BANK_TRANSFER: 'Bank Transfer',
    MIDTRANS: 'Midtrans'
  }
  return map[type] ?? type
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function openDetail(reg: RylsRegistration) {
  selectedRegistration.value = reg
  isDetailOpen.value = true
}

// ── Table columns ─────────────────────────────────────────────────
const columns: TableColumn<RylsRegistration>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) =>
      h('span', { class: 'text-muted' }, row.index + 1 + pagination.value.pageIndex * pagination.value.pageSize)
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('full_name'))
  },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'whatsapp', header: 'Whatsapp' },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => h('span', {}, row.getValue('gender') === 'FEMALE' ? 'Female' : 'Male')
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }) => h('span', { class: 'whitespace-nowrap' }, formatDate(row.getValue('date_of_birth')))
  },
  {
    accessorKey: 'residence',
    header: 'Residence',
    cell: ({ row }) => h('span', { class: row.getValue('residence') ? '' : 'text-muted' }, row.getValue('residence') ?? '–')
  },
  { accessorKey: 'nationality', header: 'Nationality' },
  {
    accessorKey: 'second_nationality',
    header: 'Second Nationality',
    cell: ({ row }) =>
      h('span', { class: row.getValue('second_nationality') ? '' : 'text-muted' }, row.getValue('second_nationality') ?? '–')
  },
  {
    accessorKey: 'institution',
    header: 'Institution',
    cell: ({ row }) =>
      h('span', { class: 'line-clamp-2 max-w-[10rem]', title: row.getValue('institution') }, row.getValue('institution'))
  },
  {
    id: 'discover_source',
    header: 'Discover Source',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatDiscoverSource(row.original.discover_source))
  },
  {
    id: 'scholarship_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.scholarship_type
      return h(UBadge, {
        variant: type === 'FULLY_FUNDED' ? 'solid' : 'outline',
        color: 'primary',
        class: 'whitespace-nowrap'
      }, () => formatScholarshipType(type))
    }
  },
  {
    id: 'payment_type',
    header: 'Payment',
    cell: ({ row }) => {
      const payment = row.original.payments?.[0]
      if (!payment) return h('span', { class: 'text-muted' }, '–')
      return h('span', { class: 'text-sm whitespace-nowrap' }, formatPaymentType(payment.type))
    }
  },
  {
    id: 'proof',
    header: 'Proof / Order ID',
    cell: ({ row }) => {
      const payment = row.original.payments?.[0]
      if (!payment) return h('span', { class: 'text-muted' }, '–')
      if (payment.type === 'PAYPAL' && payment.payment_proof) {
        return h('a', {
          href: '#',
          class: 'flex items-center gap-1 text-primary text-sm hover:underline'
        }, [
          h('span', { class: 'i-lucide-square-arrow-out-up-right size-3' }),
          h('span', {}, 'Payment Proof')
        ])
      }
      if (payment.type === 'BANK_TRANSFER' && payment.payment_proof) {
        return h('a', {
          href: '#',
          class: 'flex items-center gap-1 text-primary text-sm hover:underline'
        }, [
          h('span', { class: 'i-lucide-square-arrow-out-up-right size-3' }),
          h('span', {}, 'Bank Proof')
        ])
      }
      return h('span', { class: 'text-muted text-sm' }, '–')
    }
  },
  {
    id: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const payment = row.original.payments?.[0]
      if (!payment) return h('span', { class: 'text-muted' }, '–')
      return h('span', { class: 'text-sm whitespace-nowrap' }, formatAmount(payment.amount))
    }
  },
  {
    id: 'registered_at',
    header: 'Registration Date',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatRegistrationDate(row.original.created_at))
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h(UButton, {
        label: 'View',
        size: 'xs',
        color: 'primary',
        variant: 'outline',
        onClick: () => openDetail(row.original)
      })
  }
]
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-default">
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Search name or email..." class="w-full sm:w-52" />
        <div class="flex flex-wrap w-full sm:w-auto gap-2">
          <USelect v-model="scholarshipFilter" :items="scholarshipOptions" class="flex-1 sm:flex-none sm:w-36" />
          <USelect v-model="genderFilter" :items="genderOptions" class="flex-1 sm:flex-none sm:w-32" />
          <USelect v-model="nationalityFilter" :items="rylsNationalityOptions" class="flex-1 sm:flex-none sm:w-36" />
          <USelect v-model="paymentTypeFilter" :items="paymentTypeOptions" class="flex-1 sm:flex-none sm:w-36" />
        </div>
      </div>

      <UButton
        label="Export Excel"
        leading-icon="i-lucide-download"
        color="primary"
        variant="outline"
      />
    </div>

    <!-- Table with horizontal scroll -->
    <div class="overflow-x-auto">
      <UTable
        ref="table"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        :data="filteredData"
        :columns="columns"
        :ui="{
          base: 'border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r whitespace-nowrap',
          td: 'border-b border-default'
        }"
      />
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 border-t border-default">
      <p class="text-sm text-muted">
        Showing {{ (pagination.pageIndex * pagination.pageSize) + 1 }} to
        {{ Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length) }} of
        {{ filteredData.length }} entries
      </p>
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </UCard>

  <!-- Registration Detail Modal -->
  <UModal
    v-model:open="isDetailOpen"
    title="Registration Details"
    :ui="{ content: 'max-w-2xl' }"
    scrollable
  >
    <template v-if="selectedRegistration" #body>
      <div class="space-y-6">
        <!-- Personal Information -->
        <div>
          <h3 class="font-semibold mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-xs text-muted mb-0.5">Full Name</p>
              <p class="text-sm font-medium">{{ selectedRegistration.full_name }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Email</p>
              <p class="text-sm">{{ selectedRegistration.email }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">WhatsApp</p>
              <p class="text-sm">{{ selectedRegistration.whatsapp }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Gender</p>
              <p class="text-sm">{{ selectedRegistration.gender === 'FEMALE' ? 'Female' : 'Male' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Date of Birth</p>
              <p class="text-sm">{{ formatDate(selectedRegistration.date_of_birth) }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Residence</p>
              <p class="text-sm">{{ selectedRegistration.residence }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Nationality</p>
              <p class="text-sm capitalize">{{ selectedRegistration.nationality }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Second Nationality</p>
              <p class="text-sm" :class="selectedRegistration.second_nationality ? '' : 'text-muted'">
                {{ selectedRegistration.second_nationality ?? '–' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Institution</p>
              <p class="text-sm">{{ selectedRegistration.institution }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Discover Source</p>
              <p class="text-sm">{{ formatDiscoverSource(selectedRegistration.discover_source) }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Scholarship Type</p>
              <p class="text-sm">{{ formatScholarshipType(selectedRegistration.scholarship_type) }}</p>
            </div>
            <div>
              <p class="text-xs text-muted mb-0.5">Registration Date</p>
              <p class="text-sm">{{ formatRegistrationDate(selectedRegistration.created_at) }}</p>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Fully Funded Section -->
        <div v-if="selectedRegistration.scholarship_type === 'FULLY_FUNDED'">
          <h3 class="font-semibold mb-4">Fully Funded</h3>
          <div>
            <p class="text-xs text-muted mb-1">Essay Topic</p>
            <p class="text-sm" :class="selectedRegistration.fully_funded_submission?.essay_topic ? '' : 'text-muted'">
              {{ selectedRegistration.fully_funded_submission?.essay_topic ?? 'Not provided' }}
            </p>
          </div>
        </div>

        <USeparator />

        <!-- Payment Information -->
        <template v-for="payment in selectedRegistration.payments.slice(0, 1)" :key="payment.id">
          <div>
            <h3 class="font-semibold mb-4">Payment Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p class="text-xs text-muted mb-0.5">Payment Type</p>
                <p class="text-sm font-medium">{{ formatPaymentType(payment.type) }}</p>
              </div>
              <div>
                <p class="text-xs text-muted mb-0.5">Payment Status</p>
                <p class="text-sm font-medium capitalize">{{ payment.status?.toLowerCase() ?? '–' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted mb-0.5">Amount</p>
                <p class="text-sm font-medium">{{ formatAmount(payment.amount) }}</p>
              </div>
              <div>
                <p class="text-xs text-muted mb-0.5">Payment Date</p>
                <p class="text-sm">
                  {{ payment.paid_at
                    ? new Date(payment.paid_at).toLocaleString('en-US')
                    : '–' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted mb-0.5">Payment Proof</p>
                <template v-if="payment.payment_proof">
                  <UButton
                    icon="i-lucide-download"
                    label="Download"
                    size="xs"
                    color="neutral"
                    variant="outline"
                  />
                </template>
                <p v-else class="text-sm text-muted">–</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </UModal>
</template>
