import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ModuleModal from '../../app/components/admin/cohort/ModuleModal.vue'

function makeForm() {
  return {
    title: 'Module 1',
    description: '',
    sessionDate: null,
    sessionStartTime: null,
    sessionEndTime: null,
    meetingLink: 'https://example.com/meeting',
    attendanceLink: 'https://example.com/attendance',
    assignmentTitle: '',
    assignmentLink: '',
    assignmentDeadlineDate: null,
    assignmentDeadlineTime: null,
    isPublished: true,
  }
}

describe('ModuleModal', () => {
  it('shows an error and does not emit addLink when the attachment URL is invalid', async () => {
    const wrapper = await mountSuspended(ModuleModal, {
      props: {
        mode: 'edit',
        loading: false,
        open: true,
        form: makeForm(),
        pendingAttachments: [],
        attachments: [],
      },
    })

    wrapper.vm.showAttachment = true
    wrapper.vm.linkUrl = 'bukan-link'
    wrapper.vm.addLink()
    await nextTick()

    expect(wrapper.emitted('addLink')).toBeFalsy()
    expect(wrapper.vm.linkError).toBe('Please enter a valid link')
  })

  it('keeps the add-link button aligned to the top when the link field shows an error', async () => {
    const wrapper = await mountSuspended(ModuleModal, {
      props: {
        mode: 'edit',
        loading: false,
        open: true,
        form: makeForm(),
        pendingAttachments: [],
        attachments: [],
      },
    })

    expect(wrapper.vm.linkRowClass).toBe('pt-2 flex gap-2 items-start')
    expect(wrapper.vm.addLinkButtonClass).toContain('self-start')
  })
})
