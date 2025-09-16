/**
 * RYLS Registration Composable
 * Handles all registration-related API calls and submission logic
 */

import { ref } from 'vue';
import { useRylsRegistrationStore } from '@/store/rylsRegistration';

export const useRylsSubmission = () => {
  const { $api } = useNuxtApp();
  const isSubmitting = ref(false);
  const submissionError = ref(null);
  const submissionSuccess = ref(false);
  const submissionId = ref(null);
  const submission = ref(null);

  const store = useRylsRegistrationStore();

  /**
   * Submit registration with payment details
   * @param {Object} registrationData - Complete registration data
   * @returns {Promise<boolean>} - Whether submission was successful
   */
  const submitRegistration = async (registrationData) => {
    isSubmitting.value = true;
    submission.value = null;
    submissionError.value = null;
    submissionSuccess.value = false;

    try {
      if (!registrationData) {
        throw new Error('Registration data is required');
      }

      console.log('Registration data:', registrationData);

      const response = await $api('/ryls/registrations', {
        method: 'POST',
        body: registrationData,
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit registration');
      }

      submission.value = response.data;

      return submission.value;
    } catch (error) {
      console.error('Registration submission error:', error);
      submissionError.value = error.message || 'Failed to submit registration';
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Get submission status
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object>} Submission status data
   */
  const getSubmissionStatus = async (submissionId) => {
    if (!submissionId) {
      throw new Error('Submission ID is required');
    }

    try {
      const response = await $api(`/api/ryls/registrations/${submissionId}/status`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to get submission status');
      }

      return response.data;
    } catch (error) {
      console.error('Error getting submission status:', error);
      throw error;
    }
  };

  // =====================
  // File Upload Methods
  // =====================

  /**
   * Upload essay file
   * @param {File} file
   * @returns {Promise<{success: boolean, data: {fileId: string}}>}
   */
  const uploadEssayFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await $api('/uploads/essay', {
        method: 'POST',
        body: formData,
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

      const response = await $api('/uploads/headshot', {
        method: 'POST',
        body: formData,
      });
      return response;
    } catch (error) {
      console.error('Error uploading headshot file:', error);
      throw error;
    }
  };

  /**
   * Upload payment proof file
   * @param {File} file - The payment proof file to upload
   * @returns {Promise<{success: boolean, data: {fileId: string}}>}
   */
  const uploadPaymentProofFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await $api('/uploads/payment-proof', {
        method: 'POST',
        body: formData,
      });
      return response;
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      throw error;
    }
  };

  // =====================
  // Registration Methods
  // =====================

  /**
   * Prepare fully funded registration data
   * @returns {Object}
   */
  const prepareFullyFundedData = () => ({
    step1: {
      fullName: store.step1.fullName,
      email: store.step1.email,
      residence: store.step1.residence,
      nationality: store.step1.nationality,
      secondNationality: store.step1.secondNationality || null,
      whatsapp: store.step1.whatsapp,
      institution: store.step1.institution,
      dateOfBirth: store.step1.dateOfBirth,
      gender: store.step1.gender,
      discoverSource: store.step1.discoverSource,
      discoverOtherText: store.step1.discoverOtherText || null,
      scholarshipType: store.step1.scholarshipType,
      paymentType: store.paymentType,
      paymentStatus: store.paymentStatus,
    },
    essayTopic: store.essayTopic,
    essayFileId: store.essayFile,
    essayDescription: store.essayDescription,
    paymentProof: store.paymentProof,
    paymentType: store.paymentType,
    paymentStatus: store.paymentStatus,
  });

  /**
   * Prepare self funded registration data
   * @returns {Object}
   */
  const prepareSelfFundedData = () => ({
    step1: {
      fullName: store.step1.fullName,
      email: store.step1.email,
      residence: store.step1.residence,
      nationality: store.step1.nationality,
      secondNationality: store.step1.secondNationality || null,
      whatsapp: store.step1.whatsapp,
      institution: store.step1.institution,
      dateOfBirth: store.step1.dateOfBirth,
      gender: store.step1.gender,
      discoverSource: store.step1.discoverSource,
      discoverOtherText: store.step1.discoverOtherText || null,
      scholarshipType: store.step1.scholarshipType,
      paymentType: store.paymentType,
      paymentStatus: store.paymentStatus,
    },
    passportNumber: store.passportNumber,
    needVisa: store.needVisa,
    headshotFileId: store.headshotFile,
    readPolicies: store.readPolicies,
    paymentProof: store.paymentProof,
    paymentType: store.paymentType,
    paymentStatus: store.paymentStatus,
  });

  /**
   * Submit fully funded registration
   * @returns {Promise<boolean>}
   */
  const submitFullyFunded = async () => {
    isSubmitting.value = true;
    submissionError.value = null;
    submissionSuccess.value = false;

    try {
      const registrationData = prepareFullyFundedData();

      if (!registrationData.essayFileId) {
        throw new Error('Essay file belum diupload');
      }

      const response = await $api('/ryls/registrations/fully-funded', {
        method: 'POST',
        body: registrationData,
      });

      if (response.success) {
        submissionSuccess.value = true;
        submissionId.value = response.data.submissionId;
        store.resetAll();
        return true;
      } else {
        submissionError.value = response.message || 'Submission gagal';
        return false;
      }
    } catch (error) {
      submissionError.value = error.message || error.data?.message || 'Submission gagal';
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Submit self funded registration
   * @returns {Promise<boolean>}
   */
  const submitSelfFunded = async () => {
    isSubmitting.value = true;
    submissionError.value = null;
    submissionSuccess.value = false;

    try {
      const registrationData = prepareSelfFundedData();

      if (!registrationData.headshotFileId) {
        throw new Error('Headshot file belum diupload');
      }

      const response = await $api('/ryls/registrations/self-funded', {
        method: 'POST',
        body: registrationData,
      });

      if (response.success) {
        submissionSuccess.value = true;
        submissionId.value = response.data.submissionId;
        store.resetAll();
        return true;
      } else {
        submissionError.value = response.message || 'Submission gagal';
        return false;
      }
    } catch (error) {
      submissionError.value = error.message || error.data?.message || 'Submission gagal';
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  // =====================
  // Utility Methods
  // =====================

  /**
   * Get registration by submission ID
   * @param {string} submissionId
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  const getRegistration = async (submissionId) => {
    try {
      const response = await $api(`/api/ryls/registrations/submission/${submissionId}`);
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
      const response = await $api('/ryls/registrations/health');
      return response;
    } catch (error) {
      console.error('Error checking service health:', error);
      throw error;
    }
  };

  /**
   * Reset submission state
   */
  const resetSubmissionState = () => {
    isSubmitting.value = false;
    submissionError.value = null;
  };

  return {
    // State
    isSubmitting: readonly(isSubmitting),
    submissionError: readonly(submissionError),
    submissionSuccess: readonly(submissionSuccess),
    submissionId: readonly(submissionId),

    // Methods
    uploadEssayFile,
    uploadHeadshotFile,
    uploadPaymentProofFile,
    submitRegistration,
    getSubmissionStatus,

    // Legacy methods (deprecated, will be removed in future versions)
    submitFullyFunded: async () => {
      console.warn('submitFullyFunded is deprecated. Use submitRegistration instead.');
      const data = store.getAllRegistrationData;
      return submitRegistration({
        ...data,
        scholarshipType: 'FULLY_FUNDED',
      });
    },
    submitSelfFunded: async () => {
      console.warn('submitSelfFunded is deprecated. Use submitRegistration instead.');
      const data = store.getAllRegistrationData;
      return submitRegistration({
        ...data,
        scholarshipType: 'SELF_FUNDED',
      });
    },

    // Registration Data
    getRegistration,
    healthCheck,

    // Utilities
    resetSubmissionState,
  };
};
