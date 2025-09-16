import { formatPrice, formatDate } from '~/utils/formatting';

/**
 * Composable untuk mengelola data programs dengan API terintegrasi
 * @returns {object} Object berisi data dan methods programs
 */
export const usePrograms = () => {
  const { $fetch } = useNuxtApp();

  // Reactive state untuk programs data
  const programsData = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetch programs data dari backend API
   * @returns {Promise<Array>} Array programs data
   */
  const fetchPrograms = async () => {
    if (isLoading.value) return programsData.value;

    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch('/api/programs', {
        baseURL: config.public.backendUrl,
      });
      const transformedData = response.data || response;
      programsData.value = transformedData;
      return programsData.value;
    } catch (err) {
      console.error('Error fetching programs:', err);
      error.value = err.data?.message || 'Gagal memuat data programs';
      programsData.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get program by slug
   * @param {string} slug - Program slug
   * @returns {Promise<object|null>} Program data
   */
  const getProgramBySlug = async (slug) => {
    if (!slug) return null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/programs/${slug}`, {
        baseURL: config.public.backendUrl,
      });
      return response.data || response;
    } catch (err) {
      console.error('Error fetching program by slug:', err);
      error.value = err.data?.message || 'Program tidak ditemukan';
      return null;
    }
  };

  /**
   * Get program by ID
   * @param {string} id - Program ID
   * @returns {Promise<object|null>} Program data
   */
  const getProgramById = async (id) => {
    if (!id) return null;

    try {
      const response = await $fetch(`/api/programs/id/${id}`);
      return response.data || response;
    } catch (err) {
      console.error('Error fetching program by ID:', err);
      error.value = err.data?.message || 'Program tidak ditemukan';
      return null;
    }
  };

  /**
   * Search programs
   * @param {string} searchTerm - Search term
   * @param {object} filters - Search filters
   * @returns {Promise<Array>} Search results
   */
  const searchPrograms = async (searchTerm, filters = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = {
        search: searchTerm,
        ...filters,
      };
      const response = await $fetch('/api/programs/search', { params });
      return response.data || response;
    } catch (err) {
      console.error('Error searching programs:', err);
      error.value = err.data?.message || 'Gagal mencari programs';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Enroll to program
   * @param {string} programId - Program ID
   * @param {object} enrollmentData - Enrollment data
   * @returns {Promise<object|null>} Enrollment result
   */
  const enrollToProgram = async (programId, enrollmentData) => {
    try {
      const response = await $fetch(`/api/programs/${programId}/enroll`, {
        method: 'POST',
        body: enrollmentData,
      });
      return response.data || response;
    } catch (err) {
      console.error('Error enrolling to program:', err);
      error.value = err.data?.message || 'Gagal mendaftar program';
      return null;
    }
  };

  /**
   * Get user's enrolled programs
   * @returns {Promise<Array>} User's programs
   */
  const getUserPrograms = async () => {
    try {
      const response = await $fetch('/api/programs/user');
      return response.data || response;
    } catch (err) {
      console.error('Error fetching user programs:', err);
      error.value = err.data?.message || 'Gagal memuat program user';
      return [];
    }
  };

  /**
   * Get program progress
   * @param {string} programId - Program ID
   * @returns {Promise<object|null>} Program progress
   */
  const getProgramProgress = async (programId) => {
    try {
      const response = await $fetch(`/api/programs/${programId}/progress`);
      return response.data || response;
    } catch (err) {
      console.error('Error fetching program progress:', err);
      error.value = err.data?.message || 'Gagal memuat progress program';
      return null;
    }
  };

  /**
   * Update program progress
   * @param {string} programId - Program ID
   * @param {object} progressData - Progress data
   * @returns {Promise<object|null>} Updated progress
   */
  const updateProgramProgress = async (programId, progressData) => {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/programs/${programId}/progress`, {
        method: 'PUT',
        body: progressData,
        baseURL: config.public.backendUrl,
      });
      return response.data || response;
    } catch (err) {
      console.error('Error updating program progress:', err);
      error.value = err.data?.message || 'Gagal update progress program';
      return null;
    }
  };

  /**
   * Filter programs by criteria
   * @param {object} filters - Filter criteria
   * @returns {Array} Filtered programs
   */
  const filterPrograms = (filters) => {
    if (!Array.isArray(programsData.value)) return [];

    let filtered = [...programsData.value];

    // Add basic filtering logic here
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((program) => program.category?.toLowerCase().includes(filters.category.toLowerCase()));
    }

    if (filters.level && filters.level !== 'all') {
      filtered = filtered.filter((program) => program.level?.toLowerCase().includes(filters.level.toLowerCase()));
    }

    if (filters.price && filters.price !== 'all') {
      if (filters.price === 'free') {
        filtered = filtered.filter((program) => !program.price || program.price === 0);
      } else if (filters.price === 'paid') {
        filtered = filtered.filter((program) => program.price && program.price > 0);
      }
    }

    return filtered;
  };

  /**
   * Get programs by category
   * @param {string} category - Category filter
   * @returns {Array} Filtered programs
   */
  const getProgramsByCategory = (category) => {
    if (!category || category === 'all') return programsData.value;

    return programsData.value.filter((program) => program.category?.toLowerCase() === category.toLowerCase());
  };

  /**
   * Get programs by level
   * @param {string} level - Level filter
   * @returns {Array} Filtered programs
   */
  const getProgramsByLevel = (level) => {
    if (!level || level === 'all') return programsData.value;

    return programsData.value.filter((program) => program.level?.toLowerCase() === level.toLowerCase());
  };

  /**
   * Get featured programs
   * @returns {Array} Featured programs
   */
  const getFeaturedPrograms = () => {
    return programsData.value.filter((program) => program.isFeatured);
  };

  /**
   * Get popular programs
   * @param {number} minRating - Minimum rating
   * @returns {Array} Popular programs
   */
  const getPopularPrograms = (minRating = 4.5) => {
    return programsData.value.filter((program) => program.rating >= minRating);
  };

  /**
   * Get program features
   * @param {object} program - Program object
   * @returns {Array} Program features
   */
  const getProgramFeatures = (program) => {
    return program?.features || [];
  };

  /**
   * Get program modules/courses
   * @param {object} program - Program object
   * @returns {Array} Program modules
   */
  const getProgramModules = (program) => {
    return program?.modules || program?.courses || [];
  };

  /**
   * Get program instructors
   * @param {object} program - Program object
   * @returns {Array} Program instructors
   */
  const getProgramInstructors = (program) => {
    return program?.instructors || [];
  };

  /**
   * Calculate program completion percentage
   * @param {object} program - Program object
   * @param {object} progress - Progress object
   * @returns {number} Completion percentage
   */
  const calculateCompletionPercentage = (program, progress) => {
    if (!program || !progress) return 0;

    const totalModules = getProgramModules(program).length;
    const completedModules = progress.completedModules || 0;

    if (totalModules === 0) return 0;

    return Math.round((completedModules / totalModules) * 100);
  };

  /**
   * Get program duration in readable format
   * @param {object} program - Program object
   * @returns {string} Formatted duration
   */
  const getProgramDuration = (program) => {
    if (!program?.duration) return '';

    // If duration is already formatted, return as is
    if (typeof program.duration === 'string' && isNaN(program.duration)) {
      return program.duration;
    }

    // Convert number to readable format
    const weeks = parseInt(program.duration);
    if (weeks === 1) return '1 week';
    if (weeks < 4) return `${weeks} weeks`;

    const months = Math.round(weeks / 4);
    if (months === 1) return '1 month';

    return `${months} months`;
  };

  /**
   * Check if program is enrollable
   * @param {object} program - Program object
   * @returns {boolean} Whether program can be enrolled
   */
  const isProgramEnrollable = (program) => {
    if (!program) return false;

    // Check if program is active
    if (!program.isActive) return false;

    // Check enrollment deadline
    if (program.enrollmentDeadline) {
      const deadline = new Date(program.enrollmentDeadline);
      const now = new Date();
      if (now > deadline) return false;
    }

    return true;
  };

  /**
   * Get program price with discount
   * @param {object} program - Program object
   * @returns {object} Price information
   */
  const getProgramPricing = (program) => {
    if (!program) return { price: 0, originalPrice: 0, hasDiscount: false, discountPercentage: 0 };

    const price = program.discountPrice || program.price || 0;
    const originalPrice = program.originalPrice || program.price || 0;
    const hasDiscount = originalPrice > price;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return {
      price,
      originalPrice,
      hasDiscount,
      discountPercentage,
    };
  };

  /**
   * Initialize programs data jika belum ada
   * @returns {Promise<Array>} Array programs data
   */
  const initializePrograms = async () => {
    if (programsData.value.length === 0) {
      return await fetchPrograms();
    }
    return programsData.value;
  };

  /**
   * Refresh programs data
   * @returns {Promise<Array>} Fresh programs data
   */
  const refreshPrograms = async () => {
    programsData.value = [];
    return await fetchPrograms();
  };

  // Return reactive data dan methods
  return {
    // Reactive state
    programsData: readonly(programsData),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchPrograms,
    getProgramBySlug,
    getProgramById,
    searchPrograms,
    initializePrograms,
    refreshPrograms,

    // Enrollment methods
    enrollToProgram,
    getUserPrograms,
    getProgramProgress,
    updateProgramProgress,

    // Filter methods
    filterPrograms,
    getProgramsByCategory,
    getProgramsByLevel,
    getFeaturedPrograms,
    getPopularPrograms,

    // Utility methods
    getProgramFeatures,
    getProgramModules,
    getProgramInstructors,
    calculateCompletionPercentage,
    getProgramDuration,
    isProgramEnrollable,
    getProgramPricing,

    // Formatting utilities
    formatPrice,
    formatDate,
  };
};
