import { formatRelativeTime, formatPrice, getCleanLocation, normalizeCompanyName, normalizeJobTitle } from '~/utils/formatting';

/**
 * Composable untuk mengelola detail job dengan API terintegrasi
 * Digunakan untuk halaman detail job
 * @param {string} companyName - Company name
 * @param {string} jobSlug - Job slug
 * @returns {object} Object berisi data dan methods job detail
 */
export const useJobDetails = (companyName, jobSlug) => {
  const { $fetch } = useNuxtApp()
  
  /**
   * Transform job data untuk frontend compatibility
   * @param {object} job - Raw job data
   * @returns {object} Transformed job data
   */
  const transformJobData = (job) => {
    if (!job) return null;

    return {
      ...job,
      // Add computed fields
      cleanLocation: getCleanLocation(job),
      relativeTime: formatRelativeTime(job.date_posted || job.created_at),
      companySlug: normalizeCompanyName(job.organization || job.company),
      jobSlug: normalizeJobTitle(job.title),

      // Normalize field names
      company: job.company || job.organization,
      location: job.location || job.job_location || job.linkedin_job_location,
      industry: job.industry || job.linkedin_org_industry,
      jobType: job.job_type || job.employment_type,

      // Ensure arrays
      skills: Array.isArray(job.skills) ? job.skills : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      requirements: Array.isArray(job.requirements) ? job.requirements : [],

      // Boolean fields
      isRemote: job.is_remote || job.remote || false,
      isUrgent: job.is_urgent || job.urgent || false,
      isFeatured: job.is_featured || job.featured || false,

      // Default values
      salary: job.salary || null,
      salaryMin: job.salary_min || null,
      salaryMax: job.salary_max || null,
      experience: job.experience || job.experience_level || '',
      education: job.education || job.education_level || '',

      // Dates
      datePosted: job.date_posted || job.created_at,
      deadline: job.deadline || job.application_deadline,

      // Company info
      companyLogo: job.company_logo || job.linkedin_org_logo,
      companySize: job.company_size || job.linkedin_org_size,
      companyWebsite: job.company_website || job.linkedin_org_website,
    };
  };
  
  // Reactive state
  const job = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Computed properties
  const isLoaded = computed(() => !!job.value);
  const hasError = computed(() => !!error.value);

  /**
   * Fetch job detail by company and slug
   * @returns {Promise<object|null>} Job data
   */
  const fetchJob = async () => {
    if (!companyName || !jobSlug) {
      error.value = 'Company name and job slug are required';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/jobs/${companyName}/${jobSlug}`);
      const transformedJob = transformJobData(response.data || response);
      job.value = transformedJob;
      return transformedJob;
    } catch (err) {
      console.error('Error fetching job details:', err);
      error.value = err.data?.message || 'Gagal memuat detail job';
      job.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch job detail by ID (alternative method)
   * @param {string} jobId - Job ID
   * @returns {Promise<object|null>} Job data
   */
  const fetchJobById = async (jobId) => {
    if (!jobId) {
      error.value = 'Job ID is required';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/jobs/${jobId}`, {
        baseURL: config.public.backendUrl
      });
      const transformedJob = transformJobData(response.data || response);
      job.value = transformedJob;
      return transformedJob;
    } catch (err) {
      console.error('Error fetching job details by ID:', err);
      error.value = err.data?.message || 'Gagal memuat detail job';
      job.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh job data
   * @returns {Promise<object|null>} Fresh job data
   */
  const refreshJob = async () => {
    return await fetchJob();
  };

  /**
   * Apply to job
   * @param {object} applicationData - Application data
   * @returns {Promise<object|null>} Application result
   */
  const applyToJob = async (applicationData) => {
    if (!job.value?.id) {
      error.value = 'Job not loaded';
      return null;
    }

    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`/api/jobs/${job.value.id}/apply`, {
        method: 'POST',
        body: applicationData,
        baseURL: config.public.backendUrl
      });
      return response.data || response;
    } catch (err) {
      console.error('Error applying to job:', err);
      error.value = err.data?.message || 'Gagal melamar pekerjaan';
      return null;
    }
  };

  /**
   * Get job requirements
   * @returns {Array} Requirements array
   */
  const getRequirements = () => {
    return job.value?.requirements || [];
  };

  /**
   * Get job benefits
   * @returns {Array} Benefits array
   */
  const getBenefits = () => {
    return job.value?.benefits || [];
  };

  /**
   * Get job skills
   * @returns {Array} Skills array
   */
  const getSkills = () => {
    return job.value?.skills || [];
  };

  /**
   * Get formatted salary range
   * @returns {string} Formatted salary
   */
  const getFormattedSalary = () => {
    if (!job.value) return '';

    const { salaryMin, salaryMax, salary } = job.value;

    if (salary) {
      return formatPrice(salary);
    }

    if (salaryMin && salaryMax) {
      return `${formatPrice(salaryMin)} - ${formatPrice(salaryMax)}`;
    }

    if (salaryMin) {
      return `Dari ${formatPrice(salaryMin)}`;
    }

    if (salaryMax) {
      return `Hingga ${formatPrice(salaryMax)}`;
    }

    return 'Gaji dapat dinegosiasi';
  };

  /**
   * Get formatted job location
   * @returns {string} Formatted location
   */
  const getFormattedLocation = () => {
    if (!job.value) return '';

    if (job.value.isRemote) {
      return 'Remote';
    }

    return job.value.cleanLocation || job.value.location || 'Lokasi tidak disebutkan';
  };

  /**
   * Get formatted job type
   * @returns {string} Formatted job type
   */
  const getFormattedJobType = () => {
    if (!job.value?.jobType) return 'Full-time';

    const jobType = Array.isArray(job.value.jobType) ? job.value.jobType[0] : job.value.jobType;

    return jobType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-');
  };

  /**
   * Get formatted experience level
   * @returns {string} Formatted experience
   */
  const getFormattedExperience = () => {
    if (!job.value?.experience) return 'Tidak disebutkan';

    return job.value.experience;
  };

  /**
   * Get formatted education level
   * @returns {string} Formatted education
   */
  const getFormattedEducation = () => {
    if (!job.value?.education) return 'Tidak disebutkan';

    return job.value.education;
  };

  /**
   * Get relative time since posted
   * @returns {string} Relative time
   */
  const getTimePosted = () => {
    if (!job.value?.datePosted) return '';

    return formatRelativeTime(job.value.datePosted);
  };

  /**
   * Get application deadline
   * @returns {string} Formatted deadline
   */
  const getApplicationDeadline = () => {
    if (!job.value?.deadline) return '';

    const deadline = new Date(job.value.deadline);
    const now = new Date();

    if (deadline < now) {
      return 'Sudah berakhir';
    }

    return deadline.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Check if job is still open for applications
   * @returns {boolean} Whether job is still open
   */
  const isJobOpen = () => {
    if (!job.value) return false;

    // Check if job has deadline
    if (job.value.deadline) {
      const deadline = new Date(job.value.deadline);
      const now = new Date();
      return now <= deadline;
    }

    // If no deadline, assume it's open
    return true;
  };

  /**
   * Check if job is urgent
   * @returns {boolean} Whether job is urgent
   */
  const isUrgent = () => {
    return job.value?.isUrgent || false;
  };

  /**
   * Check if job is featured
   * @returns {boolean} Whether job is featured
   */
  const isFeatured = () => {
    return job.value?.isFeatured || false;
  };

  /**
   * Get company information
   * @returns {object} Company info
   */
  const getCompanyInfo = () => {
    if (!job.value) return {};

    return {
      name: job.value.company,
      logo: job.value.companyLogo,
      size: job.value.companySize,
      website: job.value.companyWebsite,
      industry: job.value.industry,
    };
  };

  // Auto-fetch when params change
  watch(
    [() => companyName, () => jobSlug],
    async ([newCompany, newSlug]) => {
      if (newCompany && newSlug) {
        await fetchJob();
      }
    },
    { immediate: true }
  );

  return {
    // Reactive state
    job: readonly(job),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isLoaded,
    hasError,

    // Methods
    fetchJob,
    fetchJobById,
    refreshJob,
    applyToJob,

    // Data getters
    getRequirements,
    getBenefits,
    getSkills,
    getCompanyInfo,

    // Formatted getters
    getFormattedSalary,
    getFormattedLocation,
    getFormattedJobType,
    getFormattedExperience,
    getFormattedEducation,
    getTimePosted,
    getApplicationDeadline,

    // Status checkers
    isJobOpen,
    isUrgent,
    isFeatured,
  };
};
