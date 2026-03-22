export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn, isAdmin } = useAuth()
  if (!isAdmin.value) return navigateTo('/')
})
