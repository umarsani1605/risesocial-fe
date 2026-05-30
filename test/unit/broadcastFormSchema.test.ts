import { describe, expect, it } from 'vitest'
import { broadcastFormSchema } from '../../app/schemas/broadcast'

function validateBody(bodyText: string) {
  return broadcastFormSchema.safeParse({
    sender_email: 'a@b.com',
    subject: 'Hi',
    body_text: bodyText,
    segment: 'all_users'
  })
}

describe('broadcastFormSchema body validation', () => {
  it('rejects an empty editor document', () => {
    expect(validateBody('<p></p>').success).toBe(false)
  })

  it('rejects whitespace-only HTML', () => {
    expect(validateBody('<p>   </p>').success).toBe(false)
  })

  it('accepts HTML with visible text', () => {
    expect(validateBody('<p>Hello</p>').success).toBe(true)
  })

  it('accepts a body that only contains an image', () => {
    expect(validateBody('<p><img src="https://x.com/a.png"></p>').success).toBe(true)
  })

  it('accepts a body that only contains a CTA button', () => {
    expect(validateBody('<a data-cta href="https://x.com">Go</a>').success).toBe(true)
  })
})
