import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import DashboardAdminLayout from '../../app/layouts/dashboard-admin.vue'

const mockApi = vi.fn()

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: mockApi }),
}))

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: ref({ avatar: null }),
    logout: vi.fn(),
    fullName: 'Admin User',
    initials: 'AU',
    hasPermission: () => true,
  }),
}))

describe('DashboardAdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds a solid primary badge to the Students menu when there are unassigned students', async () => {
    mockApi.mockResolvedValue({
      data: [
        { completed_at: null, placement: null },
        { completed_at: null, placement: { id: 2 } },
      ],
    })

    const wrapper = await mountSuspended(DashboardAdminLayout, {
      slots: {
        default: '<div>content</div>',
      },
    })

    const studentsLink = wrapper.vm.academyLinks.find((item: { label: string }) => item.label === 'Students')

    expect(studentsLink?.badge).toEqual({
      label: '1',
      color: 'primary',
      variant: 'solid',
    })
  })
})
