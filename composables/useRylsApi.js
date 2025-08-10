/**
 * RYLS Registration API Composable
 * Handles all API interactions for RYLS registration system
 */

export const useRylsApi = () => {
  const config = useRuntimeConfig();

  /**
   * Check if email is available for registration
   * @param {string} email
   * @returns {Promise<{success: boolean, data: {emailExists: boolean}}>}
   */
  const checkEmailAvailability = async (email) => {
    try {
      const response = await $fetch(`/api/registrations/check-email/${encodeURIComponent(email)}`, {
        baseURL: config.public.backendUrl,
      });
      return response;
    } catch (error) {
      console.error('Error checking email availability:', error);
      throw error;
    }
  };

  /**
   * Upload essay file
   * @param {File} file
   * @returns {Promise<{success: boolean, data: {fileId: string}}>}
   */
  const uploadEssayFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await $fetch('/api/uploads/essay', {
        method: 'POST',
        body: formData,
        baseURL: config.public.backendUrl,
      });
      return response;
    } catch (error) {
      console.error('Error uploading essay file:', error);
      throw error;
    }
  };

  /**
   * Upload headshot file
   * @param {File} file
   * @returns {Promise<{success: boolean, data: {fileId: string}}>}
   */
  const uploadHeadshotFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await $fetch('/api/uploads/headshot', {
        method: 'POST',
        body: formData,
        baseURL: config.public.backendUrl,
      });
      return response;
    } catch (error) {
      console.error('Error uploading headshot file:', error);
      throw error;
    }
  };

  /**
   * Submit fully funded registration
   * @param {Object} registrationData
   * @returns {Promise<{success: boolean, data: {submissionId: string}}>}
   */
  const submitFullyFundedRegistration = async (registrationData) => {
    try {
      const response = await $fetch('/api/registrations/fully-funded', {
        method: 'POST',
        body: registrationData,
        baseURL: config.public.backendUrl,
      });
      return response;
    } catch (error) {
      console.error('Error submitting fully funded registration:', error);
      throw error;
    }
  };

  /**
   * Submit self funded registration
   * @param {Object} registrationData
   * @returns {Promise<{success: boolean, data: {submissionId: string}}>}
   */
  const submitSelfFundedRegistration = async (registrationData) => {
    try {
      const response = await $fetch('/api/registrations/self-funded', {
        method: 'POST',
        body: registrationData,
        baseURL: config.public.backendUrl,
      });
      return response;
    } catch (error) {
      console.error('Error submitting self funded registration:', error);
      throw error;
    }
  };

  /**
   * Get registration by submission ID
   * @param {string} submissionId
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  const getRegistration = async (submissionId) => {
    try {
      const response = await $fetch(`/api/registrations/${submissionId}`, {
        baseURL: config.public.backendUrl,
      });
      return response;
    } catch (error) {
      console.error('Error getting registration:', error);
      throw error;
    }
  };

  /**
   * Health check for registration service
   * @returns {Promise<{success: boolean}>}
   */
  const healthCheck = async () => {
    try {
      const response = await $fetch('/api/registrations/health', {
        baseURL: config.public.backendUrl,
      });
      return response;
    } catch (error) {
      console.error('Error checking service health:', error);
      throw error;
    }
  };

  return {
    checkEmailAvailability,
    uploadEssayFile,
    uploadHeadshotFile,
    submitFullyFundedRegistration,
    submitSelfFundedRegistration,
    getRegistration,
    healthCheck,
  };
};
