/**
 * Academy Enrollment Payment Composable
 * Handles academy enrollment transaction creation and Midtrans Snap integration.
 */

interface EnrollmentResponse {
  enrollment_id: number
  transaction_code: string
  amount: number
  currency: string
  token: string | null
  redirect_url: string | null
}

interface PaymentStatusResponse {
  hasPayment: boolean
  status: string | null
  transaction_code: string | null
  amount: number | null
  currency: string
  payment_method: string | null
  paid_at: string | null
  created_at: string | null
}

interface EnrollmentCheckResponse {
  enrolled: boolean
  hasPendingPayment?: boolean
  enrollment_id?: number
  status?: string
  payment_status?: string | null
  snap_token?: string | null
  transaction_code?: string | null
}

export const useAcademyPayment = () => {
  const { api } = useApi()
  const { openSnapEmbed } = useMidtransPayment()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const createEnrollment = async (academyId: number, pricingId: number): Promise<EnrollmentResponse> => {
    isLoading.value = true
    error.value = null

    try {
      const res = await api<ApiResponse<EnrollmentResponse>>('/payments/academy/transactions', {
        method: 'POST',
        body: { academy_id: academyId, pricing_id: pricingId }
      })

      if (!res?.data) {
        throw new Error('Invalid response from server')
      }

      return res.data
    } catch (e: unknown) {
      const message = getApiErrorMessage(e, 'Failed to create enrollment')
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  const checkPaymentStatus = async (enrollmentId: number): Promise<PaymentStatusResponse> => {
    const res = await api<ApiResponse<PaymentStatusResponse>>(`/payments/academy/${enrollmentId}/status`)
    return res.data
  }

  const checkEnrollment = async (academyId: number): Promise<EnrollmentCheckResponse> => {
    const res = await api<ApiResponse<EnrollmentCheckResponse>>(`/payments/academy/check?academy_id=${academyId}`)
    return res.data
  }

  const syncTransactionStatus = async (transactionCode: string): Promise<{ status: string, payment_method: string | null }> => {
    const res = await api<ApiResponse<{ status: string, payment_method: string | null }>>(
      `/payments/academy/transactions/${transactionCode}/sync`,
      { method: 'POST' }
    )
    return res.data
  }

  return {
    isLoading,
    error,
    createEnrollment,
    openSnapEmbed,
    checkPaymentStatus,
    checkEnrollment,
    syncTransactionStatus
  }
}
