import { defineStore } from 'pinia';

/**
 * Auth Store - Global authentication state management
 * Mengelola user authentication state dan API calls
 */
export const useAuthStore = defineStore('auth', {
  /**
   * @returns {AuthState}
   */
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isInitialized: false,
  }),

  getters: {
    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isLoggedIn: (state) => !!state.user && !!state.token,

    /**
     * Check if user is admin
     * @returns {boolean}
     */
    isAdmin: (state) => state.user?.role === 'admin',

    /**
     * Check if user is instructor
     * @returns {boolean}
     */
    isInstructor: (state) => state.user?.role === 'instructor',

    /**
     * Check if user is student
     * @returns {boolean}
     */
    isStudent: (state) => state.user?.role === 'student',

    /**
     * Get authentication status
     * @returns {string}
     */
    status: (state) => {
      if (!state.isInitialized) return 'loading';
      return state.user ? 'authenticated' : 'unauthenticated';
    },

    /**
     * Get user full name
     * @returns {string}
     */
    fullName: (state) => {
      if (!state.user) return '';
      return `${state.user.first_name || ''} ${state.user.last_name || ''}`.trim();
    },

    /**
     * Get user initials
     * @returns {string}
     */
    initials: (state) => {
      if (!state.user) return 'U';
      const first = state.user.first_name?.[0] || '';
      const last = state.user.last_name?.[0] || '';
      return `${first}${last}`.toUpperCase() || 'U';
    },
  },

  actions: {
    /**
     * Initialize auth state from localStorage
     */
    initAuth() {
      if (process.server) return;

      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          this.token = storedToken;
          this.user = JSON.parse(storedUser);
        }

        this.isInitialized = true;
      } catch (err) {
        console.error('Error initializing auth:', err);
        this.clearAuth();
      }
    },

    /**
     * Set auth state
     * @param {object} authData - Auth data with user and token
     */
    setAuth(authData) {
      this.user = authData.user;
      this.token = authData.token;

      if (process.client) {
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('auth_user', JSON.stringify(authData.user));
      }
    },

    /**
     * Clear auth state
     */
    clearAuth() {
      this.user = null;
      this.token = null;
      this.error = null;
      if (process.client) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },

    /**
     * Login user
     * @param {object} credentials - Login credentials
     * @returns {Promise<object>} User data and token
     */
    async signIn(credentials) {
      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials,
          baseURL: config.public.backendUrl,
        });

        // The response should have user and token at the root level
        const { user, token } = response.data;
        this.setAuth({ user, token });
        console.log('User logged in:', { user, token });

        return response;
      } catch (err) {
        this.error = err.data?.message || 'Login failed';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Register new user
     * @param {object} userData - Registration data
     * @returns {Promise<object>} User data and token
     */
    async signUp(userData) {
      console.log('🔵 [Auth] Starting registration process...', { email: userData.email });
      this.isLoading = true;
      this.error = null;

      try {
        console.log('🔵 [Auth] Sending registration request to backend...', { 
          email: userData.email,
          endpoint: '/api/auth/register' 
        });
        
        const config = useRuntimeConfig();
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
          baseURL: config.public.backendUrl,
        });

        console.log('✅ [Auth] Registration successful', { 
          email: userData.email,
          userId: response.data?.id 
        });
        
        console.log('🔄 [Auth] Setting up authentication state...');
        
        // Extract user and token from the nested response structure
        const { user, token } = response.data;
        this.setAuth({ user, token });
        
        return response;
      } catch (err) {
        console.error('❌ [Auth] Registration failed', { 
          error: err,
          status: err.statusCode,
          message: err.data?.message || err.message 
        });
        
        this.error = err.data?.message || 'Registration failed';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    async signOut() {
      this.isLoading = true;

      try {
        const config = useRuntimeConfig();
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
          baseURL: config.public.backendUrl,
        });
      } catch (err) {
        console.warn('Logout API call failed:', err);
      } finally {
        this.clearAuth();
        this.isLoading = false;
        await navigateTo('/');
      }
    },

    /**
     * Get current user profile
     * @returns {Promise<object>} User profile data
     */
    async getCurrentUser() {
      if (!this.token) return null;

      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${this.token}` },
          baseURL: config.public.backendUrl,
        });

        this.user = response.data;
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.data));
        }

        return response.data;
      } catch (err) {
        this.error = err.data?.message || 'Failed to get user profile';
        if (err.status === 401) {
          this.clearAuth();
        }
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update user profile
     * @param {object} profileData - Updated profile data
     * @returns {Promise<object>} Updated user profile
     */
    async updateProfile(profileData) {
      if (!this.token) throw new Error('Not authenticated');

      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch('/api/auth/profile', {
          method: 'PUT',
          body: profileData,
          headers: { Authorization: `Bearer ${this.token}` },
          baseURL: config.public.backendUrl,
        });

        this.user = response.data;
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.data));
        }

        return response.data;
      } catch (err) {
        this.error = err.data?.message || 'Failed to update profile';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Change user password
     * @param {object} passwordData - Password change data
     * @returns {Promise<object>} Success response
     */
    async changePassword(passwordData) {
      if (!this.token) throw new Error('Not authenticated');

      this.isLoading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch('/api/auth/change-password', {
          method: 'POST',
          body: passwordData,
          headers: { Authorization: `Bearer ${this.token}` },
          baseURL: config.public.backendUrl,
        });

        return response;
      } catch (err) {
        this.error = err.data?.message || 'Failed to change password';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Check if user has specific role
     * @param {string} role - Role to check
     * @returns {boolean} Whether user has the role
     */
    hasRole(role) {
      return this.user?.role === role;
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    },
  },
});
