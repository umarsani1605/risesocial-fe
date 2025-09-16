/**
 * Composable untuk mengelola detail bootcamp dengan API terintegrasi
 * Digunakan untuk halaman detail bootcamp
 * @param {string} slug - Bootcamp slug
 * @returns {object} Object berisi data dan methods bootcamp detail
 */
export const useBootcampDetails = (slug) => {
  const { $fetch } = useNuxtApp();

  // Reactive state
  const bootcamp = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Computed properties
  const isLoaded = computed(() => !!bootcamp.value);
  const hasError = computed(() => !!error.value);

  /**
   * Fetch bootcamp detail by slug
   * @returns {Promise<object|null>} Bootcamp data
   */
  const fetchBootcamp = async () => {
    if (!slug) {
      error.value = 'Slug is required';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/bootcamps/${slug}`, {
        baseURL: config.public.backendUrl,
      });
      bootcamp.value = response.data || response;
      return bootcamp.value;
    } catch (err) {
      console.error('Error fetching bootcamp details:', err);
      error.value = err.data?.message || 'Gagal memuat detail bootcamp';
      bootcamp.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh bootcamp data
   * @returns {Promise<object|null>} Fresh bootcamp data
   */
  const refreshBootcamp = async () => {
    return await fetchBootcamp();
  };

  /**
   * Get bootcamp pricing tiers
   * @returns {Array} Pricing tiers
   */
  const getPricingTiers = () => {
    return bootcamp.value?.pricing || [];
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
   * Get bootcamp features
   * @returns {Array} Features array
   */
  const getFeatures = () => {
    return bootcamp.value?.features || [];
  };

  /**
   * Get bootcamp topics/curriculum
   * @returns {Array} Topics array
   */
  const getTopics = () => {
    return bootcamp.value?.topic || bootcamp.value?.topics || [];
  };

  /**
   * Get bootcamp instructors
   * @returns {Array} Instructors array
   */
  const getInstructors = () => {
    return bootcamp.value?.instructors || bootcamp.value?.instructor || [];
  };

  /**
   * Get bootcamp testimonials
   * @returns {Array} Testimonials array
   */
  const getTestimonials = () => {
    return bootcamp.value?.testimonials || [];
  };

  /**
   * Get bootcamp FAQ
   * @returns {Array} FAQ array
   */
  const getFAQ = () => {
    return bootcamp.value?.faq || [];
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
   * Check if bootcamp is enrollable
   * @returns {boolean} Whether bootcamp can be enrolled
   */
  const isEnrollable = () => {
    if (!bootcamp.value) return false;

    // Check if bootcamp is active
    if (bootcamp.value.status && bootcamp.value.status !== 'ACTIVE') return false;

    // Check enrollment deadline if exists
    if (bootcamp.value.enrollment_deadline) {
      const deadline = new Date(bootcamp.value.enrollment_deadline);
      const now = new Date();
      if (now > deadline) return false;
    }

    return true;
  };

  /**
   * Get bootcamp duration in readable format
   * @returns {string} Formatted duration
   */
  const getFormattedDuration = () => {
    if (!bootcamp.value?.duration) return '';

    // If duration is already formatted, return as is
    if (typeof bootcamp.value.duration === 'string' && isNaN(bootcamp.value.duration)) {
      return bootcamp.value.duration;
    }

    // Convert number to readable format
    const weeks = parseInt(bootcamp.value.duration);
    if (weeks === 1) return '1 week';
    if (weeks < 4) return `${weeks} weeks`;

    const months = Math.round(weeks / 4);
    if (months === 1) return '1 month';

    return `${months} months`;
  };

  // Auto-fetch when slug changes
  watch(
    () => slug,
    async (newSlug) => {
      if (newSlug) {
        await fetchBootcamp();
      }
    },
    { immediate: true }
  );

  return {
    // Reactive state
    bootcamp: readonly(bootcamp),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isLoaded,
    hasError,

    // Methods
    fetchBootcamp,
    refreshBootcamp,

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
