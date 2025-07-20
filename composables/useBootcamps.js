import { formatPrice } from '~/utils/formatting';

/**
 * Composable untuk mengelola data bootcamp dengan API terintegrasi
 * @returns {object} Object berisi data dan methods bootcamp
 */
export const useBootcamps = () => {
  // Reactive state untuk bootcamps data
  const bootcampsData = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Fetch bootcamps data dari backend API
   * @returns {Promise<Array>} Array bootcamps data
   */
  const fetchBootcamps = async () => {
    if (isLoading.value) return bootcampsData.value;

    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch('/api/bootcamps', {
        baseURL: config.public.backendUrl,
      });
      const transformedData = response.data || response;
      bootcampsData.value = transformedData;
      return bootcampsData.value;
    } catch (err) {
      console.error('Error fetching bootcamps:', err);
      error.value = err.data?.message || 'Gagal memuat data bootcamp';
      bootcampsData.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Initialize bootcamps data jika belum ada
   * @returns {Promise<Array>} Array bootcamps data
   */
  const initializeBootcamps = async () => {
    if (bootcampsData.value.length === 0) {
      return await fetchBootcamps();
    }
    return bootcampsData.value;
  };

  /**
   * Find bootcamp by slug
   * @param {string} pathSlug - Bootcamp slug
   * @returns {Promise<object|null>} Bootcamp data atau null
   */
  const findBootcampBySlug = async (pathSlug) => {
    if (!pathSlug) return null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/bootcamps/${pathSlug}`, {
        baseURL: config.public.backendUrl,
      });
      return response.data || response;
    } catch (err) {
      console.error('Error finding bootcamp by slug:', err);
      error.value = err.data?.message || 'Bootcamp tidak ditemukan';
      return null;
    }
  };

  /**
   * Get pricing tier by ID
   * @param {object} bootcamp - Bootcamp object
   * @param {number} tierId - Tier ID
   * @returns {object|null} Pricing tier atau null
   */
  const getPricingTier = (bootcamp, tierId) => {
    if (!bootcamp?.pricing || !Array.isArray(bootcamp.pricing)) return null;
    return bootcamp.pricing.find((tier) => tier.id === tierId) || null;
  };

  /**
   * Get cheapest pricing tier
   * @param {object} bootcamp - Bootcamp object
   * @returns {object|null} Cheapest pricing tier
   */
  const getCheapestTier = (bootcamp) => {
    if (!bootcamp?.pricing || !Array.isArray(bootcamp.pricing)) return null;

    return bootcamp.pricing.reduce((cheapest, current) => {
      const currentPrice = current.discount_price || current.current_price || current.original_price;
      const cheapestPrice = cheapest.discount_price || cheapest.current_price || cheapest.original_price;

      return currentPrice < cheapestPrice ? current : cheapest;
    }, bootcamp.pricing[0]);
  };

  /**
   * Calculate discount percentage
   * @param {number} originalPrice - Original price
   * @param {number} currentPrice - Current price
   * @returns {number} Discount percentage
   */
  const calculateDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  /**
   * Get bootcamp features
   * @param {object} bootcamp - Bootcamp object
   * @returns {array} Array features bootcamp
   */
  const getBootcampFeatures = (bootcamp) => {
    if (!bootcamp?.features) return [];

    // Handle both old format (array of strings) and new format (array of objects)
    if (Array.isArray(bootcamp.features) && bootcamp.features.length > 0) {
      if (typeof bootcamp.features[0] === 'object') {
        return bootcamp.features;
      } else {
        // Convert string array to object array
        return bootcamp.features.map((feature, index) => ({
          id: index + 1,
          title: feature,
          description: feature,
          icon: 'heroicons:check-circle',
        }));
      }
    }

    return [];
  };

  /**
   * Get bootcamp topics/curriculum
   * @param {object} bootcamp - Bootcamp object
   * @returns {array} Array topics bootcamp
   */
  const getBootcampTopics = (bootcamp) => {
    return bootcamp?.topic || bootcamp?.topics || [];
  };

  /**
   * Get topic by ID
   * @param {object} bootcamp - Bootcamp object
   * @param {number} topicId - Topic ID
   * @returns {object|null} Topic object atau null
   */
  const getTopicById = (bootcamp, topicId) => {
    const topics = getBootcampTopics(bootcamp);
    return topics.find((topic) => topic.id === topicId) || null;
  };

  /**
   * Get total session count
   * @param {object} bootcamp - Bootcamp object
   * @returns {number} Total session count
   */
  const getTotalSessionCount = (bootcamp) => {
    const topics = getBootcampTopics(bootcamp);
    return topics.reduce((total, topic) => {
      return total + (topic.session?.length || 0);
    }, 0);
  };

  /**
   * Get bootcamps by level
   * @param {string} level - Level filter
   * @returns {Promise<Array>} Filtered bootcamps
   */
  const getBootcampsByLevel = async (level) => {
    const bootcamps = await initializeBootcamps();
    if (!level || level === 'all') return bootcamps;

    return bootcamps.filter((bootcamp) => bootcamp.level?.toLowerCase() === level.toLowerCase());
  };

  /**
   * Get popular bootcamps
   * @param {number} minRating - Minimum rating
   * @returns {Promise<Array>} Popular bootcamps
   */
  const getPopularBootcamps = async (minRating = 4.5) => {
    const bootcamps = await initializeBootcamps();
    return bootcamps.filter((bootcamp) => bootcamp.rating >= minRating);
  };

  /**
   * Refresh bootcamps data
   * @returns {Promise<Array>} Fresh bootcamps data
   */
  const refreshBootcamps = async () => {
    bootcampsData.value = [];
    return await fetchBootcamps();
  };

  // Return reactive data dan methods
  return {
    // Reactive state
    bootcampsData: readonly(bootcampsData),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchBootcamps,
    initializeBootcamps,
    findBootcampBySlug,
    getPricingTier,
    getCheapestTier,
    calculateDiscountPercentage,
    getBootcampFeatures,
    getBootcampTopics,
    getTopicById,
    getTotalSessionCount,
    getBootcampsByLevel,
    getPopularBootcamps,
    refreshBootcamps,

    // Utility methods
    formatPrice,
  };
};
