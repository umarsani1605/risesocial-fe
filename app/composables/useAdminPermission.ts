/**
 * Reactive permission helpers scoped to a single admin domain key.
 *
 * Usage:
 *   const { canEdit, isViewer, hasAccess } = useAdminPermission('admin.academy')
 *
 * - `canEdit`   → true if user has EDITOR access (or is SUPERADMIN).
 * - `isViewer`  → true if user has access but only VIEWER level.
 * - `hasAccess` → true if user has any access level.
 *
 * Wraps `useAuth().canEdit` and `useAuth().hasPermission` so each admin page
 * binds to a single permission key once and consumes reactive computeds.
 */
export const useAdminPermission = (key: string) => {
  const { canEdit, hasPermission } = useAuth()

  const canEditDomain = computed(() => canEdit(key))
  const hasAccess = computed(() => hasPermission(key))
  const isViewer = computed(() => hasAccess.value && !canEditDomain.value)

  return {
    canEdit: canEditDomain,
    isViewer,
    hasAccess
  }
}
