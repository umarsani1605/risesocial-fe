import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { CalendarDate } from '@internationalized/date'
import CreateModal from '../../app/components/admin/cohort/CreateModal.vue'

function makeForm() {
  return {
    academy_id: 1,
    name: 'Batch 1',
    description: '',
    start_date: '',
    end_date: '',
  }
}

describe('CohortCreateModal', () => {
  it('syncs Nuxt UI calendar values back into the form date strings', async () => {
    const form = makeForm()

    const wrapper = await mountSuspended(CreateModal, {
      props: {
        open: true,
        form,
        academyItems: [{ label: 'Academy 1', value: 1 }],
      },
    })

    wrapper.vm.startDate = new CalendarDate(2026, 5, 20)
    wrapper.vm.endDate = new CalendarDate(2026, 6, 20)

    expect(form.start_date).toBe('2026-05-20')
    expect(form.end_date).toBe('2026-06-20')
  })
})
