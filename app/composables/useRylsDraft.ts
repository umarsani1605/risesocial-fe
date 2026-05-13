interface DraftPayload {
  email: string
  resumeToken?: string
  step: number
  formData: Record<string, unknown>
  scholarshipType?: string
}

interface DraftResponse {
  resumeToken: string
  currentStep: number
  savedAt: string
}

interface DraftData {
  formData: Record<string, unknown>
  currentStep: number
  scholarshipType: string | null
  expiresAt: string
}

export const useRylsDraft = () => {
  const { api } = useApi()

  const resumeToken = useCookie<string | null>('ryls_resume_token', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  })

  const isDraftSaving = ref(false)
  const isDraftLoading = ref(false)
  const draftError = ref<string | null>(null)

  const saveDraft = async (
    step: number,
    formData: Record<string, unknown>,
    email: string,
    scholarshipType?: string,
  ): Promise<boolean> => {
    isDraftSaving.value = true
    draftError.value = null
    try {
      const body: DraftPayload = { email, step, formData }
      if (resumeToken.value) body.resumeToken = resumeToken.value
      if (scholarshipType) body.scholarshipType = scholarshipType

      const response = await api<{ success: boolean; data: DraftResponse }>('/ryls/registrations/draft', {
        method: 'POST',
        body,
      })

      if (response?.success === true && response?.data?.resumeToken) {
        resumeToken.value = response.data.resumeToken
      }
      return response?.success === true
    }
    catch (error: unknown) {
      draftError.value = getApiErrorMessage(error, 'An error occurred')
      return false
    }
    finally {
      isDraftSaving.value = false
    }
  }

  const loadDraft = async (): Promise<DraftData | null> => {
    if (!resumeToken.value) return null

    isDraftLoading.value = true
    draftError.value = null
    try {
      const response = await api<{ success: boolean; data: DraftData; message?: string }>(
        `/ryls/registrations/draft/resume/${resumeToken.value}`,
      )
      if (response?.success === true) {
        return response.data ?? null
      }
      draftError.value = response?.message ?? 'Failed to load draft'
      resumeToken.value = null
      return null
    }
    catch (error: unknown) {
      draftError.value = getApiErrorMessage(error, 'An error occurred')
      resumeToken.value = null
      return null
    }
    finally {
      isDraftLoading.value = false
    }
  }

  const deleteDraft = async (): Promise<void> => {
    if (!resumeToken.value) return
    const token = resumeToken.value
    resumeToken.value = null
    try {
      await api(`/ryls/registrations/draft/${token}`, { method: 'DELETE' })
    }
    catch {
      // best-effort, cookie already cleared
    }
  }

  return {
    resumeToken,
    isDraftSaving,
    isDraftLoading,
    draftError,
    saveDraft,
    loadDraft,
    deleteDraft,
  }
}
