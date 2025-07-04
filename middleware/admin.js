/**
 * Middleware untuk melindungi halaman yang memerlukan akses admin
 * Redirect ke homepage jika user bukan admin
 * Menggunakan @sidebase/nuxt-auth
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const { status, data: session } = useAuth();

  if (status.value === 'unauthenticated') {
    // Redirect ke homepage dengan parameter untuk membuka login dialog
    return navigateTo('/?login=true&redirect=' + encodeURIComponent(to.fullPath));
  }

  if (status.value === 'authenticated' && session.value?.user?.role !== 'ADMIN') {
    // Throw error 403 jika user sudah login tapi bukan admin
    throw createError({
      statusCode: 403,
      statusMessage: 'Access forbidden: Admin privileges required',
    });
  }
});
