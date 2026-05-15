import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'

const mockApi = vi.fn()
vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: mockApi }),
}))

function makeWrapper() {
  return defineComponent({
    setup() {
      return useRylsDraft()
    },
    template: '<div />',
  })
}

describe('useRylsDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadDraft', () => {
    it('mengembalikan null jika tidak ada cookie resumeToken', async () => {
      const wrapper = await mountSuspended(makeWrapper())
      const result = await wrapper.vm.loadDraft()
      expect(result).toBeNull()
      expect(mockApi).not.toHaveBeenCalled()
    })

    it('mengembalikan null (bukan throw) jika API error', async () => {
      mockApi.mockRejectedValue(new Error('Network error'))
      // Simpan token dulu via saveDraft agar cookie ter-set
      mockApi.mockResolvedValueOnce({
        success: true,
        data: { resumeToken: 'tok-load-err', currentStep: 1, savedAt: new Date().toISOString() },
      })
      mockApi.mockRejectedValueOnce(new Error('Network error'))

      const wrapper = await mountSuspended(makeWrapper())
      await wrapper.vm.saveDraft(1, {}, 'test@test.com')
      const result = await wrapper.vm.loadDraft()
      expect(result).toBeNull()
    })

    it('mengembalikan DraftData saat API berhasil', async () => {
      const draftData = {
        formData: { step1: { fullName: 'Test' } },
        currentStep: 2,
        scholarshipType: 'FULLY_FUNDED',
        email: 'test@test.com',
      }
      mockApi
        .mockResolvedValueOnce({
          success: true,
          data: { resumeToken: 'tok-load-ok', currentStep: 1, savedAt: new Date().toISOString() },
        })
        .mockResolvedValueOnce({ success: true, data: draftData })

      const wrapper = await mountSuspended(makeWrapper())
      await wrapper.vm.saveDraft(1, {}, 'test@test.com')
      const result = await wrapper.vm.loadDraft()
      expect(result).not.toBeNull()
      expect(result?.currentStep).toBe(2)
      expect(result?.formData).toEqual(draftData.formData)
    })
  })

  describe('saveDraft', () => {
    it('mengembalikan true dan menyimpan token ke cookie saat sukses', async () => {
      mockApi.mockResolvedValue({
        success: true,
        data: { resumeToken: 'new-token-abc', currentStep: 1, savedAt: new Date().toISOString() },
      })
      const wrapper = await mountSuspended(makeWrapper())
      const result = await wrapper.vm.saveDraft(1, { step1: { fullName: 'Test' } }, 'test@test.com')
      expect(result).toBe(true)
      expect(wrapper.vm.resumeToken).toBe('new-token-abc')
    })

    it('mengembalikan false (bukan throw) jika API error', async () => {
      mockApi.mockRejectedValue(new Error('fail'))
      const wrapper = await mountSuspended(makeWrapper())
      const result = await wrapper.vm.saveDraft(1, {}, 'test@test.com')
      expect(result).toBe(false)
    })

    it('mengirim resumeToken yang ada ke request jika sudah tersimpan', async () => {
      mockApi.mockResolvedValue({
        success: true,
        data: { resumeToken: 'existing-token', currentStep: 1, savedAt: new Date().toISOString() },
      })
      const wrapper = await mountSuspended(makeWrapper())
      // Save pertama → set cookie
      await wrapper.vm.saveDraft(1, {}, 'test@test.com')
      // Save kedua → harus kirim resumeToken
      await wrapper.vm.saveDraft(2, { step2: {} }, 'test@test.com')
      const secondCallBody = mockApi.mock.calls[1]?.[1]?.body as Record<string, unknown> | undefined
      expect(secondCallBody?.resumeToken).toBe('existing-token')
    })

    it('isDraftSaving berubah true saat request berjalan, false setelah selesai', async () => {
      let resolveFn!: (v: unknown) => void
      const pending = new Promise(r => { resolveFn = r })
      mockApi.mockReturnValue(pending)

      const wrapper = await mountSuspended(makeWrapper())
      const savePromise = wrapper.vm.saveDraft(1, {}, 'test@test.com')
      expect(wrapper.vm.isDraftSaving).toBe(true)
      resolveFn({ success: true, data: { resumeToken: 'tok', currentStep: 1, savedAt: '' } })
      await savePromise
      expect(wrapper.vm.isDraftSaving).toBe(false)
    })
  })

  describe('deleteDraft', () => {
    it('tidak throw dan clear cookie meskipun API error', async () => {
      mockApi
        .mockResolvedValueOnce({
          success: true,
          data: { resumeToken: 'tok-del', currentStep: 1, savedAt: new Date().toISOString() },
        })
        .mockRejectedValueOnce(new Error('fail'))

      const wrapper = await mountSuspended(makeWrapper())
      await wrapper.vm.saveDraft(1, {}, 'test@test.com')
      await expect(wrapper.vm.deleteDraft()).resolves.not.toThrow()
      expect(wrapper.vm.resumeToken).toBeNull()
    })

    it('clear cookie setelah delete berhasil', async () => {
      mockApi
        .mockResolvedValueOnce({
          success: true,
          data: { resumeToken: 'tok-del-ok', currentStep: 1, savedAt: new Date().toISOString() },
        })
        .mockResolvedValueOnce({ success: true, data: {} })

      const wrapper = await mountSuspended(makeWrapper())
      await wrapper.vm.saveDraft(1, {}, 'test@test.com')
      expect(wrapper.vm.resumeToken).toBe('tok-del-ok')
      await wrapper.vm.deleteDraft()
      expect(wrapper.vm.resumeToken).toBeNull()
    })

    it('skip API call jika tidak ada cookie', async () => {
      const wrapper = await mountSuspended(makeWrapper())
      await wrapper.vm.deleteDraft()
      expect(mockApi).not.toHaveBeenCalled()
    })
  })
})
