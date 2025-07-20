import { useAuthStore } from '@/store/auth';

/**
 * Middleware untuk melindungi halaman yang memerlukan autentikasi
 * Redirect ke homepage dengan dialog login jika user belum login
 * Menggunakan backend auth system
 *
 * @param {Object} options - Options object
 * @param {boolean} options.requireAdmin - Require admin role
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Check if user is authenticated
  if (authStore.status === 'unauthenticated') {
    return navigateTo('/?login=true&redirect=' + encodeURIComponent(to.fullPath));
  }

  // Check admin requirement from route meta
  if (to.meta.requireAdmin && authStore.user?.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access forbidden: Admin privileges required',
    });
  }
});
