/**
 * RYLS Registration Submission Composable
 * Handles registration submission and file upload API calls.
 */

type RegistrationData = Record<string, unknown>

interface UploadResponse {
  success: boolean
  data?: { id?: string; fileUrl?: string }
  message?: string
}

interface SubmissionResponse {
  success: boolean
  data?: Record<string, unknown>
  message?: string
}

export const useRylsSubmission = () => {
  const { api } = useApi()
  const isSubmitting = ref(false)
  const submissionError = ref<string | null>(null)
  const submissionSuccess = ref(false)

  const submit = async (): Promise<Record<string, unknown> | false> => {
    isSubmitting.value = true
    submissionError.value = null
    submissionSuccess.value = false

    try {
      const store = useRylsRegistration()
      const scholarshipType = store.step1.scholarshipType

      // Build step1 request body
      const body: Record<string, unknown> = {
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
      }

      // Add FULLY_FUNDED conditional fields
      if (scholarshipType === 'FULLY_FUNDED') {
        body.essayTopic = store.essayTopic
        body.essayFileId = Number(store.essayFile)
        body.essayDescription = store.essayDescription
      }

      // Add SELF_FUNDED conditional fields
      if (scholarshipType === 'SELF_FUNDED') {
        body.passportNumber = store.passportNumber
        body.needVisa = store.needVisa
        body.headshotFileId = Number(store.headshotFile)
        body.readPolicies = store.readPolicies
      }

      // Send request to unified endpoint
      const response = await api<SubmissionResponse>('/ryls/registrations/submit', {
        method: 'POST',
        body,
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit registration')
      }

      // Handle success
      submissionSuccess.value = true
      return response.data || {}
    }
    catch (error: unknown) {
      // Handle error
      const message = error instanceof Error ? error.message : 'Failed to submit registration'
      submissionError.value = message
      return false
    }
    finally {
      isSubmitting.value = false
    }
  }

  const uploadEssayFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return api<UploadResponse>('/uploads/essay', {
      method: 'POST',
      body: formData,
    })
  }

  const uploadHeadshotFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return api<UploadResponse>('/uploads/headshot', {
      method: 'POST',
      body: formData,
    })
  }

  const uploadPaymentProofFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return api<UploadResponse>('/uploads/payment-proof', {
      method: 'POST',
      body: formData,
    })
  }

  return {
    isSubmitting: readonly(isSubmitting),
    submissionError: readonly(submissionError),
    submissionSuccess: readonly(submissionSuccess),
    submit,
    uploadEssayFile,
    uploadHeadshotFile,
    uploadPaymentProofFile,
  }
}
