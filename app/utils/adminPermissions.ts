export const HIDDEN_ASSIGNABLE_PERMISSION_KEYS = new Set(['admin.statistics', 'admin.settings'])

export function getAssignableAdminPermissions(resources: AdminPermissionResource[]) {
  return resources.filter((resource) => !HIDDEN_ASSIGNABLE_PERMISSION_KEYS.has(resource.key))
}

export function getAdminFallbackPath(hasPermission: (key: string) => boolean) {
  const fallback = [
    { key: 'admin.transactions', to: '/admin/transactions' },
    { key: 'admin.ryls', to: '/admin/programs' },
    { key: 'admin.academy', to: '/admin/academies' },
    { key: 'admin.cohort', to: '/admin/cohorts' },
    { key: 'admin.users', to: '/admin/users' },
    { key: 'admin.jobs', to: '/admin/jobs' },
  ]

  return fallback.find((entry) => hasPermission(entry.key))?.to
}
