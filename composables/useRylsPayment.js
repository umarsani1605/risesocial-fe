import { api } from '@/utils/api';
import { useMidtransSnap } from './useMidtransSnap';

export const useRylsPayment = () => {
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Create a payment transaction
   * @param {Object} payload - Payment transaction data
   * @param {string} payload.type - Payment type ('PAYPAL' or 'MIDTRANS')
   * @param {Object} payload.data - Payment data including registration details
   * @returns {Promise<Object>} Transaction data with token and other details
   */
  const createTransaction = async ({ type, data }) => {
    isLoading.value = true;
    error.value = null;

    try {
      const payload = {
        type,
        data: {
          ...data,
          paymentType: type,
        },
      };

      const res = await api.post('/payments/ryls/transactions', payload);

      if (!res?.data) {
        throw new Error('Invalid response from server');
      }

      return res.data;
    } catch (e) {
      const errorMessage = e?.response?.data?.message || e.message || 'Failed to create transaction';
      error.value = errorMessage;
      console.error('Payment transaction error:', e);
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Open Midtrans payment popup
   * @param {string} token - Midtrans token
   * @param {Object} callbacks - Callback functions
   * @param {Function} callbacks.onSuccess - Called on successful payment
   * @param {Function} callbacks.onPending - Called when payment is pending
   * @param {Function} callbacks.onError - Called on payment error
   * @param {Function} callbacks.onClose - Called when popup is closed
   */
  const openSnapEmbed = async (token, callbacks = {}) => {
    try {
      const snap = await useMidtransSnap();
      if (!snap) throw new Error('Midtrans payment is not available');

      const containerId = 'snap-container';

      snap.hide();

      const { onSuccess = () => {}, onPending = () => {}, onError = () => {}, onClose = () => {} } = callbacks;

      snap.embed(token, {
        embedId: containerId,
        onSuccess: (result) => {
          try {
            onSuccess(result);
          } catch (e) {
            console.error('Error in onSuccess callback:', e);
          }
        },
        onPending: (result) => {
          try {
            onPending(result);
          } catch (e) {
            console.error('Error in onPending callback:', e);
          }
        },
        onError: (error) => {
          try {
            onError(error);
          } catch (e) {
            console.error('Error in onError callback:', e);
          }
        },
        onClose: () => {
          try {
            onClose();
          } catch (e) {
            console.error('Error in onClose callback:', e);
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      callbacks.onError?.(error);
      throw error;
    }
  };

  const getRegistrationBySubmissionId = async (submissionId) => {
    try {
      const res = await api.get(`/api/registrations/submission/${submissionId}`);
      return res?.data || res;
    } catch (e) {
      throw e;
    }
  };

  const getPaymentStatus = async (registrationId) => {
    try {
      const res = await api.get(`/api/payments/ryls/${registrationId}/status`);
      return res?.data || res;
    } catch (e) {
      throw e;
    }
  };

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    createTransaction,
    openSnapEmbed,
    getRegistrationBySubmissionId,
    getPaymentStatus,
  };
};
