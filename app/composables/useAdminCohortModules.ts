import type { AdminCohortModule, AdminCohortAttachment, PendingAttachment } from '~/types/cohort'

interface UseAdminCohortModulesOptions {
  cohortId: string
  refreshCohort: () => Promise<void>
}

export function useAdminCohortModules(options: UseAdminCohortModulesOptions) {
  const { cohortId, refreshCohort } = options
  const { api } = useApi()
  const toast = useToast()

  // ── Add Module ────────────────────────────────────────────────────────────────

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
  })

  const pendingAttachments = ref<PendingAttachment[]>([])

  function addPendingLink(url: string, label: string) {
    pendingAttachments.value.push({ id: crypto.randomUUID(), type: 'external_link', label, url })
  }

  function addPendingFile(file: File, label: string) {
    pendingAttachments.value.push({ id: crypto.randomUUID(), type: 'file', label: label || file.name, file })
  }

  function removePendingAttachment(id: string) {
    pendingAttachments.value = pendingAttachments.value.filter(a => a.id !== id)
  }

  function resetAddModuleForm() {
    addModuleForm.title = ''
    addModuleForm.description = ''
    addModuleForm.sessionDate = ''
    addModuleForm.meetingLink = ''
    addModuleForm.attendanceLink = ''
    addModuleForm.assignmentLink = ''
    addModuleForm.isPublished = true
    pendingAttachments.value = []
  }

  async function submitAddModule() {
    if (!addModuleForm.title) {
      toast.add({ title: 'Title is required', color: 'error' })
      return
    }
    isAddingModule.value = true
    try {
      const res = await api<ApiResponse<AdminCohortModule>>(`/admin/cohorts/${cohortId}/modules`, {
        method: 'POST',
        body: {
          title: addModuleForm.title,
          description: addModuleForm.description || null,
          session_timestamp: addModuleForm.sessionDate ? new Date(addModuleForm.sessionDate).toISOString() : null,
          meeting_link: addModuleForm.meetingLink || null,
          attendance_link: addModuleForm.attendanceLink || null,
          assignment_link: addModuleForm.assignmentLink || null,
          is_published: addModuleForm.isPublished
        }
      })

      const moduleId = res.data.id

      let attachmentErrors = 0
      for (const att of pendingAttachments.value) {
        try {
          if (att.type === 'file' && att.file) {
            const fd = new FormData()
            fd.append('type', 'file')
            fd.append('file', att.file)
            if (att.label) fd.append('label', att.label)
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, { method: 'POST', body: fd })
          } else if (att.type === 'external_link' && att.url) {
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, {
              method: 'POST',
              body: { type: 'external_link', url: att.url, label: att.label }
            })
          }
        } catch {
          attachmentErrors++
        }
      }

      if (attachmentErrors > 0) {
        toast.add({ title: `Module added, but ${attachmentErrors} attachment(s) failed to upload`, color: 'warning' })
      } else {
        toast.add({ title: 'Module added', color: 'success' })
      }
      await refreshCohort()
      if (saveAndAddMore.value) {
        resetAddModuleForm()
      } else {
        isAddModuleOpen.value = false
      }
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isAddingModule.value = false
    }
  }

  // ── Edit Module ───────────────────────────────────────────────────────────────

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

  const moduleAttachments = ref<AdminCohortAttachment[]>([])
  const isDeletingAttachment = ref(false)

  const editPendingAttachments = ref<PendingAttachment[]>([])

  function addEditPendingLink(url: string, label: string) {
    editPendingAttachments.value.push({ id: crypto.randomUUID(), type: 'external_link', label, url })
  }

  function addEditPendingFile(file: File, label: string) {
    editPendingAttachments.value.push({ id: crypto.randomUUID(), type: 'file', label: label || file.name, file })
  }

  function removeEditPendingAttachment(id: string) {
    editPendingAttachments.value = editPendingAttachments.value.filter(a => a.id !== id)
  }

  function openEditModule(module: AdminCohortModule) {
    editingModule.value = module
    editModuleForm.title = module.title
    editModuleForm.description = module.description ?? ''
    editModuleForm.sessionDate = module.session_timestamp
      ? module.session_timestamp.slice(0, 16)
      : ''
    editModuleForm.meetingLink = module.meeting_link ?? ''
    editModuleForm.attendanceLink = module.attendance_link ?? ''
    editModuleForm.assignmentLink = module.assignment_link ?? ''
    editModuleForm.isPublished = module.is_published
    moduleAttachments.value = [...(module.attachments ?? [])]
    editPendingAttachments.value = []
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
          session_timestamp: editModuleForm.sessionDate ? new Date(editModuleForm.sessionDate).toISOString() : null,
          meeting_link: editModuleForm.meetingLink || null,
          attendance_link: editModuleForm.attendanceLink || null,
          assignment_link: editModuleForm.assignmentLink || null,
          is_published: editModuleForm.isPublished
        }
      })

      const moduleId = editingModule.value.id
      let attachmentErrors = 0
      for (const att of editPendingAttachments.value) {
        try {
          if (att.type === 'file' && att.file) {
            const fd = new FormData()
            fd.append('type', 'file')
            fd.append('file', att.file)
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, { method: 'POST', body: fd })
          } else if (att.type === 'external_link' && att.url) {
            await api(`/admin/cohorts/${cohortId}/modules/${moduleId}/attachments`, {
              method: 'POST', body: { type: 'external_link', url: att.url, label: att.label }
            })
          }
        } catch { attachmentErrors++ }
      }

      if (attachmentErrors > 0) {
        toast.add({ title: `Module updated, but ${attachmentErrors} attachment(s) failed`, color: 'warning' })
      } else {
        toast.add({ title: 'Module updated', color: 'success' })
      }
      isEditModuleOpen.value = false
      await refreshCohort()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isEditingModule.value = false
    }
  }

  async function submitDeleteAttachment(attachmentId: number) {
    if (!editingModule.value) return
    isDeletingAttachment.value = true
    try {
      await api(
        `/admin/cohorts/${cohortId}/modules/${editingModule.value.id}/attachments/${attachmentId}`,
        { method: 'DELETE' }
      )
      moduleAttachments.value = moduleAttachments.value.filter(a => a.id !== attachmentId)
      toast.add({ title: 'Attachment deleted', color: 'success' })
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
    } finally {
      isDeletingAttachment.value = false
    }
  }

  // ── Delete Module ─────────────────────────────────────────────────────────────

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
      await api(`/admin/cohorts/${cohortId}/modules/${deletingModuleId.value}`, { method: 'DELETE' })
      toast.add({ title: 'Module deleted', color: 'success' })
      isDeleteModuleOpen.value = false
      await refreshCohort()
    } catch (error: unknown) {
      toast.add({ title: getApiErrorMessage(error), color: 'error' })
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
    pendingAttachments,
    addPendingLink,
    addPendingFile,
    removePendingAttachment,
    resetAddModuleForm,
    submitAddModule,
    // edit
    isEditModuleOpen,
    isEditingModule,
    editModuleForm,
    openEditModule,
    submitEditModule,
    // attachments (edit modal)
    moduleAttachments,
    editPendingAttachments,
    addEditPendingLink,
    addEditPendingFile,
    removeEditPendingAttachment,
    isDeletingAttachment,
    submitDeleteAttachment,
    // delete
    isDeleteModuleOpen,
    isDeletingModule,
    confirmDeleteModule,
    submitDeleteModule
  })
}
