<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { SCHOLARSHIP_TYPE_LABEL, DISCOVER_SOURCE_LABEL, PAYMENT_TYPE_LABEL } from '@/constants/ryls'

definePageMeta({
  layout: 'dashboard-admin',
  navbarTitle: 'Rise Young Leaders',
  middleware: ['auth', 'admin']
})

useSeoMeta({ title: 'Rise Young Leaders Scholarship - Rise Social' })

const { api } = useApi()

interface RylsListResponse {
  registrations: RylsRegistration[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

interface RylsDraft {
  id: number
  email: string
  resume_token: string
  current_step: number
  form_data: { step1?: { fullName?: string; scholarshipType?: string }; [key: string]: unknown }
  scholarship_type: string | null
  expires_at: string
  updated_at: string
}

const [{ data: rawRegistrations }, { data: rawDrafts }] = await Promise.all([
  useAsyncData('admin:ryls', () => api<ApiResponse<RylsListResponse>>('/admin/ryls/registrations')),
  useAsyncData('admin:ryls-drafts', () =>
    api<ApiResponse<{ drafts: RylsDraft[]; pagination: { total: number } }>>('/admin/ryls/registrations/drafts'),
  ),
])

const allRegistrations = computed(() => rawRegistrations.value?.data?.registrations ?? [])
const allDrafts = computed(() => rawDrafts.value?.data?.drafts ?? [])

const rylsNationalityOptions = computed(() => {
  const nats = [...new Set(allRegistrations.value.map((r) => r.nationality))]
  return [
    { label: 'All Nationalities', value: 'all' },
    ...nats.map((n) => ({ label: n, value: n }))
  ]
})

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const route = useRoute()

const search = ref('')
const scholarshipFilter = ref('all')
const genderFilter = ref('all')
const nationalityFilter = ref('all')
const paymentTypeFilter = ref('all')

const dataTableRef = ref()

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

const idFilter = computed(() => (route.query.id ? Number(route.query.id) : null))

const filteredData = computed(() => {
  let result = allRegistrations.value
  if (idFilter.value) {
    return result.filter((r) => r.id === idFilter.value)
  }
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(
      (r) =>
        r.full_name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        r.whatsapp?.includes(s) ||
        r.institution?.toLowerCase().includes(s)
    )
  }
  if (scholarshipFilter.value !== 'all') {
    result = result.filter((r) => r.scholarship_type === scholarshipFilter.value)
  }
  if (genderFilter.value !== 'all') {
    result = result.filter((r) => r.gender === genderFilter.value)
  }
  if (nationalityFilter.value !== 'all') {
    result = result.filter(
      (r) => r.nationality.toLowerCase() === nationalityFilter.value.toLowerCase()
    )
  }
  if (paymentTypeFilter.value !== 'all') {
    result = result.filter((r) =>
      r.payments.some((p: { payment_method: string }) => p.payment_method === paymentTypeFilter.value)
    )
  }
  return result
})

// ── Drafts tab ────────────────────────────────────────────────────
const draftSearch = ref('')
const filteredDrafts = computed(() => {
  let result = allDrafts.value
  if (draftSearch.value) {
    const s = draftSearch.value.toLowerCase()
    result = result.filter(
      d =>
        d.email.toLowerCase().includes(s)
        || (d.form_data?.step1?.fullName ?? '').toLowerCase().includes(s),
    )
  }
  return result
})

const activeTab = ref('submitted')
const tabItems = computed(() => [
  { label: `Submitted (${filteredData.value.length})`, value: 'submitted' },
  { label: `Drafts (${filteredDrafts.value.length})`, value: 'drafts' },
])

const STEP_LABELS: Record<number, string> = { 1: 'Step 1', 2: 'Step 2', 3: 'Step 3' }

const draftColumns: TableColumn<RylsDraft>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.index + 1),
  },
  { accessorKey: 'email', header: 'Email' },
  {
    id: 'full_name',
    header: 'Nama',
    cell: ({ row }) =>
      h('span', { class: 'font-medium' }, row.original.form_data?.step1?.fullName ?? '–'),
  },
  {
    id: 'current_step',
    header: 'Progress',
    cell: ({ row }) =>
      h(UBadge, { variant: 'outline', color: 'primary', class: 'whitespace-nowrap' }, () =>
        STEP_LABELS[row.original.current_step] ?? `Step ${row.original.current_step}`),
  },
  {
    id: 'scholarship_type',
    header: 'Tipe Beasiswa',
    cell: ({ row }) => {
      const type = row.original.scholarship_type
      if (!type) return h('span', { class: 'text-muted' }, '–')
      return h(
        UBadge,
        { variant: type === 'FULLY_FUNDED' ? 'solid' : 'outline', color: 'primary', class: 'whitespace-nowrap' },
        () => SCHOLARSHIP_TYPE_LABEL[type] ?? type,
      )
    },
  },
  {
    id: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatDatetime(row.original.updated_at)),
  },
  {
    id: 'expires_at',
    header: 'Expires',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatDate(row.original.expires_at)),
  },
]

// ── Submitted tab ─────────────────────────────────────────────────
function openDetail(reg: RylsRegistration) {
  selectedRegistration.value = reg
  isDetailOpen.value = true
}

