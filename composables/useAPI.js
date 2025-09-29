/**
 * Based on: https://nuxt.com/docs/4.x/guide/recipes/custom-usefetch
 */

/**
 * Custom useFetch dengan API client yang sudah dikonfigurasi
 * Untuk initial data fetching (SSR-safe)
 * @param {string|Function} url - API endpoint
 * @param {object} options - useFetch options
 * @returns {object} useFetch result
 */
export function useAPI(url, options = {}) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
}

/**
 * Direct API call menggunakan custom $fetch
 * Untuk browser interactions (event-based)
 * @param {string} endpoint - API endpoint
 * @param {object} options - $fetch options
 * @returns {Promise} API response
 */
export function $api(endpoint, options = {}) {
  return useNuxtApp().$api(endpoint, options);
}
