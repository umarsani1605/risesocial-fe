
import { formatPrice, formatDate } from '~/utils/formatting';

/**
 * Composable untuk mengelola detail program dengan API terintegrasi
 * Digunakan untuk halaman detail program
 * @param {string} slug - Program slug
 * @returns {object} Object berisi data dan methods program detail
 */
export const useProgramDetails = (slug) => {
  const { $fetch } = useNuxtApp()
  
  // Reactive state
  const program = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const userProgress = ref(null);

  // Computed properties
  const isLoaded = computed(() => !!program.value);
  const hasError = computed(() => !!error.value);

  /**
   * Fetch program detail by slug
   * @returns {Promise<object|null>} Program data
   */
  const fetchProgram = async () => {
    if (!slug) {
      error.value = 'Slug is required';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/programs/${slug}`, {
        baseURL: config.public.backendUrl
      });
      program.value = response.data || response;
      return program.value;
    } catch (err) {
      console.error('Error fetching program details:', err);
      error.value = err.data?.message || 'Gagal memuat detail program';
      program.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch program progress
   * @returns {Promise<object|null>} Progress data
   */
  const fetchProgress = async () => {
    if (!program.value?.id) return null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/programs/${program.value.id}/progress`, {
        baseURL: config.public.backendUrl
      });
      const progress = response.data || response;
      userProgress.value = progress;
      return progress;
    } catch (err) {
      console.error('Error fetching program progress:', err);
      return null;
    }
  };

  /**
   * Enroll to program
   * @param {object} enrollmentData - Enrollment data
   * @returns {Promise<object|null>} Enrollment result
   */
  const enrollToProgram = async (enrollmentData) => {
    if (!program.value?.id) {
      error.value = 'Program not loaded';
      return null;
    }

    try {
      const response = await $fetch(`/api/programs/${program.value.id}/enroll`, {
        method: 'POST',
        body: enrollmentData
      });
      const result = response.data || response;
      return result;
    } catch (err) {
      console.error('Error enrolling to program:', err);
      error.value = err.data?.message || 'Gagal mendaftar program';
      return null;
    }
  };

  /**
   * Update program progress
   * @param {object} progressData - Progress data
   * @returns {Promise<object|null>} Updated progress
   */
  const updateProgress = async (progressData) => {
    if (!program.value?.id) {
      error.value = 'Program not loaded';
      return null;
    }

    try {
      const response = await $fetch(`/api/programs/${program.value.id}/progress`, {
        method: 'PUT',
        body: progressData
      });
      const result = response.data || response;
      userProgress.value = result;
      return result;
    } catch (err) {
      console.error('Error updating program progress:', err);
      error.value = err.data?.message || 'Gagal update progress';
      return null;
    }
  };

  /**
   * Refresh program data
   * @returns {Promise<object|null>} Fresh program data
   */
  const refreshProgram = async () => {
    const result = await fetchProgram();
    if (result) {
      await fetchProgress();
    }
    return result;
  };

  /**
   * Get program modules/courses
   * @returns {Array} Modules array
   */
  const getModules = () => {
    return program.value?.modules || program.value?.courses || [];
  };

  /**
   * Get program features
   * @returns {Array} Features array
   */
  const getFeatures = () => {
    return program.value?.features || [];
  };

  /**
   * Get program instructors
   * @returns {Array} Instructors array
   */
  const getInstructors = () => {
    return program.value?.instructors || [];
  };

  /**
   * Get program testimonials
   * @returns {Array} Testimonials array
   */
  const getTestimonials = () => {
    return program.value?.testimonials || [];
  };

  /**
   * Get program FAQ
   * @returns {Array} FAQ array
   */
  const getFAQ = () => {
    return program.value?.faq || [];
  };

  /**
   * Get program pricing information
   * @returns {object} Pricing info
   */
  const getPricing = () => {
    if (!program.value) return { price: 0, originalPrice: 0, hasDiscount: false, discountPercentage: 0 };

    const price = program.value.discountPrice || program.value.price || 0;
    const originalPrice = program.value.originalPrice || program.value.price || 0;
    const hasDiscount = originalPrice > price;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return {
      price,
      originalPrice,
      hasDiscount,
      discountPercentage,
      formattedPrice: formatPrice(price),
      formattedOriginalPrice: formatPrice(originalPrice),
    };
  };

  /**
   * Get program duration in readable format
   * @returns {string} Formatted duration
   */
  const getFormattedDuration = () => {
    if (!program.value?.duration) return '';

    // If duration is already formatted, return as is
    if (typeof program.value.duration === 'string' && isNaN(program.value.duration)) {
      return program.value.duration;
    }

    // Convert number to readable format
    const weeks = parseInt(program.value.duration);
    if (weeks === 1) return '1 minggu';
    if (weeks < 4) return `${weeks} minggu`;

    const months = Math.round(weeks / 4);
    if (months === 1) return '1 bulan';

    return `${months} bulan`;
  };

  /**
   * Get program dates
   * @returns {object} Program dates
   */
  const getProgramDates = () => {
    if (!program.value) return {};

    return {
      startDate: program.value.startDate ? formatDate(program.value.startDate) : '',
      endDate: program.value.endDate ? formatDate(program.value.endDate) : '',
      enrollmentDeadline: program.value.enrollmentDeadline ? formatDate(program.value.enrollmentDeadline) : '',
    };
  };

  /**
   * Check if program is enrollable
   * @returns {boolean} Whether program can be enrolled
   */
  const isEnrollable = () => {
    if (!program.value) return false;

    // Check if program is active
    if (!program.value.isActive) return false;

    // Check enrollment deadline
    if (program.value.enrollmentDeadline) {
      const deadline = new Date(program.value.enrollmentDeadline);
      const now = new Date();
      if (now > deadline) return false;
    }

    return true;
  };

  /**
   * Check if program is featured
   * @returns {boolean} Whether program is featured
   */
  const isFeatured = () => {
    return program.value?.isFeatured || false;
  };

  /**
   * Get completion percentage
   * @returns {number} Completion percentage
   */
  const getCompletionPercentage = () => {
    if (!program.value || !userProgress.value) return 0;

    const totalModules = getModules().length;
    const completedModules = userProgress.value.completedModules || 0;

    if (totalModules === 0) return 0;

    return Math.round((completedModules / totalModules) * 100);
  };

  /**
   * Get next module to complete
   * @returns {object|null} Next module
   */
  const getNextModule = () => {
    if (!program.value || !userProgress.value) return null;

    const modules = getModules();
    const completedModules = userProgress.value.completedModules || 0;

    return modules[completedModules] || null;
  };

  /**
   * Check if module is completed
   * @param {number} moduleIndex - Module index
   * @returns {boolean} Whether module is completed
   */
  const isModuleCompleted = (moduleIndex) => {
    if (!userProgress.value) return false;

    const completedModules = userProgress.value.completedModules || 0;
    return moduleIndex < completedModules;
  };

  /**
   * Check if module is locked
   * @param {number} moduleIndex - Module index
   * @returns {boolean} Whether module is locked
   */
  const isModuleLocked = (moduleIndex) => {
    if (!userProgress.value) return moduleIndex > 0;

    const completedModules = userProgress.value.completedModules || 0;
    return moduleIndex > completedModules;
  };

  /**
   * Get program stats
   * @returns {object} Program statistics
   */
  const getProgramStats = () => {
    if (!program.value) return {};

    return {
      rating: program.value.rating || 0,
      ratingCount: program.value.ratingCount || 0,
      studentsCount: program.value.studentsCount || 0,
      modulesCount: getModules().length,
      level: program.value.level || 'Beginner',
      format: program.value.format || 'Online',
      language: program.value.language || 'Bahasa Indonesia',
    };
  };

  // Auto-fetch when slug changes
  watch(
    () => slug,
    async (newSlug) => {
      if (newSlug) {
        await fetchProgram();
        await fetchProgress();
      }
    },
    { immediate: true }
  );

  return {
    // Reactive state
    program: readonly(program),
    userProgress: readonly(userProgress),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isLoaded,
    hasError,

    // Methods
    fetchProgram,
    fetchProgress,
    enrollToProgram,
    updateProgress,
    refreshProgram,

    // Data getters
    getModules,
    getFeatures,
    getInstructors,
    getTestimonials,
    getFAQ,
    getPricing,
    getProgramDates,
    getProgramStats,

    // Progress methods
    getCompletionPercentage,
    getNextModule,
    isModuleCompleted,
    isModuleLocked,

    // Utility methods
    getFormattedDuration,
    isEnrollable,
    isFeatured,
  };
};
