/**
 * Based on: https://nuxt.com/docs/4.x/guide/recipes/custom-usefetch
 */

import { useAuthStore } from '~/store/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.backendUrl,
    onRequest({ request, options, error }) {
      console.log('onRequest', request, options, error);
      console.log('authStore token', authStore.token);

      if (authStore.token) {
        options.headers = options.headers || {};
        options.headers.set('Authorization', `Bearer ${authStore.token}`);
      }
    },
    async onResponseError({ response }) {
      // 401 Unauthorized
      if (response.status === 401) {
        // authStore.clearAuth();
        await nuxtApp.runWithContext(() => navigateTo('/'));
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
