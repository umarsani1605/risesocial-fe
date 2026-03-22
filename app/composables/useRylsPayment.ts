/**
 * RYLS Payment Composable
 * Handles payment transaction creation and Midtrans Snap integration.
 */

interface CreateTransactionPayload {
  type: 'PAYPAL' | 'MIDTRANS'
  data: Record<string, unknown>
}

interface TransactionResponse {
  payment_id: string
  token?: string
}

interface SnapCallbacks {
  onSuccess?: (result: Record<string, unknown>) => void
  onPending?: (result: Record<string, unknown>) => void
  onError?: (error: Record<string, unknown>) => void
  onClose?: () => void
}

export const useRylsPayment = () => {
  const { api } = useApi()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const createTransaction = async (payload: CreateTransactionPayload): Promise<TransactionResponse> => {
    isLoading.value = true
    error.value = null

    try {
      const body = {
        type: payload.type,
        data: {
          ...payload.data,
          paymentType: payload.type,
        },
      }

      const res = await api<{ data: TransactionResponse }>('/payments/ryls/transactions', {
        method: 'POST',
        body,
      })

      if (!res?.data) {
        throw new Error('Invalid response from server')
      }

      return res.data
    }
    catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create transaction'
      error.value = errorMessage
      throw new Error(errorMessage)
    }
    finally {
      isLoading.value = false
    }
  }

  const openSnapEmbed = async (token: string, callbacks: SnapCallbacks = {}) => {
    const snap = await useMidtransSnap()
    if (!snap) throw new Error('Midtrans payment is not available')

    const containerId = 'snap-container'
    snap.hide()

    const { onSuccess = () => {}, onPending = () => {}, onError = () => {}, onClose = () => {} } = callbacks

    snap.embed(token, {
      embedId: containerId,
      onSuccess: (result) => {
        onSuccess(result)
      },
      onPending: (result) => {
        onPending(result)
      },
      onError: (err) => {
        onError(err)
      },
      onClose: () => {
        onClose()
      },
    })
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    createTransaction,
    openSnapEmbed,
  }
}
