import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick, ref } from 'vue'
import DashboardAdminLayout from '../../app/layouts/dashboard-admin.vue'

const mockApi = vi.fn()
let mockPermissions = new Set<string>()
const mockIsSuperAdmin = ref(false)

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: mockApi }),
}))

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: ref({ avatar: null }),
    logout: vi.fn(),
    fullName: 'Admin User',
    initials: 'AU',
    isSuperAdmin: mockIsSuperAdmin,
    hasPermission: (key: string) => mockIsSuperAdmin.value || mockPermissions.has(key),
  }),
}))

describe('DashboardAdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPermissions = new Set([
      'admin.dashboard',
      'admin.transactions',
      'admin.ryls',
      'admin.academy',
      'admin.cohort',
      'admin.users',
      'admin.jobs',
    ])
    mockIsSuperAdmin.value = false
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

    const vm = wrapper.vm as unknown as { academyLinks: Array<{ label: string; badge?: unknown }> }
    const studentsLink = vm.academyLinks.find((item) => item.label === 'Students')

    expect(studentsLink?.badge).toEqual({
      label: '1',
      color: 'primary',
      variant: 'solid',
    })
  })

  it('keeps academy permission scoped to academies only', async () => {
    mockPermissions = new Set(['admin.academy'])
    mockApi.mockResolvedValue({ data: [] })

    const wrapper = await mountSuspended(DashboardAdminLayout, {
      slots: {
        default: '<div>content</div>',
      },
    })

    const vm = wrapper.vm as unknown as {
      academyLinks: Array<{ label: string }>
      analyticsLinks: Array<{ label: string }>
    }

    expect(vm.academyLinks.map((item) => item.label)).toEqual(['All Academy'])
    expect(vm.analyticsLinks.map((item) => item.label)).not.toContain('Academies')
  })

  it('shows cohorts and students for cohort permission', async () => {
    mockPermissions = new Set(['admin.cohort'])
    mockApi.mockResolvedValue({ data: [] })

    const wrapper = await mountSuspended(DashboardAdminLayout, {
      slots: {
        default: '<div>content</div>',
      },
    })

    const vm = wrapper.vm as unknown as { academyLinks: Array<{ label: string }> }

    expect(vm.academyLinks.map((item) => item.label)).toEqual([
      'Cohorts',
      'Students',
    ])
  })

  it('keeps administrators visible only to superadmins', async () => {
    mockPermissions = new Set(['admin.users'])
    mockApi.mockResolvedValue({ data: [] })

    const wrapper = await mountSuspended(DashboardAdminLayout, {
      slots: {
        default: '<div>content</div>',
      },
    })

    const vm = wrapper.vm as unknown as { userLinks: Array<{ label: string }> }

    expect(vm.userLinks.map((item) => item.label)).toEqual(['All Users'])

    mockIsSuperAdmin.value = true
    await nextTick()

    expect(vm.userLinks.map((item) => item.label)).toEqual([
      'All Users',
      'Administrator',
    ])
  })
})
