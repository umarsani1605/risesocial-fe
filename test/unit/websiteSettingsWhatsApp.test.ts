import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { websiteSocialMediaSchema } from '../../app/schemas/settings'

const pageSource = readFileSync(
  resolve(import.meta.dirname, '../../app/pages/programs/rise-and-thrive.vue'),
  'utf8'
)

describe('website WhatsApp settings', () => {
  it('keeps website social media settings limited to the real social channels', () => {
    expect(websiteSocialMediaSchema.parse({
      instagram: '',
      facebook: '',
      linkedin: '',
      tiktok: ''
    })).toEqual({
      instagram: '',
      facebook: '',
      linkedin: '',
      tiktok: ''
    })

    expect(pageSource).not.toContain('socialMedia.whatsapp')
  })

  it('drives the Rise & Thrive CTA from contact.phone', () => {
    expect(pageSource).toContain('const { contact } = useSiteSettings()')
    expect(pageSource).toContain("const DEFAULT_WHATSAPP_NUMBER = '6285864042289'")
    expect(pageSource).toContain("const digits = (contact.value.phone || '').replace(/\\D/g, '')")
    expect(pageSource).toContain(':to="collaborationLink"')
  })
})
