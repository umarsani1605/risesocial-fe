import modulesJson from '~/data/data.json';

/**
 * Composable untuk mengelola data course/module
 * @returns {object} Object berisi data dan methods course/module
 */
export const useCourses = () => {
  // Import data from JSON file
  const { modulesData } = modulesJson;

  /**
   * Mencari module berdasarkan module_slug
   * @param {string} moduleSlug - Slug module
   * @returns {object|undefined} Module object atau undefined jika tidak ditemukan
   */
  const findModuleBySlug = (moduleSlug) => {
    return modulesData.find((module) => module.module_slug === moduleSlug);
  };

  /**
   * Mendapatkan semua modules berdasarkan kategori
   * @param {string} category - Kategori module
   * @returns {Array} Array modules dalam kategori tertentu
   */
  const getModulesByCategory = (category) => {
    return modulesData.filter((module) => module.category === category);
  };

  /**
   * Mendapatkan semua modules yang completed
   * @returns {Array} Array modules yang sudah completed
   */
  const getCompletedModules = () => {
    return modulesData.filter((module) => module.completed);
  };

  /**
   * Mendapatkan semua modules yang belum completed
   * @returns {Array} Array modules yang belum completed
   */
  const getInProgressModules = () => {
    return modulesData.filter((module) => !module.completed);
  };

  /**
   * Mendapatkan semua kategori unique
   * @returns {Array} Array kategori unique
   */
  const getUniqueCategories = () => {
    const categories = [...new Set(modulesData.map((module) => module.category))];
    return categories;
  };

  /**
   * Format harga dalam format Rupiah
   * @param {number} price - Harga dalam angka
   * @returns {string} Harga terformat
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  /**
   * Mendapatkan progress module berdasarkan syllabus completion
   * @param {object} module - Object module
   * @returns {number} Progress percentage (0-100)
   */
  const getModuleProgress = (module) => {
    if (!module.syllabus || module.syllabus.length === 0) return 0;

    const completedSyllabus = module.syllabus.filter((s) => s.completed).length;
    return Math.round((completedSyllabus / module.syllabus.length) * 100);
  };

  /**
   * Mendapatkan jumlah syllabus yang completed vs total
   * @param {object} module - Object module
   * @returns {object} Object dengan completed, total, dan percentage
   */
  const getModuleSyllabusCount = (module) => {
    if (!module.syllabus || module.syllabus.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const completed = module.syllabus.filter((s) => s.completed).length;
    const total = module.syllabus.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  /**
   * Mendapatkan latest/current syllabus yang sedang dipelajari
   * @param {object} module - Object module
   * @returns {object|null} Latest syllabus atau null jika tidak ada
   */
  const getLatestSyllabus = (module) => {
    if (!module.syllabus || module.syllabus.length === 0) return null;

    // Cari syllabus pertama yang belum completed
    const nextSyllabus = module.syllabus.find((s) => !s.completed);

    // Jika semua sudah completed, return syllabus terakhir
    if (!nextSyllabus) {
      return module.syllabus[module.syllabus.length - 1];
    }

    return nextSyllabus;
  };

  /**
   * Mendapatkan module berdasarkan rating minimum
   * @param {number} minRating - Rating minimum
   * @returns {Array} Array modules dengan rating >= minRating
   */
  const getModulesByRating = (minRating = 4.5) => {
    return modulesData.filter((module) => module.rating >= minRating);
  };

  /**
   * Mendapatkan modules yang paling populer berdasarkan rating count
   * @param {number} limit - Jumlah modules yang dikembalikan
   * @returns {Array} Array modules populer
   */
  const getPopularModules = (limit = 10) => {
    return modulesData.sort((a, b) => b.ratingCount - a.ratingCount).slice(0, limit);
  };

  /**
   * Search modules berdasarkan title, name, atau description
   * @param {string} searchTerm - Term pencarian
   * @returns {Array} Array modules yang sesuai dengan pencarian
   */
  const searchModules = (searchTerm) => {
    if (!searchTerm) return modulesData;

    const term = searchTerm.toLowerCase();
    return modulesData.filter(
      (module) =>
        module.title.toLowerCase().includes(term) || module.name.toLowerCase().includes(term) || module.description.toLowerCase().includes(term)
    );
  };

  /**
   * Mendapatkan modules yang direkomendasikan berdasarkan category
   * @param {string} currentModuleSlug - Slug module saat ini
   * @param {number} limit - Jumlah rekomendasi
   * @returns {Array} Array modules rekomendasi
   */
  const getRecommendedModules = (currentModuleSlug, limit = 5) => {
    const currentModule = findModuleBySlug(currentModuleSlug);
    if (!currentModule) return [];

    // Cari modules dalam kategori yang sama, exclude current module
    const sameCategoryModules = modulesData.filter(
      (module) => module.category === currentModule.category && module.module_slug !== currentModuleSlug
    );

    // Sort berdasarkan rating dan ambil limited
    return sameCategoryModules.sort((a, b) => b.rating - a.rating).slice(0, limit);
  };

  /**
   * Mendapatkan label untuk syllabus berdasarkan index
   * @param {object} module - Object module
   * @param {number} index - Index syllabus
   * @returns {string} Label syllabus
   */
  const getSyllabusLabel = (module, index) => {
    return `Materi ${index + 1}`;
  };

  /**
   * Mendapatkan modules yang sedang dipelajari (untuk dashboard)
   * @returns {Array} Array modules yang sedang dipelajari
   */
  const getStudyingModules = () => {
    return modulesData.filter((module) => {
      // Module yang sedang dipelajari adalah yang belum completed tapi sudah dimulai
      // Untuk sementara, kita anggap modules yang ada progress > 0 atau completed = true
      const progress = getModuleProgress(module);
      return progress > 0 || module.completed;
    });
  };

  /**
   * Mendapatkan modules dengan progress berdasarkan percentage
   * @param {number} minProgress - Progress minimum (0-100)
   * @param {number} maxProgress - Progress maximum (0-100)
   * @returns {Array} Array modules dalam range progress
   */
  const getModulesByProgress = (minProgress = 0, maxProgress = 100) => {
    return modulesData.filter((module) => {
      const progress = getModuleProgress(module);
      return progress >= minProgress && progress <= maxProgress;
    });
  };

  /**
   * Mendapatkan modules yang sedang dalam progress (0-99%)
   * @returns {Array} Array modules dalam progress
   */
  const getProgressModules = () => {
    return getModulesByProgress(1, 99);
  };

  /**
   * Mendapatkan modules yang sudah complete (100%)
   * @returns {Array} Array modules yang sudah complete
   */
  const getCompletedModulesProgress = () => {
    return getModulesByProgress(100, 100);
  };

  /**
   * Mendapatkan label untuk module berdasarkan index
   * @param {object} module - Object module
   * @param {number} index - Index module
   * @returns {string} Label module
   */
  const getModuleLabel = (module, index) => {
    return `Modul ${index + 1}`;
  };

  /**
   * Mendapatkan modules terbatas untuk dashboard
   * @param {number} limit - Jumlah modules yang dikembalikan
   * @returns {Array} Array modules terbatas
   */
  const getLimitedModules = (limit = 3) => {
    return getStudyingModules().slice(0, limit);
  };

  /**
   * Compatibility function untuk menggantikan getCourseProgress
   * @param {object} module - Object module
   * @returns {number} Progress percentage
   */
  const getCourseProgress = (module) => {
    return getModuleProgress(module);
  };

  /**
   * Compatibility function untuk menggantikan getCourseModulesCount
   * @param {object} module - Object module
   * @returns {object} Object dengan completed, total, dan percentage
   */
  const getCourseModulesCount = (module) => {
    return getModuleSyllabusCount(module);
  };

  /**
   * Compatibility function untuk menggantikan getLatestModule
   * @param {object} module - Object module
   * @returns {object|null} Latest syllabus
   */
  const getLatestModule = (module) => {
    return getLatestSyllabus(module);
  };

  return {
    // Data (new structure)
    coursesData: modulesData, // Main data is now courses/modules
    modulesData, // Keep for any specific module references

    // Core functions (updated naming)
    findCourseBySlug: findModuleBySlug,
    findModuleBySlug,
    getCoursesByCategory: getModulesByCategory,
    getModulesByCategory,
    getCompletedCourses: getCompletedModules,
    getCompletedModules,
    getInProgressCourses: getInProgressModules,
    getInProgressModules,
    getUniqueCategories,

    // Progress & Analytics
    getCourseProgress: getModuleProgress,
    getModuleProgress,
    getCourseModulesCount: getModuleSyllabusCount,
    getModuleSyllabusCount,
    getLatestModule: getLatestSyllabus,
    getLatestSyllabus,
    getSyllabusLabel,
    getStudyingCourses: getStudyingModules,
    getStudyingModules,
    getCoursesByProgress: getModulesByProgress,
    getModulesByProgress,
    getProgressCourses: getProgressModules,
    getProgressModules,
    getCompletedCoursesProgress: getCompletedModulesProgress,
    getCompletedModulesProgress,
    getModuleLabel,
    getLimitedCourses: getLimitedModules,
    getLimitedModules,

    // Search & Filter
    searchCourses: searchModules,
    searchModules,
    getCoursesByRating: getModulesByRating,
    getModulesByRating,
    getPopularCourses: getPopularModules,
    getPopularModules,
    getRecommendedCourses: getRecommendedModules,
    getRecommendedModules,

    // Utility
    formatPrice,
  };
};
