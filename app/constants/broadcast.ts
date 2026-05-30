export const BROADCAST_SEGMENT_OPTIONS = [
  { label: 'All Users', value: 'all_users' },
  { label: 'Users with Program Notifications', value: 'program_subscribers' },
  { label: 'Users with Job Notifications', value: 'job_subscribers' },
  { label: 'RYLS Submitted', value: 'ryls_submitted' },
  { label: 'Custom List', value: 'custom_list' }
]

export const BROADCAST_SEGMENT_LABEL: Record<string, string> = Object.fromEntries(
  BROADCAST_SEGMENT_OPTIONS.map((o) => [o.value, o.label])
)

export const BROADCAST_STATUS_COLOR: Record<
  EmailBroadcastStatus,
  'neutral' | 'warning' | 'success' | 'error'
> = {
  DRAFT: 'neutral',
  SENDING: 'warning',
  SENT: 'success',
  FAILED: 'error'
}

export const BROADCAST_STATUS_LABEL: Record<EmailBroadcastStatus, string> = {
  DRAFT: 'Draft',
  SENDING: 'Sending',
  SENT: 'Sent',
  FAILED: 'Failed'
}

export const BROADCAST_STATUS_FILTER_OPTIONS = [
  { label: 'All Status', value: 'all' },
  { label: 'Sending', value: 'SENDING' },
  { label: 'Sent', value: 'SENT' },
  { label: 'Failed', value: 'FAILED' }
]

/** Brevo free-tier daily sending cap; mirrors the backend guard. */
export const BROADCAST_DAILY_LIMIT = 300
