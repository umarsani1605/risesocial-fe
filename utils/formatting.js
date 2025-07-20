/**
 * Formatting utilities untuk Rise Social
 * Contains functions for formatting prices, dates, and other common formats
 */

/**
 * Format price to Indonesian Rupiah format
 * @param {number} price - Price in number format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date string or Date object
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('id-ID', defaultOptions).format(dateObj);
};

/**
 * Format date to relative time (e.g., "2 hari yang lalu")
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} hari yang lalu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} tahun yang lalu`;
};

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (!num || isNaN(num)) return '0';

  return new Intl.NumberFormat('id-ID').format(num);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100, suffix = '...') => {
  if (!text) return '';

  if (text.length <= length) return text;

  return text.substring(0, length).trim() + suffix;
};

/**
 * Normalize company name untuk URL slug
 * @param {string} name - Company name
 * @returns {string} Normalized company name
 */
export const normalizeCompanyName = (name) => {
  if (!name) return '';

  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Normalize job title untuk URL slug
 * @param {string} title - Job title
 * @returns {string} Normalized job title
 */
export const normalizeJobTitle = (title) => {
  if (!title) return '';

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Clean location string
 * @param {object} job - Job object
 * @returns {string} Clean location string
 */
export const getCleanLocation = (job) => {
  if (!job) return '';

  // Check if remote
  if (job.is_remote || job.remote) {
    return 'Remote';
  }

  // Get location from various fields
  const location = job.location || job.job_location || job.linkedin_job_location || '';

  if (!location) return '';

  // Clean up location string
  return location
    .replace(/,\s*Indonesia/gi, '')
    .replace(/\s*,\s*ID$/gi, '')
    .replace(/\s*,\s*$/g, '')
    .trim();
};

/**
 * Format duration (e.g., "3 bulan", "2 weeks")
 * @param {string|number} duration - Duration value
 * @param {string} unit - Duration unit (optional)
 * @returns {string} Formatted duration
 */
export const formatDuration = (duration, unit = '') => {
  if (!duration) return '';

  // If duration already includes unit
  if (typeof duration === 'string' && isNaN(duration)) {
    return duration;
  }

  const num = parseInt(duration);
  if (isNaN(num)) return '';

  // Default unit mapping
  const unitMap = {
    month: num === 1 ? 'bulan' : 'bulan',
    week: num === 1 ? 'minggu' : 'minggu',
    day: num === 1 ? 'hari' : 'hari',
    hour: num === 1 ? 'jam' : 'jam',
  };

  const mappedUnit = unitMap[unit] || unit;

  return `${num} ${mappedUnit}`;
};
