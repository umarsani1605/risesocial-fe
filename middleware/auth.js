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

  if (authStore.status === 'unauthenticated') {
    return navigateTo('/');
  }

  if (authStore.user?.role !== 'ADMIN') {
    return navigateTo('/');
  }
});
