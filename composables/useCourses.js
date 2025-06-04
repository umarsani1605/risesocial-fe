import coursesJson from '~/data/data.json';

/**
 * Composable untuk mengelola data course
 * @returns {object} Object berisi data dan methods course
 */
export const useCourses = () => {
  // Import data from JSON file
  const { coursesData } = coursesJson;

  /**
   * Mencari course berdasarkan path_slug
   * @param {string} pathSlug - Slug path course
   * @returns {object|undefined} Course object atau undefined jika tidak ditemukan
   */
  const findCourseBySlug = (pathSlug) => {
    return coursesData.find((course) => course.path_slug === pathSlug);
  };

  /**
   * Mencari module berdasarkan course dan module slug
   * @param {string} courseSlug - Slug course
   * @param {string} moduleSlug - Slug module
   * @returns {object|null} Object berisi course dan module atau null jika tidak ditemukan
   */
  const findModuleBySlug = (courseSlug, moduleSlug) => {
    const course = findCourseBySlug(courseSlug);
    if (!course) return null;

    const module = course.modules.find((m) => m.module_slug === moduleSlug);
    if (!module) return null;

    return { course, module };
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
   * Mendapatkan total durasi course dalam jam
   * @param {object} course - Object course
   * @returns {number} Total durasi dalam jam
   */
  const getTotalCourseDuration = (course) => {
    if (!course.modules) return 0;
    return course.modules.reduce((total, module) => {
      const duration = parseInt(module.duration);
      return total + (isNaN(duration) ? 0 : duration);
    }, 0);
  };

  /**
   * Mendapatkan total material count course
   * @param {object} course - Object course
   * @returns {number} Total material count
   */
  const getTotalMaterialCount = (course) => {
    if (!course.modules) return 0;
    return course.modules.reduce((total, module) => {
      return total + (module.materialCount || 0);
    }, 0);
  };

  /**
   * Mendapatkan rata-rata rating course
   * @param {object} course - Object course
   * @returns {number} Rata-rata rating
   */
  const getAverageRating = (course) => {
    if (!course.modules || course.modules.length === 0) return 0;

    const totalRating = course.modules.reduce((sum, module) => sum + (module.rating || 0), 0);
    return (totalRating / course.modules.length).toFixed(2);
  };

  /**
   * Mendapatkan progress course berdasarkan module yang completed
   * @param {object} course - Object course
   * @returns {number} Persentase progress (0-100)
   */
  const getCourseProgress = (course) => {
    if (!course.modules || course.modules.length === 0) return 0;

    const completedModules = course.modules.filter((module) => module.completed).length;
    return Math.round((completedModules / course.modules.length) * 100);
  };

  return {
    coursesData,
    findCourseBySlug,
    findModuleBySlug,
    formatPrice,
    getTotalCourseDuration,
    getTotalMaterialCount,
    getAverageRating,
    getCourseProgress,
  };
};
