import { describe, expect, it } from 'vitest'
import { getAttachmentLinkError } from '../../app/utils/attachment'

describe('getAttachmentLinkError', () => {
  it('returns an error when the value is not a valid URL', () => {
    expect(getAttachmentLinkError('bukan-link')).toBe('Please enter a valid link')
  })

  it('returns null when the value is a valid https URL', () => {
    expect(getAttachmentLinkError('https://example.com/resource')).toBeNull()
  })
})
