import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, ref, computed, nextTick } from 'vue'

interface RylsDraft {
  id: number
  email: string
  resume_token: string
  current_step: number
  form_data: { step1?: { fullName?: string; scholarshipType?: string }; [key: string]: unknown }
  scholarship_type: string | null
  expires_at: string
  updated_at: string
}

// Helper: pure filter function matching what the page computes
function filterDrafts(drafts: RylsDraft[], search: string): RylsDraft[] {
  if (!search) return drafts
  const s = search.toLowerCase()
  return drafts.filter(
    d =>
      d.email.toLowerCase().includes(s)
      || (d.form_data?.step1?.fullName ?? '').toLowerCase().includes(s),
  )
}

// Wrapper component untuk test integrasi computed + tab label
function makeDraftWrapper(initialDrafts: RylsDraft[] = [], submittedCount = 0) {
  return defineComponent({
    setup() {
      const allDrafts = ref<RylsDraft[]>(initialDrafts)
      const draftSearch = ref('')
      const activeTab = ref('submitted')

      const filteredDrafts = computed(() => filterDrafts(allDrafts.value, draftSearch.value))

      const tabItems = computed(() => [
        { label: `Submitted (${submittedCount})`, value: 'submitted' },
        { label: `Drafts (${filteredDrafts.value.length})`, value: 'drafts' },
      ])

      return { allDrafts, draftSearch, activeTab, filteredDrafts, tabItems }
    },
    template: '<div />',
  })
}

const sampleDrafts: RylsDraft[] = [
  {
    id: 1,
    email: 'alice@test.com',
    resume_token: 'tok-1',
    current_step: 1,
    form_data: { step1: { fullName: 'Alice Smith', scholarshipType: 'FULLY_FUNDED' } },
    scholarship_type: 'FULLY_FUNDED',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'bob@example.com',
    resume_token: 'tok-2',
    current_step: 2,
    form_data: { step1: { fullName: 'Bob Jones', scholarshipType: 'SELF_FUNDED' } },
    scholarship_type: 'SELF_FUNDED',
    expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    email: 'carol@test.com',
    resume_token: 'tok-3',
    current_step: 1,
    form_data: { step1: { fullName: 'Carol Tan' } },
    scholarship_type: null,
    expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

describe('Admin RYLS — Tab Drafts', () => {
  describe('tabItems computed', () => {
    it('menghasilkan dua tab: submitted dan drafts', async () => {
      const wrapper = await mountSuspended(makeDraftWrapper(sampleDrafts, 5))
      expect(wrapper.vm.tabItems).toHaveLength(2)
      expect(wrapper.vm.tabItems[0]!.value).toBe('submitted')
      expect(wrapper.vm.tabItems[1]!.value).toBe('drafts')
    })

    it('label tab Drafts menampilkan jumlah draft', async () => {
      const wrapper = await mountSuspended(makeDraftWrapper(sampleDrafts, 5))
      expect(wrapper.vm.tabItems[1]!.label).toBe('Drafts (3)')
    })

    it('activeTab default adalah submitted', async () => {
      const wrapper = await mountSuspended(makeDraftWrapper(sampleDrafts, 5))
      expect(wrapper.vm.activeTab).toBe('submitted')
    })
  })

  describe('filteredDrafts computed', () => {
    it('filter by email mengembalikan draft yang cocok', async () => {
      const wrapper = await mountSuspended(makeDraftWrapper(sampleDrafts))
      wrapper.vm.draftSearch = 'alice'
      await nextTick()
      expect(wrapper.vm.filteredDrafts).toHaveLength(1)
      expect(wrapper.vm.filteredDrafts[0]!.email).toBe('alice@test.com')
    })

    it('filter by name mengembalikan draft yang cocok', async () => {
      const wrapper = await mountSuspended(makeDraftWrapper(sampleDrafts))
      wrapper.vm.draftSearch = 'bob jones'
      await nextTick()
      expect(wrapper.vm.filteredDrafts).toHaveLength(1)
      expect(wrapper.vm.filteredDrafts[0]!.form_data.step1?.fullName).toBe('Bob Jones')
    })

    it('search kosong mengembalikan semua draft', async () => {
      const wrapper = await mountSuspended(makeDraftWrapper(sampleDrafts))
      wrapper.vm.draftSearch = ''
      await nextTick()
      expect(wrapper.vm.filteredDrafts).toHaveLength(3)
    })

    it('label tab Drafts ikut update setelah filter', async () => {
      const wrapper = await mountSuspended(makeDraftWrapper(sampleDrafts, 5))
      wrapper.vm.draftSearch = '@test.com'
      await nextTick()
      expect(wrapper.vm.tabItems[1]!.label).toBe('Drafts (2)')
    })
  })
})
