/**
 * Middleware untuk melindungi halaman yang memerlukan autentikasi
 * Redirect ke homepage dengan dialog login jika user belum login
 * Menggunakan @sidebase/nuxt-auth
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth();

  if (status.value === 'unauthenticated') {
    // Redirect ke homepage dengan parameter untuk membuka login dialog
    return navigateTo('/?login=true&redirect=' + encodeURIComponent(to.fullPath));
  }
});
