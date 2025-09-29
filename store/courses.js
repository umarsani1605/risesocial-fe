import { defineStore } from 'pinia';

/**
 * @typedef {object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {string} slug
 * @property {string} module_slug
 * @property {string} category
 * @property {string} level
 * @property {number} rating
 * @property {number} ratingCount
 * @property {string} duration
 * @property {number} price
 * @property {boolean} completed
 * @property {Array} syllabus
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {object} CoursesState
 * @property {Course[]} courses
 * @property {boolean} isLoading
 * @property {string|null} error
 * @property {boolean} isInitialized
 * @property {object} cache - Cache untuk course details
 * @property {object} userProgress - User progress untuk courses
 */

export const useCoursesStore = defineStore('courses', {
  /**
   * @returns {CoursesState}
   */
  state: () => ({
    courses: [],
    isLoading: false,
    error: null,
    isInitialized: false,
    cache: {}, // Cache untuk course details
    userProgress: {}, // User progress untuk each course
  }),

  getters: {
    /**
     * Get courses count
     * @param {CoursesState} state
     * @returns {number}
     */
    coursesCount: (state) => state.courses.length,

    /**
     * Get courses by category
     * @param {CoursesState} state
     * @returns {Function}
     */
    getCoursesByCategory: (state) => (category) => {
      if (!category || category === 'all') return state.courses;
      return state.courses.filter((course) => course.category?.toLowerCase() === category.toLowerCase());
    },

    /**
     * Get courses by level
     * @param {CoursesState} state
     * @returns {Function}
     */
    getCoursesByLevel: (state) => (level) => {
      if (!level || level === 'all') return state.courses;
      return state.courses.filter((course) => course.level?.toLowerCase() === level.toLowerCase());
    },

    /**
     * Get completed courses
     * @param {CoursesState} state
     * @returns {Course[]}
     */
    completedCourses: (state) => {
      return state.courses.filter((course) => course.completed);
    },

    /**
     * Get in-progress courses
     * @param {CoursesState} state
     * @returns {Course[]}
     */
    inProgressCourses: (state) => {
      return state.courses.filter((course) => !course.completed);
    },

    /**
     * Get popular courses (rating >= 4.5)
     * @param {CoursesState} state
     * @returns {Course[]}
     */
    popularCourses: (state) => {
      return state.courses.filter((course) => course.rating >= 4.5);
    },

    /**
     * Find course by slug
     * @param {CoursesState} state
     * @returns {Function}
     */
    findCourseBySlug: (state) => (slug) => {
      return state.courses.find((course) => course.module_slug === slug || course.slug === slug);
    },

    /**
     * Get course from cache
     * @param {CoursesState} state
     * @returns {Function}
     */
    getCachedCourse: (state) => (slug) => {
      return state.cache[slug];
    },

    /**
     * Get user progress for course
     * @param {CoursesState} state
     * @returns {Function}
     */
    getUserProgress: (state) => (courseId) => {
      return state.userProgress[courseId];
    },

    /**
     * Get unique categories
     * @param {CoursesState} state
     * @returns {string[]}
     */
    uniqueCategories: (state) => {
      const categories = new Set();
      state.courses.forEach((course) => {
        if (course.category) {
          categories.add(course.category);
        }
      });
      return Array.from(categories).sort();
    },

    /**
     * Get courses by rating
     * @param {CoursesState} state
     * @returns {Function}
     */
    getCoursesByRating:
      (state) =>
      (minRating = 4.5) => {
        return state.courses.filter((course) => course.rating >= minRating);
      },
  },

  actions: {
    /**
     * Fetch all courses with fallback to static data
     * @returns {Promise<Course[]>} Courses data
     */
    async fetchCourses() {
      if (this.isLoading) return this.courses;

      this.isLoading = true;
      this.error = null;

      try {
        // Try to fetch from programs API first
        const { $api } = useNuxtApp();
        const response = await $api.get('/programs');

        if (response.success && response.data) {
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

          this.courses = transformedData;
          this.isInitialized = true;
          return transformedData;
        }

        throw new Error('Failed to fetch courses from API');
      } catch (error) {
        console.warn('Failed to fetch courses from API, using static data:', error);

        // Fallback ke static data
        try {
          const staticDataModule = await import('~/data/data.json');
          const staticModulesData = staticDataModule.modulesData || [];

          this.courses = staticModulesData;
          this.isInitialized = true;
          return staticModulesData;
        } catch (staticError) {
          console.error('Failed to load static data fallback:', staticError);
          this.error = 'Gagal memuat data course';
          this.courses = [];
          return [];
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Initialize courses data
     * @returns {Promise<Course[]>} Courses data
     */
    async initializeCourses() {
      if (this.isInitialized && this.courses.length > 0) {
        return this.courses;
      }
      return await this.fetchCourses();
    },

    /**
     * Get course by slug with caching
     * @param {string} slug - Course slug
     * @returns {Promise<Course|null>} Course data
     */
    async getCourseBySlug(slug) {
      if (!slug) return null;

      // Check cache first
      if (this.cache[slug]) {
        return this.cache[slug];
      }

      // Initialize courses if not loaded
      await this.initializeCourses();

      // Check in current courses list
      const existingCourse = this.findCourseBySlug(slug);
      if (existingCourse) {
        this.cache[slug] = existingCourse;
        return existingCourse;
      }

      return null;
    },

    /**
     * Search courses
     * @param {string} searchTerm - Search term
     * @param {object} filters - Additional filters
     * @returns {Course[]} Search results
     */
    searchCourses(searchTerm, filters = {}) {
      let results = [...this.courses];

      // Text search
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (course) =>
            course.title.toLowerCase().includes(term) || course.name.toLowerCase().includes(term) || course.description.toLowerCase().includes(term)
        );
      }

      // Category filter
      if (filters.category && filters.category !== 'all') {
        results = results.filter((course) => course.category?.toLowerCase() === filters.category.toLowerCase());
      }

      // Level filter
      if (filters.level && filters.level !== 'all') {
        results = results.filter((course) => course.level?.toLowerCase() === filters.level.toLowerCase());
      }

      // Rating filter
      if (filters.minRating) {
        results = results.filter((course) => course.rating >= filters.minRating);
      }

      // Completion status filter
      if (filters.completed !== undefined) {
        results = results.filter((course) => course.completed === filters.completed);
      }

      return results;
    },

    /**
     * Get recommended courses based on category
     * @param {string} currentCourseSlug - Current course slug
     * @param {number} limit - Number of recommendations
     * @returns {Course[]} Recommended courses
     */
    getRecommendedCourses(currentCourseSlug, limit = 5) {
      const currentCourse = this.findCourseBySlug(currentCourseSlug);
      if (!currentCourse) return [];

      // Find courses in same category, exclude current course
      const sameCategoryCourses = this.courses.filter(
        (course) => course.category === currentCourse.category && course.module_slug !== currentCourseSlug && course.slug !== currentCourseSlug
      );

      // Sort by rating and take limited
      return sameCategoryCourses.sort((a, b) => b.rating - a.rating).slice(0, limit);
    },

    /**
     * Update course progress
     * @param {string} courseId - Course ID
     * @param {object} progressData - Progress data
     */
    updateCourseProgress(courseId, progressData) {
      this.userProgress[courseId] = progressData;

      // Update course completion status if needed
      const course = this.courses.find((c) => c.id === courseId);
      if (course && progressData.completed !== undefined) {
        course.completed = progressData.completed;
      }
    },

    /**
     * Get course progress percentage
     * @param {Course} course - Course object
     * @returns {number} Progress percentage (0-100)
     */
    getCourseProgress(course) {
      if (!course.syllabus || course.syllabus.length === 0) return 0;

      const completedSyllabus = course.syllabus.filter((s) => s.completed).length;
      return Math.round((completedSyllabus / course.syllabus.length) * 100);
    },

    /**
     * Get course modules count
     * @param {Course} course - Course object
     * @returns {object} Modules count info
     */
    getCourseModulesCount(course) {
      if (!course.syllabus || course.syllabus.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
      }

      const completed = course.syllabus.filter((s) => s.completed).length;
      const total = course.syllabus.length;
      const percentage = Math.round((completed / total) * 100);

      return { completed, total, percentage };
    },

    /**
     * Refresh courses data
     * @returns {Promise<Course[]>} Fresh courses data
     */
    async refreshCourses() {
      this.courses = [];
      this.cache = {};
      this.isInitialized = false;
      return await this.fetchCourses();
    },

    /**
     * Clear cache for specific course
     * @param {string} slug - Course slug
     */
    clearCourseCache(slug) {
      if (slug && this.cache[slug]) {
        delete this.cache[slug];
      }
    },

    /**
     * Clear all cache
     */
    clearAllCache() {
      this.cache = {};
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    },

    /**
     * Add or update course in store
     * @param {Course} course - Course to add/update
     */
    upsertCourse(course) {
      const existingIndex = this.courses.findIndex((c) => c.id === course.id);
      if (existingIndex !== -1) {
        this.courses[existingIndex] = course;
      } else {
        this.courses.push(course);
      }

      // Update cache if exists
      const cacheKey = course.module_slug || course.slug;
      if (cacheKey && this.cache[cacheKey]) {
        this.cache[cacheKey] = course;
      }
    },
  },
});
