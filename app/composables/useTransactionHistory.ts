/**
 * Transaction History Composable
 * Fetches user's transaction list and detail.
 */

export const useTransactionHistory = () => {
  const { api } = useApi()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTransactions = async (params: { page?: number, limit?: number, status?: string } = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const query = new URLSearchParams()
      if (params.page) query.set('page', String(params.page))
      if (params.limit) query.set('limit', String(params.limit))
      if (params.status) query.set('status', params.status)

      const qs = query.toString()
      const res = await api<PaginatedResponse<UserTransaction>>(`/payments/transactions${qs ? `?${qs}` : ''}`)
      return res
    } catch (e: unknown) {
      const message = getApiErrorMessage(e, 'Failed to load transactions')
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  const fetchTransactionDetail = async (transactionCode: string) => {
    isLoading.value = true
    error.value = null

    try {
      const res = await api<ApiResponse<UserTransactionDetail>>(`/payments/transactions/${transactionCode}`)
      return res.data
    } catch (e: unknown) {
      const message = getApiErrorMessage(e, 'Failed to load transaction detail')
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    fetchTransactions,
    fetchTransactionDetail
  }
}
