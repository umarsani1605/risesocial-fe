/**
 * Composable untuk mengelola data course/module
 * Terintegrasi dengan backend Programs API dengan fallback ke static data
 * @returns {object} Object berisi data dan methods course/module
 */
export const useCourses = () => {
  // Reactive state untuk courses data
  const coursesData = ref([]);
  const modulesData = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Fallback static data dari JSON file
  let staticModulesData = [];

  // Load static data fallback
  const loadStaticData = async () => {
    try {
      const staticDataModule = await import('~/data/data.json');
      staticModulesData = staticDataModule.modulesData;
    } catch (error) {
      console.warn('Could not load static data fallback:', error);
    }
  };

  /**
   * Fetch courses/programs data dari backend API
   * @returns {Promise<Array>} Array courses data
   */
  const fetchCourses = async () => {
    if (isLoading.value) return coursesData.value;

    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch('/api/programs', {
        baseURL: config.public.backendUrl,
      });

      if (response.data) {
        // Transform backend programs data untuk compatibility dengan frontend courses
        const transformedData = response.data.map((program) => ({
          // Backend program fields
          id: program.id,
          title: program.title,
          name: program.title,
          description: program.description,
          image: program.image,
          slug: program.slug,
          status: program.status,
          created_at: program.created_at,
          updated_at: program.updated_at,

          // Frontend compatibility fields
          module_slug: program.slug,
          category: program.category || 'General',
          level: program.level || 'Beginner',
          duration: program.duration || '4 weeks',
          price: program.price || 0,
          rating: program.rating || 4.5,
          ratingCount: program.rating_count || 0,
          completed: false, // Default untuk user progress

          // Default syllabus structure untuk compatibility
          syllabus: program.syllabus || [
            {
              id: 1,
              title: 'Introduction',
              description: 'Getting started with the program',
              completed: false,
              duration: '30 minutes',
            },
            {
              id: 2,
              title: 'Main Content',
              description: 'Core learning materials',
              completed: false,
              duration: '2 hours',
            },
            {
              id: 3,
              title: 'Practice & Assessment',
              description: 'Hands-on exercises and evaluation',
              completed: false,
              duration: '1 hour',
            },
          ],
        }));

        coursesData.value = transformedData;
        modulesData.value = transformedData; // Alias untuk compatibility
        return transformedData;
      }

      throw new Error('Failed to fetch courses');
    } catch (err) {
      console.warn('Failed to fetch courses from API, using static data:', err);
      error.value = err.data?.message || 'Gagal memuat data course';

      // Fallback ke static data
      await loadStaticData();
      coursesData.value = staticModulesData;
      modulesData.value = staticModulesData;
      return staticModulesData;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Initialize courses data
   */
  const initializeCourses = async () => {
    if (coursesData.value.length === 0) {
      await fetchCourses();
    }
    return coursesData.value;
  };

  /**
   * Mencari module berdasarkan module_slug
   * @param {string} moduleSlug - Slug module
   * @returns {object|undefined} Module object atau undefined jika tidak ditemukan
   */
  const findModuleBySlug = async (moduleSlug) => {
    await initializeCourses();
    return coursesData.value.find((module) => module.module_slug === moduleSlug || module.slug === moduleSlug);
  };

  /**
   * Alias untuk findModuleBySlug
   * @param {string} courseSlug - Slug course
   * @returns {object|undefined} Course object atau undefined jika tidak ditemukan
   */
  const findCourseBySlug = async (courseSlug) => {
    return await findModuleBySlug(courseSlug);
  };

  /**
   * Mendapatkan semua modules berdasarkan kategori
   * @param {string} category - Kategori module
   * @returns {Array} Array modules dalam kategori tertentu
   */
  const getModulesByCategory = async (category) => {
    await initializeCourses();
    return coursesData.value.filter((module) => module.category === category);
  };

  /**
   * Alias untuk getModulesByCategory
   * @param {string} category - Kategori course
   * @returns {Array} Array courses dalam kategori tertentu
   */
  const getCoursesByCategory = async (category) => {
    return await getModulesByCategory(category);
  };

  /**
   * Mendapatkan semua modules yang completed
   * @returns {Array} Array modules yang sudah completed
   */
  const getCompletedModules = async () => {
    await initializeCourses();
    return coursesData.value.filter((module) => module.completed);
  };

  /**
   * Alias untuk getCompletedModules
   * @returns {Array} Array courses yang sudah completed
   */
  const getCompletedCourses = async () => {
    return await getCompletedModules();
  };

  /**
   * Mendapatkan semua modules yang belum completed
   * @returns {Array} Array modules yang belum completed
   */
  const getInProgressModules = async () => {
    await initializeCourses();
    return coursesData.value.filter((module) => !module.completed);
  };

  /**
   * Alias untuk getInProgressModules
   * @returns {Array} Array courses yang belum completed
   */
  const getInProgressCourses = async () => {
    return await getInProgressModules();
  };

  /**
   * Mendapatkan semua kategori unique
   * @returns {Array} Array kategori unique
   */
  const getUniqueCategories = async () => {
    await initializeCourses();
    const categories = [...new Set(coursesData.value.map((module) => module.category))];
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
   * Alias untuk getModuleProgress
   * @param {object} module - Object module
   * @returns {number} Progress percentage (0-100)
   */
  const getCourseProgress = (module) => {
    return getModuleProgress(module);
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
   * Alias untuk getModuleSyllabusCount
   * @param {object} module - Object module
   * @returns {object} Object dengan completed, total, dan percentage
   */
  const getCourseModulesCount = (module) => {
    return getModuleSyllabusCount(module);
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
   * Alias untuk getLatestSyllabus
   * @param {object} module - Object module
   * @returns {object|null} Latest syllabus atau null jika tidak ada
   */
  const getLatestModule = (module) => {
    return getLatestSyllabus(module);
  };

  /**
   * Mendapatkan module berdasarkan rating minimum
   * @param {number} minRating - Rating minimum
   * @returns {Array} Array modules dengan rating >= minRating
   */
  const getModulesByRating = async (minRating = 4.5) => {
    await initializeCourses();
    return coursesData.value.filter((module) => module.rating >= minRating);
  };

  /**
   * Alias untuk getModulesByRating
   * @param {number} minRating - Rating minimum
   * @returns {Array} Array courses dengan rating >= minRating
   */
  const getCoursesByRating = async (minRating = 4.5) => {
    return await getModulesByRating(minRating);
  };

  /**
   * Mendapatkan modules yang paling populer berdasarkan rating count
   * @param {number} limit - Jumlah modules yang dikembalikan
   * @returns {Array} Array modules populer
   */
  const getPopularModules = async (limit = 10) => {
    await initializeCourses();
    return coursesData.value.sort((a, b) => b.ratingCount - a.ratingCount).slice(0, limit);
  };

  /**
   * Alias untuk getPopularModules
   * @param {number} limit - Jumlah courses yang dikembalikan
   * @returns {Array} Array courses populer
   */
  const getPopularCourses = async (limit = 10) => {
    return await getPopularModules(limit);
  };

  /**
   * Search modules berdasarkan title, name, atau description
   * @param {string} searchTerm - Term pencarian
   * @returns {Array} Array modules yang sesuai dengan pencarian
   */
  const searchModules = async (searchTerm) => {
    await initializeCourses();
    if (!searchTerm) return coursesData.value;

    const term = searchTerm.toLowerCase();
    return coursesData.value.filter(
      (module) =>
        module.title.toLowerCase().includes(term) || module.name.toLowerCase().includes(term) || module.description.toLowerCase().includes(term)
    );
  };

  /**
   * Alias untuk searchModules
   * @param {string} searchTerm - Term pencarian
   * @returns {Array} Array courses yang sesuai dengan pencarian
   */
  const searchCourses = async (searchTerm) => {
    return await searchModules(searchTerm);
  };

  /**
   * Mendapatkan modules yang direkomendasikan berdasarkan category
   * @param {string} currentModuleSlug - Slug module saat ini
   * @param {number} limit - Jumlah rekomendasi
   * @returns {Array} Array modules rekomendasi
   */
  const getRecommendedModules = async (currentModuleSlug, limit = 5) => {
    await initializeCourses();
    const currentModule = coursesData.value.find((module) => module.module_slug === currentModuleSlug || module.slug === currentModuleSlug);
    if (!currentModule) return [];

    // Cari modules dalam kategori yang sama, exclude current module
    const sameCategoryModules = coursesData.value.filter(
      (module) => module.category === currentModule.category && module.module_slug !== currentModuleSlug && module.slug !== currentModuleSlug
    );

    // Sort berdasarkan rating dan ambil limited
    return sameCategoryModules.sort((a, b) => b.rating - a.rating).slice(0, limit);
  };

  /**
   * Alias untuk getRecommendedModules
   * @param {string} currentCourseSlug - Slug course saat ini
   * @param {number} limit - Jumlah rekomendasi
   * @returns {Array} Array courses rekomendasi
   */
  const getRecommendedCourses = async (currentCourseSlug, limit = 5) => {
    return await getRecommendedModules(currentCourseSlug, limit);
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
   * Refresh courses data dari API
   * @returns {Promise<Array>} Updated courses data
   */
  const refreshCourses = async () => {
    coursesData.value = [];
    modulesData.value = [];
    return await fetchCourses();
  };

  // Initialize courses saat composable pertama kali digunakan
  if (process.client) {
    onMounted(async () => {
      await initializeCourses();
    });
  }

  return {
    // Reactive state
    coursesData: readonly(coursesData),
    modulesData: readonly(modulesData),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Data methods
    fetchCourses,
    initializeCourses,
    refreshCourses,
    findCourseBySlug,
    findModuleBySlug,
    getCoursesByCategory,
    getModulesByCategory,
    getCompletedCourses,
    getCompletedModules,
    getInProgressCourses,
    getInProgressModules,
    getUniqueCategories,

    // Progress & Analytics
    getCourseProgress,
    getModuleProgress,
    getCourseModulesCount,
    getModuleSyllabusCount,
    getLatestModule,
    getLatestSyllabus,
    getSyllabusLabel,

    // Search & Filter
    searchCourses,
    searchModules,
    getCoursesByRating,
    getModulesByRating,
    getPopularCourses,
    getPopularModules,
    getRecommendedCourses,
    getRecommendedModules,

    // Utility
    formatPrice,
  };
};
