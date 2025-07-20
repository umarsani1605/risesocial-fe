import { getCleanLocation, formatRelativeTime, normalizeCompanyName, normalizeJobTitle } from '~/utils/formatting';

/**
 * Composable untuk mengelola data jobs
 * Dengan API terintegrasi dan data transformation
 * @returns {object} Object berisi data dan methods jobs
 */
export const useJobs = () => {
  // Reactive state untuk jobs data
  const jobsData = ref([]);
  const filteredJobs = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Filter state
  const filters = reactive({
    title: '',
    company: '',
    location: 'all',
    industry: 'all',
    jobType: 'all',
    experience: 'all',
    salaryMin: null,
    salaryMax: null,
  });

  // Pagination state
  const currentPage = ref(1);
  const itemsPerPage = ref(12);
  const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage.value));

  // Computed properties
  const paginatedJobs = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return filteredJobs.value.slice(startIndex, endIndex);
  });

  const hasActiveFilters = computed(() => {
    return (
      filters.title.trim() !== '' ||
      filters.company.trim() !== '' ||
      filters.location !== 'all' ||
      filters.industry !== 'all' ||
      filters.jobType !== 'all' ||
      filters.experience !== 'all' ||
      filters.salaryMin !== null ||
      filters.salaryMax !== null
    );
  });

  /**
   * Transform jobs data - minimal transformation, just ensure arrays exist
   * @param {Array} jobs - Raw jobs data
   * @returns {Array} Jobs data with ensured arrays
   */
  const transformJobsData = (jobs) => {
    if (!Array.isArray(jobs)) return [];

    return jobs.map((job) => ({
      ...job,
      // Ensure arrays exist
      skills: Array.isArray(job.skills) ? job.skills : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
    }));
  };

  /**
   * Get clean location string from job
   * @param {Object} job - Job object
   * @returns {string} Formatted location string
   */
  const getJobLocation = (job) => {
    if (!job?.location) return 'Location not specified';

    const { city, region, country } = job.location;
    const parts = [];

    if (city) parts.push(city);
    if (region && region !== city) parts.push(region);
    if (country) parts.push(country);

    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  /**
   * Get relative time string for job posting
   * @param {string} dateString - Date string
   * @returns {string} Relative time string
   */
  const getRelativeTime = (dateString) => {
    return formatRelativeTime(dateString);
  };

  /**
   * Get job slug
   * @param {Object} job - Job object
   * @returns {string} Job slug
   */
  const getJobSlug = (job) => {
    return job.slug || normalizeJobTitle(job.title);
  };

  /**
   * Get company slug
   * @param {Object} job - Job object
   * @returns {string} Company slug
   */
  const getCompanySlug = (job) => {
    return job.company?.slug || normalizeCompanyName(job.company?.name);
  };

  /**
   * Get job type
   * @param {Object} job - Job object
   * @returns {string} Job type
   */
  const getJobType = (job) => {
    return job.employment_type || 'Full Time';
  };

  /**
   * Get company logo URL
   * @param {Object} job - Job object
   * @returns {string} Company logo URL
   */
  const getCompanyLogo = (job) => {
    return job.company?.logo_url || '/images/default-company.png';
  };

  /**
   * Get job image URL
   * @param {Object} job - Job object
   * @returns {string} Job image URL
   */
  const getJobImage = (job) => {
    return job.image || job.company?.logo_url || '/images/default-job.png';
  };

  /**
   * Get job location details
   * @param {Object} job - Job object
   * @returns {Object} Location details
   */
  const getJobLocationDetails = (job) => {
    if (!job.location) return null;

    return {
      city: job.location.city,
      region: job.location.region,
      country: job.location.country,
      timezone: job.location.timezone,
      isRemote: job.location.is_remote || job.is_remote || false,
      coordinates:
        job.location.latitude && job.location.longitude
          ? {
              lat: parseFloat(job.location.latitude),
              lng: parseFloat(job.location.longitude),
            }
          : null,
    };
  };

  /**
   * Fetch jobs data dari backend API
   * @returns {Promise<Array>} Array jobs data
   */
  const fetchJobs = async () => {
    console.log('🚀 fetchJobs started');

    if (isLoading.value) {
      console.log('⏳ Already loading, returning existing data');
      return jobsData.value;
    }

    // Set loading state
    isLoading.value = true;
    error.value = null;
    
    console.log('🔄 isLoading set to:', isLoading.value);

    try {
      const config = useRuntimeConfig();
      console.log('🌐 API call to:', config.public.backendUrl + '/api/jobs');

      const response = await $fetch('/api/jobs', {
        baseURL: config.public.backendUrl,
      });

      console.log('📦 API response received');
      console.log('📦 response.data length:', response?.data?.length || 0);

      // Just ensure arrays exist, no other transformation
      jobsData.value = transformJobsData(response.data);
      console.log('📊 jobsData.value after assignment:', jobsData.value?.length || 0);

      applyFilters();
      return jobsData.value;
    } catch (err) {
      console.error('Error fetching jobs:', err);
      error.value = err.data?.message || 'Gagal memuat data jobs';
      jobsData.value = [];
      filteredJobs.value = [];
      return [];
    } finally {
      console.log('✅ fetchJobs completed, setting isLoading to false');
      isLoading.value = false;
      console.log('🔄 isLoading after completion:', isLoading.value);
    }
  };

  /**
   * Search jobs with search term
   * @param {string} searchTerm - Search term
   * @param {object} searchFilters - Additional filters
   * @returns {Promise<Array>} Search results
   */
  const searchJobs = async (searchTerm, searchFilters = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = {
        search: searchTerm,
        ...searchFilters,
      };

      const config = useRuntimeConfig();
      const response = await $fetch('/api/jobs/search', {
        params,
        baseURL: config.public.backendUrl,
      });

      // Just ensure arrays exist, no other transformation
      jobsData.value = transformJobsData(response.data);
      filteredJobs.value = [...jobsData.value];
      currentPage.value = 1;
      return jobsData.value;
    } catch (err) {
      console.error('Error searching jobs:', err);
      error.value = err.data?.message || 'Gagal mencari jobs';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get job by ID
   * @param {string} jobId - Job ID
   * @returns {Promise<object|null>} Job data
   */
  const getJobById = async (jobId) => {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/jobs/${jobId}`, {
        baseURL: config.public.backendUrl,
      });
      return transformJobsData([response.data || response])[0] || null;
    } catch (err) {
      console.error('Error fetching job by ID:', err);
      error.value = err.data?.message || 'Job tidak ditemukan';
      return null;
    }
  };

  /**
   * Get job by slug (company + job name) - Client-side lookup
   * @param {string} companySlug - Company slug
   * @param {string} jobSlug - Job slug
   * @returns {Object|null} Job object or null
   */
  const getJobBySlug = (companySlug, jobSlug) => {
    // Simple direct lookup
    return jobsData.value.find((job) => job.company?.slug === companySlug && job.slug === jobSlug) || null;
  };

  /**
   * Get similar jobs based on industry
   * @param {number} excludeJobId - Job ID to exclude
   * @param {string} industry - Industry to match
   * @param {number} limit - Number of similar jobs to return
   * @returns {Array} Array of similar jobs
   */
  const getSimilarJobs = (excludeJobId, industry, limit = 4) => {
    return jobsData.value.filter((job) => job.id !== excludeJobId && job.industry === industry).slice(0, limit);
  };

  /**
   * Filter jobs by criteria
   * @param {Array} jobs - Jobs array
   * @param {object} filterCriteria - Filter criteria
   * @returns {Array} Filtered jobs
   */
  const filterJobs = (jobs, filterCriteria) => {
    console.log('🔧 filterJobs called with:', jobs?.length || 0, 'jobs');
    console.log('🔧 filterCriteria:', filterCriteria);

    if (!Array.isArray(jobs)) {
      console.log('❌ jobs is not array in filterJobs');
      return [];
    }

    let filtered = [...jobs];
    console.log('🔧 Initial filtered count:', filtered.length);

    // Filter by title
    if (filterCriteria.title?.trim()) {
      const searchTerm = filterCriteria.title.toLowerCase().trim();
      filtered = filtered.filter((job) => job.title.toLowerCase().includes(searchTerm));
    }

    // Filter by company
    if (filterCriteria.company?.trim()) {
      const searchTerm = filterCriteria.company.toLowerCase().trim();
      filtered = filtered.filter((job) => job.company.toLowerCase().includes(searchTerm));
    }

    // Filter by location - City-based filtering
    if (filterCriteria.location && filterCriteria.location !== 'all') {
      filtered = filtered.filter((job) => {
        const filterLocation = filterCriteria.location.toLowerCase();

        // Handle remote filter
        if (filterLocation === 'remote') {
          return job.locationIsRemote;
        }

        // Check city, region, or country match
        const city = job.locationCity?.toLowerCase() || '';
        const region = job.locationRegion?.toLowerCase() || '';
        const country = job.locationCountry?.toLowerCase() || '';

        return city.includes(filterLocation) || region.includes(filterLocation) || country.includes(filterLocation);
      });
    }

    // Filter by industry
    if (filterCriteria.industry && filterCriteria.industry !== 'all') {
      filtered = filtered.filter((job) => {
        const jobIndustry = job.industry?.toLowerCase() || '';
        return jobIndustry.includes(filterCriteria.industry.toLowerCase());
      });
    }

    // Filter by job type
    if (filterCriteria.jobType && filterCriteria.jobType !== 'all') {
      filtered = filtered.filter((job) => {
        const jobType = job.jobType?.toLowerCase() || '';
        return jobType.includes(filterCriteria.jobType.toLowerCase());
      });
    }

    // Filter by experience
    if (filterCriteria.experience && filterCriteria.experience !== 'all') {
      filtered = filtered.filter((job) => {
        const jobExperience = job.experience?.toLowerCase() || '';
        return jobExperience.includes(filterCriteria.experience.toLowerCase());
      });
    }

    // Filter by salary range
    if (filterCriteria.salaryMin !== null || filterCriteria.salaryMax !== null) {
      filtered = filtered.filter((job) => {
        const jobSalaryMin = job.salaryMin || 0;
        const jobSalaryMax = job.salaryMax || Infinity;

        const filterMin = filterCriteria.salaryMin || 0;
        const filterMax = filterCriteria.salaryMax || Infinity;

        return jobSalaryMax >= filterMin && jobSalaryMin <= filterMax;
      });
    }

    console.log('🎯 Final filtered count:', filtered.length);
    return filtered;
  };

  /**
   * Apply filters to jobs data
   */
  const applyFilters = () => {
    console.log('🔍 applyFilters called');
    console.log('📊 jobsData.value:', jobsData.value?.length || 0, 'items');
    console.log('🎯 filters:', filters);

    if (!Array.isArray(jobsData.value)) {
      console.log('❌ jobsData is not array, setting filteredJobs to empty');
      filteredJobs.value = [];
      return;
    }

    const filtered = filterJobs(jobsData.value, filters);
    console.log('✅ Filtered result:', filtered?.length || 0, 'items');

    filteredJobs.value = filtered;
    currentPage.value = 1; // Reset to first page when filters change
  };

  /**
   * Update specific filter
   * @param {string} filterType - Type of filter
   * @param {any} value - Filter value
   */
  const updateFilter = (filterType, value) => {
    if (filters.hasOwnProperty(filterType)) {
      filters[filterType] = value;
      applyFilters();
    }
  };

  /**
   * Clear all filters
   */
  const clearAllFilters = () => {
    filters.title = '';
    filters.company = '';
    filters.location = 'all';
    filters.industry = 'all';
    filters.jobType = 'all';
    filters.experience = 'all';
    filters.salaryMin = null;
    filters.salaryMax = null;
    applyFilters();
  };

  /**
   * Sort jobs by criteria
   * @param {string} sortBy - Sort criteria
   * @param {string} sortOrder - Sort order (asc/desc)
   */
  const sortJobs = (sortBy = 'date', sortOrder = 'desc') => {
    // Simple sorting implementation
    const sortedJobs = [...filteredJobs.value];

    sortedJobs.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.datePosted || a.created_at);
          bValue = new Date(b.datePosted || b.created_at);
          break;
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'company':
          aValue = a.company?.toLowerCase() || '';
          bValue = b.company?.toLowerCase() || '';
          break;
        case 'location':
          aValue = a.location?.toLowerCase() || '';
          bValue = b.location?.toLowerCase() || '';
          break;
        case 'salary':
          aValue = a.salaryMax || a.salary || 0;
          bValue = b.salaryMax || b.salary || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    filteredJobs.value = sortedJobs;
  };

  /**
   * Set current page
   * @param {number} page - Page number
   */
  const setCurrentPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  /**
   * Go to next page
   */
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  /**
   * Go to previous page
   */
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  /**
   * Set items per page
   * @param {number} count - Items per page
   */
  const setItemsPerPage = (count) => {
    itemsPerPage.value = count;
    currentPage.value = 1;
  };

  /**
   * Get unique locations - City-based filtering
   * @returns {Array} Unique city-based locations
   */
  const getUniqueLocations = () => {
    const locations = new Set();
    jobsData.value.forEach((job) => {
      // Priority: City > Region > Country for filtering
      if (job.locationCity?.trim()) {
        locations.add(job.locationCity.trim());
      } else if (job.locationRegion?.trim()) {
        locations.add(job.locationRegion.trim());
      } else if (job.locationCountry?.trim()) {
        locations.add(job.locationCountry.trim());
      }

      // Add remote option for remote jobs
      if (job.locationIsRemote) {
        locations.add('Remote');
      }
    });
    return Array.from(locations).sort();
  };

  /**
   * Get unique industries
   * @returns {Array} Unique industries
   */
  const getUniqueIndustries = () => {
    const industries = new Set();
    jobsData.value.forEach((job) => {
      if (job.industry) {
        industries.add(job.industry);
      }
    });
    return Array.from(industries).sort();
  };

  /**
   * Get unique job types
   * @returns {Array} Unique job types
   */
  const getUniqueJobTypes = () => {
    const jobTypes = new Set();
    jobsData.value.forEach((job) => {
      if (job.jobType) {
        const types = Array.isArray(job.jobType) ? job.jobType : [job.jobType];
        types.forEach((type) => {
          let displayType = type.replace('_', ' ').toLowerCase();
          displayType = displayType.charAt(0).toUpperCase() + displayType.slice(1);
          jobTypes.add(displayType);
        });
      }
    });
    return Array.from(jobTypes).sort();
  };

  /**
   * Initialize jobs data jika belum ada
   * @returns {Promise<Array>} Array jobs data
   */
  const initializeJobs = async () => {
    console.log('🔄 initializeJobs called');
    if (jobsData.value.length === 0) {
      console.log('📥 No jobs data found, fetching...');
      return await fetchJobs();
    }
    console.log('ℹ️ Jobs data already exists, returning existing data');
    return jobsData.value;
  };

  /**
   * Refresh jobs data
   * @returns {Promise<Array>} Fresh jobs data
   */
  const refreshJobs = async () => {
    jobsData.value = [];
    filteredJobs.value = [];
    return await fetchJobs();
  };

  // Watch for filter changes
  watch(
    filters,
    () => {
      applyFilters();
    },
    { deep: true }
  );

  // Return reactive data dan methods
  return {
    // Reactive state
    jobsData: readonly(jobsData),
    filteredJobs: readonly(filteredJobs),
    paginatedJobs,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Filter state
    filters,
    hasActiveFilters,

    // Pagination state
    currentPage: readonly(currentPage),
    itemsPerPage: readonly(itemsPerPage),
    totalPages,

    // Methods
    fetchJobs,
    searchJobs,
    getJobById,
    getJobBySlug,
    getSimilarJobs,
    initializeJobs,
    refreshJobs,

    // Filter methods
    updateFilter,
    clearAllFilters,
    applyFilters,
    sortJobs,

    // Pagination methods
    setCurrentPage,
    nextPage,
    prevPage,
    setItemsPerPage,

    // Utility methods
    getUniqueLocations,
    getUniqueIndustries,
    getUniqueJobTypes,
    formatPrice,
    formatRelativeTime,

    // Get company info from jobs data
    getCompanyFromJobs(companySlug, jobs) {
      if (!jobs || !Array.isArray(jobs)) return null;
      const companyJob = jobs.find(
        (job) => job.company && (job.company.slug === companySlug || job.company.name?.toLowerCase() === companySlug.toLowerCase())
      );
      return companyJob?.company || null;
    },
  };
};
