/**
 * Composable untuk mengelola detail academy dengan API terintegrasi
 * Digunakan untuk halaman detail academy
 * @param {string} slug - Academy slug
 * @returns {object} Object berisi data dan methods academy detail
 */
export const useAcademyDetails = (slug) => {
  const { $fetch } = useNuxtApp();

  // Reactive state
  const academy = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Computed properties
  const isLoaded = computed(() => !!academy.value);
  const hasError = computed(() => !!error.value);

  /**
   * Fetch academy detail by slug
   * @returns {Promise<object|null>} Academy data
   */
  const fetchAcademy = async () => {
    if (!slug) {
      error.value = 'Slug is required';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/academies/${slug}`, {
        baseURL: config.public.backendUrl,
      });
      academy.value = response.data || response;
      return academy.value;
    } catch (err) {
      console.error('Error fetching academy details:', err);
      error.value = err.data?.message || 'Gagal memuat detail academy';
      academy.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh academy data
   * @returns {Promise<object|null>} Fresh academy data
   */
  const refreshAcademy = async () => {
    return await fetchAcademy();
  };

  /**
   * Get academy pricing tiers
   * @returns {Array} Pricing tiers
   */
  const getPricingTiers = () => {
    return academy.value?.pricing || [];
  };

  /**
   * Get cheapest pricing tier
   * @returns {object|null} Cheapest tier
   */
  const getCheapestTier = () => {
    const tiers = getPricingTiers();
    if (tiers.length === 0) return null;

    return tiers.reduce((cheapest, current) => {
      const currentPrice = current.discount_price || current.original_price;
      const cheapestPrice = cheapest.discount_price || cheapest.original_price;
      return currentPrice < cheapestPrice ? current : cheapest;
    });
  };

  /**
   * Get academy features
   * @returns {Array} Features array
   */
  const getFeatures = () => {
    return academy.value?.features || [];
  };

  /**
   * Get academy topics/curriculum
   * @returns {Array} Topics array
   */
  const getTopics = () => {
    return academy.value?.topic || academy.value?.topics || [];
  };

  /**
   * Get academy instructors
   * @returns {Array} Instructors array
   */
  const getInstructors = () => {
    return academy.value?.instructors || academy.value?.instructor || [];
  };

  /**
   * Get academy testimonials
   * @returns {Array} Testimonials array
   */
  const getTestimonials = () => {
    return academy.value?.testimonials || [];
  };

  /**
   * Get academy FAQ
   * @returns {Array} FAQ array
   */
  const getFAQ = () => {
    return academy.value?.faq || [];
  };

  /**
   * Get total session count
   * @returns {number} Total sessions
   */
  const getTotalSessions = () => {
    const topics = getTopics();
    return topics.reduce((total, topic) => {
      return total + (topic.session?.length || 0);
    }, 0);
  };

  /**
   * Calculate discount percentage for a tier
   * @param {object} tier - Pricing tier
   * @returns {number} Discount percentage
   */
  const calculateDiscount = (tier) => {
    if (!tier.original_price || !tier.discount_price) return 0;
    if (tier.original_price <= tier.discount_price) return 0;

    return Math.round(((tier.original_price - tier.discount_price) / tier.original_price) * 100);
  };

  /**
   * Check if academy is enrollable
   * @returns {boolean} Whether academy can be enrolled
   */
  const isEnrollable = () => {
    if (!academy.value) return false;

    // Check if academy is active
    if (academy.value.status && academy.value.status !== 'ACTIVE') return false;

    // Check enrollment deadline if exists
    if (academy.value.enrollment_deadline) {
      const deadline = new Date(academy.value.enrollment_deadline);
      const now = new Date();
      if (now > deadline) return false;
    }

    return true;
  };

  /**
   * Get academy duration in readable format
   * @returns {string} Formatted duration
   */
  const getFormattedDuration = () => {
    if (!academy.value?.duration) return '';

    // If duration is already formatted, return as is
    if (typeof academy.value.duration === 'string' && isNaN(academy.value.duration)) {
      return academy.value.duration;
    }

    // Convert number to readable format
    const weeks = parseInt(academy.value.duration);
    if (weeks === 1) return '1 minggu';
    if (weeks < 4) return `${weeks} minggu`;

    const months = Math.round(weeks / 4);
    if (months === 1) return '1 bulan';

    return `${months} bulan`;
  };

  // Auto-fetch when slug changes
  watch(
    () => slug,
    async (newSlug) => {
      if (newSlug) {
        await fetchAcademy();
      }
    },
    { immediate: true }
  );

  return {
    // Reactive state
    academy: readonly(academy),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isLoaded,
    hasError,

    // Methods
    fetchAcademy,
    refreshAcademy,

    // Data getters
    getPricingTiers,
    getCheapestTier,
    getFeatures,
    getTopics,
    getInstructors,
    getTestimonials,
    getFAQ,
    getTotalSessions,

    // Utility methods
    calculateDiscount,
    isEnrollable,
    getFormattedDuration,
  };
};
