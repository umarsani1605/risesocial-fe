export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn, isAdmin } = useAuth()
  if (isLoggedIn.value) {
    return navigateTo(isAdmin.value ? '/admin' : '/dashboard')
  }
})
