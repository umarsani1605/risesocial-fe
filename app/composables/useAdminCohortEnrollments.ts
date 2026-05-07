import type { AdminCohortPlacement, AdminCohortSummary } from '~/types/cohort'

interface UseAdminCohortEnrollmentsOptions {
  cohortId: string
}

export function useAdminCohortEnrollments(options: UseAdminCohortEnrollmentsOptions) {
  const { cohortId } = options
  const { api } = useApi()
  const toast = useToast()

  const enrollments = ref<AdminCohortPlacement[]>([])
  const isLoadingEnrollments = ref(false)

  async function loadEnrollments() {
    isLoadingEnrollments.value = true
    try {
      const res = await api<ApiResponse<AdminCohortPlacement[]>>(
        `/admin/cohorts/${cohortId}/enrollments`
      )
      enrollments.value = res.data
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isLoadingEnrollments.value = false
    }
  }

  onMounted(() => loadEnrollments())

  const isInviteStudentOpen = ref(false)
  const isInvitingStudent = ref(false)
  const inviteStudentEmail = ref('')

  function openInviteStudentModal() {
    isInviteStudentOpen.value = true
  }

  async function submitInviteStudent() {
    if (!inviteStudentEmail.value.trim()) {
      toast.add({ title: 'Email is required', color: 'error' })
      return
    }
    isInvitingStudent.value = true
    try {
      toast.add({ title: 'Invite is not available yet', color: 'info' })
      inviteStudentEmail.value = ''
      isInviteStudentOpen.value = false
    } finally {
      isInvitingStudent.value = false
    }
  }

  // --- Generate certificate ---

  const isGenerateCertOpen = ref(false)
  const isGeneratingCert = ref(false)
  const generatingPlacementId = ref<number | null>(null)
  const certGradesForm = reactive({ assignments: '', case_study: '', final_test: '', final_score: '' })

  function openGenerateCertModal(placementId: number) {
    generatingPlacementId.value = placementId
    certGradesForm.assignments = ''
    certGradesForm.case_study = ''
    certGradesForm.final_test = ''
    certGradesForm.final_score = ''
    isGenerateCertOpen.value = true
  }

  async function submitGenerateCert() {
    if (!generatingPlacementId.value) return
    isGeneratingCert.value = true
    try {
      const grades: Record<string, number> = {}
      if (certGradesForm.assignments !== '') grades.assignments = Number(certGradesForm.assignments)
      if (certGradesForm.case_study !== '') grades.case_study = Number(certGradesForm.case_study)
      if (certGradesForm.final_test !== '') grades.final_test = Number(certGradesForm.final_test)
      if (certGradesForm.final_score !== '') grades.final_score = Number(certGradesForm.final_score)

      await api(`/admin/cohorts/${cohortId}/placements/${generatingPlacementId.value}/certificate`, {
        method: 'POST',
        body: { grades },
      })
      toast.add({ title: 'Certificate generated', color: 'success' })
      isGenerateCertOpen.value = false
      await loadEnrollments()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isGeneratingCert.value = false
    }
  }

  function openRegenerateCertModal(placementId: number) {
    openGenerateCertModal(placementId)
  }

  // --- Drop student (from cohort, placement deleted, enrollment stays active) ---

  const isDroppingStudent = ref(false)

  async function submitDropStudent(placementId: number) {
    isDroppingStudent.value = true
    try {
      await api(`/admin/cohort-placements/${placementId}/drop`, {
        method: 'POST',
      })
      toast.add({ title: 'Student removed from cohort', color: 'success' })
      await loadEnrollments()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isDroppingStudent.value = false
    }
  }

  // --- Assign / Transfer cohort ---

  const isAssignOpen = ref(false)
  const assignTarget = ref<AdminCohortPlacement | null>(null)
  const availableCohorts = ref<AdminCohortSummary[]>([])
  const selectedCohortId = ref<number | null>(null)
  const isLoadingCohorts = ref(false)
  const isAssigning = ref(false)

  async function openAssignModal(placement: AdminCohortPlacement) {
    assignTarget.value = placement
    selectedCohortId.value = null
    availableCohorts.value = []
    isAssignOpen.value = true
    isLoadingCohorts.value = true
    try {
      const res = await api<ApiResponse<AdminCohortSummary[]>>(
        `/admin/cohorts?academy_id=${placement.academy_id}&status[]=not_started&status[]=ongoing`
      )
      availableCohorts.value = res.data
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isLoadingCohorts.value = false
    }
  }

  function closeAssignModal() {
    isAssignOpen.value = false
    assignTarget.value = null
    selectedCohortId.value = null
    availableCohorts.value = []
  }

  async function submitAssign() {
    if (!assignTarget.value?.academy_enrollment_id || !selectedCohortId.value) return
    isAssigning.value = true
    try {
      await api(`/admin/academy-enrollments/${assignTarget.value.academy_enrollment_id}/assign`, {
        method: 'POST',
        body: { cohort_id: selectedCohortId.value },
      })
      toast.add({ title: 'Student assigned to cohort', color: 'success' })
      closeAssignModal()
      await loadEnrollments()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isAssigning.value = false
    }
  }

  async function submitDropFromCohort(placementId: number) {
    isDroppingStudent.value = true
    try {
      await api(`/admin/cohort-placements/${placementId}/drop`, { method: 'POST' })
      toast.add({ title: 'Student removed from cohort', color: 'success' })
      closeAssignModal()
      await loadEnrollments()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isDroppingStudent.value = false
    }
  }

  // --- Mentors ---

  const isInviteMentorOpen = ref(false)
  const isInvitingMentor = ref(false)
  const mentorForm = reactive({ name: '', jobTitle: '' })

  function openInviteMentorModal() {
    isInviteMentorOpen.value = true
  }

  async function submitInviteMentor() {
    isInvitingMentor.value = true
    try {
      toast.add({ title: 'Invite is not available yet', color: 'info' })
      mentorForm.name = ''
      mentorForm.jobTitle = ''
      isInviteMentorOpen.value = false
    } finally {
      isInvitingMentor.value = false
    }
  }

  return reactive({
    enrollments,
    isLoadingEnrollments,
    loadEnrollments,
    isInviteStudentOpen,
    isInvitingStudent,
    inviteStudentEmail,
    openInviteStudentModal,
    submitInviteStudent,
    isGenerateCertOpen,
    isGeneratingCert,
    certGradesForm,
    openGenerateCertModal,
    submitGenerateCert,
    openRegenerateCertModal,
    isDroppingStudent,
    submitDropStudent,
    isAssignOpen,
    assignTarget,
    availableCohorts,
    selectedCohortId,
    isLoadingCohorts,
    isAssigning,
    openAssignModal,
    closeAssignModal,
    submitAssign,
    submitDropFromCohort,
    isInviteMentorOpen,
    isInvitingMentor,
    mentorForm,
    openInviteMentorModal,
    submitInviteMentor,
  })
}
