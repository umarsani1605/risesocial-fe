import type { AdminCohortModule } from '~/types/cohort'

interface UseAdminCohortModulesOptions {
  cohortId: string
  refreshCohort: () => Promise<void>
}

export function useAdminCohortModules(options: UseAdminCohortModulesOptions) {
  const { cohortId, refreshCohort } = options
  const { api } = useApi()
  const toast = useToast()

  const isAddModuleOpen = ref(false)
  const isAddingModule = ref(false)
  const saveAndAddMore = ref(false)
  const addModuleForm = reactive({
    title: '',
    description: '',
    sessionDate: '',
    meetingLink: '',
    attendanceLink: '',
    assignmentLink: '',
    isPublished: true,
    attachmentTab: 'files' as 'files' | 'links'
  })

  function resetAddModuleForm() {
    addModuleForm.title = ''
    addModuleForm.description = ''
    addModuleForm.sessionDate = ''
    addModuleForm.meetingLink = ''
    addModuleForm.attendanceLink = ''
    addModuleForm.assignmentLink = ''
    addModuleForm.isPublished = true
    addModuleForm.attachmentTab = 'files'
  }

  async function submitAddModule() {
    if (!addModuleForm.title) {
      toast.add({ title: 'Title is required', color: 'error' })
      return
    }
    isAddingModule.value = true
    try {
      await api(`/admin/cohorts/${cohortId}/modules`, {
        method: 'POST',
        body: {
          title: addModuleForm.title,
          description: addModuleForm.description || null,
          session_timestamp: addModuleForm.sessionDate || null,
          meeting_link: addModuleForm.meetingLink || null,
          attendance_link: addModuleForm.attendanceLink || null,
          assignment_link: addModuleForm.assignmentLink || null,
          is_published: addModuleForm.isPublished
        }
      })
      toast.add({ title: 'Module added', color: 'success' })
      await refreshCohort()
      if (saveAndAddMore.value) {
        resetAddModuleForm()
      } else {
        isAddModuleOpen.value = false
      }
    } catch (error: any) {
      toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
    } finally {
      isAddingModule.value = false
    }
  }

  const isEditModuleOpen = ref(false)
  const isEditingModule = ref(false)
  const editingModule = ref<AdminCohortModule | null>(null)
  const editModuleForm = reactive({
    title: '',
    description: '',
    sessionDate: '',
    meetingLink: '',
    attendanceLink: '',
    assignmentLink: '',
    isPublished: true
  })

  function openEditModule(module: AdminCohortModule) {
    editingModule.value = module
    editModuleForm.title = module.title
    editModuleForm.description = module.description ?? ''
    editModuleForm.sessionDate = module.session_timestamp ?? ''
    editModuleForm.meetingLink = module.meeting_link ?? ''
    editModuleForm.attendanceLink = module.attendance_link ?? ''
    editModuleForm.assignmentLink = module.assignment_link ?? ''
    editModuleForm.isPublished = module.is_published
    isEditModuleOpen.value = true
  }

  async function submitEditModule() {
    if (!editingModule.value) return
    isEditingModule.value = true
    try {
      await api(`/admin/cohorts/${cohortId}/modules/${editingModule.value.id}`, {
        method: 'PUT',
        body: {
          title: editModuleForm.title,
          description: editModuleForm.description || null,
          session_timestamp: editModuleForm.sessionDate || null,
          meeting_link: editModuleForm.meetingLink || null,
          attendance_link: editModuleForm.attendanceLink || null,
          assignment_link: editModuleForm.assignmentLink || null,
          is_published: editModuleForm.isPublished
        }
      })
      toast.add({ title: 'Module updated', color: 'success' })
      isEditModuleOpen.value = false
      await refreshCohort()
    } catch (error: any) {
      toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
    } finally {
      isEditingModule.value = false
    }
  }

  const isDeleteModuleOpen = ref(false)
  const isDeletingModule = ref(false)
  const deletingModuleId = ref<number | null>(null)

  function confirmDeleteModule(moduleId: number) {
    deletingModuleId.value = moduleId
    isDeleteModuleOpen.value = true
  }

  async function submitDeleteModule() {
    if (!deletingModuleId.value) return
    isDeletingModule.value = true
    try {
      await api(`/admin/cohorts/${cohortId}/modules/${deletingModuleId.value}`, {
        method: 'DELETE'
      })
      toast.add({ title: 'Module deleted', color: 'success' })
      isDeleteModuleOpen.value = false
      await refreshCohort()
    } catch (error: any) {
      toast.add({ title: error?.data?.message ?? 'An error occurred', color: 'error' })
    } finally {
      isDeletingModule.value = false
    }
  }

  return reactive({
    // add
    isAddModuleOpen,
    isAddingModule,
    saveAndAddMore,
    addModuleForm,
    resetAddModuleForm,
    submitAddModule,
    // edit
    isEditModuleOpen,
    isEditingModule,
    editModuleForm,
    openEditModule,
    submitEditModule,
    // delete
    isDeleteModuleOpen,
    isDeletingModule,
    confirmDeleteModule,
    submitDeleteModule
  })
}
