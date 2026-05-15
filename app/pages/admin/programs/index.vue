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
const { public: { apiBaseUrl } } = useRuntimeConfig()

function getFileUrl(filePath?: string | null): string {
  if (!filePath) return ''
  const idx = filePath.indexOf('/uploads/')
  if (idx === -1) return ''
  const rel = filePath.slice(idx + '/uploads/'.length)
  const encoded = rel.split('/').map(encodeURIComponent).join('/')
  return `${apiBaseUrl}/uploads/${encoded}`
}

const [{ data: rawRegistrations }, { data: rawDrafts }] = await Promise.all([
  useAsyncData('admin:ryls', () => api<ApiResponse<RylsListResponse>>('/admin/ryls/registrations')),
  useAsyncData('admin:ryls-drafts', () =>
    api<ApiResponse<{ drafts: RylsDraft[]; pagination: { total: number } }>>(
      '/admin/ryls/registrations/drafts'
    )
  )
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
const toast = useToast()

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
      r.payments.some(
        (p: { payment_method: string }) => p.payment_method === paymentTypeFilter.value
      )
    )
  }
  return result
})

const draftSearch = ref('')
const draftStepFilter = ref('all')
const draftScholarshipFilter = ref('all')

const draftStepOptions = [
  { label: 'All Progress', value: 'all' },
  { label: 'Step 1', value: '1' },
  { label: 'Step 2', value: '2' },
  { label: 'Step 3', value: '3' }
]

const draftScholarshipOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Fully Funded', value: 'FULLY_FUNDED' },
  { label: 'Self Funded', value: 'SELF_FUNDED' }
]

const filteredDrafts = computed(() => {
  let result = allDrafts.value
  if (draftSearch.value) {
    const s = draftSearch.value.toLowerCase()
    result = result.filter(
      (d) =>
        d.email.toLowerCase().includes(s) ||
        (d.form_data?.step1?.fullName ?? '').toLowerCase().includes(s)
    )
  }
  if (draftStepFilter.value !== 'all') {
    result = result.filter((d) => String(d.current_step) === draftStepFilter.value)
  }
  if (draftScholarshipFilter.value !== 'all') {
    result = result.filter((d) => d.scholarship_type === draftScholarshipFilter.value)
  }
  return result
})

const activeTab = ref('submitted')
const tabItems = computed(() => [
  {
    label: `Submitted (${filteredData.value.length})`,
    value: 'submitted',
    slot: 'submitted',
    icon: 'i-ph-users-duotone'
  },
  {
    label: `Drafts (${filteredDrafts.value.length})`,
    value: 'drafts',
    slot: 'drafts',
    icon: 'i-ph-files-duotone'
  }
])

const STEP_LABELS: Record<number, string> = { 1: 'Step 1', 2: 'Step 2', 3: 'Step 3' }

const isExportingSubmitted = ref(false)
const isExportingDrafts = ref(false)

