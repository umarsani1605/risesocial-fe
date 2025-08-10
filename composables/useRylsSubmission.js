/**
 * RYLS Registration Submission Composable
 * Handles complete registration form submission process
 */

import { useRylsRegistrationStore } from '@/store/rylsRegistration';

export const useRylsSubmission = () => {
  const isSubmitting = ref(false);
  const submissionError = ref(null);
  const submissionSuccess = ref(false);
  const submissionId = ref(null);

  const store = useRylsRegistrationStore();
  const { submitFullyFundedRegistration, submitSelfFundedRegistration } = useRylsApi();

  /**
   * Prepare fully funded registration data
   * @returns {Object}
   */
  const prepareFullyFundedData = () => {
    return {
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
      },
      essayTopic: store.essayTopic,
      essayFileId: store.essayFile,
      essayDescription: store.essayDescription,
    };
  };

  /**
   * Prepare self funded registration data
   * @returns {Object}
   */
  const prepareSelfFundedData = () => {
    return {
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
      },
      passportNumber: store.passportNumber,
      needVisa: store.needVisa,
      headshotFileId: store.headshotFile,
      readPolicies: store.readPolicies,
    };
  };

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
      console.log('Prepared registration data:', JSON.stringify(registrationData, null, 2));

      // Validate required data
      if (!registrationData.essayFileId) {
        throw new Error('Essay file belum diupload');
      }

      const response = await submitFullyFundedRegistration(registrationData);

      if (response.success) {
        submissionSuccess.value = true;
        submissionId.value = response.data.submissionId;

        // Clear store after successful submission
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

      // Validate required data
      if (!registrationData.headshotFileId) {
        throw new Error('Headshot file belum diupload');
      }

      const response = await submitSelfFundedRegistration(registrationData);

      if (response.success) {
        submissionSuccess.value = true;
        submissionId.value = response.data.submissionId;

        // Clear store after successful submission
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
   * Reset submission state
   */
  const resetSubmissionState = () => {
    isSubmitting.value = false;
    submissionError.value = null;
    submissionSuccess.value = false;
    submissionId.value = null;
  };

  return {
    isSubmitting: readonly(isSubmitting),
    submissionError: readonly(submissionError),
    submissionSuccess: readonly(submissionSuccess),
    submissionId: readonly(submissionId),
    submitFullyFunded,
    submitSelfFunded,
    resetSubmissionState,
  };
};
