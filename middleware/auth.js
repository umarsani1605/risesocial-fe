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

  try {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    console.log('storedUser: ' + storedUser);

    if (storedToken && storedUser) {
      authStore.setAuth({
        token: storedToken,
        user: JSON.parse(storedUser),
      });
    }

    authStore.isInitialized = true;
  } catch (err) {
    console.error('Error initializing auth:', err);
    authStore.clearAuth();
  }

  console.log('authStore' + authStore);

  if (authStore.status === 'unauthenticated') {
    console.log('unauthenticated');
    return navigateTo('/');
  }

  if (authStore.user?.role !== 'ADMIN') {
    return navigateTo('/');
  }
});
