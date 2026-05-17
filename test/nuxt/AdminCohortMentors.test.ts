import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TabMentors from '../../app/components/admin/cohort/TabMentors.vue'
import MentorModal from '../../app/components/admin/cohort/InviteMentorModal.vue'

describe('Admin cohort mentors UI', () => {
  it('renders mentor CRUD actions without email and phone columns', async () => {
    const wrapper = await mountSuspended(TabMentors, {
      props: {
        mentors: [
          {
            id: 1,
            name: 'Jane Mentor',
            job_title: 'Senior Consultant',
            avatar: null,
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.text()).toContain('Remove')
    expect(wrapper.text()).not.toContain('Email')
    expect(wrapper.text()).not.toContain('Phone')
    expect(wrapper.text()).not.toContain('Mentors')
  })

  it('uses add and edit titles based on the current mentor state', async () => {
    const addWrapper = await mountSuspended(MentorModal, {
      props: {
        open: true,
        loading: false,
        form: { name: '', jobTitle: '' },
        item: null,
      },
    })

    const editWrapper = await mountSuspended(MentorModal, {
      props: {
        open: true,
        loading: false,
        form: { name: 'Jane Mentor', jobTitle: 'Senior Consultant' },
        item: {
          id: 1,
          name: 'Jane Mentor',
          job_title: 'Senior Consultant',
          avatar: null,
        },
      },
    })

    expect((addWrapper.vm as any).modalTitle).toBe('Add Mentor')
    expect((editWrapper.vm as any).modalTitle).toBe('Edit Mentor')
  })
})
