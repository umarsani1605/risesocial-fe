import { defineStore } from 'pinia';

/**
 * @typedef {object} JobsState
 * @property {Array} favoriteJobIds - User's favorite job IDs
 * @property {boolean} isLoading - Loading status for favorites
 * @property {string} error - Error message if any
 */

export const useJobsStore = defineStore('jobs', {
  /**
   * @returns {JobsState}
   */
  state: () => ({
    favoriteJobIds: [],
    isLoading: false,
    error: null,
  }),

  getters: {
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
  },
});
