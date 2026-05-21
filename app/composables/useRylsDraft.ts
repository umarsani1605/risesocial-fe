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
  email: string
}

function normalizeDraftFormData(input: unknown): Record<string, unknown> {
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    return input as Record<string, unknown>
  }

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input) as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>
      }
    }
    catch {
      // ignore malformed draft payloads and fall through to empty object
    }
  }

  return {}
}

function serializeDraftFormData(input: Record<string, unknown>): Record<string, unknown> {
  try {
    return JSON.parse(JSON.stringify(input)) as Record<string, unknown>
  }
  catch {
    return {}
  }
}

export const useRylsDraft = () => {
  const { api } = useApi()

  const resumeToken = useCookie<string | null>('ryls_resume_token', {
    maxAge: 10 * 365 * 24 * 60 * 60,
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
      const body: DraftPayload = { email, step, formData: serializeDraftFormData(formData) }
      if (resumeToken.value) body.resumeToken = resumeToken.value
      if (scholarshipType) body.scholarshipType = scholarshipType

      const response = await api<{ success: boolean; data: DraftResponse }>('/ryls/registrations/draft', {
        method: 'POST',
        body,
      })

      if (response?.success === true && response?.data?.resumeToken) {
        resumeToken.value = response.data.resumeToken
      }

      if (response?.success === true) {
        capturePostHogEvent('ryls.registration_draft_saved', {
          step,
          scholarship_type: scholarshipType ?? null,
          resume_token: response?.data?.resumeToken ?? resumeToken.value ?? null
        })
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
        if (!response.data) {
          return null
        }

        return {
          ...response.data,
          formData: normalizeDraftFormData(response.data.formData),
        }
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
