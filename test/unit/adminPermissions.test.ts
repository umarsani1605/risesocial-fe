import { describe, expect, it } from 'vitest'

import { getAdminFallbackPath, getAssignableAdminPermissions } from '../../app/utils/adminPermissions'

describe('admin permission helpers', () => {
  it('hides statistics and settings from assignable permission resources', () => {
    const resources = [
      { key: 'admin.academy', name: 'Academy', available_levels: ['VIEWER', 'EDITOR'] },
      { key: 'admin.statistics', name: 'Statistics', available_levels: ['VIEWER'] },
      { key: 'admin.settings', name: 'System Settings', available_levels: ['VIEWER', 'EDITOR'] },
      { key: 'admin.cohort', name: 'Cohort', available_levels: ['VIEWER', 'EDITOR'] },
    ] as AdminPermissionResource[]

    expect(getAssignableAdminPermissions(resources).map((item) => item.key)).toEqual([
      'admin.academy',
      'admin.cohort',
    ])
  })

  it('routes cohort admins to cohorts and ignores statistics as a dashboard fallback', () => {
    expect(getAdminFallbackPath((key) => key === 'admin.cohort' || key === 'admin.statistics')).toBe(
      '/admin/cohorts'
    )
  })
})