const columns: TableColumn<RylsRegistration>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-muted' },
        row.index +
          1 +
          (dataTableRef.value?.pagination?.pageIndex ?? 0) *
            (dataTableRef.value?.pagination?.pageSize ?? 10)
      )
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
    cell: ({ row }) =>
      h('span', { class: 'whitespace-nowrap' }, formatDate(row.getValue('date_of_birth')))
  },
  {
    accessorKey: 'residence',
    header: 'Residence',
    cell: ({ row }) =>
      h(
        'span',
        { class: row.getValue('residence') ? '' : 'text-muted' },
        row.getValue('residence') ?? '–'
      )
  },
  { accessorKey: 'nationality', header: 'Nationality' },
  {
    accessorKey: 'second_nationality',
    header: 'Second Nationality',
    cell: ({ row }) =>
      h(
        'span',
        { class: row.getValue('second_nationality') ? '' : 'text-muted' },
        row.getValue('second_nationality') ?? '–'
      )
  },
  {
    accessorKey: 'institution',
    header: 'Institution',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'line-clamp-2 max-w-[10rem]', title: row.getValue('institution') },
        row.getValue('institution')
      )
  },
  {
    id: 'discover_source',
    header: 'Discover Source',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-sm' },
        DISCOVER_SOURCE_LABEL[row.original.discover_source] ?? row.original.discover_source
      )
  },
  {
    id: 'scholarship_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.scholarship_type
      return h(
        UBadge,
        {
          variant: type === 'FULLY_FUNDED' ? 'solid' : 'outline',
          color: 'primary',
          class: 'whitespace-nowrap'
        },
        () => SCHOLARSHIP_TYPE_LABEL[type] ?? type
      )
    }
  },
  {
    id: 'payment_type',
    header: 'Payment',
    cell: ({ row }) => {
      const payment = row.original.payments?.[0]
      if (!payment) return h('span', { class: 'text-muted' }, '–')
      const method = payment.payment_method
      const logoMap: Record<string, string> = {
        MIDTRANS: '/images/payment-logo/midtrans.png',
        PAYPAL: '/images/payment-logo/paypal.png',
      }
      const logo = logoMap[method]
      if (logo) {
        return h('img', {
          src: logo,
          alt: PAYMENT_TYPE_LABEL[method] ?? method,
          title: PAYMENT_TYPE_LABEL[method] ?? method,
          class: 'h-5 object-contain'
        })
      }
      return h('span', { class: 'text-sm whitespace-nowrap' }, PAYMENT_TYPE_LABEL[method] ?? method)
    }
  },
  {
    id: 'proof',
    header: 'Proof / Order ID',
    cell: ({ row }) => {
      const payment = row.original.payments?.[0]
      if (!payment) return h('span', { class: 'text-muted' }, '–')
      if ((payment.payment_method === 'PAYPAL' || payment.payment_method === 'BANK_TRANSFER') && payment.payment_proof) {
        return h(
          'a',
          {
            href: '#',
            class: 'flex items-center gap-1 text-primary text-sm hover:underline'
          },
          [
            h('span', { class: 'i-ph-arrow-square-out-bold size-3' }),
            h('span', {}, 'Payment Proof')
          ]
        )
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
      return h('span', { class: 'text-sm whitespace-nowrap' }, formatPrice(payment.transaction?.amount))
    }
  },
  {
    id: 'registered_at',
    header: 'Registration Date',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatDatetime(row.original.created_at))
  },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) =>
      h(UButton, {
        label: 'Detail',
        size: 'sm',
        color: 'primary',
        variant: 'light',
        leadingIcon: 'i-ph-magnifying-glass-bold',
        onClick: () => openDetail(row.original)
      })
  }
]
</script>

<template>
  <UTabs :items="tabItems" v-model="activeTab" class="w-full">
    <template #submitted>
      <AdminDataTable
        ref="dataTableRef"
        v-model:search="search"
        :data="filteredData"
        :columns="columns"
        search-placeholder="Search name or email..."
        search-class="w-full sm:w-52"
        pinned-shadow
      >
        <template #toolbar-left>
          <div class="flex flex-wrap w-full sm:w-auto gap-2">
            <USelect
              v-model="scholarshipFilter"
              :items="scholarshipOptions"
              class="flex-1 sm:flex-none sm:w-36"
            />
            <USelect
              v-model="genderFilter"
              :items="genderOptions"
              class="flex-1 sm:flex-none sm:w-32"
            />
            <USelect
              v-model="nationalityFilter"
              :items="rylsNationalityOptions"
              class="flex-1 sm:flex-none sm:w-36"
            />
            <USelect
              v-model="paymentTypeFilter"
              :items="paymentTypeOptions"
              class="flex-1 sm:flex-none sm:w-36"
            />
          </div>
        </template>
        <template #toolbar-right>
          <UButton label="Export Excel" leading-icon="i-ph-download-simple-bold" color="primary" />
        </template>
      </AdminDataTable>
    </template>

    <template #drafts>
      <div class="space-y-4 mt-4">
        <UInput
          v-model="draftSearch"
          placeholder="Search email or name..."
          leading-icon="i-ph-magnifying-glass-bold"
          class="w-full sm:w-64"
        />
        <UTable :data="filteredDrafts" :columns="draftColumns" />
      </div>
    </template>
  </UTabs>

  <AdminProgramsRegistrationDetailSlideover
    v-model:open="isDetailOpen"
    :registration="selectedRegistration"
  />
</template>
