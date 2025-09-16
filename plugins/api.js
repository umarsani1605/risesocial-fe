/**
 * API Plugin with Sidebase Auth integration
 * Based on: https://nuxt.com/docs/4.x/guide/recipes/custom-usefetch
 */

export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.backendUrl,
    onRequest({ request, options, error }) {
      // Get token from Sidebase Auth
      const { token } = useAuth();

      if (token.value) {
        // Add Authorization header
        options.headers = {
          ...options.headers,
          Authorization: token.value,
        };
      }
    },
    async onResponseError({ response }) {
      // 401 Unauthorized
      if (response.status === 401) {
        // Sidebase Auth will handle logout automatically
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
