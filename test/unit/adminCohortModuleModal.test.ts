import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('admin cohort module modal source', () => {
  it('uses the normalized attachment href helper for existing edit-modal attachments', () => {
    const source = readFileSync(resolve('app/components/admin/cohort/ModuleModal.vue'), 'utf8')

    expect(source).toContain('function getAttachmentHref(attachment:')
    expect(source).toContain("if (attachment.type === 'file') return attachment.file_url ?? undefined")
    expect(source).toContain(":href=\"getAttachmentHref(a)\"")
  })
})
