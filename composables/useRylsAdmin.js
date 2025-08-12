import { ref, readonly } from 'vue';
import { api } from '@/utils/api';

/**
 * RYLS Admin Composable
 * Handles API calls for RYLS registration management
 * Pattern: mirip useAdminJobs.js dengan api utils
 */
export const useRylsAdmin = () => {
  // Reactive state
  const registrations = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetch all registrations with pagination and filters
   * @param {Object} params - Query options
   * @returns {Promise<Array>} registrations array
   */
  const fetchRegistrations = async (params = {}) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get('/api/ryls/registrations', {
        query: {
          ...(params.page ? { page: String(params.page) } : {}),
          ...(params.limit ? { limit: String(params.limit) } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.scholarshipType ? { scholarshipType: params.scholarshipType } : {}),
          ...(params.sortBy ? { sortBy: params.sortBy } : {}),
          ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
        },
      });
      registrations.value = (response?.data?.registrations || []).map((reg) => ({
        ...reg,
        applicationInfo: {
          ...reg.applicationInfo,
          status: reg.applicationInfo?.status,
        },
      }));
      return {
        registrations: registrations.value,
        pagination: response?.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    } catch (e) {
      error.value = e?.message || 'Failed to fetch registrations';
      registrations.value = [];
      return {
        registrations: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get registration by ID
   * @param {number|string} id - Registration ID
   * @returns {Promise<Object>} Registration data
   */
  const getRegistrationById = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/api/registrations/${id}`);
      return response?.data || response;
    } catch (e) {
      error.value = e?.message || 'Failed to fetch registration';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get registration statistics
   * @returns {Promise<Object>} Statistics data
   */
  const getRegistrationStats = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get('/api/registrations/stats');
      return response?.data || response;
    } catch (e) {
      error.value = e?.message || 'Failed to fetch statistics';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update registration status
   * @param {number|string} id - Registration ID
   * @param {string} status - New status (PENDING, APPROVED, REJECTED)
   * @returns {Promise<Object>} Updated registration
   */
  const updateRegistrationStatus = async (id, status) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/api/registrations/${id}/status`, { status });
      return response?.data || response;
    } catch (e) {
      error.value = e?.message || 'Failed to update status';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Delete registration by ID
   * @param {number|string} id - Registration ID
   * @returns {Promise<void>}
   */
  const deleteRegistration = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await api.delete(`/api/registrations/${id}`);
    } catch (e) {
      error.value = e?.message || 'Failed to delete registration';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Export registrations to CSV
   * @param {Object} filters - Export filters
   * @returns {Promise<Blob>} CSV file blob
   */
  const exportRegistrations = async (filters = {}) => {
    isLoading.value = true;
    error.value = null;
    try {
      const queryParams = {
        ...(filters.status && { status: filters.status }),
        ...(filters.scholarshipType && { scholarshipType: filters.scholarshipType }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const response = await api.get('/api/registrations/export', {
        query: queryParams,
      });

      return response;
    } catch (e) {
      error.value = e?.message || 'Export failed';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Download file by ID
   * @param {number|string} fileId - File ID
   * @returns {Promise<void>}
   */
  const downloadFile = async (fileId) => {
    try {
      console.log('Downloading file with ID:', fileId);

      const response = await api.get(`/api/uploads/${fileId}`);
      const blob = response instanceof Blob ? response : new Blob([response]);
      const filename = `file-${fileId}`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      error.value = e?.message || 'Download failed';
      throw e;
    }
  };

  return {
    // state
    registrations: readonly(registrations),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // methods
    fetchRegistrations,
    getRegistrationById,
    getRegistrationStats,
    updateRegistrationStatus,
    deleteRegistration,
    exportRegistrations,
    downloadFile,
  };
};
