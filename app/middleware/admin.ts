export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, isAdmin } = useAuth()
  if (!isLoggedIn.value) return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  if (!isAdmin.value) return navigateTo('/')
})
