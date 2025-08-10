import { api } from '@/utils/api';
import { useMidtransSnap } from './useMidtransSnap';

export const useRylsPayment = () => {
  const isLoading = ref(false);
  const error = ref(null);

  const createTransaction = async (registrationId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.post('/api/payments/ryls/transactions', { registrationId });
      // res expected shape: { success, message, data: { token, redirect_url, orderId, amount, currency } }
      return res?.data || res;
    } catch (e) {
      error.value = e?.message || 'Failed to create transaction';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const openSnapEmbed = async (token, callbacks = {}) => {
    const snap = await useMidtransSnap();
    if (!snap) throw new Error('Snap is not available');

    // Ensure container exists
    const containerId = 'snap-container';
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      document.body.appendChild(el);
    }

    snap.embed(token, {
      embedId: containerId,
      onSuccess: callbacks.onSuccess || (() => {}),
      onPending: callbacks.onPending || (() => {}),
      onError: callbacks.onError || (() => {}),
      onClose: callbacks.onClose || (() => {}),
    });
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
