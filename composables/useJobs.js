import { useJobsStore } from '~/store/jobs';

/**
 * Composable untuk mengelola data jobs dan favorit
 * @returns {object} Object berisi data dan methods jobs
 */
export const useJobs = () => {
  const jobsStore = useJobsStore();

  // Reactive state untuk favorit jobs (disimpan di localStorage untuk persistence)
  const favoriteJobIds = ref(new Set());

  /**
   * Inisialisasi data jobs dan favorit dari localStorage
   */
  const initializeJobs = async () => {
    // Initialize jobs store
    await jobsStore.initializeJobs();

    // Load favorit dari localStorage
    if (process.client) {
      const savedFavorites = localStorage.getItem('favoriteJobs');
      if (savedFavorites) {
        try {
          const favorites = JSON.parse(savedFavorites);
          favoriteJobIds.value = new Set(favorites);
        } catch (error) {
          console.error('Error loading favorite jobs:', error);
        }
      } else {
        // Add some sample favorites for demo if no saved favorites
        await addSampleFavorites();
      }
    }
  };

  /**
   * Menambahkan sample favorites untuk demo
   */
  const addSampleFavorites = async () => {
    // Wait for jobs to be loaded
    await nextTick();

    // Add first 3 jobs as sample favorites
    if (jobsStore.processedJobs.length > 0) {
      const sampleJobIds = jobsStore.processedJobs.slice(0, 3).map((job) => job.id);
      sampleJobIds.forEach((id) => {
        favoriteJobIds.value.add(id);
      });
      saveFavoritesToStorage();
    } else {
      // If still no jobs, wait and try again
      initTimeout = setTimeout(() => {
        if (jobsStore.processedJobs.length > 0) {
          const sampleJobIds = jobsStore.processedJobs.slice(0, 3).map((job) => job.id);
          sampleJobIds.forEach((id) => {
            favoriteJobIds.value.add(id);
          });
          saveFavoritesToStorage();
        }
      }, 500);
    }
  };

  /**
   * Menyimpan favorit ke localStorage
   */
  const saveFavoritesToStorage = () => {
    if (process.client) {
      localStorage.setItem('favoriteJobs', JSON.stringify([...favoriteJobIds.value]));
    }
  };

  /**
   * Menambahkan job ke favorit
   * @param {string} jobId - ID job yang akan ditambahkan ke favorit
   */
  const addToFavorites = (jobId) => {
    favoriteJobIds.value.add(jobId);
    saveFavoritesToStorage();
  };

  /**
   * Menghapus job dari favorit
   * @param {string} jobId - ID job yang akan dihapus dari favorit
   */
  const removeFromFavorites = (jobId) => {
    favoriteJobIds.value.delete(jobId);
    saveFavoritesToStorage();
  };

  /**
   * Toggle status favorit job
   * @param {string} jobId - ID job yang akan di-toggle
   */
  const toggleFavorite = (jobId) => {
    if (favoriteJobIds.value.has(jobId)) {
      removeFromFavorites(jobId);
    } else {
      addToFavorites(jobId);
    }
  };

  /**
   * Mengecek apakah job adalah favorit
   * @param {string} jobId - ID job yang akan dicek
   * @returns {boolean} True jika job adalah favorit
   */
  const isFavorite = (jobId) => {
    return favoriteJobIds.value.has(jobId);
  };

  /**
   * Mendapatkan semua jobs yang menjadi favorit
   * @returns {Array} Array jobs yang menjadi favorit
   */
  const getFavoriteJobs = computed(() => {
    if (!jobsStore.processedJobs.length) return [];

    return jobsStore.processedJobs.filter((job) => favoriteJobIds.value.has(job.id));
  });

  /**
   * Mendapatkan jobs favorit dengan limit tertentu
   * @param {number} limit - Jumlah jobs yang akan diambil
   * @returns {Array} Array jobs favorit dengan limit
   */
  const getLimitedFavoriteJobs = (limit = 3) => {
    return getFavoriteJobs.value.slice(0, limit);
  };

  /**
   * Format employment type untuk display
   * @param {Array} employmentTypes - Array employment types
   * @returns {string} Formatted employment type
   */
  const formatEmploymentType = (employmentTypes) => {
    if (!employmentTypes || employmentTypes.length === 0) return 'Full-time';

    const type = employmentTypes[0];
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-');
  };

  /**
   * Mendapatkan gambar untuk job (logo perusahaan atau fallback)
   * @param {object} job - Job object
   * @returns {string} Image URL
   */
  const getJobImage = (job) => {
    // Gunakan organization_logo jika ada
    if (job.organization_logo) {
      return job.organization_logo;
    }

    // Fallback ke gambar default berdasarkan industry/job type
    const title = job.title.toLowerCase();
    const industry = job.linkedin_org_industry?.toLowerCase() || '';

    if (title.includes('social media') || title.includes('marketing')) {
      return '/images/courses/2.webp';
    }
    if (title.includes('apoteker') || title.includes('health') || industry.includes('health')) {
      return '/images/courses/4.webp';
    }
    if (title.includes('sustainability') || title.includes('analyst') || title.includes('data')) {
      return '/images/courses/3.webp';
    }
    if (title.includes('developer') || title.includes('programmer') || title.includes('tech')) {
      return '/images/courses/5.webp';
    }
    if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
      return '/images/courses/6.webp';
    }
    if (title.includes('teacher') || title.includes('education') || title.includes('instructor')) {
      return '/images/courses/1.webp';
    }

    // Default image
    return '/images/courses/1.webp';
  };

  /**
   * Membuat URL untuk job detail
   * @param {object} job - Job object
   * @returns {string} URL path untuk job detail
   */
  const getJobDetailUrl = (job) => {
    return `/opportunities/${job.companySlug}/${job.jobSlug}`;
  };

  // Cleanup timeout reference
  let initTimeout = null;

  // Initialize saat composable digunakan
  onMounted(() => {
    initializeJobs();
  });

  // Cleanup saat component di-unmount
  onUnmounted(() => {
    if (initTimeout) {
      clearTimeout(initTimeout);
    }
  });

  return {
    // Store data
    jobsStore,

    // Reactive data
    favoriteJobIds: readonly(favoriteJobIds),

    // Computed
    getFavoriteJobs,

    // Methods
    initializeJobs,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getLimitedFavoriteJobs,
    formatEmploymentType,
    getJobImage,
    getJobDetailUrl,
  };
};
