/**
 * Middleware untuk melindungi halaman yang memerlukan akses admin
 * Redirect ke homepage jika user bukan admin
 * Menggunakan custom auth system
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, user } = useCustomAuth();

  if (!isAuthenticated.value) {
    // Redirect ke homepage dengan parameter untuk membuka login dialog
    return navigateTo('/?login=true&redirect=' + encodeURIComponent(to.fullPath));
  }

  if (isAuthenticated.value && user.value?.role !== 'ADMIN') {
    // Throw error 403 jika user sudah login tapi bukan admin
    throw createError({
      statusCode: 403,
      statusMessage: 'Access forbidden: Admin privileges required',
    });
  }
});
