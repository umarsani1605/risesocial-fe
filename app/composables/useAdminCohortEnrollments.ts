import type { AdminCohortEnrollment } from '~/types/cohort'

interface UseAdminCohortEnrollmentsOptions {
  cohortId: string
}

export function useAdminCohortEnrollments(options: UseAdminCohortEnrollmentsOptions) {
  const { cohortId } = options
  const { api } = useApi()
  const toast = useToast()

  const enrollments = ref<AdminCohortEnrollment[]>([])
  const isLoadingEnrollments = ref(false)

  async function loadEnrollments() {
    isLoadingEnrollments.value = true
    try {
      const res = await api<ApiResponse<AdminCohortEnrollment[]>>(
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
  const generatingEnrollmentId = ref<number | null>(null)
  const certGradesForm = reactive({ assignments: '', case_study: '', final_test: '', final_score: '' })

  function openGenerateCertModal(enrollmentId: number) {
    generatingEnrollmentId.value = enrollmentId
    certGradesForm.assignments = ''
    certGradesForm.case_study = ''
    certGradesForm.final_test = ''
    certGradesForm.final_score = ''
    isGenerateCertOpen.value = true
  }

  async function submitGenerateCert() {
    if (!generatingEnrollmentId.value) return
    isGeneratingCert.value = true
    try {
      const grades: Record<string, number> = {}
      if (certGradesForm.assignments !== '') grades.assignments = Number(certGradesForm.assignments)
      if (certGradesForm.case_study !== '') grades.case_study = Number(certGradesForm.case_study)
      if (certGradesForm.final_test !== '') grades.final_test = Number(certGradesForm.final_test)
      if (certGradesForm.final_score !== '') grades.final_score = Number(certGradesForm.final_score)

      await api(`/admin/cohorts/${cohortId}/enrollments/${generatingEnrollmentId.value}/certificate`, {
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

  // --- Regenerate certificate ---

  function openRegenerateCertModal(enrollmentId: number) {
    openGenerateCertModal(enrollmentId)
  }

  // --- Drop student ---

  const isDroppingStudent = ref(false)

  async function submitDropStudent(enrollmentId: number) {
    isDroppingStudent.value = true
    try {
      await api(`/admin/cohorts/${cohortId}/enrollments/${enrollmentId}`, {
        method: 'PUT',
        body: { status: 'dropped' },
      })
      toast.add({ title: 'Student dropped', color: 'success' })
      await loadEnrollments()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isDroppingStudent.value = false
    }
  }

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
    isInviteMentorOpen,
    isInvitingMentor,
    mentorForm,
    openInviteMentorModal,
    submitInviteMentor
  })
}
