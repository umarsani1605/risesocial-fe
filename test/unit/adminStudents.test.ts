import { describe, expect, it, vi } from 'vitest'
import { ADMIN_STUDENTS_NAV_BADGE_ASYNC_KEY, refreshAdminStudentSurfaces } from '../../app/utils/adminStudents'

describe('refreshAdminStudentSurfaces', () => {
  it('refreshes the students page data and the sidebar badge data', async () => {
    const refreshPage = vi.fn().mockResolvedValue(undefined)
    const refreshGlobal = vi.fn().mockResolvedValue(undefined)

    await refreshAdminStudentSurfaces(refreshPage, refreshGlobal)

    expect(refreshPage).toHaveBeenCalledTimes(1)
    expect(refreshGlobal).toHaveBeenCalledWith(ADMIN_STUDENTS_NAV_BADGE_ASYNC_KEY)
  })
})
