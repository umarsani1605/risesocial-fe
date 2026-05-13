/**
 * RYLS Payment Composable
 * Handles payment transaction creation and Midtrans Snap integration.
 */

interface CreateTransactionPayload {
  type: RylsPaymentType
  data: Record<string, unknown>
}

interface TransactionResponse {
  payment_id: string
  token?: string
}

export const useRylsPayment = () => {
  const { api } = useApi()
  const { openSnapEmbed } = useMidtransPayment()
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
      const errorMessage = getApiErrorMessage(e, 'Failed to create transaction')
      error.value = errorMessage
      throw new Error(errorMessage)
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    createTransaction,
    openSnapEmbed,
  }
}
