import { buildCohortMentorFormData } from '@/utils/cohortMentors'

interface UseAdminCohortMentorsOptions {
  cohortId: string
  refreshCohort: () => Promise<unknown>
}

interface MentorSubmitPayload {
  avatarFile: File | null
  removeAvatar: boolean
}

export function useAdminCohortMentors(options: UseAdminCohortMentorsOptions) {
  const { cohortId, refreshCohort } = options
  const { api } = useApi()
  const toast = useToast()

  const isMentorModalOpen = ref(false)
  const isSavingMentor = ref(false)
  const editingMentor = ref<AdminCohortMentor | null>(null)
  const mentorForm = reactive({
    name: '',
    jobTitle: '',
  })

  const isDeleteMentorOpen = ref(false)
  const isDeletingMentor = ref(false)
  const deletingMentor = ref<AdminCohortMentor | null>(null)

  function resetMentorForm() {
    mentorForm.name = ''
    mentorForm.jobTitle = ''
  }

  function openAddMentorModal() {
    editingMentor.value = null
    resetMentorForm()
    isMentorModalOpen.value = true
  }

  function openEditMentorModal(mentor: AdminCohortMentor) {
    editingMentor.value = mentor
    mentorForm.name = mentor.name
    mentorForm.jobTitle = mentor.job_title ?? ''
    isMentorModalOpen.value = true
  }

  function closeMentorModal() {
    isMentorModalOpen.value = false
    editingMentor.value = null
    resetMentorForm()
  }

  async function submitMentor(payload: MentorSubmitPayload) {
    isSavingMentor.value = true
    try {
      const body = buildCohortMentorFormData(
        mentorForm,
        payload.avatarFile,
        payload.removeAvatar,
      )

      if (editingMentor.value) {
        await api(`/admin/cohorts/${cohortId}/mentors/${editingMentor.value.id}`, {
          method: 'PUT',
          body,
        })
      }
      else {
        await api(`/admin/cohorts/${cohortId}/mentors`, {
          method: 'POST',
          body,
        })
      }

      toast.add({
        title: editingMentor.value ? 'Mentor updated' : 'Mentor added',
        color: 'success',
      })
      closeMentorModal()
      await refreshCohort()
    }
    catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    }
    finally {
      isSavingMentor.value = false
    }
  }

  function confirmDeleteMentor(mentor: AdminCohortMentor) {
    deletingMentor.value = mentor
    isDeleteMentorOpen.value = true
  }

  function closeDeleteMentorModal() {
    isDeleteMentorOpen.value = false
    deletingMentor.value = null
  }

  async function submitDeleteMentor() {
    if (!deletingMentor.value) return

    isDeletingMentor.value = true
    try {
      await api(`/admin/cohorts/${cohortId}/mentors/${deletingMentor.value.id}`, {
        method: 'DELETE',
      })
      toast.add({ title: 'Mentor removed', color: 'success' })
      closeDeleteMentorModal()
      await refreshCohort()
    }
    catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    }
    finally {
      isDeletingMentor.value = false
    }
  }

  return reactive({
    isMentorModalOpen,
    isSavingMentor,
    editingMentor,
    mentorForm,
    openAddMentorModal,
    openEditMentorModal,
    closeMentorModal,
    submitMentor,
    isDeleteMentorOpen,
    isDeletingMentor,
    deletingMentor,
    confirmDeleteMentor,
    closeDeleteMentorModal,
    submitDeleteMentor,
  })
}
