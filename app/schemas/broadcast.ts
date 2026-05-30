import { z } from 'zod'

export const BROADCAST_SEGMENTS = [
  'all_users',
  'ryls_submitted',
  'program_subscribers',
  'job_subscribers',
  'custom_list'
] as const

/** Body is rich-text HTML; it's non-empty if it has visible text, an image, or a CTA. */
function bodyHasContent(html: string): boolean {
  if (/<img\b/i.test(html) || /data-cta/i.test(html)) return true
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim().length > 0
}

export const broadcastFormSchema = z
  .object({
    sender_email: z.string().min(1, 'Sender is required'),
    subject: z.string().min(1, 'Subject is required').max(255, 'Subject is too long'),
    body_text: z.string().refine(bodyHasContent, { error: 'Body is required' }),
    segment: z.enum(BROADCAST_SEGMENTS, { error: 'Recipient is required' }),
    custom_emails: z.string().optional()
  })
  .refine((d) => d.segment !== 'custom_list' || (d.custom_emails ?? '').trim().length > 0, {
    error: 'Enter at least one email address',
    path: ['custom_emails']
  })

export type BroadcastFormState = z.output<typeof broadcastFormSchema>
