/**
 * Composable untuk API calls ke backend
 * Otomatis menambahkan authorization header jika user sudah login
 * Menggunakan @sidebase/nuxt-auth untuk session management
 *
 * DEMO MODE: Includes mock responses untuk frontend-only demo
 */
export const useBackendApi = () => {
  const { data: session, signOut } = useAuth();
  const config = useRuntimeConfig();

  // DEMO MODE: Check if we're in demo mode (no backend available)
  const isDemoMode = ref(true); // Set to true for demo frontend-only

  // Mock responses untuk demo
  const mockResponses = {
    '/api/users/me': {
      success: true,
      data: {
        id: 'demo-user-001',
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@risesocial.org',
        role: 'USER',
        avatar: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    '/api/auth/register': {
      success: true,
      data: {
        user: {
          id: 'demo-user-002',
          first_name: 'New',
          last_name: 'User',
          email: 'newuser@example.com',
          role: 'USER',
          avatar: null,
        },
        token: 'demo-jwt-token-' + Date.now(),
        expiresIn: '1 day',
      },
      message: 'User registered successfully',
    },
  };

  /**
   * Generic API call dengan automatic token handling
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options
   * @returns {Promise} - Response data
   */
  const apiCall = async (endpoint, options = {}) => {
    // DEMO MODE: Return mock responses
    if (isDemoMode.value) {
      console.log('🎭 DEMO MODE: Mock API call to', endpoint);

      // Simulasi delay network
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return mock response jika ada
      if (mockResponses[endpoint]) {
        console.log('✅ DEMO MODE: Returning mock response for', endpoint);
        return mockResponses[endpoint];
      }

      // Default mock success response
      console.log('⚡ DEMO MODE: Returning default mock response for', endpoint);
      return {
        success: true,
        data: {},
        message: 'Demo mode - operation successful',
      };
    }

    // PRODUCTION MODE: Real API calls
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
    if (!session.value?.user && !isDemoMode.value) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      });
    }

    return apiCall(endpoint, options);
  };

  /**
   * Toggle demo mode (useful untuk development/testing)
   */
  const toggleDemoMode = () => {
    isDemoMode.value = !isDemoMode.value;
    console.log('🎭 Demo mode:', isDemoMode.value ? 'ENABLED' : 'DISABLED');
  };

  return {
    apiCall,
    authenticatedCall,
    toggleDemoMode,
    isDemoMode: readonly(isDemoMode),
  };
};
