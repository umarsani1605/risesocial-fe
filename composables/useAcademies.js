import { formatPrice } from '~/utils/formatting';

/**
 * Composable untuk mengelola data academy dengan API terintegrasi
 * @returns {object} Object berisi data dan methods academy
 */
export const useAcademies = () => {
  const academiesData = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const { $api } = useNuxtApp();

  /**
   * Fetch academies data dari backend API
   * @returns {Promise<Array>} Array academies data
   */
  const fetchAcademies = async () => {
    if (isLoading.value) return academiesData.value;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $api('/academies');
      const transformedData = response.data || response;
      academiesData.value = transformedData;
      return academiesData.value;
    } catch (err) {
      console.error('Error fetching academies:', err);
      error.value = err.data?.message || 'Gagal memuat data academy';
      academiesData.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Initialize academies data jika belum ada
   * @returns {Promise<Array>} Array academies data
   */
  const initializeAcademies = async () => {
    if (academiesData.value.length === 0) {
      return await fetchAcademies();
    }
    return academiesData.value;
  };

  /**
   * Find academy by slug
   * @param {string} pathSlug - Academy slug
   * @returns {Promise<object|null>} Academy data atau null
   */
  const findAcademyBySlug = async (pathSlug) => {
    if (!pathSlug) return null;

    try {
      const response = await $api(`/academies/${pathSlug}`);
      return response.data || response;
    } catch (err) {
      console.error('Error finding academy by slug:', err);
      error.value = err.data?.message || 'Academy tidak ditemukan';
      return null;
    }
  };

  /**
   * Get pricing tier by ID
   * @param {object} academy - Academy object
   * @param {number} tierId - Tier ID
   * @returns {object|null} Pricing tier atau null
   */
  const getPricingTier = (academy, tierId) => {
    if (!academy?.pricing || !Array.isArray(academy.pricing)) return null;
    return academy.pricing.find((tier) => tier.id === tierId) || null;
  };

  /**
   * Get cheapest pricing tier
   * @param {object} academy - Academy object
   * @returns {object|null} Cheapest pricing tier
   */
  const getCheapestTier = (academy) => {
    if (!academy?.pricing || !Array.isArray(academy.pricing)) return null;

    return academy.pricing.reduce((cheapest, current) => {
      const currentPrice = current.discount_price || current.current_price || current.original_price;
      const cheapestPrice = cheapest.discount_price || cheapest.current_price || cheapest.original_price;

      return currentPrice < cheapestPrice ? current : cheapest;
    }, academy.pricing[0]);
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
   * Get academy features
   * @param {object} academy - Academy object
   * @returns {array} Array features academy
   */
  const getAcademyFeatures = (academy) => {
    if (!academy?.features) return [];

    // Handle both old format (array of strings) and new format (array of objects)
    if (Array.isArray(academy.features) && academy.features.length > 0) {
      if (typeof academy.features[0] === 'object') {
        return academy.features;
      } else {
        // Convert string array to object array
        return academy.features.map((feature, index) => ({
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
   * Get academy topics/curriculum
   * @param {object} academy - Academy object
   * @returns {array} Array topics academy
   */
  const getAcademyTopics = (academy) => {
    return academy?.topic || academy?.topics || [];
  };

  /**
   * Get topic by ID
   * @param {object} academy - Academy object
   * @param {number} topicId - Topic ID
   * @returns {object|null} Topic object atau null
   */
  const getTopicById = (academy, topicId) => {
    const topics = getAcademyTopics(academy);
    return topics.find((topic) => topic.id === topicId) || null;
  };

  /**
   * Get total session count
   * @param {object} academy - Academy object
   * @returns {number} Total session count
   */
  const getTotalSessionCount = (academy) => {
    const topics = getAcademyTopics(academy);
    return topics.reduce((total, topic) => {
      return total + (topic.session?.length || 0);
    }, 0);
  };

  /**
   * Get academies by level
   * @param {string} level - Level filter
   * @returns {Promise<Array>} Filtered academies
   */
  const getAcademiesByLevel = async (level) => {
    const academies = await initializeAcademies();
    if (!level || level === 'all') return academies;

    return academies.filter((academy) => academy.level?.toLowerCase() === level.toLowerCase());
  };

  /**
   * Get popular academies
   * @param {number} minRating - Minimum rating
   * @returns {Promise<Array>} Popular academies
   */
  const getPopularAcademies = async (minRating = 4.5) => {
    const academies = await initializeAcademies();
    return academies.filter((academy) => academy.rating >= minRating);
  };

  /**
   * Refresh academies data
   * @returns {Promise<Array>} Fresh academies data
   */
  const refreshAcademies = async () => {
    academiesData.value = [];
    return await fetchAcademies();
  };

  // Return reactive data dan methods
  return {
    // Reactive state
    academiesData: readonly(academiesData),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchAcademies,
    initializeAcademies,
    findAcademyBySlug,
    getPricingTier,
    getCheapestTier,
    calculateDiscountPercentage,
    getAcademyFeatures,
    getAcademyTopics,
    getTopicById,
    getTotalSessionCount,
    getAcademiesByLevel,
    getPopularAcademies,
    refreshAcademies,

    // Utility methods
    formatPrice,
  };
};
