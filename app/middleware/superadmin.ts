export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, isSuperAdmin } = useAuth()
  if (!isLoggedIn.value) return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  if (!isSuperAdmin.value) return navigateTo('/')
})
