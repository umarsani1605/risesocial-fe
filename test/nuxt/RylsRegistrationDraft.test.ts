import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'

const mockLoadDraft = vi.fn()
const mockSaveDraft = vi.fn()
const mockDeleteDraft = vi.fn()
const mockResumeToken = ref<string | null>(null)

vi.mock('~/composables/useRylsDraft', () => ({
  useRylsDraft: () => ({
    loadDraft: mockLoadDraft,
    saveDraft: mockSaveDraft,
    deleteDraft: mockDeleteDraft,
    resumeToken: mockResumeToken,
    isDraftLoading: ref(false),
    isDraftSaving: ref(false),
    draftError: ref(null),
  }),
}))

const mockSetStep1 = vi.fn()
const mockSetSelfFundedData = vi.fn()
let mockStoreStep1: Record<string, string> = { fullName: '', scholarshipType: '' }

vi.mock('~/composables/useRylsRegistration', () => ({
  useRylsRegistration: () => ({
    step1: mockStoreStep1,
    passportNumber: '',
    needVisa: '',
    headshotFile: '',
    readPolicies: '',
    payment: { type: null, status: null },
    essayTopic: '',
    essayFile: '',
    essayDescription: '',
    getStep1Data: { scholarshipType: mockStoreStep1.scholarshipType },
    setStep1: mockSetStep1,
    setSelfFundedData: mockSetSelfFundedData,
    setPaymentId: vi.fn(),
    setPaymentType: vi.fn(),
    setPaymentStatus: vi.fn(),
    setPaymentProof: vi.fn(),
    setMidtransData: vi.fn(),
    resetAll: vi.fn(),
  }),
}))

vi.mock('~/composables/useRylsFileUpload', () => ({
  useRylsFileUpload: () => ({
    uploadHeadshot: vi.fn(),
    uploadPaymentProof: vi.fn(),
    isUploading: ref(false),
    uploadError: ref(null),
    uploadProgress: ref(0),
  }),
}))

vi.mock('~/composables/useRylsPayment', () => ({
  useRylsPayment: () => ({
    createTransaction: vi.fn(),
    openSnapEmbed: vi.fn(),
    isLoading: ref(false),
    error: ref(null),
  }),
}))

vi.mock('~/composables/useRylsSubmission', () => ({
  useRylsSubmission: () => ({
    submit: vi.fn().mockResolvedValue({}),
    isSubmitting: ref(false),
    submissionError: ref(null),
    submissionSuccess: ref(false),
  }),
}))

import RegistrationPage from '~/pages/programs/rise-young-leaders-summit/registration/index.vue'
import SelfFundedPage from '~/pages/programs/rise-young-leaders-summit/registration/self-funded.vue'

describe('RYLS Registration — Integrasi Draft', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLoadDraft.mockResolvedValue(null)
    mockSaveDraft.mockResolvedValue(true)
    mockStoreStep1 = { fullName: '', scholarshipType: '' }
  })

  describe('index.vue (Step 1)', () => {
    it('memanggil loadDraft saat komponen mount', async () => {
      await mountSuspended(RegistrationPage)
      expect(mockLoadDraft).toHaveBeenCalledOnce()
    })

    it('mengisi store dari draft jika loadDraft mengembalikan data', async () => {
      const draftData = {
        formData: { step1: { fullName: 'Test User', email: 'test@test.com' } },
        currentStep: 1,
        scholarshipType: null,
        expiresAt: new Date(Date.now() + 1000).toISOString(),
      }
      mockLoadDraft.mockResolvedValueOnce(draftData)
      await mountSuspended(RegistrationPage)
      expect(mockSetStep1).toHaveBeenCalledWith(draftData.formData.step1)
    })

    it('tidak mengisi store jika loadDraft mengembalikan null', async () => {
      mockLoadDraft.mockResolvedValueOnce(null)
      await mountSuspended(RegistrationPage)
      expect(mockSetStep1).not.toHaveBeenCalled()
    })
  })

  describe('self-funded.vue (Step 2a)', () => {
    it('memanggil loadDraft jika store kosong (sebelum redirect)', async () => {
      mockStoreStep1 = { fullName: '', scholarshipType: '' }
      mockLoadDraft.mockResolvedValueOnce(null)
      await mountSuspended(SelfFundedPage)
      expect(mockLoadDraft).toHaveBeenCalledOnce()
    })
  })
})
