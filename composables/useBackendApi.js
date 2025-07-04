/**
 * Composable untuk API calls ke backend
 * Otomatis menambahkan authorization header jika user sudah login
 * Menggunakan @sidebase/nuxt-auth untuk session management
 */
export const useBackendApi = () => {
  const { data: session, signOut } = useAuth();
  const config = useRuntimeConfig();

  /**
   * Generic API call dengan automatic token handling
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options
   * @returns {Promise} - Response data
   */
  const apiCall = async (endpoint, options = {}) => {
    const token = session.value?.accessToken;

    const defaultOptions = {
      baseURL: config.public.backendUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await $fetch(endpoint, defaultOptions);
      return response;
    } catch (error) {
      console.error('Backend API error:', error);

      // Jika error 401 (Unauthorized), sign out user
      if (error.status === 401 || error.statusCode === 401) {
        console.warn('Unauthorized access, signing out user');
        await signOut({ redirect: false });
        // Redirect ke homepage dengan login dialog
        await navigateTo('/?login=true');
      }

      throw error;
    }
  };

  /**
   * Authenticated API call - memerlukan user sudah login
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options
   * @returns {Promise} - Response data
   */
  const authenticatedCall = async (endpoint, options = {}) => {
    if (!session.value?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      });
    }

    return apiCall(endpoint, options);
  };

  /**
   * Admin-only API call - memerlukan user admin
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options
   * @returns {Promise} - Response data
   */
  const adminCall = async (endpoint, options = {}) => {
    if (!session.value?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      });
    }

    if (session.value.user.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required',
      });
    }

    return apiCall(endpoint, options);
  };

  return {
    // Generic API call
    apiCall,

    // Authenticated calls
    authenticatedCall,
    adminCall,

    // HTTP method helpers
    get: (endpoint, options = {}) => apiCall(endpoint, { method: 'GET', ...options }),
    post: (endpoint, body, options = {}) => apiCall(endpoint, { method: 'POST', body, ...options }),
    put: (endpoint, body, options = {}) => apiCall(endpoint, { method: 'PUT', body, ...options }),
    patch: (endpoint, body, options = {}) => apiCall(endpoint, { method: 'PATCH', body, ...options }),
    delete: (endpoint, options = {}) => apiCall(endpoint, { method: 'DELETE', ...options }),

    // Authenticated HTTP method helpers
    authGet: (endpoint, options = {}) => authenticatedCall(endpoint, { method: 'GET', ...options }),
    authPost: (endpoint, body, options = {}) => authenticatedCall(endpoint, { method: 'POST', body, ...options }),
    authPut: (endpoint, body, options = {}) => authenticatedCall(endpoint, { method: 'PUT', body, ...options }),
    authPatch: (endpoint, body, options = {}) => authenticatedCall(endpoint, { method: 'PATCH', body, ...options }),
    authDelete: (endpoint, options = {}) => authenticatedCall(endpoint, { method: 'DELETE', ...options }),

    // Admin HTTP method helpers
    adminGet: (endpoint, options = {}) => adminCall(endpoint, { method: 'GET', ...options }),
    adminPost: (endpoint, body, options = {}) => adminCall(endpoint, { method: 'POST', body, ...options }),
    adminPut: (endpoint, body, options = {}) => adminCall(endpoint, { method: 'PUT', body, ...options }),
    adminPatch: (endpoint, body, options = {}) => adminCall(endpoint, { method: 'PATCH', body, ...options }),
    adminDelete: (endpoint, options = {}) => adminCall(endpoint, { method: 'DELETE', ...options }),
  };
};
