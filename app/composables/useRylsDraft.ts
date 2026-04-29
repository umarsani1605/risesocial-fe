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

      if (response?.data?.resumeToken) {
        resumeToken.value = response.data.resumeToken
      }
      return true
    }
    catch (error: unknown) {
      draftError.value = error instanceof Error ? error.message : 'Failed to save draft'
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
      const response = await api<{ success: boolean; data: DraftData }>(
        `/ryls/registrations/draft/resume/${resumeToken.value}`,
      )
      return response?.data ?? null
    }
    catch {
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
    resumeToken: readonly(resumeToken),
    isDraftSaving: readonly(isDraftSaving),
    isDraftLoading: readonly(isDraftLoading),
    draftError: readonly(draftError),
    saveDraft,
    loadDraft,
    deleteDraft,
  }
}
