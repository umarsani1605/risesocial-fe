import { defineStore } from 'pinia';
import { formatRelativeTime, normalizeCompanyName, normalizeJobTitle } from '~/utils/formatting';

/**
 * @typedef {object} JobsState
 * @property {Array} favoriteJobIds - User's favorite job IDs
 * @property {boolean} isLoading - Loading status for favorites
 * @property {string} error - Error message if any
 */

export const useJobsStore = defineStore(
  'jobs',
  {
    /**
     * @returns {JobsState}
     */
    state: () => ({
      // Core jobs data
      jobsData: [],
      filteredJobs: [],

      // Favorites (existing)
      favoriteJobIds: [],

      // UI & network states
      isLoading: false,
      error: null,

      // Filters
      filters: {
        title: '',
        company: '',
        location: 'all',
        industry: 'all',
        jobType: 'all',
        experience: 'all',
        salaryMin: null,
        salaryMax: null,
      },

      // Pagination
      currentPage: 1,
      itemsPerPage: 12,

      // Navigation persistence
      selectedJob: null,
    }),

    getters: {
      // Jobs derived states
      hasActiveFilters: (state) =>
        state.filters.title.trim() !== '' ||
        state.filters.company.trim() !== '' ||
        state.filters.location !== 'all' ||
        state.filters.industry !== 'all' ||
        state.filters.jobType !== 'all' ||
        state.filters.experience !== 'all' ||
        state.filters.salaryMin !== null ||
        state.filters.salaryMax !== null,

      totalPages: (state) => Math.max(1, Math.ceil(state.filteredJobs.length / state.itemsPerPage)),

      paginatedJobs: (state) => {
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        return state.filteredJobs.slice(startIndex, endIndex);
      },
      /**
       * Get favorite jobs count
       * @param {JobsState} state
       * @returns {number}
       */
      favoritesCount: (state) => state.favoriteJobIds.length,

      /**
       * Check if job is favorite
       * @param {JobsState} state
       * @returns {Function}
       */
      isFavorite: (state) => (jobId) => state.favoriteJobIds.includes(jobId),
    },

    actions: {
      // ========== Core data management ==========
      /**
       * Set jobs data from SSR page fetch
       * @param {Array} data
       */
      setJobsData(data) {
        this.jobsData = Array.isArray(data) ? data : [];
        this.applyFilters();
      },

      /**
       * Apply filters to jobsData
       */
      applyFilters() {
        if (!Array.isArray(this.jobsData)) {
          this.filteredJobs = [];
          return;
        }
        this.filteredJobs = this.filterJobs(this.jobsData, this.filters);
        this.currentPage = 1;
      },

      /**
       * Update a filter field and re-apply filters
       * @param {string} filterType
       * @param {any} value
       */
      updateFilter(filterType, value) {
        if (Object.prototype.hasOwnProperty.call(this.filters, filterType)) {
          this.filters[filterType] = value;
          this.applyFilters();
        }
      },

      /**
       * Clear all filters to defaults
       */
      clearAllFilters() {
        this.filters = {
          title: '',
          company: '',
          location: 'all',
          industry: 'all',
          jobType: 'all',
          experience: 'all',
          salaryMin: null,
          salaryMax: null,
        };
        this.applyFilters();
      },

      /**
       * Sort current filtered jobs (simple client-side)
       * @param {string} sortBy
       * @param {string} sortOrder
       */
      sortJobs(sortBy = 'date', sortOrder = 'desc') {
        const sorted = [...this.filteredJobs];
        sorted.sort((a, b) => {
          let aValue, bValue;
          switch (sortBy) {
            case 'date':
              aValue = new Date(a.posted_date || a.created_at);
              bValue = new Date(b.posted_date || b.created_at);
              break;
            case 'title':
              aValue = (a.title || '').toLowerCase();
              bValue = (b.title || '').toLowerCase();
              break;
            case 'company':
              aValue = (a.company?.name || '').toLowerCase();
              bValue = (b.company?.name || '').toLowerCase();
              break;
            case 'location':
              aValue = (this.getJobLocation(a) || '').toLowerCase();
              bValue = (this.getJobLocation(b) || '').toLowerCase();
              break;
            default:
              return 0;
          }
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
        this.filteredJobs = sorted;
      },

      // ========== Pagination ==========
      setCurrentPage(page) {
        const total = Math.max(1, Math.ceil(this.filteredJobs.length / this.itemsPerPage));
        if (page >= 1 && page <= total) this.currentPage = page;
      },
      nextPage() {
        const total = Math.max(1, Math.ceil(this.filteredJobs.length / this.itemsPerPage));
        if (this.currentPage < total) this.currentPage += 1;
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage -= 1;
      },
      setItemsPerPage(count) {
        this.itemsPerPage = count || 12;
        this.currentPage = 1;
      },

      // ========== Filtering helper ==========
      /**
       * Pure filter function
       * @param {Array} jobs
       * @param {object} filterCriteria
       */
      filterJobs(jobs, filterCriteria) {
        if (!Array.isArray(jobs)) return [];
        let filtered = [...jobs];

        // Title
        if (filterCriteria.title?.trim()) {
          const term = filterCriteria.title.toLowerCase().trim();
          filtered = filtered.filter((job) => (job.title || '').toLowerCase().includes(term));
        }
        // Company
        if (filterCriteria.company?.trim()) {
          const term = filterCriteria.company.toLowerCase().trim();
          filtered = filtered.filter((job) => (job.company?.name || '').toLowerCase().includes(term));
        }
        // Location
        if (filterCriteria.location && filterCriteria.location !== 'all') {
          const loc = filterCriteria.location.toLowerCase();
          if (loc === 'remote') {
            filtered = filtered.filter((job) => job.location?.is_remote);
          } else {
            filtered = filtered.filter((job) => {
              const city = job.location?.city?.toLowerCase() || '';
              const region = job.location?.region?.toLowerCase() || '';
              const country = job.location?.country?.toLowerCase() || '';
              return city.includes(loc) || region.includes(loc) || country.includes(loc);
            });
          }
        }
        // Industry
        if (filterCriteria.industry && filterCriteria.industry !== 'all') {
          const wanted = filterCriteria.industry.toLowerCase();
          filtered = filtered.filter((job) => (job.company?.industry || '').toLowerCase().includes(wanted));
        }
        // Job type
        if (filterCriteria.jobType && filterCriteria.jobType !== 'all') {
          const wanted = filterCriteria.jobType.toLowerCase();
          filtered = filtered.filter((job) => (job.employment_type || '').toLowerCase().includes(wanted));
        }
        // Experience
        if (filterCriteria.experience && filterCriteria.experience !== 'all') {
          const wanted = filterCriteria.experience.toLowerCase();
          filtered = filtered.filter((job) => (job.experience || '').toLowerCase().includes(wanted));
        }
        // Salary range
        if (filterCriteria.salaryMin !== null || filterCriteria.salaryMax !== null) {
          filtered = filtered.filter((job) => {
            const min = job.salaryMin || 0;
            const max = job.salaryMax || Infinity;
            const fMin = filterCriteria.salaryMin || 0;
            const fMax = filterCriteria.salaryMax || Infinity;
            return max >= fMin && min <= fMax;
          });
        }
        return filtered;
      },

      // ========== Helpers parity with useJobs.js ==========
      /**
       * Get job by slug (company + job)
       * @param {string} companySlug
       * @param {string} jobSlug
       * @returns {Object|null}
       */
      getJobBySlug(companySlug, jobSlug) {
        const found = this.jobsData.find((job) => job.company?.slug === companySlug && job.slug === jobSlug);
        return found || null;
      },

      /**
       * Get similar jobs by industry, excluding current
       * @param {number} excludeJobId
       * @param {string} industry
       * @param {number} limit
       */
      getSimilarJobs(excludeJobId, industry, limit = 4) {
        return this.jobsData.filter((job) => job.id !== excludeJobId && job.company?.industry === industry).slice(0, limit);
      },

      /**
       * Client-only search via $api
       * @param {string} searchTerm
       * @param {object} searchFilters
       */
      async searchJobs(searchTerm, searchFilters = {}) {
        this.isLoading = true;
        this.error = null;
        try {
          const nuxtApp = useNuxtApp();
          const params = { search: searchTerm, ...searchFilters };
          const response = await nuxtApp.$api('/api/jobs/search', { query: params });
          const data = Array.isArray(response?.data) ? response.data : [];
          this.jobsData = this.transformJobsData(data);
          this.filteredJobs = [...this.jobsData];
          this.currentPage = 1;
          return this.jobsData;
        } catch (err) {
          this.error = err?.data?.message || 'Gagal mencari jobs';
          return [];
        } finally {
          this.isLoading = false;
        }
      },

      /**
       * Fetch single job by id
       * @param {string|number} jobId
       */
      async getJobById(jobId) {
        try {
          const nuxtApp = useNuxtApp();
          const response = await nuxtApp.$api(`/api/jobs/${jobId}`);
          const first = this.transformJobsData([response?.data || response])[0] || null;
          return first;
        } catch (err) {
          this.error = err?.data?.message || 'Job tidak ditemukan';
          return null;
        }
      },

      // ----- transform and utility helpers -----
      transformJobsData(jobs) {
        if (!Array.isArray(jobs)) return [];
        return jobs.map((job) => ({
          ...job,
          skills: Array.isArray(job.skills) ? job.skills : [],
          benefits: Array.isArray(job.benefits) ? job.benefits : [],
          requirements: Array.isArray(job.requirements) ? job.requirements : [],
        }));
      },

      getJobSlug(job) {
        return job.slug || normalizeJobTitle(job.title);
      },

      getCompanySlug(job) {
        return job.company?.slug || normalizeCompanyName(job.company?.name);
      },

      getJobType(job) {
        return job.employment_type || 'Full Time';
      },

      getJobImage(job) {
        return job.image || job.company?.logo_url || '/images/default-job.png';
      },

      /**
       * Build job detail URL from job object
       * @param {Object} job
       */
      getJobDetailUrl(job) {
        const company = job.company?.slug || (job.company?.name ? normalizeCompanyName(job.company.name) : 'company');
        const jobSlug = job.slug || normalizeJobTitle(job.title || 'job');
        return `/opportunities/${company}/${jobSlug}`;
      },

      /**
       * Format employment type for display
       * @param {string} type
       */
      formatEmploymentType(type) {
        if (!type) return 'Full time';
        const txt = String(type).toLowerCase().replace('_', ' ');
        return txt.charAt(0).toUpperCase() + txt.slice(1);
      },

      getJobLocation(job) {
        const loc = job?.location;
        if (!loc) return 'Location not specified';
        const parts = [];
        if (loc.city) parts.push(loc.city);
        if (loc.region && loc.region !== loc.city) parts.push(loc.region);
        if (loc.country) parts.push(loc.country);
        return parts.length > 0 ? parts.join(', ') : 'Location not specified';
      },

      getRelativeTime(dateString) {
        return formatRelativeTime(dateString);
      },

      getUniqueLocations() {
        const locations = new Set();
        this.jobsData.forEach((job) => {
          if (job.location?.city?.trim()) {
            locations.add(job.location.city.trim());
          } else if (job.location?.region?.trim()) {
            locations.add(job.location.region.trim());
          } else if (job.location?.country?.trim()) {
            locations.add(job.location.country.trim());
          }
          if (job.location?.is_remote) locations.add('Remote');
        });
        return Array.from(locations).sort();
      },

      getUniqueIndustries() {
        const industries = new Set();
        this.jobsData.forEach((job) => {
          if (job.company?.industry) industries.add(job.company.industry);
        });
        return Array.from(industries).sort();
      },

      getUniqueJobTypes() {
        const jobTypes = new Set();
        this.jobsData.forEach((job) => {
          if (job.employment_type) {
            let display = job.employment_type.replace('_', ' ').toLowerCase();
            display = display.charAt(0).toUpperCase() + display.slice(1);
            jobTypes.add(display);
          }
        });
        return Array.from(jobTypes).sort();
      },

      /**
       * Get company object from jobs data by slug or name
       * @param {string} companySlug
       * @param {Array} jobs
       * @returns {Object|null}
       */
      getCompanyFromJobs(companySlug, jobs) {
        const list = Array.isArray(jobs) ? jobs : this.jobsData;
        if (!Array.isArray(list)) return null;
        const companyJob = list.find(
          (job) => job.company && (job.company.slug === companySlug || job.company.name?.toLowerCase() === companySlug.toLowerCase())
        );
        return companyJob?.company || null;
      },
      /**
       * Initialize favorites from localStorage
       */
      initializeFavorites() {
        if (process.client) {
          const savedFavorites = localStorage.getItem('favoriteJobs');
          if (savedFavorites) {
            try {
              this.favoriteJobIds = JSON.parse(savedFavorites);
            } catch (error) {
              console.error('Error loading favorite jobs:', error);
              this.favoriteJobIds = [];
            }
          }
        }
      },

      /**
       * Save favorites to localStorage
       */
      saveFavoritesToStorage() {
        if (process.client) {
          localStorage.setItem('favoriteJobs', JSON.stringify(this.favoriteJobIds));
        }
      },

      /**
       * Add job to favorites
       * @param {string} jobId - Job ID to add to favorites
       */
      addToFavorites(jobId) {
        if (!this.favoriteJobIds.includes(jobId)) {
          this.favoriteJobIds.push(jobId);
          this.saveFavoritesToStorage();
        }
      },

      /**
       * Remove job from favorites
       * @param {string} jobId - Job ID to remove from favorites
       */
      removeFromFavorites(jobId) {
        const index = this.favoriteJobIds.indexOf(jobId);
        if (index > -1) {
          this.favoriteJobIds.splice(index, 1);
          this.saveFavoritesToStorage();
        }
      },

      /**
       * Toggle job favorite status
       * @param {string} jobId - Job ID to toggle
       */
      toggleFavorite(jobId) {
        if (this.isFavorite(jobId)) {
          this.removeFromFavorites(jobId);
        } else {
          this.addToFavorites(jobId);
        }
      },

      /**
       * Clear all favorites
       */
      clearAllFavorites() {
        this.favoriteJobIds = [];
        this.saveFavoritesToStorage();
      },

      /**
       * Get favorite jobs data
       * @param {Array} allJobs - All jobs data
       * @returns {Array} Favorite jobs
       */
      getFavoriteJobs(allJobs) {
        if (!Array.isArray(allJobs)) return [];

        return allJobs.filter((job) => this.isFavorite(job.id));
      },

      /**
       * Get limited favorite jobs for display
       * @param {Array} allJobs - All jobs array
       * @param {number} limit - Maximum number of jobs to return
       * @returns {Array} Limited favorite jobs
       */
      getLimitedFavoriteJobs(allJobs, limit = 5) {
        const favoriteJobs = this.getFavoriteJobs(allJobs);
        return favoriteJobs.slice(0, limit);
      },

      /**
       * Set selected job
       * @param {Object} job - Job object to select
       */
      setSelectedJob(job) {
        this.selectedJob = job;
        if (process.dev) {
          // eslint-disable-next-line no-console
          console.debug('[jobsStore] selectedJob set');
        }
      },

      /**
       * Get selected job
       * @returns {Object|null} Selected job object
       */
      getSelectedJob() {
        return this.selectedJob;
      },

      /**
       * Clear selected job
       */
      clearSelectedJob() {
        this.selectedJob = null;
        if (process.dev) {
          // eslint-disable-next-line no-console
          console.debug('[jobsStore] selectedJob cleared');
        }
      },
    },
  },
  {
    persist: {
      // Persist only small, navigation-relevant state
      pick: ['selectedJob', 'filters'],
    },
  }
);
