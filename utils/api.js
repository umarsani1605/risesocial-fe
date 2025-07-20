/**
 * Simple API client untuk Rise Social
 * Handles HTTP requests dengan error handling dan token management
 */

let authToken = null;

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
const setAuthToken = (token) => {
  authToken = token;
};

/**
 * Clear authentication token
 */
const clearAuthToken = () => {
  authToken = null;
};

/**
 * Get default headers dengan auth token jika ada
 * @returns {object} Headers object
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * Handle API errors dengan consistent error messages
 * @param {object} error - Error object dari $fetch
 * @throws {Error} Formatted error message
 */
const handleError = (error) => {
  console.error('API Error:', error);

  if (error.status === 401) {
    clearAuthToken();
    navigateTo('/login');
    throw new Error('Session expired. Please login again.');
  }

  if (error.status === 403) {
    throw new Error('Access denied.');
  }

  if (error.status === 404) {
    throw new Error('Resource not found.');
  }

  if (error.status >= 500) {
    throw new Error('Server error. Please try again later.');
  }

  throw new Error(error.message || 'Network error occurred.');
};

/**
 * Base API request function
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @returns {Promise} API response
 */
const request = async (endpoint, options = {}) => {
  const config = useRuntimeConfig();
  const url = `${config.public.backendUrl}${endpoint}`;

  try {
    const response = await $fetch(url, {
      headers: getHeaders(),
      ...options,
    });

    return response;
  } catch (error) {
    handleError(error);
  }
};

/**
 * API object dengan HTTP methods
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options
   * @returns {Promise} API response
   */
  get: (endpoint, options = {}) => {
    return request(endpoint, { method: 'GET', ...options });
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} options - Request options
   * @returns {Promise} API response
   */
  post: (endpoint, data, options = {}) => {
    return request(endpoint, {
      method: 'POST',
      body: data,
      ...options,
    });
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} options - Request options
   * @returns {Promise} API response
   */
  put: (endpoint, data, options = {}) => {
    return request(endpoint, {
      method: 'PUT',
      body: data,
      ...options,
    });
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options
   * @returns {Promise} API response
   */
  delete: (endpoint, options = {}) => {
    return request(endpoint, { method: 'DELETE', ...options });
  },

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken,

  /**
   * Clear authentication token
   */
  clearAuthToken,
};
