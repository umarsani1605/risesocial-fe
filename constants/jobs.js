/**
 * Jobs constants used across the app
 * Pattern follows `constants/ryls.js` (array of { value, label })
 */

/**
 * Job employment types supported by the LinkedIn API
 * Values are the exact enum strings expected by the backend/API
 */
export const JOB_TYPES = [
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'VOLUNTEER', label: 'Volunteer' },
];

/**
 * Seniority levels. Values match API-accepted labels used in filtering.
 */
export const JOB_SENIORITIES = [
  { value: 'Internship', label: 'Internship' },
  { value: 'Entry level', label: 'Entry level' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Mid-Senior level', label: 'Mid-Senior level' },
  { value: 'Director', label: 'Director' },
  { value: 'Executive', label: 'Executive' },
  { value: 'Not Applicable', label: 'Not Applicable' },
];

/**
 * Helper maps for quick lookup
 */
export const JOB_TYPE_LABEL_BY_VALUE = Object.fromEntries(JOB_TYPES.map((o) => [o.value, o.label]));

export const JOB_SENIORITY_LABEL_BY_VALUE = Object.fromEntries(JOB_SENIORITIES.map((o) => [o.value, o.label]));
