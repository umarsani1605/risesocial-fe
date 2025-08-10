import { api } from '@/utils/api';

/**
 * Admin Jobs Composable (camelCase only)
 * Kebutuhan: CRUD jobs untuk halaman admin.
 * Catatan: Backend menerima camelCase penuh, tidak perlu mapping tambahan.
 */
export const useAdminJobs = () => {
  // Reactive state
  const jobs = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetch jobs list (tanpa pagination meta dari backend)
   * @param {Object} params - optional filters/sort (camelCase)
   * @returns {Promise<Array>} jobs array
   */
  const fetchJobs = async (params = {}) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get('/api/jobs', {
        query: {
          ...(params.search ? { search: params.search } : {}),
          ...(params.location ? { location: params.location } : {}),
          ...(params.jobType ? { jobType: params.jobType } : {}),
          ...(params.experienceLevel ? { experienceLevel: params.experienceLevel } : {}),
          ...(params.minSalary ? { minSalary: String(params.minSalary) } : {}),
          ...(params.maxSalary ? { maxSalary: String(params.maxSalary) } : {}),
          ...(params.isRemote !== undefined ? { isRemote: String(params.isRemote) } : {}),
          ...(params.companyName ? { companyName: params.companyName } : {}),
          ...(params.skills?.length ? { skills: params.skills.join(',') } : {}),
          ...(params.sortBy ? { sortBy: params.sortBy } : {}),
          ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
        },
      });
      jobs.value = Array.isArray(response?.data) ? response.data : [];
      return jobs.value;
    } catch (e) {
      error.value = e?.message || 'Gagal memuat jobs';
      jobs.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create job
   * @param {Object} payload - camelCase job payload
   * @returns {Promise<Object>} created job
   */
  const createJob = async (payload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post('/api/jobs', payload);
      return response?.data || response;
    } catch (e) {
      error.value = e?.message || 'Gagal membuat job';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update job by ID
   * @param {number|string} id - job id
   * @param {Object} payload - camelCase job payload (partial)
   * @returns {Promise<Object>} updated job
   */
  const updateJob = async (id, payload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.put(`/api/jobs/${id}`, payload);
      return response?.data || response;
    } catch (e) {
      error.value = e?.message || 'Gagal memperbarui job';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Delete job by ID
   * @param {number|string} id - job id
   * @returns {Promise<void>}
   */
  const deleteJob = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await api.delete(`/api/jobs/${id}`);
    } catch (e) {
      error.value = e?.message || 'Gagal menghapus job';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // state
    jobs: readonly(jobs),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // methods
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
  };
};
