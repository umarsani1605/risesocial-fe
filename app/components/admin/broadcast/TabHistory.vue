<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import {
  BROADCAST_SEGMENT_LABEL,
  BROADCAST_STATUS_COLOR,
  BROADCAST_STATUS_LABEL,
  BROADCAST_STATUS_FILTER_OPTIONS
} from '@/constants/broadcast'

const props = defineProps<{ reloadToken: number }>()

const { canEdit } = useAdminPermission('admin.broadcast')
const history = useAdminBroadcastHistory()

onMounted(() => history.load())
watch(() => props.reloadToken, () => history.load())

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

function openRate(b: EmailBroadcast) {
  if (!b.delivered) return '–'
  return `${Math.round((b.unique_opens / b.delivered) * 100)}%`
}

const columns: TableColumn<EmailBroadcast>[] = [
  {
    id: 'no',
    header: '#',
    cell: ({ row }) => h('span', { class: 'text-muted' }, row.index + 1)
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => h('span', { class: 'font-medium line-clamp-1 max-w-[16rem]', title: row.original.subject }, row.original.subject)
  },
  {
    id: 'segment',
    header: 'Recipient',
    cell: ({ row }) => h('span', { class: 'text-sm' }, BROADCAST_SEGMENT_LABEL[row.original.segment] ?? row.original.segment)
  },
  {
    id: 'recipient_count',
    header: 'Recipients',
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.recipient_count)
  },
  {
    id: 'delivered',
    header: 'Delivered',
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, row.original.delivered)
  },
  {
    id: 'open_rate',
    header: 'Open Rate',
    cell: ({ row }) => h('span', { class: 'text-sm tabular-nums' }, openRate(row.original))
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(UBadge, { color: BROADCAST_STATUS_COLOR[row.original.status], variant: 'subtle', class: 'whitespace-nowrap' }, () => BROADCAST_STATUS_LABEL[row.original.status])
  },
  {
    id: 'sent_at',
    header: 'Sent At',
    cell: ({ row }) =>
      h('span', { class: 'text-sm whitespace-nowrap' }, row.original.sent_at ? formatDatetime(row.original.sent_at) : '–')
  },
  {
    id: 'actions',
    header: () => h('div', 'Actions'),
    meta: { class: { th: 'w-px whitespace-nowrap', td: 'w-px whitespace-nowrap' } },
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-1 justify-end' }, [
        ...(canEdit.value
          ? [
              h(UButton, {
                label: 'Check Status',
                size: 'sm',
                color: 'neutral',
                variant: 'light',
                leadingIcon: 'i-ph-arrows-clockwise-bold',
                loading: history.refreshingId === row.original.id,
                onClick: () => history.checkStatus(row.original.id)
              })
            ]
          : []),
        h(UButton, {
          label: 'Detail',
          size: 'sm',
          color: 'neutral',
          variant: 'light',
          leadingIcon: 'i-ph-magnifying-glass-bold',
          onClick: () => history.openDetail(row.original)
        })
      ])
  }
]
</script>

<template>
  <div>
    <AdminDataTable
      :data="history.filtered"
      :columns="columns"
      :loading="history.loading"
    >
      <template #toolbar-left>
        <USelect
          v-model="history.statusFilter"
          :items="BROADCAST_STATUS_FILTER_OPTIONS"
          class="w-full sm:w-44"
        />
      </template>
    </AdminDataTable>

    <AdminBroadcastDetailSlideover
      v-model:open="history.isDetailOpen"
      :broadcast="history.selected"
    />
  </div>
</template>
