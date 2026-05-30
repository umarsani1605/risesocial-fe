// Email broadcast types (ambient, no import needed)

type EmailBroadcastStatus = 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED'

interface BrevoSender {
  id: number | null
  name: string
  email: string
  active: boolean
}

interface BroadcastSegmentCriteria {
  emails?: string
}

interface EmailBroadcast {
  id: number
  subject: string
  body_text: string
  sender_email: string
  sender_name: string
  segment: string
  segment_criteria: BroadcastSegmentCriteria | null
  recipient_count: number
  brevo_tag: string | null
  message_ids: string[]
  status: EmailBroadcastStatus
  error_detail: string | null
  created_by: number
  requests: number
  delivered: number
  opens: number
  unique_opens: number
  clicks: number
  unique_clicks: number
  hard_bounces: number
  soft_bounces: number
  spam_reports: number
  blocked: number
  invalid: number
  unsubscribed: number
  sent_at: string | null
  created_at: string
  updated_at: string
  created_by_user?: {
    id: number
    first_name: string
    last_name: string
    email: string
  } | null
}

interface BroadcastRecipientPreview {
  count: number
  blocked: boolean
  limit: number
  sample: string[]
}
