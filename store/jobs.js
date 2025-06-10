import { defineStore } from 'pinia';
import jobsData from '@/data/jobs.json';

/**
 * @typedef {object} JobFilter
 * @property {string} title - Filter by job title
 * @property {string} organization - Filter by organization name
 * @property {string} location - Filter by location
 * @property {string} industry - Filter by industry
 * @property {string} jobType - Filter by job type
 */

/**
 * @typedef {object} JobsState
 * @property {Array} jobs - All job data
 * @property {JobFilter} filters - Active filters
 * @property {number} currentPage - Current page for pagination
 * @property {number} itemsPerPage - Number of items per page
 * @property {boolean} isLoading - Loading status
 */

export const useJobsStore = defineStore('jobs', {
  /**
   * @returns {JobsState}
   */
  state: () => ({
    jobs: [],
    filters: {
      title: '',
      organization: '',
      location: 'all',
      industry: 'all',
      jobType: 'all',
    },
    currentPage: 1,
    itemsPerPage: 12,
    isLoading: false,
  }),

  getters: {
    /**
     * Process all jobs with additional data
     * @param {JobsState} state
     * @returns {Array}
     */
    processedJobs: (state) => {
      return state.jobs.map((job) => ({
        ...job,
        cleanLocation: getCleanLocation(job),
        relativeTime: getRelativeTime(job.date_posted),
        companySlug: normalizeCompanyName(job.organization),
        jobSlug: normalizeJobName(job.title),
      }));
    },

    /**
     * Filter jobs based on active criteria
     * @param {JobsState} state
     * @returns {Array}
     */
    filteredJobs() {
      let filtered = [...this.processedJobs];

      // Filter by title
      if (this.filters.title.trim()) {
        const searchTerm = this.filters.title.toLowerCase().trim();
        filtered = filtered.filter((job) => job.title.toLowerCase().includes(searchTerm));
      }

      // Filter by organization
      if (this.filters.organization.trim()) {
        const searchTerm = this.filters.organization.toLowerCase().trim();
        filtered = filtered.filter((job) => job.organization.toLowerCase().includes(searchTerm));
      }

      // Filter by location
      if (this.filters.location && this.filters.location !== '' && this.filters.location !== 'all') {
        filtered = filtered.filter((job) => {
          if (this.filters.location === 'remote') {
            return job.cleanLocation === 'Remote';
          }
          return job.cleanLocation.toLowerCase().includes(this.filters.location.toLowerCase());
        });
      }

      // Filter by industry
      if (this.filters.industry && this.filters.industry !== '' && this.filters.industry !== 'all') {
        filtered = filtered.filter(
          (job) => job.linkedin_org_industry && job.linkedin_org_industry.toLowerCase().includes(this.filters.industry.toLowerCase())
        );
      }

      // Filter by job type
      if (this.filters.jobType && this.filters.jobType !== '' && this.filters.jobType !== 'all') {
        filtered = filtered.filter((job) => {
          if (!job.employment_type || job.employment_type.length === 0) return false;

          const jobType = this.filters.jobType.toLowerCase();
          const employmentType = job.employment_type[0].toLowerCase();

          // Map job types
          const typeMapping = {
            full_time: ['full_time', 'full-time'],
            part_time: ['part_time', 'part-time'],
            contract: ['contract', 'contractor'],
            temporary: ['temporary', 'temp'],
            internship: ['internship', 'intern'],
            freelance: ['freelance', 'contractor'],
          };

          if (typeMapping[jobType]) {
            return typeMapping[jobType].some((type) => employmentType.includes(type));
          }

          return employmentType.includes(jobType);
        });
      }

      return filtered;
    },

    /**
     * Paginated jobs
     * @param {JobsState} state
     * @returns {Array}
     */
    paginatedJobs() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredJobs.slice(startIndex, endIndex);
    },

    /**
     * Total pages based on filtered jobs
     * @param {JobsState} state
     * @returns {number}
     */
    totalPages() {
      return Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    },

    /**
     * Get unique locations from all jobs
     * @param {JobsState} state
     * @returns {Array<string>}
     */
    uniqueLocations() {
      const locations = new Set();
      this.processedJobs.forEach((job) => {
        if (job.cleanLocation && job.cleanLocation !== 'Remote') {
          locations.add(job.cleanLocation);
        }
      });
      return Array.from(locations).sort();
    },

    /**
     * Get unique industries from all jobs
     * @param {JobsState} state
     * @returns {Array<string>}
     */
    uniqueIndustries() {
      const industries = new Set();
      this.processedJobs.forEach((job) => {
        if (job.linkedin_org_industry) {
          industries.add(job.linkedin_org_industry);
        }
      });
      return Array.from(industries).sort();
    },

    /**
     * Get unique job types from all jobs
     * @param {JobsState} state
     * @returns {Array<string>}
     */
    uniqueJobTypes() {
      const jobTypes = new Set();
      this.processedJobs.forEach((job) => {
        if (job.employment_type && job.employment_type.length > 0) {
          // Normalize employment type for display
          const type = job.employment_type[0];
          let displayType = type.replace('_', ' ').toLowerCase();
          displayType = displayType.charAt(0).toUpperCase() + displayType.slice(1);
          jobTypes.add(displayType);
        }
      });
      return Array.from(jobTypes).sort();
    },

    /**
     * Check if any filter is active
     * @param {JobsState} state
     * @returns {boolean}
     */
    hasActiveFilters() {
      return !!(
        this.filters.title ||
        this.filters.organization ||
        (this.filters.location && this.filters.location !== 'all') ||
        (this.filters.industry && this.filters.industry !== 'all') ||
        (this.filters.jobType && this.filters.jobType !== 'all')
      );
    },

    /**
     * Get visible page numbers for pagination
     * @param {JobsState} state
     * @returns {Array<number>}
     */
    visiblePages() {
      const pages = [];
      const totalPagesValue = this.totalPages;
      const currentPageValue = this.currentPage;

      if (totalPagesValue <= 5) {
        // Show all pages if total is 5 or less
        for (let i = 1; i <= totalPagesValue; i++) {
          pages.push(i);
        }
      } else {
        // Show current page and surrounding pages
        const start = Math.max(1, currentPageValue - 2);
        const end = Math.min(totalPagesValue, currentPageValue + 2);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }

      return pages;
    },
  },

  actions: {
    /**
     * Initialize jobs data
     */
    async initializeJobs() {
      this.isLoading = true;
      try {
        this.jobs = jobsData;
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update specific filter
     * @param {string} filterType - Type of filter to update
     * @param {string} value - New filter value
     */
    updateFilter(filterType, value) {
      if (this.filters.hasOwnProperty(filterType)) {
        this.filters[filterType] = value;
        // Reset to first page when filters change
        this.currentPage = 1;
      }
    },

    /**
     * Clear all filters
     */
    clearAllFilters() {
      this.filters = {
        title: '',
        organization: '',
        location: 'all',
        industry: 'all',
        jobType: 'all',
      };
      this.currentPage = 1;
    },

    /**
     * Set current page
     * @param {number} page - Page number to set
     */
    setCurrentPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    /**
     * Go to next page
     */
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    /**
     * Go to previous page
     */
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    /**
     * Set items per page
     * @param {number} count - Number of items per page
     */
    setItemsPerPage(count) {
      this.itemsPerPage = count;
      this.currentPage = 1; // Reset to first page
    },
  },
});

/**
 * Helper function to normalize company name for URL
 * @param {string} name - Company name to normalize
 * @returns {string}
 */
function normalizeCompanyName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .trim();
}

/**
 * Helper function to normalize job name for URL
 * @param {string} title - Job title to normalize
 * @returns {string}
 */
function normalizeJobName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .trim();
}

/**
 * Helper function to get clean location
 * @param {object} job - Job object
 * @returns {string}
 */
function getCleanLocation(job) {
  if (job.cities_derived && job.cities_derived.length > 0 && job.countries_derived && job.countries_derived.length > 0) {
    return `${job.cities_derived[0]}, ${job.countries_derived[0]}`;
  }
  if (job.countries_derived && job.countries_derived.length > 0) {
    return job.countries_derived[0];
  }
  return 'Remote';
}

/**
 * Helper function to convert date to relative time
 * @param {string} dateString - Date string to convert
 * @returns {string}
 */
function getRelativeTime(dateString) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now - postDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1d ago';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 14) return '1w ago';
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 60) return '1mo ago';
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  return `${Math.floor(diffInDays / 365)}y ago`;
}
