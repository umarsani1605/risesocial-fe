export default defineNuxtRouteMiddleware((to) => {
  const requiredPermission = to.meta.requiredPermission as string | undefined
  if (!requiredPermission) return

  const requiredPermissionLevel = to.meta.requiredPermissionLevel as AdminAccessLevel | undefined
  const { canEdit, hasPermission, isSuperAdmin } = useAuth()

  if (isSuperAdmin.value) return

  const isAllowed =
    requiredPermissionLevel === 'EDITOR'
      ? canEdit(requiredPermission)
      : hasPermission(requiredPermission)

  if (isAllowed) return

  return navigateTo(getAdminFallbackPath(hasPermission) ?? '/', { replace: true })
})
