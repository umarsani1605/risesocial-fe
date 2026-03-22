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
    } catch (error: any) {
      toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
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

  function closeInviteStudentModal() {
    isInviteStudentOpen.value = false
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

  const isInviteMentorOpen = ref(false)
  const isInvitingMentor = ref(false)
  const mentorForm = reactive({ name: '', jobTitle: '' })

  function openInviteMentorModal() {
    isInviteMentorOpen.value = true
  }

  function closeInviteMentorModal() {
    isInviteMentorOpen.value = false
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
    isInviteMentorOpen,
    isInvitingMentor,
    mentorForm,
    openInviteMentorModal,
    submitInviteMentor
  })
}
