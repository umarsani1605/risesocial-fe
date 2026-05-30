<script setup lang="ts">
import {
  BROADCAST_SEGMENT_LABEL,
  BROADCAST_STATUS_COLOR,
  BROADCAST_STATUS_LABEL
} from '@/constants/broadcast'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ broadcast: EmailBroadcast | null }>()

// Ordered so each related pair sits side by side (4-column grid).
const stats = computed(() => {
  const b = props.broadcast
  if (!b) return []
  return [
    { label: 'Opens', value: b.opens },
    { label: 'Unique Opens', value: b.unique_opens },
    { label: 'Clicks', value: b.clicks },
    { label: 'Unique Clicks', value: b.unique_clicks },
    { label: 'Delivered', value: b.delivered },
    { label: 'Invalid Email', value: b.invalid },
    { label: 'Soft Bounces', value: b.soft_bounces },
    { label: 'Hard Bounces', value: b.hard_bounces },
    { label: 'Requests', value: b.requests },
    { label: 'Blocked', value: b.blocked },
    { label: 'Spam Reports', value: b.spam_reports },
    { label: 'Unsubscribed', value: b.unsubscribed }
  ]
})

// Render the stored body the same way it was sent (logo header + footer + content).
const bodyPreviewDoc = computed(() => buildBroadcastPreviewDoc(props.broadcast?.body_text || ''))

// Custom-list recipients are stored verbatim in segment_criteria.emails.
const recipientEmails = computed(() => {
  const b = props.broadcast
  if (!b || b.segment !== 'custom_list') return []
  return String(b.segment_criteria?.emails ?? '')
    .split(/[\n;,]+/)
    .map((e) => e.trim())
    .filter(Boolean)
})
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Broadcast Detail"
    side="right"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <div v-if="broadcast" class="space-y-6">
        <h3 class="text-lg font-semibold">{{ broadcast.subject }}</h3>

        <UAlert
          v-if="broadcast.status === 'FAILED' && broadcast.error_detail"
          color="error"
          variant="soft"
          icon="i-ph-warning-circle-fill"
          title="Send failed"
          :description="broadcast.error_detail"
        />

        <div class="grid grid-cols-[180px_1fr] gap-x-6 gap-y-3 text-sm items-center">
          <span class="text-muted">Recipient group</span>
          <span class="font-medium">{{
            BROADCAST_SEGMENT_LABEL[broadcast.segment] ?? broadcast.segment
          }}</span>
          <span class="text-muted">Recipients</span>
          <span class="font-medium">{{ broadcast.recipient_count }}</span>
          <span class="text-muted">Sender</span>
          <span class="font-medium"
            >{{ broadcast.sender_name }} &lt;{{ broadcast.sender_email }}&gt;</span
          >
          <span class="text-muted">Status</span>
          <span>
            <UBadge :color="BROADCAST_STATUS_COLOR[broadcast.status]" variant="subtle">
              {{ BROADCAST_STATUS_LABEL[broadcast.status] }}
            </UBadge>
          </span>
          <span class="text-muted">Sent at</span>
          <span class="font-medium">{{
            broadcast.sent_at ? formatDatetime(broadcast.sent_at) : '–'
          }}</span>
        </div>

        <div v-if="recipientEmails.length">
          <h4 class="text-sm font-medium mb-2">Recipient emails</h4>
          <div
            class="rounded-lg border border-default p-3 max-h-48 overflow-y-auto text-sm text-muted space-y-1"
          >
            <div v-for="email in recipientEmails" :key="email" class="truncate">{{ email }}</div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium mb-2">Engagement</h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="s in stats" :key="s.label" class="rounded-lg border border-default p-3">
              <div class="text-xs text-muted">{{ s.label }}</div>
              <div class="text-lg font-semibold tabular-nums">{{ s.value }}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium mb-2">Body</h4>
          <div class="rounded-lg border border-default overflow-hidden bg-elevated h-[500px]">
            <iframe
              :srcdoc="bodyPreviewDoc"
              title="Email body"
              sandbox="allow-same-origin"
              class="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