async function exportSubmittedExcel() {
  isExportingSubmitted.value = true
  try {
    const blob = await api('/admin/ryls/registrations/export-excel', { responseType: 'blob' }) as Blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ryls-registrations-${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isExportingSubmitted.value = false
  }
}

async function exportDraftsExcel() {
  isExportingDrafts.value = true
  try {
    const blob = await api('/admin/ryls/registrations/drafts/export-excel', { responseType: 'blob' }) as Blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ryls-drafts-${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error: unknown) {
    toast.add({ title: getApiErrorMessage(error), color: 'error' })
  } finally {
    isExportingDrafts.value = false
  }
}

function formatDraftGender(gender?: string | null) {
  if (!gender) return '–'
  if (gender === 'FEMALE') return 'Female'
  if (gender === 'MALE') return 'Male'
  if (gender === 'PREFER_NOT_TO_SAY') return 'Prefer not to say'
  return gender
}

function formatDraftDiscoverSource(source?: string | null, otherText?: string | null) {
  if (!source) return '–'
  if (source === 'OTHER') return otherText?.trim() || 'Other'
  return DISCOVER_SOURCE_LABEL[source] ?? source
}

const draftColumns: TableColumn<RylsDraft>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.index + 1)
  },
  {
    id: 'full_name',
    header: 'Name',
    cell: ({ row }) =>
      h('span', { class: 'font-medium' }, row.original.form_data?.step1?.fullName ?? '–')
  },
  { accessorKey: 'email', header: 'Email' },
  {
    id: 'whatsapp',
    header: 'Whatsapp',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.form_data?.step1?.whatsapp ?? '–')
  },
  {
    id: 'gender',
    header: 'Gender',
    cell: ({ row }) => h('span', { class: 'text-sm' }, formatDraftGender(row.original.form_data?.step1?.gender as string | undefined))
  },
  {
    id: 'date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }) => {
      const value = row.original.form_data?.step1?.dateOfBirth
      return h('span', { class: 'text-sm whitespace-nowrap' }, value ? formatDate(value) : '–')
    }
  },
  {
    id: 'residence',
    header: 'Residence',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.form_data?.step1?.residence ?? '–')
  },
  {
    id: 'nationality',
    header: 'Nationality',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.form_data?.step1?.nationality ?? '–')
  },
  {
    id: 'second_nationality',
    header: 'Second Nationality',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.form_data?.step1?.secondNationality ?? '–')
  },
  {
    id: 'institution',
    header: 'Institution',
    cell: ({ row }) =>
      h(
        'span',
        {
          class: 'text-sm line-clamp-2 max-w-[12rem]',
          title: row.original.form_data?.step1?.institution ?? undefined
        },
        row.original.form_data?.step1?.institution ?? '–'
      )
  },
  {
    id: 'discover_source',
    header: 'Discover Source',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-sm' },
        formatDraftDiscoverSource(
          row.original.form_data?.step1?.discoverSource as string | undefined,
          row.original.form_data?.step1?.discoverOtherText as string | undefined
        )
      )
  },
  {
    id: 'scholarship_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.scholarship_type
      if (!type) return h('span', { class: 'text-muted' }, '–')
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
    id: 'current_step',
    header: 'Progress',
    cell: ({ row }) =>
      h(
        UBadge,
        { variant: 'outline', color: 'primary', class: 'whitespace-nowrap' },
        () => STEP_LABELS[row.original.current_step] ?? `Step ${row.original.current_step}`
      )
  },
  {
    id: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, formatDatetime(row.original.updated_at))
  }
]

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
        PAYPAL: '/images/payment-logo/paypal.png'
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

      const linkClass =
        'inline-flex items-center gap-1 text-primary text-sm hover:underline max-w-52 truncate'

      if (
        (payment.payment_method === 'PAYPAL' || payment.payment_method === 'BANK_TRANSFER') &&
        payment.payment_proof?.file_path
      ) {
        const href = getFileUrl(payment.payment_proof.file_path)
        if (href) {
          return h('a', { href, target: '_blank', rel: 'noopener', class: linkClass }, [
            h('span', { class: 'i-ph-arrow-square-out-bold size-3 shrink-0' }),
            h('span', { class: 'truncate' }, 'Payment Proof')
          ])
        }
      }

      if (payment.payment_method === 'MIDTRANS') {
        const orderId =
          payment.transaction?.midtrans_data?.midtrans_order_id ??
          payment.transaction?.transaction_code
        if (orderId) {
          const href = `https://dashboard.midtrans.com/beta/transactions?type=order_id&query=${orderId}`
          return h('a', { href, target: '_blank', rel: 'noopener', class: linkClass }, [
            h('span', { class: 'i-ph-arrow-square-out-bold size-3 shrink-0' }),
            h('span', { class: 'truncate', title: orderId }, orderId)
          ])
        }
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
      return h(
        'span',
        { class: 'text-sm whitespace-nowrap' },
        formatPrice(payment.transaction?.amount)
      )
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
  <UTabs
    :items="tabItems"
    v-model="activeTab"
    variant="link"
    color="primary"
    :unmount-on-hide="false"
    :ui="{
      root: 'flex-1 min-h-0 gap-6',
      list: 'p-0! shrink-0',
      content: 'flex-1 min-h-0',
      trigger: 'px-3 sm:px-6 whitespace-nowrap'
    }"
  >
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
          <UButton
            label="Export Excel"
            leading-icon="i-ph-download-simple-bold"
            color="primary"
            :loading="isExportingSubmitted"
            :disabled="isExportingSubmitted"
            @click="exportSubmittedExcel"
          />
        </template>
      </AdminDataTable>
    </template>

    <template #drafts>
      <AdminDataTable
        v-model:search="draftSearch"
        :data="filteredDrafts"
        :columns="draftColumns"
        search-placeholder="Search email or name..."
        search-class="w-full sm:w-52"
      >
        <template #toolbar-left>
          <div class="flex flex-wrap w-full sm:w-auto gap-2">
            <USelect
              v-model="draftStepFilter"
              :items="draftStepOptions"
              class="flex-1 sm:flex-none sm:w-36"
            />
            <USelect
              v-model="draftScholarshipFilter"
              :items="draftScholarshipOptions"
              class="flex-1 sm:flex-none sm:w-36"
            />
          </div>
        </template>
        <template #toolbar-right>
          <UButton
            label="Export Excel"
            leading-icon="i-ph-download-simple-bold"
            color="primary"
            :loading="isExportingDrafts"
            :disabled="isExportingDrafts"
            @click="exportDraftsExcel"
          />
        </template>
      </AdminDataTable>
    </template>
  </UTabs>

  <AdminProgramsRegistrationDetailSlideover
    v-model:open="isDetailOpen"
    :registration="selectedRegistration"
  />
</template>
