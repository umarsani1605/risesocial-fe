export const ADMIN_STUDENTS_NAV_BADGE_ASYNC_KEY = 'admin:students-nav-badge'

export async function refreshAdminStudentSurfaces(
  refreshPage: () => Promise<unknown>,
  refreshGlobal: (key: string) => Promise<unknown>,
) {
  await refreshPage()
  await refreshGlobal(ADMIN_STUDENTS_NAV_BADGE_ASYNC_KEY)
}
